import React, { useState } from "react";
import './App.css';
import StationsFilter from './AppComponents/StationsFilter/StationsFilter';
import StationsMap from './AppComponents/StationsMap/StationsMap';
import StationsTable from './AppComponents/StationsTable/StationsTable';

export default function App() {
  const [hospitals, setHospitals] = useState([]);

  const handleReceiveHospitals = (hospitalsData) => {
    setHospitals(hospitalsData);
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="h1-searchbar">SaludGo</h1>
      </header>
          <StationsMap />
    </div>
  );
}
