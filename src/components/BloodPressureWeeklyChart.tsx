import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Calendar } from "lucide-react";
import type { BloodPressureReading } from "./BloodPressureForm";

interface BloodPressureWeeklyChartProps {
  readings: BloodPressureReading[];
}

export function BloodPressureWeeklyChart({ readings }: BloodPressureWeeklyChartProps) {
  // Agrupar por semana
  const getWeekNumber = (dateString: string) => {
    const parts = dateString.split('/');
    const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const weeklyData = readings.reduce((acc, reading) => {
    const week = `Sem ${getWeekNumber(reading.date)}`;
    if (!acc[week]) {
      acc[week] = { systolic: [], diastolic: [] };
    }
    acc[week].systolic.push(reading.systolic);
    acc[week].diastolic.push(reading.diastolic);
    return acc;
  }, {} as Record<string, { systolic: number[], diastolic: number[] }>);

  const chartData = Object.entries(weeklyData).map(([week, values]) => ({
    week,
    sistólica: Math.round(values.systolic.reduce((a, b) => a + b, 0) / values.systolic.length),
    diastólica: Math.round(values.diastolic.reduce((a, b) => a + b, 0) / values.diastolic.length),
    mediciones: values.systolic.length,
  })).slice(-8); // Últimas 8 semanas

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="mb-1">{payload[0].payload.week}</p>
          <p className="text-red-600">
            Promedio Sistólica: <span className="font-medium">{payload[0].value} mmHg</span>
          </p>
          <p className="text-blue-600">
            Promedio Diastólica: <span className="font-medium">{payload[1].value} mmHg</span>
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            {payload[0].payload.mediciones} mediciones
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
          <Calendar className="h-5 w-5" />
          Promedios Semanales
        </CardTitle>
        <CardDescription>
          Comparación de promedios por semana
        </CardDescription>
      </CardHeader>
      <CardContent>
        {readings.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No hay mediciones registradas aún
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" />
              <YAxis 
                label={{ value: 'mmHg', angle: -90, position: 'insideLeft' }}
                domain={[40, 200]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Líneas de referencia */}
              <ReferenceLine y={120} stroke="#22c55e" strokeDasharray="3 3" label="Normal" />
              <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" label="Alta" />
              
              <Bar dataKey="sistólica" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="diastólica" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
