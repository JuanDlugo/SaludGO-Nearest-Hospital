import React, { useEffect, useState } from "react";
import "./StationsMap.css";
import Plot from "react-plotly.js";
import figJson from "./fig.json";
import axios from "axios";
import StationsTable from "../StationsTable/StationsTable";

export default function StationsMap() {
  const [mapData, setMapData] = useState(null);
  const [hospitalData, setHospitalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        const data = figJson["data"];
        const layout = figJson["layout"];

        layout["autosize"] = true;
        layout["margin"] = { b: 0, t: 0, l: 0, r: 0 };
        layout["mapbox"]["center"] = {
          lat: coordinates.lat,
          lon: coordinates.lon,
        };
        delete layout.template;
        delete layout.width;
        delete layout.height;

        setMapData({ data, layout });

        fetchHospitalsData(coordinates);
      });
    }
  }, []);

  const fetchHospitalsData = (coordinates) => {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const targetUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lon}&radius=5000&type=hospital&key=AIzaSyBHMug4aHOly1KiCy4Cwy97yH7U9fRepO4`;

    axios
      .get(proxyUrl + targetUrl)
      .then((response) => {
        const hospitals = response.data.results;
        setHospitalData(hospitals);
        setIsLoading(false); // Se han cargado los datos de los hospitales
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false); // Error al cargar los datos de los hospitales
      });
  };

  return (
    <div className="component-embbeder">
      <div className="map-container">
        {mapData && (
          <Plot
            data={mapData.data}
            layout={mapData.layout}
            style={{ height: "100%", width: "100%" }}
            useResizeHandler={true}
            config={{
              mapboxAccessToken: "pk.eyJ1IjoianVhbmlkbHVnbyIsImEiOiJjbGl6NHJoemwwa3VxM2txbDJkaW1lYjIzIn0.ST5Zyu8CmZGVFfQr8HYnvQ",
            }}
          />
        )}
      </div>
      <div className="table-container">
        {isLoading ? (
          <p>Buscando hospitales...</p>
        ) : (
          <StationsTable hospitals={hospitalData} />
        )}
      </div>
    </div>
  );
}