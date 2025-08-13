'use client';

import { useFireData } from '@/hooks/useFireData';
import dynamic from 'next/dynamic';
import FireFilters from '@/components/FireFilters';
import FireLegend from '@/components/FireLegend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Flame, 
  RefreshCw, 
  Activity, 
  MapPin, 
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react';

// Dynamically import FireMap to avoid SSR issues
const FireMap = dynamic(() => import('@/components/FireMap'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden border border-border flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const { fires, loading, error, filters, updateFilters, refreshData } = useFireData();

  // Calculate statistics
  const totalFires = fires.length;
  const highConfidenceFires = fires.filter(fire => fire.confidence === 'high').length;
  const nominalConfidenceFires = fires.filter(fire => fire.confidence === 'nominal').length;
  const lowConfidenceFires = fires.filter(fire => fire.confidence === 'low').length;
  const totalFRP = fires.reduce((sum, fire) => sum + fire.frp, 0);
  const avgFRP = totalFires > 0 ? totalFRP / totalFires : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Flame className="h-8 w-8 text-red-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Incendios Forestales España</h1>
                <p className="text-sm text-muted-foreground">
                  Monitoreo en tiempo real con datos NASA FIRMS
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.ceil((filters.dateRange.end.getTime() - filters.dateRange.start.getTime()) / (1000 * 60 * 60 * 24))}d
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar datos: {error}. Por favor, intenta nuevamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Incendios</p>
                  <p className="text-xl font-bold">{totalFires}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Alta Confianza</p>
                  <p className="text-xl font-bold">{highConfidenceFires}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Confianza Normal</p>
                  <p className="text-xl font-bold">{nominalConfidenceFires}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Baja Confianza</p>
                  <p className="text-xl font-bold">{lowConfidenceFires}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">FRP Promedio</p>
                  <p className="text-xl font-bold">{avgFRP.toFixed(1)} MW</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Column */}
          <div className="lg:col-span-1 space-y-6">
            <FireFilters 
              filters={filters}
              onFiltersChange={updateFilters}
              onRefresh={refreshData}
              loading={loading}
              fireCount={totalFires}
            />
            <FireLegend />
          </div>

          {/* Map Column */}
          <div className="lg:col-span-3">
            <FireMap 
              fires={fires}
            />
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Información sobre los Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Fuente de Datos</h4>
                <p className="text-sm text-muted-foreground">
                  Los datos son obtenidos en tiempo real de NASA FIRMS (Fire Information for Resource Management System) 
                  utilizando sensores VIIRS y MODIS a bordo de satélites.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Actualización</h4>
                <p className="text-sm text-muted-foreground">
                  Los datos se actualizan automáticamente cada 5 minutos. 
                  La latencia típica entre la detección y la visualización es de 1-3 horas.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">FRP - Fire Radiative Power</h4>
                <p className="text-sm text-muted-foreground">
                  El FRP mide la potencia radiativa del fuego en megavatios (MW), 
                  indicando la intensidad del incendio detectado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}