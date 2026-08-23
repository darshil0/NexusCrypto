import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { formatUSD, formatCompactNumber } from '../../utils/formatters';

interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingChartProps {
  symbol: string;
  basePrice: number;
  change24h?: number;
  height?: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  symbol,
  basePrice,
  change24h = 0,
  height = 380,
}) => {
  const [timeframe, setTimeframe] = useState<'24H' | '7D' | '30D' | '1Y'>('24H');
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [showMA, setShowMA] = useState<boolean>(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(650);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Generate deterministic candlestick data based on symbol, timeframe, and basePrice
  const candles: CandleData[] = useMemo(() => {
    const count = timeframe === '24H' ? 24 : timeframe === '7D' ? 28 : timeframe === '30D' ? 30 : 52;
    const intervalMs =
      timeframe === '24H'
        ? 3600000
        : timeframe === '7D'
        ? 3600000 * 6
        : timeframe === '30D'
        ? 86400000
        : 86400000 * 7;

    const data: CandleData[] = [];
    // Fixed reference timestamp for deterministic rendering
    const now = 1735689600000;
    const current = basePrice * (timeframe === '1Y' ? 0.65 : timeframe === '30D' ? 0.88 : timeframe === '7D' ? 0.96 : (1 - (change24h / 100)));

    // Deterministic pseudo-random seed using symbol code
    let seed = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 42);
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const targetEndPrice = basePrice;
    const stepDiff = (targetEndPrice - current) / count;

    for (let i = 0; i < count; i++) {
      const t = now - (count - i) * intervalMs;
      const noise = (pseudoRandom() - 0.48) * (basePrice * (timeframe === '24H' ? 0.015 : 0.04));
      const open = i === 0 ? current : data[i - 1].close;
      const drift = stepDiff * (0.8 + pseudoRandom() * 0.4);
      const close = i === count - 1 ? basePrice : Math.max(basePrice * 0.1, open + drift + noise);
      const high = Math.max(open, close) + pseudoRandom() * (basePrice * 0.008);
      const low = Math.min(open, close) - pseudoRandom() * (basePrice * 0.008);
      const volume = Math.floor((basePrice * 120 + pseudoRandom() * basePrice * 300) * (timeframe === '1Y' ? 20 : 1));

      data.push({
        time: new Date(t).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: timeframe === '24H' || timeframe === '7D' ? '2-digit' : undefined,
          minute: timeframe === '24H' ? '2-digit' : undefined,
        }),
        timestamp: t,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
      });
    }

    return data;
  }, [symbol, timeframe, basePrice, change24h]);

  // Compute Moving Average (period 7)
  const maData = useMemo(() => {
    const period = 5;
    return candles.map((c, idx, arr) => {
      if (idx < period - 1) return null;
      const slice = arr.slice(idx - period + 1, idx + 1);
      const avg = slice.reduce((sum, item) => sum + item.close, 0) / period;
      return avg;
    });
  }, [candles]);

  // Chart coordinate calculations
  const padding = { top: 20, right: 60, bottom: 40, left: 10 };
  const chartWidth = Math.max(300, width - padding.left - padding.right);
  const chartHeight = height - padding.top - padding.bottom;
  const volumeHeight = chartHeight * 0.22;
  const priceChartHeight = chartHeight - volumeHeight - 15;

  const minPrice = Math.min(...candles.map((c) => c.low)) * 0.995;
  const maxPrice = Math.max(...candles.map((c) => c.high)) * 1.005;
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...candles.map((c) => c.volume)) || 1;

  const getX = useCallback((index: number) => {
    const step = chartWidth / (candles.length - 1 || 1);
    return padding.left + index * step;
  }, [chartWidth, candles.length, padding.left]);

  const getY = useCallback((price: number) => {
    return padding.top + priceChartHeight - ((price - minPrice) / priceRange) * priceChartHeight;
  }, [padding.top, priceChartHeight, minPrice, priceRange]);

  const getVolumeY = (vol: number) => {
    return padding.top + chartHeight - (vol / maxVolume) * volumeHeight;
  };

  // Line path
  const linePath = useMemo(() => {
    return candles
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(c.close).toFixed(1)}`)
      .join(' ');
  }, [candles, getX, getY]);

  const areaPath = useMemo(() => {
    if (candles.length === 0) return '';
    const firstX = getX(0).toFixed(1);
    const lastX = getX(candles.length - 1).toFixed(1);
    const bottomY = (padding.top + priceChartHeight).toFixed(1);
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [linePath, candles, getX, padding.top, priceChartHeight]);

  // MA Line Path
  const maPath = useMemo(() => {
    let path = '';
    maData.forEach((ma, i) => {
      if (ma === null) return;
      const x = getX(i).toFixed(1);
      const y = getY(ma).toFixed(1);
      path += `${path === '' ? 'M' : 'L'} ${x} ${y} `;
    });
    return path;
  }, [maData, getX, getY]);

  const activeCandle = hoverIndex !== null ? candles[hoverIndex] : candles[candles.length - 1];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - padding.left;
    const step = chartWidth / (candles.length - 1 || 1);
    const idx = Math.max(0, Math.min(candles.length - 1, Math.round(mouseX / step)));
    setHoverIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const isGreen = (activeCandle?.close || basePrice) >= (activeCandle?.open || basePrice);

  return (
    <div ref={containerRef} className="w-full select-none" id="trading-chart-wrapper">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-1">
        {/* Active quote stats */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">O:</span>
            <span className="text-gray-200 font-semibold">{formatUSD(activeCandle?.open || basePrice)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">H:</span>
            <span className="text-green-400 font-semibold">{formatUSD(activeCandle?.high || basePrice)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">L:</span>
            <span className="text-red-400 font-semibold">{formatUSD(activeCandle?.low || basePrice)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">C:</span>
            <span className={isGreen ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
              {formatUSD(activeCandle?.close || basePrice)}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-gray-400">Vol:</span>
            <span className="text-gray-300">{formatCompactNumber(activeCandle?.volume || 0)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex items-center bg-[#161A1E] rounded-xl p-0.5 border border-gray-800 text-xs">
            <button
              onClick={() => setChartType('candle')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                chartType === 'candle' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                chartType === 'line' ? 'bg-indigo-600 text-white font-medium shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Line
            </button>
          </div>

          {/* Indicator MA Toggle */}
          <button
            onClick={() => setShowMA(!showMA)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
              showMA
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-medium'
                : 'bg-[#161A1E] text-gray-400 border-gray-800 hover:text-white'
            }`}
          >
            MA(5)
          </button>

          {/* Timeframe Select */}
          <div className="flex items-center bg-[#161A1E] rounded-xl p-0.5 border border-gray-800 text-xs font-semibold">
            {(['24H', '7D', '30D', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                id={`btn-timeframe-${tf}`}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  timeframe === tf ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative rounded-2xl border border-gray-800 bg-[#0B0E11] overflow-hidden">
        <svg
          width={width}
          height={height}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="cursor-crosshair"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isGreen ? '#22C55E' : '#6366F1'} stopOpacity="0.2" />
              <stop offset="100%" stopColor={isGreen ? '#22C55E' : '#6366F1'} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const y = padding.top + priceChartHeight * ratio;
            const priceVal = maxPrice - ratio * priceRange;
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1F242B"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                  opacity="0.7"
                />
                <text
                  x={width - padding.right + 6}
                  y={y + 3}
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {formatUSD(priceVal, 2, 2)}
                </text>
              </g>
            );
          })}

          {/* Volume Grid separator */}
          <line
            x1={padding.left}
            y1={padding.top + priceChartHeight + 8}
            x2={width - padding.right}
            y2={padding.top + priceChartHeight + 8}
            stroke="#1F242B"
            strokeWidth="1"
          />
          <text
            x={padding.left + 5}
            y={padding.top + priceChartHeight + 20}
            fill="#4B5563"
            fontSize="9"
            fontFamily="monospace"
          >
            VOLUME (SIMULATED)
          </text>

          {/* Volume Bars */}
          {candles.map((c, i) => {
            const x = getX(i);
            const y = getVolumeY(c.volume);
            const barH = padding.top + chartHeight - y;
            const barW = Math.max(2, (chartWidth / candles.length) * 0.65);
            const green = c.close >= c.open;
            return (
              <rect
                key={`vol-${i}`}
                x={x - barW / 2}
                y={y}
                width={barW}
                height={Math.max(1, barH)}
                fill={green ? '#22C55E' : '#EF4444'}
                opacity={hoverIndex === i ? 0.8 : 0.35}
              />
            );
          })}

          {/* Line or Candlestick mode */}
          {chartType === 'line' ? (
            <>
              <path d={areaPath} fill="url(#areaGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke={isGreen ? '#22C55E' : '#6366F1'}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          ) : (
            candles.map((c, i) => {
              const x = getX(i);
              const openY = getY(c.open);
              const closeY = getY(c.close);
              const highY = getY(c.high);
              const lowY = getY(c.low);
              const green = c.close >= c.open;
              const color = green ? '#22C55E' : '#EF4444';
              const candleW = Math.max(3, (chartWidth / candles.length) * 0.65);
              const candleY = Math.min(openY, closeY);
              const candleH = Math.max(1.5, Math.abs(closeY - openY));

              return (
                <g key={`candle-${i}`}>
                  {/* High/Low Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x - candleW / 2}
                    y={candleY}
                    width={candleW}
                    height={candleH}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })
          )}

          {/* Moving Average Line */}
          {showMA && (
            <path
              d={maPath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.85"
            />
          )}

          {/* Interactive Crosshair */}
          {hoverIndex !== null && (
            <g>
              {/* Vertical line */}
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + chartHeight}
                stroke="#6B7280"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              {/* Horizontal line */}
              <line
                x1={padding.left}
                y1={getY(activeCandle.close)}
                x2={width - padding.right}
                y2={getY(activeCandle.close)}
                stroke="#6B7280"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              {/* Current Price Marker */}
              <rect
                x={width - padding.right + 2}
                y={getY(activeCandle.close) - 9}
                width={54}
                height={18}
                fill="#4F46E5"
                rx="4"
              />
              <text
                x={width - padding.right + 6}
                y={getY(activeCandle.close) + 3}
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {formatUSD(activeCandle.close, 0, 0)}
              </text>
            </g>
          )}

          {/* Time axis labels */}
          {candles.map((c, i) => {
            if (i % Math.ceil(candles.length / 5) !== 0) return null;
            return (
              <text
                key={`label-${i}`}
                x={getX(i)}
                y={padding.top + chartHeight + 20}
                fill="#6B7280"
                fontSize="10"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {c.time}
              </text>
            );
          })}
        </svg>

        {/* Paper Trading Watermark */}
        <div className="absolute top-3 right-16 pointer-events-none opacity-20 text-[11px] font-mono tracking-widest text-gray-400 uppercase">
          SIMULATED CANDLESTICK ENGINE • NO REAL FUNDS
        </div>
      </div>
    </div>
  );
};
