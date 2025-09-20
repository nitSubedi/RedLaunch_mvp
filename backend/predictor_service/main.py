from fastapi import FastAPI, Query
from sqlalchemy import create_engine
import pandas as pd
try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
from statsmodels.tsa.arima.model import ARIMA
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

SUPABASE_DB = os.getenv("SUPABASE_DB")
SUPABASE_USER = os.getenv("SUPABASE_USER")
SUPABASE_PASSWORD = os.getenv("SUPABASE_PASSWORD")
SUPABASE_HOST = os.getenv("SUPABASE_HOST")
SUPABASE_PORT = os.getenv("SUPABASE_PORT", "5432")

print("DB:", SUPABASE_DB)
print("USER:", SUPABASE_USER)
print("HOST:", SUPABASE_HOST)
print("PORT:", SUPABASE_PORT)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLAlchemy engine setup
engine = create_engine(
    f"postgresql+psycopg2://{SUPABASE_USER}:{SUPABASE_PASSWORD}@{SUPABASE_HOST}:{SUPABASE_PORT}/{SUPABASE_DB}"
)

def forecast_arima(ts, periods):
    try:
        model = ARIMA(ts, order=(1,1,1))
        model_fit = model.fit()
        forecast = model_fit.forecast(steps=periods)
        return [float(x) for x in forecast], None
    except Exception as e:
        avg = ts.mean()
        return [avg] * periods, str(e)

def forecast_prophet(ts, periods):
    if not PROPHET_AVAILABLE:
        return None, "Prophet not installed"
    df = ts.reset_index()
    df.columns = ['ds', 'y']
    try:
        model = Prophet()
        model.fit(df)
        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)
        yhat = forecast['yhat'][-periods:].tolist()
        return [float(x) for x in yhat], None
    except Exception as e:
        avg = ts.mean()
        return [avg] * periods, str(e)

def forecast_average(ts, periods):
    avg = ts.mean()
    return [avg] * periods, None

def get_forecast(ts, periods):
    return forecast_prophet(ts, periods)

def clean_usage_data(df):
    subset_cols = ['usage_time', 'quantity']
    if 'item_id' in df.columns:
        subset_cols.append('item_id')
    df = df.drop_duplicates(subset=subset_cols)
    df['usage_time'] = pd.to_datetime(df['usage_time'], errors='coerce')
    df = df.dropna(subset=['usage_time'])
    if df['quantity'].isnull().any():
        df['quantity'] = df['quantity'].fillna(df['quantity'].mean())
    df = df[df['quantity'] >= 0]
    upper = df['quantity'].quantile(0.99)
    df['quantity'] = df['quantity'].clip(upper=upper)
    return df

@app.get("/predict_usage_trend")
def predict_usage_trend(
    item_id: int = Query(...),
    periods: int = Query(7)
):
    query = f"""
        SELECT usage_time, quantity
        FROM usage_log
        WHERE item_id = {item_id}
        ORDER BY usage_time
    """
    df = pd.read_sql(query, engine)
    df = clean_usage_data(df)
    if df.empty or len(df) < 5:
        avg = df['quantity'].mean() if not df.empty else 0
        return {"trend": [avg] * periods, "model_used": "prophet", "warning": "Limited data"}
    ts = df.set_index('usage_time')['quantity']
    forecast, error = get_forecast(ts, periods)
    response = {"trend": forecast, "model_used": "prophet"}
    if error:
        response["error"] = error
    return response

@app.get("/predict_shortages")
def predict_shortages(
    item_id: int = Query(...),
    periods: int = Query(7)
):
    query = f"""
        SELECT usage_time, quantity
        FROM usage_log
        WHERE item_id = {item_id}
        ORDER BY usage_time
    """
    query_stock = f"SELECT stock_level FROM inventory WHERE id = {item_id}"
    df_stock = pd.read_sql(query_stock, engine)
    df = pd.read_sql(query, engine)
    print(df)
    df = clean_usage_data(df)
    print(df)
    if df.empty:
        return {"error": "Not enough data"}
    df_usage = df[df['quantity'] > 0]
    ts = df_usage.set_index('usage_time')['quantity']
    if len(ts) < 5:
        avg = ts.mean() if not ts.empty else 0
        forecast = [avg] * periods
        error = "Limited data, using average usage"
    else:
        forecast, error = get_forecast(ts, periods)
    print(ts)
    
    # Ensure forecast is non-negative and Python float
    forecast = [max(0, float(x)) for x in forecast]
    current_stock = float(df_stock['stock_level'].iloc[0]) if not df_stock.empty else float(df['quantity'].sum())
    stock_projection = []
    shortages = []
    last_date = pd.to_datetime(df['usage_time']).max() if not df.empty else pd.Timestamp.now()
    date_labels = [(last_date + pd.Timedelta(days=i+1)).strftime('%Y-%m-%d') for i in range(periods)]
    stock = current_stock
    for i, demand in enumerate(forecast):
        stock -= demand
        projected_stock = float(stock)
        stock_projection.append(round(projected_stock, 2))
        if projected_stock < 0:
            shortages.append({
                "period": int(i+1),
                "date": date_labels[i],
                "predicted_shortage": round(abs(projected_stock), 2)
            })
    response = {
        "forecast_usage": [round(float(x), 2) for x in forecast],
        "starting_stock": round(float(current_stock), 2),
        "stock_projection": [
            {"period": int(i+1), "date": date_labels[i], "projected_stock": round(float(stock_projection[i]), 2)}
            for i in range(periods)
        ],
        "shortages": shortages,
        "model_used": "prophet"
    }
    if error:
        response["error"] = error
    return response