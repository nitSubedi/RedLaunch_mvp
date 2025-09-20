import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart, TooltipProps } from 'recharts';

// Type assertion to fix Recharts TypeScript issues
const FixedXAxis = XAxis as typeof XAxis;
const FixedYAxis = YAxis as typeof YAxis;
const FixedCartesianGrid = CartesianGrid as typeof CartesianGrid;
const FixedReferenceLine = ReferenceLine as typeof ReferenceLine;
const FixedArea = Area as typeof Area;
const FixedLine = Line as typeof Line;

interface ChartDataPoint {
    day: number;
    date: string;
    projectedStock: number;
    forecastUsage: number;
    isShortage: boolean;
    shortageAmount: number;
}

interface StockProjectionChartProps {
    data: ChartDataPoint[];
    className?: string;
}

const CustomTooltip = (props: TooltipProps<number, string>) => {
    const { active } = props;
    const label = (props as { label: string }).label;
    const payload = (props as { payload: { payload: ChartDataPoint }[] }).payload;
    if (active && payload && payload.length) {
        const data: ChartDataPoint = payload[0].payload;
        return (
            <div className="chart-tooltip">
                <p className="tooltip-label">{`Day ${label} (${data.date})`}</p>
                <p className="tooltip-stock">
                    <span 
                        className="tooltip-dot" 
                        style={{ backgroundColor: data.isShortage ? "#ff4757" : "#00ff88" }}
                    ></span>
                    Stock: {data.projectedStock.toFixed(1)}
                </p>
                <p className="tooltip-usage">
                    <span className="tooltip-dot" style={{ backgroundColor: "#00fff7" }}></span>
                    Usage: {data.forecastUsage.toFixed(1)}
                </p>
                {data.isShortage && (
                    <p className="tooltip-shortage">
                        ⚠️ Shortage: {Math.abs(data.projectedStock).toFixed(1)}
                    </p>
                )}
            </div>
        );
    }
    return null;
};

const StockProjectionChart: React.FC<StockProjectionChartProps> = ({ data, className = "" }) => {
    if (!data || data.length === 0) {
        return (
            <div className="chart-empty-state">
                <p>No chart data available</p>
            </div>
        );
    }

    return (
        <div className={`chart-section ${className}`}>
            <div className="chart-header">
                <h4>Stock Projection Trend</h4>
                <p className="chart-subtitle">Visual forecast of stock levels and daily usage patterns</p>
            </div>
            
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={320}>
                    <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="stockGradientPositive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="stockGradientNegative" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff4757" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ff4757" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        
                        <FixedCartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="#3a3a3f" 
                            opacity={0.3} 
                        />
                        <FixedXAxis 
                            dataKey="date" 
                            stroke="#8a8a8e"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <FixedYAxis 
                            stroke="#8a8a8e"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        
                        {/* Zero reference line */}
                        <FixedReferenceLine 
                            y={0} 
                            stroke="#ffd700" 
                            strokeDasharray="5 5" 
                            strokeWidth={2}
                            opacity={0.8}
                        />
                        
                        {/* Stock projection area */}
                        <FixedArea
                            type="monotone"
                            dataKey="projectedStock"
                            stroke="#00ff88"
                            strokeWidth={3}
                            fill="url(#stockGradientPositive)"
                            dot={{ r: 4, fill: "#00ff88", strokeWidth: 2, stroke: "#1e1e21" }}
                            activeDot={{ r: 6, fill: "#00ff88", stroke: "#1e1e21", strokeWidth: 2 }}
                        />
                        
                        {/* Usage trend line */}
                        <FixedLine
                            type="monotone"
                            dataKey="forecastUsage"
                            stroke="#00fff7"
                            strokeWidth={2}
                            dot={{ r: 3, fill: "#00fff7", strokeWidth: 1, stroke: "#1e1e21" }}
                            strokeDasharray="8 4"
                            opacity={0.9}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            
            {/* Chart Legend */}
            <div className="chart-legend">
                <div className="legend-item">
                    <div className="legend-indicator solid" style={{ backgroundColor: "#00ff88" }}></div>
                    <span>Projected Stock</span>
                </div>
                <div className="legend-item">
                    <div className="legend-indicator dashed" style={{ borderColor: "#00fff7" }}></div>
                    <span>Daily Usage</span>
                </div>
                <div className="legend-item">
                    <div className="legend-indicator dashed" style={{ borderColor: "#ffd700" }}></div>
                    <span>Zero Stock Line</span>
                </div>
            </div>
        </div>
    );
};

export default StockProjectionChart;