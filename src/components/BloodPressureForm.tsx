import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Activity } from "lucide-react";

export interface BloodPressureReading {
  id: string;
  systolic: number;
  diastolic: number;
  date: string;
  time: string;
  category: string;
}

interface BloodPressureFormProps {
  onAddReading: (reading: BloodPressureReading) => void;
}

export function BloodPressureForm({ onAddReading }: BloodPressureFormProps) {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");

  const categorizeBloodPressure = (sys: number, dia: number): string => {
    if (sys > 180 || dia > 120) return "Crisis Hipertensiva";
    if (sys >= 140 || dia >= 90) return "Hipertensión Etapa 2";
    if (sys >= 130 || dia >= 80) return "Hipertensión Etapa 1";
    if (sys >= 120 && dia < 80) return "Elevada";
    return "Normal";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sysValue = parseInt(systolic);
    const diaValue = parseInt(diastolic);
    
    if (isNaN(sysValue) || isNaN(diaValue) || sysValue <= 0 || diaValue <= 0) {
      return;
    }

    const now = new Date();
    const reading: BloodPressureReading = {
      id: Date.now().toString(),
      systolic: sysValue,
      diastolic: diaValue,
      date: now.toLocaleDateString('es-ES'),
      time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      category: categorizeBloodPressure(sysValue, diaValue)
    };

    onAddReading(reading);
    setSystolic("");
    setDiastolic("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Nueva Medición
        </CardTitle>
        <CardDescription>
          Registra tu presión arterial actual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="systolic">Sistólica (mmHg)</Label>
              <Input
                id="systolic"
                type="number"
                placeholder="120"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                min="50"
                max="250"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diastolic">Diastólica (mmHg)</Label>
              <Input
                id="diastolic"
                type="number"
                placeholder="80"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                min="30"
                max="150"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Registrar Medición
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
