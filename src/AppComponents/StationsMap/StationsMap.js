import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Plot from "react-plotly.js";
import figJson from "./fig.json";
import axios from "axios";
import StationsTable from "../StationsTable/StationsTable";

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (angle) => (Math.PI / 180) * angle;
  const R = 6371; // Radio de la tierra en km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};



export default function StationsMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapData, setMapData] = useState(null);
  const [hospitalData, setHospitalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoordinates, setUserCoordinates] = useState(null);
  


  useEffect(() => {
    let coordinates;
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
  
    const initializeMap = (coordinates) => {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [coordinates.lon, coordinates.lat],
        zoom: 13,
      });
  
      setUserCoordinates(coordinates);
      fetchHospitalsData(coordinates);
    };
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          coordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          initializeMap(coordinates);
        },
        (error) => {
          // Usar ubicación de respaldo si el usuario no permite la geolocalización
          coordinates = {
            lat: -33.499235,
            lon: -70.614884,
          };
          initializeMap(coordinates);
        }
      );
    } else {
      // Usar ubicación de respaldo si la geolocalización no está disponible
      coordinates = {
        lat: -33.499235,
        lon: -70.614884,
      };
      initializeMap(coordinates);
    }
  }, []);

  const fetchHospitalsData = (coordinates) => {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const targetUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lon}&radius=5000&type=hospital&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`;

    axios
      .get(proxyUrl + targetUrl)
      .then((response) => {
        const hospitals = response.data.results;
        setHospitalData(hospitals);
        setIsLoading(false); // Se han cargado los datos de los hospitales
        hospitals.forEach((hospital) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([
            hospital.geometry.location.lng,
            hospital.geometry.location.lat,
          ])
          .addTo(map.current);

       
        const lat = hospital.geometry.location.lat;
        const lng = hospital.geometry.location.lng;
        hospital.distance = haversineDistance(
          coordinates.lat,
          coordinates.lon,
          lat,
          lng
        );
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${coordinates.lat},${coordinates.lon}&destination=${lat},${lng}&travelmode=driving`;


        const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(
              `<h3>${hospital.name}</h3>
               <p>${hospital.vicinity}</p>
               <p>${hospital.opening_hours?.open_now ? "Abierto" : "Cerrado"}</p>
               <a href="${googleMapsUrl}" target="_blank">Cómo llegar</a>`
            );

        marker.setPopup(popup);
      });
      new mapboxgl.Marker({ color: 'red' })
          .setLngLat([coordinates.lon, coordinates.lat])
          .setPopup(new mapboxgl.Popup().setText('Tu ubicación'))
          .addTo(map.current);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false); // Error al cargar los datos de los hospitales
      });
  };

  return (
    <div className="component-embbeder" style={{ display: "flex", 'margin-top':'50px' }}>
        <div ref={mapContainer} style={{ height: "700px", width: "50%", 'margin-left':'50px' }} />
        <div className="table-container" style={{ width: "50%" }}>
          {isLoading ? (
            <p>Buscando hospitales...</p>
          ) : (
            <StationsTable hospitals={hospitalData} />
          )}
        </div>
      </div>
  );
}
