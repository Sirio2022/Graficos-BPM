import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import type { BloodPressureReading } from "./BloodPressureForm";

interface BloodPressureStatsProps {
  readings: BloodPressureReading[];
}

export function BloodPressureStats({ readings }: BloodPressureStatsProps) {
  if (readings.length === 0) {
    return null;
  }

  const systolicValues = readings.map(r => r.systolic);
  const diastolicValues = readings.map(r => r.diastolic);

  const avgSystolic = Math.round(systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length);
  const avgDiastolic = Math.round(diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length);

  const maxSystolic = Math.max(...systolicValues);
  const maxDiastolic = Math.max(...diastolicValues);

  const minSystolic = Math.min(...systolicValues);
  const minDiastolic = Math.min(...diastolicValues);

  const stats = [
    {
      title: "Promedio",
      systolic: avgSystolic,
      diastolic: avgDiastolic,
      icon: Activity,
    },
    {
      title: "Máximo",
      systolic: maxSystolic,
      diastolic: maxDiastolic,
      icon: TrendingUp,
    },
    {
      title: "Mínimo",
      systolic: minSystolic,
      diastolic: minDiastolic,
      icon: TrendingDown,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4" />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-red-600">{stat.systolic}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-2xl text-blue-600">{stat.diastolic}</span>
                <span className="text-sm text-muted-foreground">mmHg</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
