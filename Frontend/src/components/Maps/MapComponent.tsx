import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';  // Importar Leaflet Routing Machine

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapComponentProps, MapProps } from '../../helpers/Interfaces';

import firefighterIconImg from '../../assets/firefighterIcon.png';
import requesterIconImg from '../../assets/EmergencyRequestIcon.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
});

const firefighterIcon = new L.Icon({
  iconUrl: firefighterIconImg,
  iconRetinaUrl: firefighterIconImg,
  iconSize: [35, 45],
  iconAnchor: [17, 46],
  popupAnchor: [0, -46],
});

const requesterIcon = new L.Icon({
  iconUrl: requesterIconImg,
  iconRetinaUrl: requesterIconImg,
  iconSize: [35, 45],
  iconAnchor: [17, 46],
  popupAnchor: [0, -46],
});

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude, onLocationChange, isUser }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  const firefighterCoords = [16.925213065550683, -89.90177602186692];

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(firefighterCoords as any, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      L.marker(firefighterCoords as any, { icon: firefighterIcon })
        .addTo(mapRef.current)
        .bindPopup('Ubicación ambulancia')
        .openPopup();

      markerRef.current = L.marker([latitude, longitude], {
        icon: requesterIcon,
        draggable: true,
      }).addTo(mapRef.current);

      // Crear la ruta desde firefighterCoords hasta la ubicación inicial
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(firefighterCoords[0], firefighterCoords[1]),
          L.latLng(latitude, longitude),
        ],
        createMarker: () => null, // No crear marcadores automáticamente
        routeWhileDragging: false, // No actualizar la ruta mientras se arrastra
      }).addTo(mapRef.current);
      
      // Inicialmente ocultar las instrucciones
      const instructionsContainer = document.querySelector('.leaflet-routing-container');
      if (instructionsContainer) {
        instructionsContainer.classList.add('hidden');
      }

      // Manejar el evento de arrastrar y soltar
      markerRef.current.on('dragend', function (event) {
        const marker = event.target;
        const position = marker.getLatLng();
        onLocationChange(position.lat, position.lng);

        // Actualizar la ruta con la nueva posición
        if (routingControlRef.current) {
          routingControlRef.current.setWaypoints([
            L.latLng(firefighterCoords[0], firefighterCoords[1]),
            L.latLng(position.lat, position.lng),
          ]);
        }
      });
    }
  }, [onLocationChange]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);

      if (routingControlRef.current) {
        routingControlRef.current.setWaypoints([
          L.latLng(firefighterCoords[0], firefighterCoords[1]),
          L.latLng(latitude, longitude),
        ]);
      }
    }
  }, [latitude, longitude]);

  return (
    <div>
      <div ref={mapContainerRef} id="map" className="h-90 xl:h-85 w-full"></div>
    </div>
  );
};

export default MapComponent;
