"use client"

import React from 'react'

interface SparklineChartProps {
  data: number[]
  width?: number
  height?: number
  color?: string
}

export function SparklineChart({ 
  data, 
  width = 120, 
  height = 40, 
  color = '#3b82f6' 
}: SparklineChartProps) {
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1 // Avoid division by zero
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - minValue) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  )
}