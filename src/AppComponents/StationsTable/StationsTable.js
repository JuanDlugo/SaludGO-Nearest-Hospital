import React from "react";
import "./StationsTable.css";
import tableJson from "./sample_table.json";

export default function StationsTable({ hospitals }) {
  console.log("hospital table", hospitals);
  if (!hospitals || hospitals.length === 0) {
    // Si no hay datos de los hospitales, muestra un mensaje o componente de carga
    return <p>Loading hospitals...</p>;
  }

  return (
    <table className="price-table">
      <thead>
        <tr>
          <th style={{ width: "50%", textAlign: "left" }}>Nombre</th>
          <th>Dirección</th>
          <th>Abierto</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        {hospitals.map((hospital) => {
          // Obtén los datos del hospital para mostrarlos en la tabla
          const name = hospital.name;
          const address = hospital.vicinity;
          const rating = hospital.rating;
          const isOpen = hospital.opening_hours?.open_now ? "Sí" : "No"; // Comprueba si hay datos de horario y si está abierto
          console.log(isOpen);

          return (
            <tr key={hospital.place_id}>
              <td style={{ width: "50%", textAlign: "left" }}>{name}</td>
              <td>{address}</td>
              <td>{isOpen}</td>
              <td>{rating}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
