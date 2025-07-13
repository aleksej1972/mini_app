import React from 'react'
import { cn } from '@/lib/utils'

interface LevelBadgeProps {
  level: string
  className?: string
}

const levelColors = {
  'A1': 'bg-green-100 text-green-800 border-green-200',
  'A2': 'bg-blue-100 text-blue-800 border-blue-200',
  'B1': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'B2': 'bg-orange-100 text-orange-800 border-orange-200',
  'C1': 'bg-red-100 text-red-800 border-red-200',
  'C2': 'bg-purple-100 text-purple-800 border-purple-200',
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  const colorClass = levelColors[level as keyof typeof levelColors] || levelColors['A1']
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colorClass,
        className
      )}
    >
      {level}
    </span>
  )
}
