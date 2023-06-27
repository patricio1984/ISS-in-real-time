import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from '../assets/ISS-marker.webp';
import * as satellite from 'satellite.js';

const Map = ({ latitude, longitude, tleLine1, tleLine2 }) => {
  const customIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
  });

  const [positions, setPositions] = useState([]);
  const [markerPosition, setMarkerPosition] = useState([latitude, longitude]);

  useEffect(() => {
    const updatePolyline = () => {
      if (!tleLine1 || !tleLine2) return;

      const tleLine1Array = tleLine1.split('\n');
      const tleLine2Array = tleLine2.split('\n');

      const newPositions = [];
      const numSegments = 100;

      for (let i = 0; i <= numSegments; i++) {
        const t = i / numSegments;
        const satellitePosition = getSatellitePosition(tleLine1Array, tleLine2Array, t);
        newPositions.push([
          satellitePosition.latitude,
          satellitePosition.longitude
        ]);
      }

      setPositions(newPositions);
    };

    const getSatellitePosition = (tleLine1, tleLine2) => {
      const satrec = satellite.twoline2satrec(tleLine1[0], tleLine2[0]);
      const positionAndVelocity = satellite.propagate(satrec, new Date());
      const positionEci = positionAndVelocity.position;

      const gmst = satellite.gstime(new Date());
      const positionGd = satellite.eciToGeodetic(positionEci, gmst);

      const latitude = satellite.degreesLat(positionGd.latitude);
      const longitude = satellite.degreesLong(positionGd.longitude);

      return {
        latitude,
        longitude,
      };
    };

    updatePolyline();
  }, [tleLine1, tleLine2]);

  const parsedPositions = positions.map(position => [parseFloat(position[0]), parseFloat(position[1])]);

  // Hook personalizado para centrar el mapa en la posición del marcador
  function CenterMap() {
    const map = useMap();

    useEffect(() => {
      if (latitude && longitude) {
        map.setView([latitude, longitude], map.getZoom());
      }
    }, [latitude, longitude, map]);

    return null;
  }

  return (
    <>
      {latitude && longitude && (
        <MapContainer className="map-container" center={[latitude, longitude]} zoom={3}>
          <TileLayer url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}" detectRetina={true} />
          <Marker position={markerPosition} icon={customIcon}>
            <CenterMap />
          </Marker>
          {/* Fixear esto */}
          {/* <Polyline positions={parsedPositions} color="blue" /> */}
        </MapContainer>
      )}
    </>
  );
};

export default Map;


