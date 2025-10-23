import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { History } from "lucide-react";
import type { BloodPressureReading } from "./BloodPressureForm";

interface BloodPressureHistoryProps {
  readings: BloodPressureReading[];
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Normal":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Elevada":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Hipertensión Etapa 1":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    case "Hipertensión Etapa 2":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "Crisis Hipertensiva":
      return "bg-red-200 text-red-900 hover:bg-red-200";
    default:
      return "";
  }
};

export function BloodPressureHistory({ readings }: BloodPressureHistoryProps) {
  // Mostrar en orden inverso (más reciente primero)
  const sortedReadings = [...readings].reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historial de Mediciones
        </CardTitle>
        <CardDescription>
          Total de registros: {readings.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {readings.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No hay mediciones registradas aún
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead className="text-right">Sistólica</TableHead>
                  <TableHead className="text-right">Diastólica</TableHead>
                  <TableHead>Categoría</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedReadings.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell>{reading.date}</TableCell>
                    <TableCell>{reading.time}</TableCell>
                    <TableCell className="text-right text-red-600">
                      {reading.systolic} <span className="text-muted-foreground text-sm">mmHg</span>
                    </TableCell>
                    <TableCell className="text-right text-blue-600">
                      {reading.diastolic} <span className="text-muted-foreground text-sm">mmHg</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(reading.category)}>
                        {reading.category}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
