import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";


const WeatherMap = ({ location }) => {
  const mapRef = useRef();

  // Function to animate the map to the searched location
  const FlyToLocation = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
      if (lat && lon) {
        map.flyTo([lat, lon], 10, { duration: 2 }); // Fly to the location with animation
      }
    }, [lat, lon, map]);
    return null;
  };

  return (
    <div className="weather-map">
      <MapContainer
        center={[location.lat, location.lon]} // Default center
        zoom={6} // Default zoom level
        style={{ height: "300px", width: "300px", borderRadius: "12px" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.lat, location.lon]} />
        <FlyToLocation lat={location.lat} lon={location.lon} />
      </MapContainer>
    </div>
  );
};

export default WeatherMap;