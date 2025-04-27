
import React from 'react';

interface StudentIdPreviewProps {
  studentPhotoUrl?: string;
  isProcessing?: boolean;
}

export const StudentIdPreview = ({ studentPhotoUrl, isProcessing }: StudentIdPreviewProps) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="w-24">
          <img 
            src="public/lovable-uploads/53a3d632-09f3-420a-b229-b7b6cd300b98.png" 
            alt="CODE Logo" 
            className="w-full h-auto"
          />
        </div>
        <div className="text-right text-xs">
          <p className="font-medium">CURIOSITY DRIVEN EDUCATION</p>
          <p>UNIVERSITY OF APPLIED SCIENCES</p>
          <p>BERLIN</p>
        </div>
      </div>

      <div className="grid grid-cols-[2fr,1fr] gap-4">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-600">STUDENT ID STUDIERENDENAUSWEIS</p>
            <p className="font-medium">XY2234E12053</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600">NAME NAME</p>
            <p className="font-medium">MATEUSZ PIATKOWSKI</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600">ENROLLMENT NO MATRIKELNUMMER</p>
            <p className="font-medium">123456</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-600">VALID GÜLTIG</p>
            <p className="font-medium">12.07.2024</p>
          </div>
        </div>

        <div className="flex justify-end">
          {studentPhotoUrl ? (
            <img 
              src={studentPhotoUrl} 
              alt="Student Photo" 
              className="w-32 h-40 object-cover"
            />
          ) : (
            <div className="w-32 h-40 bg-gray-100 flex items-center justify-center">
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
  );
};
