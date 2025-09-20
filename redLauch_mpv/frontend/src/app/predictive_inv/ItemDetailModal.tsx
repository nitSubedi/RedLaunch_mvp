"use client";
import React, { useEffect, useState } from 'react';
import { InventoryItem } from './types';
import { fetchShortagePrediction } from '../lib/apiClient';
import './modal.css'
import StockProjectionChart from './Chart';

interface ItemDetailModalProps {
    item: InventoryItem | null;
    isOpen: boolean;
    onClose: () => void;
}

interface Shortage {
    period: number;
    date: string;
    predicted_shortage: number;
}

interface ShortageData {
    forecast_usage: number[];
    starting_stock: number;
    stock_projection: {
        period: number;
        date: string;
        projected_stock: number;
    }[];
    shortages: Shortage[];
    model_used: string;
}

interface ChartDataPoint {
    day: number;
    date: string;
    projectedStock: number;
    forecastUsage: number;
    isShortage: boolean;
    shortageAmount: number;
}

function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
    const [shortageData, setShortageData] = useState<ShortageData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadShortageData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!item?.id) return;

                const data = await fetchShortagePrediction(item.id);
                setShortageData(data);
            } catch (err) {
                console.error('Failed to fetch shortage prediction:', err);
                setError('Could not load shortage data.');
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && item) {
            loadShortageData();
        }
    }, [item, isOpen]);

    // Transform data for chart
    const chartData: ChartDataPoint[] = React.useMemo(() => {
        if (!shortageData || !shortageData.forecast_usage.length) return [];

        return shortageData.forecast_usage.map((usage, index) => {
            const day = index + 1;
            const date = shortageData.stock_projection?.[index]?.date ?? 'N/A';
            const projectedStock = shortageData.stock_projection?.[index]?.projected_stock ?? 0;
            const shortage = shortageData.shortages.find(s => s.period === day);
            
            return {
                day,
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                projectedStock,
                forecastUsage: usage,
                isShortage: projectedStock < 0,
                shortageAmount: shortage?.predicted_shortage ?? 0
            };
        });
    }, [shortageData]);

    if (!isOpen || !item) return null

    const shortages = shortageData?.shortages ?? [];

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2>{item.category}</h2>
                        <p className="modal-subtitle">Inventory Shortage Analysis</p>
                    </div>
                    <button onClick={onClose} className="modal-close-btn">
                        ✕
                    </button>
                </div>

                <div className="modal-content">
                    {loading && (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading shortage prediction...</p>
                        </div>
                    )}
                    
                    {error && <div className="error-text">{error}</div>}

                    {!loading && !error && shortageData && (
                        <>
                            <div className="starting-stock-card">
                                <div className="stock-info">
                                    <span className="stock-label">Starting Stock</span>
                                    <span className="stock-value">{shortageData.starting_stock}</span>
                                </div>
                                <div className="model-info">
                                    <span className="model-label">Model Used:</span>
                                    <span className="model-value">{shortageData.model_used.toUpperCase()}</span>
                                </div>
                            </div>

                            {/* Chart Component */}
                            <StockProjectionChart data={chartData} />

                            {/* Enhanced Table Section */}
                            {shortageData.forecast_usage && shortageData.forecast_usage.length > 0 && (
                                <div className="table-section">
                                    <div className="table-header">
                                        <h4>Detailed Breakdown</h4>
                                        <p className="table-subtitle">Day-by-day analysis of stock projection</p>
                                    </div>
                                    
                                    <div className="table-wrapper">
                                        <table className="shortage-table">
                                            <thead>
                                                <tr>
                                                    <th>Day</th>
                                                    <th>Date</th>
                                                    <th>Usage</th>
                                                    <th>Stock</th>
                                                    <th>Shortage</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {shortageData.forecast_usage.map((usage, index) => {
                                                    const day = index + 1;
                                                    const date = shortageData.stock_projection?.[index]?.date ?? 'N/A';
                                                    const projectedStock = shortageData.stock_projection?.[index]?.projected_stock ?? 0;
                                                    const shortageEntry = shortages.find(s => s.period === day);
                                                    const predictedShortage = shortageEntry?.predicted_shortage ?? 0;
                                                    const isShortageRow = projectedStock < 0;

                                                    return (
                                                        <tr key={day} className={isShortageRow ? 'shortage-row' : ''}>
                                                            <td className="day-cell">{day}</td>
                                                            <td>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                                            <td>{usage.toFixed(1)}</td>
                                                            <td className={`stock-cell ${isShortageRow ? 'negative-stock' : 'positive-stock'}`}>
                                                                {projectedStock.toFixed(1)}
                                                            </td>
                                                            <td className={`shortage-cell ${predictedShortage > 0 ? 'has-shortage' : ''}`}>
                                                                {predictedShortage > 0 ? predictedShortage.toFixed(1) : '-'}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            
                            {/* Enhanced Shortage Alert */}
                            {shortages.length > 0 && (
                                <div className="shortage-alert-card">
                                    <div className="alert-icon">⚠️</div>
                                    <div className="alert-content">
                                        <h4>Critical Stock Shortage Predicted</h4>
                                        <p>Stock depletion expected on days: <strong>{shortages.map(s => s.period).join(', ')}</strong></p>
                                        <p className="alert-subtext">
                                            Maximum shortage: <strong>{Math.max(...shortages.map(s => s.predicted_shortage)).toFixed(1)} units</strong>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ItemDetailModal;