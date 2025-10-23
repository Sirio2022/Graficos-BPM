import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp } from "lucide-react";
import type { BloodPressureReading } from "./BloodPressureForm";

interface BloodPressureChartProps {
  readings: BloodPressureReading[];
}

export function BloodPressureChart({ readings }: BloodPressureChartProps) {
  // Preparar datos para el gráfico (últimas 10 lecturas)
  const chartData = readings.slice(-10).map((reading, index) => ({
    name: `${reading.date} ${reading.time}`,
    shortName: index + 1,
    sistólica: reading.systolic,
    diastólica: reading.diastolic,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="mb-1">{payload[0].payload.name}</p>
          <p className="text-red-600">
            Sistólica: <span className="font-medium">{payload[0].value} mmHg</span>
          </p>
          <p className="text-blue-600">
            Diastólica: <span className="font-medium">{payload[1].value} mmHg</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tendencia de Presión Arterial
        </CardTitle>
        <CardDescription>
          Últimas {Math.min(10, readings.length)} mediciones registradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {readings.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No hay mediciones registradas aún
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              
              {/* Zonas de referencia */}
              <ReferenceArea y1={0} y2={120} fill="#22c55e" fillOpacity={0.1} />
              <ReferenceArea y1={120} y2={130} fill="#eab308" fillOpacity={0.1} />
              <ReferenceArea y1={130} y2={140} fill="#f97316" fillOpacity={0.1} />
              <ReferenceArea y1={140} y2={180} fill="#ef4444" fillOpacity={0.1} />
              <ReferenceArea y1={180} y2={250} fill="#dc2626" fillOpacity={0.15} />
              
              <XAxis 
                dataKey="shortName" 
                label={{ value: 'Medición', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'mmHg', angle: -90, position: 'insideLeft' }}
                domain={[40, 200]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sistólica" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="diastólica" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        {/* Leyenda de zonas */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Elevada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm">H. Etapa 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">H. Etapa 2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-sm">Crisis</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
