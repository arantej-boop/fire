'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, subDays } from 'date-fns'

export interface FireData {
  latitude: number
  longitude: number
  brightness: number
  scan: number
  track: number
  acq_date: string
  acq_time: number
  satellite: string
  confidence: 'low' | 'nominal' | 'high'
  version: string
  bright_t31: number
  frp: number
  daynight: 'D' | 'N'
}

export interface FireFilters {
  dateRange: {
    start: Date
    end: Date
  }
  confidence: ('low' | 'nominal' | 'high')[]
  satellite: string[]
  minBrightness: number
  minFRP: number
}

const defaultFilters: FireFilters = {
  dateRange: {
    start: subDays(new Date(), 7),
    end: new Date()
  },
  confidence: ['nominal', 'high'],
  satellite: [],
  minBrightness: 300,
  minFRP: 0
}

export function useFireData() {
  const [fires, setFires] = useState<FireData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FireFilters>(defaultFilters)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const updateFilters = useCallback((newFilters: Partial<FireFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const fetchFires = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        start_date: format(filters.dateRange.start, 'yyyy-MM-dd'),
        end_date: format(filters.dateRange.end, 'yyyy-MM-dd'),
        confidence: filters.confidence.join(','),
        min_brightness: filters.minBrightness.toString(),
        min_frp: filters.minFRP.toString()
      })

      if (filters.satellite.length > 0) {
        params.append('satellite', filters.satellite.join(','))
      }

      const response = await fetch(`/api/fires?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setFires(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('Error fetching fire data:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const refreshData = useCallback(() => {
    fetchFires()
  }, [fetchFires])

  useEffect(() => {
    fetchFires()
  }, [fetchFires])

  return {
    fires,
    loading,
    error,
    filters,
    updateFilters,
    refreshData,
    lastUpdated
  }
}