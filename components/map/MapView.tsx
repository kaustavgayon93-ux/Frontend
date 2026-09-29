"use client";
import React, { useRef } from 'react';
import Map, { NavigationControl, ScaleControl, Source, Layer, Marker } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapViewProps {
  center?: [number, number]; // lon, lat
  zoom?: number;
  boundaries?: any; // GeoJSON
  markers?: Array<{lat: number, lon: number, label: string}>;
  height?: string;
}

export default function MapView({ 
  center = [92.9, 26.2], 
  zoom = 7, 
  boundaries, 
  markers, 
  height = '500px' 
}: MapViewProps) {
  
  return (
    <div style={{ height, width: '100%', position: 'relative' }} className="rounded-lg overflow-hidden border">
      <Map
        initialViewState={{
          longitude: center[0],
          latitude: center[1],
          zoom: zoom
        }}
        mapStyle={{
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap Contributors',
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        }}
      >
        <NavigationControl position="top-left" />
        <ScaleControl />

        {boundaries && (
          <Source type="geojson" data={boundaries}>
            <Layer 
              id="project-fill" 
              type="fill" 
              paint={{
                'fill-color': '#22c55e',
                'fill-opacity': 0.2
              }} 
            />
            <Layer 
              id="project-line" 
              type="line" 
              paint={{
                'line-color': '#166534',
                'line-width': 2
              }} 
            />
          </Source>
        )}

        {markers?.map((m, i) => (
          <Marker key={i} longitude={m.lon} latitude={m.lat} color="#d97706" />
        ))}
      </Map>
    </div>
  );
}
