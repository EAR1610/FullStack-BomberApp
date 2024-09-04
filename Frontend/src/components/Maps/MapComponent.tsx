import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapProps } from '../../helpers/Interfaces';

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

const MapComponent: React.FC<MapProps> = ({ latitude, longitude }) => {
  const firefighterCoords = [16.925213065550683, -89.90177602186692];

  useEffect(() => {
    const map = L.map('map').setView(firefighterCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(firefighterCoords, { icon: firefighterIcon })
      .addTo(map)
      .bindPopup('Ubicación ambulancia')
      .openPopup();

    L.marker([latitude, longitude], { icon: requesterIcon })
      .addTo(map)
      .bindPopup('Ubicación solicitante')
      .openPopup();

    L.Routing.control({
      waypoints: [
        L.latLng(firefighterCoords[0], firefighterCoords[1]),
        L.latLng(latitude, longitude),
      ],
      createMarker: (i, waypoint, n) => {
        const icon = i === 0 ? firefighterIcon : requesterIcon;
        const popupText = i === 0 ? 'Ubicación ambulancia' : 'Ubicación solicitante';
        return L.marker(waypoint.latLng, { icon: icon }).bindPopup(popupText);
      },
      draggableWaypoints: false, 
      addWaypoints: false, 
      routeWhileDragging: false,
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return <div id="map" className="h-96 w-full"></div>;
};

export default MapComponent;
