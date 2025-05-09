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
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const [selectedToken, setSelectedToken] = useState('BTCUSDT');
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().slice(0, 19).replace('T', ' ');
    });
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 19).replace('T', ' '));
    const [tokens, setTokens] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const initChart = () => {
        if (!containerRef.current || chartRef.current) return;

        const chart = createChart(containerRef.current, {
            ...darkTheme,
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
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
            const response: any = await api.tokenTrendingView(selectedToken, startDate, endDate);
            if (response.code === 200) {
               
                const data = response.body.data;
                if (candlestickSeries) {
                    candlestickSeries.setData(data);
                }

                const markers: any = response.body.markers
                if (markers) {
                    for (const marker of markers) {
                        marker.position = 'aboveBar';
                        marker.color = marker.text.indexOf("sell") != -1 ? '#26A69A' : '#EF5350';
                        marker.shape = 'arrowDown';
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
            }
        } catch (error) {
            console.error('Failed to fetch chart data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!containerRef.current || chartRef.current) {
            return;
        }

        getTokenTrendings();
        // initChart();
        fetchAndUpdateChart();

        resizeObserverRef.current = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                chartRef.current?.resize(width, height);
            }
        });
        resizeObserverRef.current.observe(containerRef.current);

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []);

    const getTokenTrendings = async () => {
        try {
            const response = await api.tokenTrends();
            if (response.code === 200) {
                const data = response.body;  
                if(data && data.trends && data.trends.length > 0){
                    setTokens(data.trends.map((item: any) => item.tokenSymbol))
                } else {
                    setTokens([])
                }
            } 
        } catch (error) {
            console.error('Failed to create API key:', error);  
        }
    }

    const handleConfirm = () => {
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }
        fetchAndUpdateChart();
    };

    return <div>
        <div className="flex gap-4 mb-4">
            <select 
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="p-2 border rounded bg-gray-800 text-white"
            >
                {tokens.map((token: string) => (
                    <option key={token} value={token}>
                        {token}
                    </option>
                ))}
            </select>
            
            <input 
                type="datetime-local" 
                value={startDate.replace(' ', 'T')}
                onChange={(e) => setStartDate(e.target.value.replace('T', ' '))}
                className="p-2 border rounded bg-gray-800 text-white"
                placeholder="Start Date"
            />
            
            <input 
                type="datetime-local" 
                value={endDate.replace(' ', 'T')}
                onChange={(e) => setEndDate(e.target.value.replace('T', ' '))}
                className="p-2 border rounded bg-gray-800 text-white"
            />

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
            <div ref={containerRef} className="w-full h-full" />
        </div>
    </div>
};