
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
  studentId: string;
  profileImage?: string;
  hasAllData: boolean;
};

export const StudentCard = ({ student }: { student: Student }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
            {student.profileImage ? (
              <img 
                src={student.profileImage} 
                alt={student.name} 
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span className="text-xl font-bold">
                {student.name.split(' ').map(name => name[0]).join('')}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{student.name}</h3>
              <Badge variant={student.hasAllData ? "default" : "destructive"}>
                {student.hasAllData ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Complete</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Incomplete</span>
                  </div>
                )}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div className="text-muted-foreground">Student ID:</div>
              <div>{student.studentId}</div>
              <div className="text-muted-foreground">Email:</div>
              <div>{student.email}</div>
              <div className="text-muted-foreground">Course:</div>
              <div>{student.course}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
