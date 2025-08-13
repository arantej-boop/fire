'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Filter, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { FireFilters } from '@/hooks/useFireData'

interface FireFiltersProps {
  filters: FireFilters
  onFiltersChange: (filters: Partial<FireFilters>) => void
  onRefresh: () => void
  loading: boolean
  fireCount?: number
}

export default function FireFilters({ filters, onFiltersChange, onRefresh, loading, fireCount = 0 }: FireFiltersProps) {
  const [isOpen, setIsOpen] = useState(true)

  const confidenceOptions = [
    { value: 'low', label: 'Low', color: 'bg-yellow-500' },
    { value: 'nominal', label: 'Nominal', color: 'bg-orange-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' }
  ] as const

  const satelliteOptions = [
    { value: 'Terra', label: 'Terra (AM)' },
    { value: 'Aqua', label: 'Aqua (PM)' },
    { value: 'Suomi-NPP', label: 'Suomi-NPP' },
    { value: 'NOAA-20', label: 'NOAA-20' },
    { value: 'NOAA-21', label: 'NOAA-21' }
  ]

  const handleConfidenceToggle = (confidence: 'low' | 'nominal' | 'high') => {
    const newConfidence = filters.confidence.includes(confidence)
      ? filters.confidence.filter(c => c !== confidence)
      : [...filters.confidence, confidence]
    onFiltersChange({ confidence: newConfidence })
  }

  const handleSatelliteToggle = (satellite: string) => {
    const newSatellites = filters.satellite.includes(satellite)
      ? filters.satellite.filter(s => s !== satellite)
      : [...filters.satellite, satellite]
    onFiltersChange({ satellite: newSatellites })
  }

  const resetFilters = () => {
    onFiltersChange({
      confidence: ['nominal', 'high'],
      satellite: [],
      minBrightness: 300,
      minFRP: 0
    })
  }

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              <Badge variant="secondary" className="ml-2">
                {fireCount} fires
              </Badge>
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? 'Hide' : 'Show'}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Range</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(filters.dateRange.start, 'MMM dd, yyyy')} - {format(filters.dateRange.end, 'MMM dd, yyyy')}
              </div>
            </div>

            {/* Confidence Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Confidence Level</Label>
              <div className="flex flex-wrap gap-2">
                {confidenceOptions.map(option => (
                  <Badge
                    key={option.value}
                    variant={filters.confidence.includes(option.value) ? 'default' : 'outline'}
                    className={`cursor-pointer transition-colors ${
                      filters.confidence.includes(option.value) ? option.color + ' text-white' : ''
                    }`}
                    onClick={() => handleConfidenceToggle(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Satellite Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Satellite</Label>
              <div className="flex flex-wrap gap-2">
                {satelliteOptions.map(satellite => (
                  <Badge
                    key={satellite.value}
                    variant={filters.satellite.includes(satellite.value) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleSatelliteToggle(satellite.value)}
                  >
                    {satellite.label}
                  </Badge>
                ))}
              </div>
              {filters.satellite.length === 0 && (
                <p className="text-xs text-muted-foreground">All satellites selected</p>
              )}
            </div>

            {/* Brightness Slider */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Minimum Brightness: {filters.minBrightness}K
              </Label>
              <Slider
                value={[filters.minBrightness]}
                onValueChange={([value]) => onFiltersChange({ minBrightness: value })}
                min={250}
                max={600}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>250K</span>
                <span>600K</span>
              </div>
            </div>

            {/* FRP Slider */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Minimum Fire Radiative Power: {filters.minFRP} MW
              </Label>
              <Slider
                value={[filters.minFRP]}
                onValueChange={([value]) => onFiltersChange({ minFRP: value })}
                min={0}
                max={500}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 MW</span>
                <span>500 MW</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={onRefresh}
                disabled={loading}
                className="flex-1"
              >
                <RotateCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button
                variant="outline"
                onClick={resetFilters}
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}