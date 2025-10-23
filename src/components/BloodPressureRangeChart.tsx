import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { BarChart3 } from "lucide-react";
import type { BloodPressureReading } from "./BloodPressureForm";

interface BloodPressureRangeChartProps {
  readings: BloodPressureReading[];
}

export function BloodPressureRangeChart({ readings }: BloodPressureRangeChartProps) {
  // Agrupar por día y calcular min/max/promedio
  const dailyData = readings.reduce((acc, reading) => {
    if (!acc[reading.date]) {
      acc[reading.date] = { systolic: [], diastolic: [] };
    }
    acc[reading.date].systolic.push(reading.systolic);
    acc[reading.date].diastolic.push(reading.diastolic);
    return acc;
  }, {} as Record<string, { systolic: number[], diastolic: number[] }>);

  const chartData = Object.entries(dailyData).map(([date, values]) => {
    const systolicAvg = values.systolic.reduce((a, b) => a + b, 0) / values.systolic.length;
    const diastolicAvg = values.diastolic.reduce((a, b) => a + b, 0) / values.diastolic.length;
    const systolicMax = Math.max(...values.systolic);
    const systolicMin = Math.min(...values.systolic);
    const diastolicMax = Math.max(...values.diastolic);
    const diastolicMin = Math.min(...values.diastolic);
    
    return {
      date,
      sistólicaPromedio: Math.round(systolicAvg),
      diastólicaPromedio: Math.round(diastolicAvg),
      sistólicaMax: systolicMax,
      sistólicaMin: systolicMin,
      diastólicaMax: diastolicMax,
      diastólicaMin: diastolicMin,
      rangoSistólico: [systolicMin, systolicMax],
      rangoDiastólico: [diastolicMin, diastolicMax],
    };
  }).slice(-10); // Últimos 10 días

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="mb-2">{data.date}</p>
          <div className="space-y-1">
            <p className="text-red-600 text-sm">
              Sistólica: <span className="font-medium">{data.sistólicaMin}-{data.sistólicaMax} mmHg</span>
            </p>
            <p className="text-red-400 text-sm">
              Promedio: <span className="font-medium">{data.sistólicaPromedio} mmHg</span>
            </p>
            <p className="text-blue-600 text-sm">
              Diastólica: <span className="font-medium">{data.diastólicaMin}-{data.diastólicaMax} mmHg</span>
            </p>
            <p className="text-blue-400 text-sm">
              Promedio: <span className="font-medium">{data.diastólicaPromedio} mmHg</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Rangos de Variación Diaria
        </CardTitle>
        <CardDescription>
          Visualización de rangos mínimo-máximo por día
        </CardDescription>
      </CardHeader>
      <CardContent>
        {readings.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No hay mediciones registradas aún
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorDiastolic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                label={{ value: 'mmHg', angle: -90, position: 'insideLeft' }}
                domain={[40, 200]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Líneas de referencia */}
              <ReferenceLine y={120} stroke="#22c55e" strokeDasharray="3 3" />
              <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="3 3" />
              
              {/* Áreas de rango */}
              <Area 
                type="monotone" 
                dataKey="sistólicaMax" 
                stackId="1"
                stroke="#ef4444" 
                fill="url(#colorSystolic)" 
                name="Rango Sistólica"
              />
              <Area 
                type="monotone" 
                dataKey="diastólicaMax" 
                stackId="2"
                stroke="#3b82f6" 
                fill="url(#colorDiastolic)" 
                name="Rango Diastólica"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        <p className="text-sm text-muted-foreground mt-4">
          Las áreas sombreadas muestran el rango de variación entre la medición más baja y más alta del día.
        </p>
      </CardContent>
    </Card>
  );
}
