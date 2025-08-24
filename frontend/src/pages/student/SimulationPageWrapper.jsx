// src/pages/student/SimulationPageWrapper.jsx
import { useParams } from "react-router-dom";
import SimulationPage from "./SimulationPage";
import { SimulationProvider } from "../../context/SimulationContext";

function SimulationPageWrapper() {
  const { id } = useParams(); // <- aquí sacamos el :id de la URL
  console.log("🟢 SimulationPageWrapper ID desde URL:", id);

  return (
    <SimulationProvider>
      <SimulationPage simulationId={id} />
      {/* 👆 le pasamos el id como prop */}
    </SimulationProvider>
  );
}

export default SimulationPageWrapper;
