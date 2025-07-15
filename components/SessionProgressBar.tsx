'use client'

import { useEffect, useState } from "react"

interface SessionProgressBarProps {
  duration: number // in minutes
  color?: string
  started: boolean // controls if the timer should begin
}

const SessionProgressBar = ({ duration, color, started }: SessionProgressBarProps) => {
  const totalSeconds = duration * 60
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!started) return // don't start timer until "started" is true

    const interval = setInterval(() => {
      setElapsed(prev => {
        if (prev >= totalSeconds) {
          clearInterval(interval)
          return totalSeconds
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [started, totalSeconds])

  const progress = Math.min((elapsed / totalSeconds) * 100, 100)

  return (
    <div className="w-full h-2 bg-gray-200 rounded-md overflow-hidden mt-4 min-h-[20px]">
      <div
        className="h-full transition-all duration-1000"
        style={{ 
          width: `${progress}%`,
          backgroundColor: color || '#3b82f6'
        }}
      />
    </div>
  )
}

export default SessionProgressBar
