'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/* ─── Types ──────────────────────────────────────── */
interface DailyData {
  date: string
  volume: number
  count: number
}

interface Props {
  totalVolume?: number
  totalTransactions?: number
  dailyData?: DailyData[]
  dateRangeLabel?: string
}

/* ─── Payment Method Legend ───────────────────────── */
const PAYMENT_METHODS = [
  { name: 'Credit Card', color: '#3B82F6' }, // Biru
  { name: 'Mandiri Bill', color: '#EAB308' }, // Kuning
  { name: 'Indomaret', color: '#8B4513' }, // Cokelat
  { name: 'GO-PAY', color: '#F97316' }, // Oranye
  { name: 'Akulaku PayLater', color: '#22C55E' }, // Hijau
  { name: 'Alfamart', color: '#166534' }, // Hijau Tua
  { name: 'LinkAja', color: '#1E3A5F' }, // Biru Tua
  { name: 'QRIS', color: '#8B5CF6' }, // Ungu
  { name: 'Kredivo', color: '#06B6D4' }, // Cyan
  { name: 'DANA', color: '#EF4444' }, // Merah
  { name: 'ShopeePay', color: '#60A5FA' }, // Biru Muda
  { name: 'Bank Transfer', color: '#6D28D9' }, // Ungu Tua
]

const TIME_FILTERS = ['Today', 'Last 7 Days', 'Last 30 Days', 'This Month']

