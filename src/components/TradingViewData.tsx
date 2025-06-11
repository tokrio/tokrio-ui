import { CandlestickSeries, createChart, createSeriesMarkers } from 'lightweight-charts';
import React, { useState } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { api } from '../services/api';

interface LineItem {
    timestamp: number | string;
    open: number | string;
    high: number | string;
    low: number | string;
    close: number | string;
    volume: number | string;
}

const lightTheme = {
    layout: {
        background: { color: '#FAFCFF' },
        textColor: '#444',
    },
    grid: {
        vertLines: {
            color: '#ddd',
        },
        horzLines: {
            color: '#ddd',
        },
    },
};

const darkTheme = {
    layout: {
        background: { color: '#18181B' },
        textColor: '#fff',
    },
    grid: {
        vertLines: {
            color: '#333333',
        },
        horzLines: {
            color: '#333333',
        },
    },
};

export default function TrendingView() {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const [selectedToken, setSelectedToken] = useState('BTCUSDT');
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().slice(0, 19).replace('T', ' ');
    });
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 19).replace('T', ' '));
    const [tokens, setTokens] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<string>('');

    const initChart = () => {
        if (!containerRef.current || chartRef.current) return;

        const chart = createChart(containerRef.current, {
            ...darkTheme,
            // width: containerRef.current.clientWidth,
            // height: containerRef.current.clientHeight,
        });
        chartRef.current = chart;

        return chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
    };

    const fetchAndUpdateChart = async () => {
        // if (!chartRef.current) return;
        
        setIsLoading(true);
        try {
            const candlestickSeries = initChart();
            
               let body = JSON.parse(data)
                const viewData = body.data;
                if (candlestickSeries) {
                    candlestickSeries.setData(viewData);
                }

                const markers: any = body.markers
                if (markers) {
                    for (const marker of markers) {
                        marker.time = marker.time;
                        marker.text = marker.text;
                        marker.position = marker.text.indexOf("sell") != -1 ? 'aboveBar':'belowBar';
                        marker.color = marker.text.indexOf("sell") != -1 ? '#26A69A' : '#EF5350';
                        marker.shape = marker.text.indexOf("sell") != -1 ? 'arrowDown':'arrowUp';
                    }
                    if (candlestickSeries) {
                        createSeriesMarkers(candlestickSeries, markers);
                    }
                }

                chartRef.current.timeScale().applyOptions({
                    timeVisible: true,
                });
                chartRef.current.applyOptions({
                    localization: {
                        locale: 'en-US',
                    },
                });
                chartRef.current.timeScale().fitContent();
            
        } catch (error) {
            console.error('Failed to fetch chart data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = () => {
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }
        fetchAndUpdateChart();
    };

    return <div>
        <div className="flex flex-wrap gap-4 mb-4">
            
            <textarea 
                rows={6}
                className="p-2 border w-full rounded bg-gray-800 text-white [color-scheme:lgiht] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[1]"
                value={data}
                onChange={(e) => setData(e.target.value)} />
            

            <button
                onClick={handleConfirm}
                className="px-3 py-2 cta-button"
            >
                Ok
            </button>
        </div>
        <div className="relative w-[100%] border rounded-sm border-gray-600 h-[70vh]">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}
            <div ref={containerRef} className="w-screen h-full" />
        </div>
    </div>
};