import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Download, FileText, Printer } from "lucide-react";
import type { BloodPressureReading } from "./BloodPressureForm";

interface BloodPressureExportProps {
  readings: BloodPressureReading[];
}

export function BloodPressureExport({ readings }: BloodPressureExportProps) {
  
  // Exportar a CSV
  const exportToCSV = () => {
    if (readings.length === 0) return;

    const headers = ["Fecha", "Hora", "Sistólica (mmHg)", "Diastólica (mmHg)", "Categoría"];
    const csvContent = [
      headers.join(","),
      ...readings.map(r => 
        `${r.date},${r.time},${r.systolic},${r.diastolic},"${r.category}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `presion-arterial-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Imprimir reporte
  const printReport = () => {
    if (readings.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const avgSystolic = Math.round(readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length);
    const avgDiastolic = Math.round(readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reporte de Presión Arterial</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #333;
            }
            h1 {
              color: #ef4444;
              border-bottom: 3px solid #ef4444;
              padding-bottom: 10px;
            }
            .summary {
              background: #f3f4f6;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f3f4f6;
              font-weight: bold;
            }
            .normal { color: #22c55e; }
            .elevated { color: #eab308; }
            .high { color: #ef4444; }
            .crisis { color: #dc2626; font-weight: bold; }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>📊 Reporte de Presión Arterial</h1>
          
          <div class="summary">
            <h2>Resumen</h2>
            <p><strong>Total de mediciones:</strong> ${readings.length}</p>
            <p><strong>Promedio Sistólica:</strong> ${avgSystolic} mmHg</p>
            <p><strong>Promedio Diastólica:</strong> ${avgDiastolic} mmHg</p>
            <p><strong>Período:</strong> ${readings[0].date} - ${readings[readings.length - 1].date}</p>
          </div>

          <h2>Historial de Mediciones</h2>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Sistólica</th>
                <th>Diastólica</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              ${readings.slice().reverse().map(r => `
                <tr>
                  <td>${r.date}</td>
                  <td>${r.time}</td>
                  <td>${r.systolic} mmHg</td>
                  <td>${r.diastolic} mmHg</td>
                  <td class="${r.category.toLowerCase().replace(/ /g, '-')}">${r.category}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
            <p>Este reporte es solo para referencia personal. Consulte a su médico para diagnóstico y tratamiento.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Esperar a que se cargue y luego imprimir
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  // Exportar datos como JSON (para backup)
  const exportToJSON = () => {
    if (readings.length === 0) return;

    const jsonContent = JSON.stringify(readings, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `presion-arterial-backup-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Datos
        </CardTitle>
        <CardDescription>
          Descarga tus mediciones para compartir con tu médico
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button 
            onClick={exportToCSV} 
            variant="outline" 
            className="w-full"
            disabled={readings.length === 0}
          >
            <FileText className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          
          <Button 
            onClick={printReport} 
            variant="outline" 
            className="w-full"
            disabled={readings.length === 0}
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Reporte
          </Button>
          
          <Button 
            onClick={exportToJSON} 
            variant="outline" 
            className="w-full"
            disabled={readings.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Backup JSON
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          {readings.length === 0 
            ? "No hay mediciones para exportar" 
            : `${readings.length} mediciones listas para exportar`}
        </p>
      </CardContent>
    </Card>
  );
}
