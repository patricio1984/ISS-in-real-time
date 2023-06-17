import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from '../assets/ISS-marker.png';

const Map = ({ latitude, longitude }) => {
  const customIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
  });

  const UpdateMarker = () => {
    const map = useMap();

    useEffect(() => {
      if (latitude && longitude && map) {
        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
        map.setView([latitude, longitude], map.getZoom());

        return () => {
          map.removeLayer(marker);
        };
      }
    }, [latitude, longitude, map, customIcon]);

    return null;
  };

  return (
    <div className="map-container--wrapper">
      <MapContainer className="map-container" center={[latitude, longitude]} zoom={3}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <UpdateMarker />
      </MapContainer>
    </div>
  );
};

export default Map;