import { useState, useEffect } from "react";
import { BloodPressureForm, type BloodPressureReading } from "./components/BloodPressureForm";
import { BloodPressureChart } from "./components/BloodPressureChart";
import { BloodPressureHistory } from "./components/BloodPressureHistory";
import { BloodPressureStats } from "./components/BloodPressureStats";
import { BloodPressureWeeklyChart } from "./components/BloodPressureWeeklyChart";
import { BloodPressureRangeChart } from "./components/BloodPressureRangeChart";
import { BloodPressureExport } from "./components/BloodPressureExport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Heart } from "lucide-react";

export default function App() {
  const [readings, setReadings] = useState<BloodPressureReading[]>([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedReadings = localStorage.getItem("bloodPressureReadings");
    if (savedReadings) {
      setReadings(JSON.parse(savedReadings));
    }
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    if (readings.length > 0) {
      localStorage.setItem("bloodPressureReadings", JSON.stringify(readings));
    }
  }, [readings]);

  const handleAddReading = (reading: BloodPressureReading) => {
    setReadings((prev) => [...prev, reading]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl">Monitor de Presión Arterial</h1>
          </div>
          <p className="text-muted-foreground">
            Registra y visualiza tus mediciones de presión arterial
          </p>
        </div>

        {/* Formulario */}
        <div className="max-w-md mx-auto">
          <BloodPressureForm onAddReading={handleAddReading} />
        </div>

        {/* Estadísticas */}
        {readings.length > 0 && (
          <BloodPressureStats readings={readings} />
        )}

        {/* Tabs con diferentes vistas de gráficos */}
        <Tabs defaultValue="tendencia" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tendencia">Tendencia</TabsTrigger>
            <TabsTrigger value="semanal">Semanal</TabsTrigger>
            <TabsTrigger value="rangos">Rangos</TabsTrigger>
          </TabsList>
          <TabsContent value="tendencia" className="mt-4">
            <BloodPressureChart readings={readings} />
          </TabsContent>
          <TabsContent value="semanal" className="mt-4">
            <BloodPressureWeeklyChart readings={readings} />
          </TabsContent>
          <TabsContent value="rangos" className="mt-4">
            <BloodPressureRangeChart readings={readings} />
          </TabsContent>
        </Tabs>

        {/* Exportación */}
        <BloodPressureExport readings={readings} />

        {/* Historial */}
        <BloodPressureHistory readings={readings} />

        {/* Info sobre categorías */}
        <div className="bg-white rounded-lg p-6 border border-border">
          <h3 className="mb-4">Categorías de Presión Arterial (AHA)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-2">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                <strong>Normal:</strong> Sistólica {'<'} 120 y Diastólica {'<'} 80
              </p>
              <p className="mb-2">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                <strong>Elevada:</strong> Sistólica 120-129 y Diastólica {'<'} 80
              </p>
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                <strong>Hipertensión Etapa 1:</strong> Sistólica 130-139 o Diastólica 80-89
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                <strong>Hipertensión Etapa 2:</strong> Sistólica ≥ 140 o Diastólica ≥ 90
              </p>
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
                <strong>Crisis Hipertensiva:</strong> Sistólica {'>'} 180 o Diastólica {'>'} 120
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
