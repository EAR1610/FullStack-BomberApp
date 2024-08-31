import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapProps } from '../../helpers/Interfaces';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
});

const MapComponent: React.FC<MapProps> = ({ latitude, longitude }) => {
  const firefighterCoords = [16.925213065550683, -89.90177602186692];

  useEffect(() => {
    const map = L.map('map').setView(firefighterCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.Routing.control({
      waypoints: [
        L.latLng(firefighterCoords[0], firefighterCoords[1]),
        L.latLng(latitude, longitude),
      ],
      routeWhileDragging: true,
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return <div id="map" className="h-96 w-full"></div>;
};

export default MapComponent;
