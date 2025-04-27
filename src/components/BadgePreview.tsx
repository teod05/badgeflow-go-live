
import { Card } from "@/components/ui/card";

type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
  studentId: string;
  profileImage?: string;
  hasAllData: boolean;
};

interface BadgePreviewProps {
  student: Student;
  profileImage: string;
}

export const BadgePreview = ({ student, profileImage }: BadgePreviewProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="flex flex-col items-center">
      <div className="badge-preview mb-4">
        <div className="relative w-full h-full overflow-hidden p-4 flex flex-col">
          <div className="flex items-center">
            <div className="w-1/3">
              <img 
                src="/placeholder.svg" 
                alt="University Logo" 
                className="h-12 object-contain" 
              />
            </div>
            <div className="w-2/3 text-right">
              <h3 className="font-bold text-badgeflow-blue text-lg">STUDENT ID</h3>
              <p className="text-xs text-badgeflow-lightBlue">Valid until {currentYear + 4}</p>
            </div>
          </div>
          
          <div className="flex mt-4 flex-1">
            <div className="w-1/3 pr-2">
              <div className="rounded-md overflow-hidden border border-gray-200 h-24 w-24">
                <img 
                  src={profileImage} 
                  alt={student.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <div className="w-2/3 flex flex-col">
              <div className="text-sm space-y-1 flex-1">
                <div className="font-bold text-badgeflow-blue">{student.name}</div>
                <div className="grid grid-cols-2 gap-x-1">
                  <div className="text-xs text-badgeflow-lightBlue">ID Number:</div>
                  <div className="text-xs">{student.studentId}</div>
                  <div className="text-xs text-badgeflow-lightBlue">Course:</div>
                  <div className="text-xs">{student.course}</div>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="h-8 bg-badgeflow-blue w-full rounded-sm flex items-center justify-center">
                  <div className="bg-white h-1 w-full mx-2"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-badgeflow-lightBlue">
            If found, please return to Example University Campus Security
          </div>
        </div>
      </div>
      
      <Card className="p-4 mb-4 bg-gray-50 w-full max-w-md">
        <p className="text-sm text-center">
          This is how the badge will appear when printed. Please verify all details before proceeding.
        </p>
      </Card>
    </div>
  );
};
