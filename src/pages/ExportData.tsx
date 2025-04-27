
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, Database, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for export
const mockSerialData = [
  { id: "1", studentName: "Jane Smith", studentId: "CS22-1234", nfcSerial: "NFC-3245612", encodedDate: "2023-04-25" },
  { id: "2", studentName: "John Doe", studentId: "ME22-5678", nfcSerial: "NFC-8765432", encodedDate: "2023-04-24" },
  { id: "3", studentName: "Sarah Johnson", studentId: "CS22-9012", nfcSerial: "NFC-1239876", encodedDate: "2023-04-24" },
  { id: "4", studentName: "Michael Brown", studentId: "EE22-3456", nfcSerial: "NFC-6549870", encodedDate: "2023-04-23" },
  { id: "5", studentName: "Emily Davis", studentId: "ME22-7890", nfcSerial: "NFC-9871234", encodedDate: "2023-04-23" },
];

const ExportData = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportToCsv = () => {
    setIsExporting(true);
    
    // In a real app, we would generate and download a CSV file
    setTimeout(() => {
      // Create CSV content
      const headers = ["Student Name", "Student ID", "NFC Serial", "Encoded Date"];
      const csvContent = 
        headers.join(",") + 
        "\n" + 
        mockSerialData.map(row => 
          `"${row.studentName}","${row.studentId}","${row.nfcSerial}","${row.encodedDate}"`
        ).join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `badge_serials_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      toast({
        title: "Export complete",
        description: "CSV file has been downloaded successfully.",
      });
    }, 1500);
  };

  const handleExportToSalto = () => {
    setIsExporting(true);
    
    // In a real app, we would make an API call to Salto
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export to Salto complete",
        description: "Data has been sent to Salto access management system.",
      });
    }, 2000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Export Data</h1>
      
      <Tabs defaultValue="salto">
        <TabsList className="mb-4">
          <TabsTrigger value="salto">Salto Export</TabsTrigger>
          <TabsTrigger value="nfc">NFC Serial Numbers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="salto">
          <Card>
            <CardHeader>
              <CardTitle>Salto Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Send badge data directly to the Salto access management system. This will automatically update access permissions for all students.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-badgeflow-accent flex items-center justify-center text-white mr-4">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Salto Integration</h3>
                    <p className="text-sm text-muted-foreground">API connection configured and ready</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-md border">
                  <div>
                    <p className="font-medium">Latest export:</p>
                    <p className="text-sm text-muted-foreground">April 24, 2023 - 15:42</p>
                  </div>
                  <p className="text-sm text-green-600 font-medium">5 records successfully synced</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm">
                  <span className="text-badgeflow-accent font-semibold">{mockSerialData.length}</span> records ready to export
                </p>
                <Button 
                  onClick={handleExportToSalto}
                  disabled={isExporting}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export to Salto"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nfc">
          <Card>
            <CardHeader>
              <CardTitle>NFC Serial Numbers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Export NFC serial numbers for all encoded student badges. This data can be used for batch importing into access management systems.
                </p>
                <Button 
                  onClick={handleExportToCsv}
                  disabled={isExporting}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export to CSV"}
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>NFC Serial</TableHead>
                      <TableHead>Encoded Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSerialData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.studentName}</TableCell>
                        <TableCell>{row.studentId}</TableCell>
                        <TableCell className="font-mono">{row.nfcSerial}</TableCell>
                        <TableCell>{row.encodedDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExportData;
