
import React from 'react';

interface StudentIdPreviewProps {
  studentPhotoUrl?: string;
  isProcessing?: boolean;
  student?: {
    name?: string;
    studentId?: string;
  };
}

export const StudentIdPreview = ({ 
  studentPhotoUrl, 
  isProcessing,
  student 
}: StudentIdPreviewProps) => {
  return (
    <div className="w-[3.375in] h-[2.125in] bg-white shadow-sm border rounded-lg overflow-hidden mx-auto">
      <div className="h-full p-4 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="w-16">
            <img 
              src="public/lovable-uploads/4823ada5-9a22-4fc3-a007-5d9b6c822030.png" 
              alt="CODE Logo" 
              className="w-full h-auto"
            />
          </div>
          <div className="text-right text-[10px]">
            <p className="font-medium">CURIOSITY DRIVEN EDUCATION</p>
            <p>UNIVERSITY OF APPLIED SCIENCES</p>
            <p>BERLIN</p>
          </div>
        </div>

        <div className="flex gap-4 flex-1">
          <div className="space-y-2 flex-1">
            <div>
              <p className="text-[10px] text-gray-600">STUDENT ID STUDIERENDENAUSWEIS</p>
              <p className="text-sm font-medium">{student?.studentId || 'XY2234E12053'}</p>
            </div>
            
            <div>
              <p className="text-[10px] text-gray-600">NAME NAME</p>
              <p className="text-sm font-medium">{student?.name || 'MATEUSZ PIATKOWSKI'}</p>
            </div>
            
            <div>
              <p className="text-[10px] text-gray-600">ENROLLMENT NO MATRIKELNUMMER</p>
              <p className="text-sm font-medium">123456</p>
            </div>
            
            <div>
              <p className="text-[10px] text-gray-600">VALID GÜLTIG</p>
              <p className="text-sm font-medium">12.07.2024</p>
            </div>
          </div>

          <div className="w-24">
            {studentPhotoUrl ? (
              <img 
                src={studentPhotoUrl} 
                alt="Student Photo" 
                className="w-24 h-32 object-cover rounded"
              />
            ) : (
              <div className="w-24 h-32 bg-gray-100 rounded flex items-center justify-center">
                {isProcessing ? (
                  <p className="text-xs text-center text-gray-500">Processing...</p>
                ) : (
                  <p className="text-xs text-center text-gray-500">Photo will appear here</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
