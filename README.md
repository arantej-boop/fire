# Forest Fire Monitor Spain

A real-time forest fire monitoring application for Spain, built with Next.js, React, and TypeScript. This application visualizes wildfire data from NASA FIRMS (Fire Information for Resource Management System) with an interactive map and comprehensive filtering options.

## Features

- **Real-time Fire Data**: Fetches near real-time fire detection data from NASA FIRMS
- **Interactive Map**: Interactive Leaflet map with custom fire markers
- **Advanced Filtering**: Filter fires by confidence level, satellite, brightness, and Fire Radiative Power (FRP)
- **Statistics Dashboard**: Real-time statistics showing fire counts and intensity
- **Responsive Design**: Fully responsive layout that works on all devices
- **Dark Mode Support**: Built-in dark mode with warm color accents
- **Accessibility**: AA compliance with proper ARIA labels and keyboard navigation

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Mapping**: Leaflet with React Leaflet
- **Data**: NASA FIRMS API
- **State Management**: React hooks with custom data fetching
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- NASA FIRMS API token (required for data fetching)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd forest-fire-monitor-spain
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your NASA FIRMS API token to `.env.local`:
```env
NASA_FIRMS_TOKEN=your_nasa_firms_bearer_token_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NASA_FIRMS_TOKEN` | NASA FIRMS API Bearer token | Yes |

## Getting NASA FIRMS API Token

1. Visit [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/)
2. Register for an account
3. Generate your API token
4. Add it to your `.env.local` file

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── fires/
│   │       └── route.ts          # NASA FIRMS API proxy
│   ├── globals.css               # Global styles with Leaflet and fire markers
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main application page
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── FireFilters.tsx           # Filter panel component
│   ├── FireLegend.tsx            # Legend and information component
│   └── FireMap.tsx               # Interactive map component
└── hooks/
    └── useFireData.ts            # Custom hook for fire data management
```

## API Endpoints

### `GET /api/fires`

Proxy endpoint for NASA FIRMS data. Supports the following query parameters:

- `start_date` (string): Start date in YYYY-MM-DD format
- `end_date` (string): End date in YYYY-MM-DD format  
- `confidence` (string): Comma-separated confidence levels (low,nominal,high)
- `satellite` (string): Comma-separated satellite names
- `min_brightness` (number): Minimum brightness temperature in Kelvin
- `min_frp` (number): Minimum Fire Radiative Power in MW

## Data Source

This application uses data from:

- **NASA FIRMS**: Fire Information for Resource Management System
- **Satellites**: Terra, Aqua, Suomi-NPP, NOAA-20, NOAA-21
- **Sensors**: MODIS, VIIRS
- **Update Frequency**: Near real-time (every 3-6 hours)

## Key Metrics

- **Brightness Temperature**: Measured in Kelvin (K) - indicates the heat intensity
- **FRP**: Fire Radiative Power in Megawatts (MW) - measures the energy output of the fire
- **Confidence Level**: Classification of detection confidence (low, nominal, high)
- **Scan/Track**: Pixel size and orientation information

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript throughout with strict typing
- ESLint for code quality
- Prettier formatting (configured)
- Semantic HTML5 structure
- Responsive design with Tailwind CSS

## Deployment

This application is designed for deployment on Vercel:

1. Push your code to a Git repository
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

## Security

- NASA FIRMS API token is securely stored in environment variables
- API proxy pattern prevents token exposure to client
- CORS configuration for secure API access
- Input validation on all API parameters

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the [NASA FIRMS documentation](https://firms.modaps.eosdis.nasa.gov/content/faq/user_guide_faq.html)
- Review the project issues on GitHub
- Contact the development team

## Acknowledgments

- NASA FIRMS for providing fire detection data
- Leaflet contributors for the mapping library
- shadcn/ui for the beautiful component library
- Next.js team for the excellent framework