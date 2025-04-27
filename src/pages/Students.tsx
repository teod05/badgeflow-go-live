
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw } from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
  studentId: string;
  badgeStatus: "issued" | "not_issued" | "expired";
  profileComplete: boolean;
};

// Mock student data
const mockStudents: Student[] = [
  { id: "1", name: "Jane Smith", email: "jane.smith@example.edu", course: "Computer Science", studentId: "CS22-1234", badgeStatus: "issued", profileComplete: true },
  { id: "2", name: "John Doe", email: "john.doe@example.edu", course: "Mechanical Engineering", studentId: "ME22-5678", badgeStatus: "not_issued", profileComplete: false },
  { id: "3", name: "Sarah Johnson", email: "sarah.johnson@example.edu", course: "Computer Science", studentId: "CS22-9012", badgeStatus: "issued", profileComplete: true },
  { id: "4", name: "Michael Brown", email: "michael.brown@example.edu", course: "Electrical Engineering", studentId: "EE22-3456", badgeStatus: "expired", profileComplete: true },
  { id: "5", name: "Emily Davis", email: "emily.davis@example.edu", course: "Mechanical Engineering", studentId: "ME22-7890", badgeStatus: "not_issued", profileComplete: false },
  { id: "6", name: "Daniel Wilson", email: "daniel.wilson@example.edu", course: "Computer Science", studentId: "CS22-3457", badgeStatus: "issued", profileComplete: true },
  { id: "7", name: "Olivia Taylor", email: "olivia.taylor@example.edu", course: "Electrical Engineering", studentId: "EE22-6789", badgeStatus: "not_issued", profileComplete: true },
];

const Students = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    const filteredStudents = mockStudents.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setStudents(filteredStudents);
  };

  const refreshData = () => {
    setIsLoading(true);
    
    // In a real app, this would fetch fresh data from HubSpot
    setTimeout(() => {
      setStudents(mockStudents);
      setSearchQuery("");
      setIsLoading(false);
    }, 1000);
  };

  const getBadgeStatusDisplay = (status: Student["badgeStatus"]) => {
    switch (status) {
      case "issued":
        return <Badge className="bg-badgeflow-success">Issued</Badge>;
      case "not_issued":
        return <Badge variant="outline">Not Issued</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
        <Button variant="outline" onClick={refreshData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Refreshing..." : "Refresh from HubSpot"}
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Search by name, ID, email or course..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-2xl"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Profile Status</TableHead>
                  <TableHead>Badge Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No students found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="font-mono">{student.studentId}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {student.profileComplete ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complete</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Incomplete</Badge>
                        )}
                      </TableCell>
                      <TableCell>{getBadgeStatusDisplay(student.badgeStatus)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/badge-flow?studentId=${student.studentId}`}>Process Badge</a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
