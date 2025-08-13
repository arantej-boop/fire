'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Info } from 'lucide-react'

export default function FireLegend() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5" />
          Legend & Information
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Confidence Levels */}
        <div>
          <h4 className="font-medium text-sm mb-2">Confidence Levels</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">High Confidence</span>
              <Badge variant="outline" className="ml-auto text-xs">≥ 80%</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-sm">Nominal Confidence</span>
              <Badge variant="outline" className="ml-auto text-xs">40-79%</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Low Confidence</span>
              <Badge variant="outline" className="ml-auto text-xs">&lt; 40%</Badge>
            </div>
          </div>
        </div>

        {/* Fire Intensity */}
        <div>
          <h4 className="font-medium text-sm mb-2">Fire Intensity</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600 shadow-lg shadow-red-500/50"></div>
              <span className="text-sm">High Intensity</span>
              <Badge variant="outline" className="ml-auto text-xs">FRP &gt; 100 MW</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500 shadow-md shadow-orange-500/30"></div>
              <span className="text-sm">Medium Intensity</span>
              <Badge variant="outline" className="ml-auto text-xs">FRP 10-100 MW</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/20"></div>
              <span className="text-sm">Low Intensity</span>
              <Badge variant="outline" className="ml-auto text-xs">FRP &lt; 10 MW</Badge>
            </div>
          </div>
        </div>

        {/* Data Source */}
        <div>
          <h4 className="font-medium text-sm mb-2">Data Source</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>NASA FIRMS</strong> (Fire Information for Resource Management System)</p>
            <p><strong>Satellites:</strong> Terra, Aqua, Suomi-NPP, NOAA-20, NOAA-21</p>
            <p><strong>Sensors:</strong> MODIS, VIIRS</p>
            <p><strong>Update Frequency:</strong> Near real-time (every 3-6 hours)</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h4 className="font-medium text-sm mb-2">Key Metrics</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Brightness Temperature:</strong> Measured in Kelvin (K)</p>
            <p><strong>FRP:</strong> Fire Radiative Power in Megawatts (MW)</p>
            <p><strong>Scan/Track:</strong> Pixel size and orientation</p>
            <p><strong>Day/Night:</strong> Detection time indicator</p>
          </div>
        </div>

        {/* Coverage */}
        <div>
          <h4 className="font-medium text-sm mb-2">Coverage</h4>
          <div className="text-xs text-muted-foreground">
            <p>This application monitors forest fires across Spain, including:</p>
            <ul className="mt-1 space-y-1">
              <li>• Wildland-urban interface areas</li>
              <li>• National parks and protected areas</li>
              <li>• Forested regions and woodlands</li>
              <li>• Agricultural and rural areas</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}