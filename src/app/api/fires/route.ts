import { NextRequest, NextResponse } from 'next/server';

// Bounding box for Spain (approximate)
const SPAIN_BBOX = '-9.39,35.94,3.35,43.75';

// NASA FIRMS API base URL
const FIRMS_API_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';

// Cache configuration
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
let cache: {
  data: any;
  timestamp: number;
} | null = null;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const hours = searchParams.get('hours');
    const bbox = searchParams.get('bbox') || SPAIN_BBOX;
    const sensor = searchParams.get('sensor') || 'VIIRS_SNPP_NRT,VIIRS_NOAA20_NRT,MODIS_NRT';
    
    // Check cache
    const cacheKey = `${from}-${to}-${hours}-${bbox}-${sensor}`;
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    // Get Bearer token from environment
    const bearerToken = process.env.EDL_BEARER_TOKEN;
    if (!bearerToken) {
      return NextResponse.json(
        { error: 'EDL_BEARER_TOKEN not configured' },
        { status: 500 }
      );
    }

    // Build FIRMS API URL
    const params = new URLSearchParams({
      area: bbox,
      product: sensor,
      date_range: hours ? `${hours}h` : `${from}:${to}`,
      format: 'csv'
    });

    const apiUrl = `${FIRMS_API_URL}/${bearerToken}?${params.toString()}`;

    // Fetch data from FIRMS API
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Accept': 'text/csv'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`FIRMS API error: ${response.status} ${response.statusText}`);
    }

    const csvData = await response.text();
    
    // Parse CSV and convert to GeoJSON
    const features = parseCSVToGeoJSON(csvData);
    
    const geoJSON = {
      type: 'FeatureCollection' as const,
      features
    };

    // Cache the result
    cache = {
      data: geoJSON,
      timestamp: Date.now()
    };

    // Set cache headers
    const responseHeaders = new Headers();
    responseHeaders.set('Cache-Control', `public, max-age=${CACHE_DURATION / 1000}`);
    responseHeaders.set('Content-Type', 'application/json');

    return NextResponse.json(geoJSON, { headers: responseHeaders });

  } catch (error) {
    console.error('Error fetching fire data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fire data' },
      { status: 500 }
    );
  }
}

function parseCSVToGeoJSON(csvData: string) {
  const lines = csvData.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',');
  const features = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length !== headers.length) continue;

    const fireData: any = {};
    headers.forEach((header, index) => {
      fireData[header.trim()] = values[index]?.trim();
    });

    // Convert to numbers
    const latitude = parseFloat(fireData.latitude);
    const longitude = parseFloat(fireData.longitude);
    const frp = parseFloat(fireData.frp) || 0;
    const confidence = parseInt(fireData.confidence) || 0;

    if (isNaN(latitude) || isNaN(longitude)) continue;

    // Create GeoJSON feature
    const feature = {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [longitude, latitude]
      },
      properties: {
        ...fireData,
        latitude,
        longitude,
        frp,
        confidence,
        // Additional normalized fields
        acq_datetime: `${fireData.acq_date} ${fireData.acq_time?.padStart(4, '0')?.slice(0, 2)}:${fireData.acq_time?.padStart(4, '0')?.slice(2, 4)}`,
        satellite_name: fireData.satellite?.includes('VIIRS') ? 'VIIRS' : 'MODIS',
        confidence_level: confidence >= 80 ? 'high' : confidence >= 50 ? 'medium' : 'low'
      }
    };

    features.push(feature);
  }

  return features;
}