/* ─── Component ──────────────────────────────────── */
export default function AnalyticsDashboard({
  totalVolume = 3555000,
  totalTransactions = 1,
  dailyData = [
    { date: '30/05', volume: 0, count: 0 },
    { date: '31/05', volume: 0, count: 0 },
    { date: '01/06', volume: 0, count: 0 },
    { date: '02/06', volume: 0, count: 0 },
    { date: '03/06', volume: 0, count: 0 },
    { date: '04/06', volume: 0, count: 0 },
    { date: '05/06', volume: 3555000, count: 1 },
    { date: '06/06', volume: 0, count: 0 },
  ],
  dateRangeLabel = '30 May - 6 Jun 2026',
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialFilter = searchParams.get('filter') || 'Last 7 Days'

  const [activeFilter, setActiveFilter] = useState(initialFilter)
  const [showDropdown, setShowDropdown] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /* ─── Dynamic Y-Axis Scale ────────────── */
  const { maxVal, yTicks } = useMemo(() => {
    const highestVolume = Math.max(...dailyData.map(d => d.volume), 0)
    // If there's data, set max to 110% of highest volume, rounded to nice numbers
    const calculatedMax = highestVolume > 0 ? highestVolume * 1.1 : 3_500_000
    
    // Create 6 ticks (0 to 5)
    const ticks = Array.from({ length: 6 }, (_, i) => {
      const value = (calculatedMax / 5) * i
      let label = '0.0'
      if (value > 0) {
        if (value >= 1_000_000) {
          label = (value / 1_000_000).toFixed(1) + 'M'
        } else if (value >= 1_000) {
          label = (value / 1_000).toFixed(1) + 'K'
        } else {
          label = value.toFixed(0)
        }
      }
      return { value, label }
    })
    return { maxVal: calculatedMax, yTicks: ticks }
  }, [dailyData])

  /* ─── Chart Geometry ────────────────────────────── */
  const chartWidth = 820
  const chartHeight = 380
  const pad = { top: 30, right: 40, bottom: 65, left: 80 }

  const { points, linePath, areaPath } = useMemo(() => {
    const cw = chartWidth - pad.left - pad.right
    const ch = chartHeight - pad.top - pad.bottom
    const len = Math.max(dailyData.length - 1, 1)

    const _points = dailyData.map((d, i) => ({
      x: pad.left + (i / len) * cw,
      y: pad.top + ch - (Math.min(d.volume, maxVal) / maxVal) * ch,
    }))

    const _linePath = _points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ')

    const baseline = pad.top + ch
    const _areaPath =
      _linePath +
      ` L ${_points[_points.length - 1].x} ${baseline}` +
      ` L ${_points[0].x} ${baseline} Z`

    return { points: _points, linePath: _linePath, areaPath: _areaPath }
  }, [dailyData, maxVal])

  const ch = chartHeight - pad.top - pad.bottom
  const cw = chartWidth - pad.left - pad.right

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════
          SUMMARY PANEL (White Card)
          ═══════════════════════════════════════════════ */}
      <div
        className={`
          rounded-[2rem] bg-white p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]
          transition-all duration-700 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        `}
      >
        {/* Title */}
        <h2 className="text-xl font-medium text-gray-700 mb-8">
          Summary
        </h2>

        <div className="flex items-center">
          {/* ── Metric 1: Total Volume ── */}
          <div className="flex-1 min-w-0">
            <p className="text-4xl md:text-[2.5rem] font-bold text-black leading-tight tracking-tight truncate">
              Rp. {totalVolume.toLocaleString('id-ID')}
            </p>
            <p className="text-sm font-semibold text-blue-500 mt-2">Total Volume</p>
            <p className="text-xs font-medium text-gray-400 mt-1">Selected Period</p>
          </div>

          {/* ── Vertical Separator ── */}
          <div className="w-[2px] h-24 bg-gray-100 mx-8 md:mx-12 shrink-0" />

          {/* ── Metric 2: Total Transaction ── */}
          <div className="flex-1 min-w-0">
            <p className="text-4xl md:text-[2.5rem] font-bold text-black leading-tight tracking-tight">
              {totalTransactions}
            </p>
            <p className="text-sm font-semibold text-gray-500 mt-2">Total Transaction</p>
            <p className="text-xs font-medium text-gray-400 mt-1">Selected Period</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          TRANSACTION VOLUME PANEL (White Card)
          ═══════════════════════════════════════════════ */}
      <div
        className={`
          rounded-[2rem] bg-white p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]
          transition-all duration-700 ease-out delay-150
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
        `}
      >
        {/* ── Header: Title + Date Picker ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <h2 className="text-xl font-medium text-gray-700">
            Transaction Volume
          </h2>

          {/* Date range picker + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="date-picker-btn"
              onClick={() => setShowDropdown((v) => !v)}
              className="
                flex items-center gap-2.5 px-5 py-2.5 rounded-xl
                border border-gray-200 bg-white
                text-sm text-gray-600 font-medium shadow-sm
                hover:border-gray-300 hover:bg-gray-50
                active:scale-[0.98]
                transition-all duration-200
              "
            >
              {/* Calendar icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span>{dateRangeLabel}</span>
              {/* Chevron */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-gray-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* ── Dark Dropdown Menu ── */}
            <div
              className={`
                absolute right-0 top-full mt-2 w-60 rounded-xl
                bg-[#18181b] border border-white/10
                shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden z-50
                transition-all duration-300 origin-top-right
                ${showDropdown ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
              `}
            >
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <p className="text-sm font-semibold text-white tracking-wide">Show stats for:</p>
              </div>
              {TIME_FILTERS.map((filter) => (
                <button
                  key={filter}
                  id={`filter-${filter.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    setActiveFilter(filter)
                    setShowDropdown(false)
                    router.push(`?filter=${encodeURIComponent(filter)}`, { scroll: false })
                  }}
                  className={`
                    w-full px-4 py-3 text-left text-sm transition-all duration-200
                    ${
                      activeFilter === filter
                        ? 'bg-zinc-800 text-white font-medium'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }
                  `}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── SVG Area Chart ── */}
        <div className="w-full overflow-x-auto no-scrollbar -mx-2 px-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[560px]"
            role="img"
            aria-label="Transaction volume area chart"
          >
            <defs>
              {/* Yellow/amber area gradient */}
              <linearGradient id="areaFillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EAB308" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#EAB308" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* ── Horizontal Grid Lines + Y Labels ── */}
            {yTicks.map((tick, i) => {
              const y = pad.top + ch - (tick.value / maxVal) * ch
              return (
                <g key={`y-${i}`}>
                  <line
                    x1={pad.left}
                    y1={y}
                    x2={chartWidth - pad.right}
                    y2={y}
                    stroke="#E5E7EB" // gray-200
                    strokeDasharray={i === 0 ? 'none' : '4 6'}
                  />
                  <text
                    x={pad.left - 14}
                    y={y + 4}
                    textAnchor="end"
                    fill="#6B7280" // gray-500
                    fontSize="12"
                    fontWeight="500"
                    fontFamily="var(--font-sans), system-ui, sans-serif"
                  >
                    {tick.label}
                  </text>
                </g>
              )
            })}

            {/* ── X Axis Labels (dates) ── */}
            {dailyData.map((d, i) => {
              const x = pad.left + (i / Math.max(dailyData.length - 1, 1)) * cw
              
              // Only show some labels if there are too many data points (e.g. 30 days) to prevent overlap
              const labelStep = Math.max(1, Math.ceil(dailyData.length / 10))
              const showLabel = i % labelStep === 0 || i === dailyData.length - 1
              
              if (!showLabel) return null

              return (
                <text
                  key={`x-${i}`}
                  x={x}
                  y={chartHeight - 18}
                  textAnchor="middle"
                  fill="#6B7280" // gray-500
                  fontSize="12"
                  fontWeight="500"
                  fontFamily="var(--font-sans), system-ui, sans-serif"
                >
                  {d.date}
                </text>
              )
            })}

            {/* ── Yellow Area Fill ── */}
            <path
              d={areaPath}
              fill="url(#areaFillGrad)"
              className="transition-all duration-500"
            />

            {/* ── Blue Line ── */}
            <path
              d={linePath}
              fill="none"
              stroke="#3B82F6" // blue-500
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500"
            />

            {/* ── Interactive Data Points ── */}
            {points.map((p, i) => (
              <g key={`dot-${i}`}>
                {/* Invisible hit area */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={20}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* Visible dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint === i ? 6 : 4}
                  fill={hoveredPoint === i ? '#3B82F6' : '#FFFFFF'}
                  stroke="#3B82F6"
                  strokeWidth={hoveredPoint === i ? 3 : 2}
                  className="transition-all duration-200"
                />

                {/* Tooltip on hover */}
                {hoveredPoint === i && dailyData[i].volume > 0 && (
                  <g className="pointer-events-none">
                    {/* Vertical dashed guide */}
                    <line
                      x1={p.x}
                      y1={p.y + 10}
                      x2={p.x}
                      y2={pad.top + ch}
                      stroke="#3B82F6"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      opacity="0.5"
                    />
                    {/* Tooltip pill */}
                    <rect
                      x={p.x - 75}
                      y={p.y - 44}
                      width={150}
                      height={32}
                      rx={8}
                      fill="#1E293B"
                      stroke="rgba(59,130,246,0.3)"
                      strokeWidth="1"
                      className="shadow-md"
                    />
                    {/* Tooltip text */}
                    <text
                      x={p.x}
                      y={p.y - 23}
                      textAnchor="middle"
                      fill="white"
                      fontSize="13"
                      fontWeight="600"
                      fontFamily="var(--font-sans), system-ui, sans-serif"
                    >
                      Rp. {dailyData[i].volume.toLocaleString('id-ID')}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* ── Payment Method Legend ── */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.name}
                className="flex items-center gap-2.5 group cursor-default"
              >
                <div
                  className="w-3 h-3 rounded-[3px] transition-transform duration-200 group-hover:scale-125 shadow-sm"
                  style={{ backgroundColor: method.color }}
                />
                <span className="text-[12px] font-medium text-gray-500 group-hover:text-gray-800 transition-colors duration-200">
                  {method.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          FLOATING ACTION BUTTON (Chat)
          ═══════════════════════════════════════════════ */}
      <button
        id="fab-chat"
        className="
          fixed bottom-8 right-8 w-14 h-14 rounded-full
          bg-[#007BFF] hover:bg-[#0056b3]
          shadow-[0_8px_24px_rgba(0,123,255,0.4)]
          flex items-center justify-center
          transition-all duration-300 hover:scale-110 active:scale-95
          z-50
        "
        aria-label="Open chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </button>
    </div>
  )
}
