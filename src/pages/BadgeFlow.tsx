import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Search, Camera, Printer, CreditCard, CheckCircle } from "lucide-react";
import { StudentCard } from "@/components/StudentCard";
import { CameraCapture } from "@/components/CameraCapture";
import { BadgePreview } from "@/components/BadgePreview";

type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
  studentId: string;
  profileImage?: string;
  hasAllData: boolean;
};

// Mock student data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane.smith@example.edu",
    course: "Computer Science",
    studentId: "CS22-1234",
    profileImage: undefined,
    hasAllData: true
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.doe@example.edu",
    course: "Mechanical Engineering",
    studentId: "ME22-5678",
    profileImage: undefined,
    hasAllData: false
  }
];

type Step = "verify" | "photo" | "preview" | "encode" | "complete";

const BadgeFlow = () => {
  const [step, setStep] = useState<Step>("verify");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [nfcSerial, setNfcSerial] = useState<string>("");

  const handleSearch = () => {
    const found = mockStudents.find(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (found) {
      setSelectedStudent(found);
      toast({
        title: "Student found",
        description: `${found.name} has been located in HubSpot`,
      });
    } else {
      toast({
        title: "Student not found",
        description: "No matching records in HubSpot. Please check details.",
        variant: "destructive",
      });
    }
  };

  const handlePhotoCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    
    // In a real app, we would upload to HubSpot here
    toast({
      title: "Photo captured",
      description: "Photo has been saved to student profile.",
    });
  };

  const handleSkipPhoto = () => {
    setCapturedImage(null);
    toast({
      title: "Photo skipped",
      description: "Proceeding without a photo. You can add one later.",
    });
    goToNextStep();
  };

  const goToNextStep = () => {
    switch (step) {
      case "verify":
        setStep("photo");
        break;
      case "photo":
        setStep("preview");
        break;
      case "preview":
        setStep("encode");
        break;
      case "encode":
        setStep("complete");
        break;
      default:
        break;
    }
  };

  const goToPrevStep = () => {
    switch (step) {
      case "photo":
        setStep("verify");
        break;
      case "preview":
        setStep("photo");
        break;
      case "encode":
        setStep("preview");
        break;
      default:
        break;
    }
  };

  const handleNfcEncoding = () => {
    // In a real app, we would trigger NFC encoding here
    setNfcSerial("NFC-" + Math.floor(Math.random() * 10000000).toString());
    toast({
      title: "NFC encoded successfully",
      description: "Card is ready for use.",
    });
    goToNextStep();
  };

  const resetProcess = () => {
    setStep("verify");
    setSelectedStudent(null);
    setCapturedImage(null);
    setNfcSerial("");
    setSearchQuery("");
  };

  const renderStepContent = () => {
    switch (step) {
      case "verify":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="search-student">Search for Student</Label>
              <div className="flex mt-2 gap-2">
                <Input 
                  id="search-student" 
                  placeholder="Enter name or ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleSearch} type="button">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Search by name or student ID to retrieve data from HubSpot
              </p>
            </div>
            
            {selectedStudent && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Student Profile</h3>
                <StudentCard student={selectedStudent} />
                
                {selectedStudent.hasAllData ? (
                  <div className="mt-4 flex justify-end">
                    <Button onClick={goToNextStep}>
                      Continue to Photo Capture
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <h4 className="font-semibold text-yellow-600">Missing Information</h4>
                    <p className="text-sm text-yellow-700">
                      This student is missing required data fields in HubSpot. Please update the profile before proceeding.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      case "photo":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Photo Capture</h3>
                <Camera className="h-5 w-5 text-badgeflow-accent" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Ensure the student is positioned against a white background and looking directly at the camera.
              </p>
              
              <CameraCapture onCapture={handlePhotoCapture} onSkip={handleSkipPhoto} />
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={goToPrevStep}>
                Back
              </Button>
              <Button 
                onClick={goToNextStep}
                disabled={!capturedImage}
              >
                Continue to Badge Preview
              </Button>
            </div>
          </div>
        );
        
      case "preview":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Badge Preview</h3>
                <Printer className="h-5 w-5 text-badgeflow-accent" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Review the badge before printing. Make sure all information is correct.
              </p>
              
              {selectedStudent && capturedImage && (
                <BadgePreview 
                  student={selectedStudent} 
                  profileImage={capturedImage} 
                />
              )}
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={goToPrevStep}>
                Back
              </Button>
              <Button onClick={goToNextStep}>
                Print & Continue to NFC Encoding
              </Button>
            </div>
          </div>
        );
        
      case "encode":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">NFC Encoding</h3>
                <CreditCard className="h-5 w-5 text-badgeflow-accent" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Tap the printed card against the NFC reader to encode access details.
              </p>
              
              <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                <CreditCard className="h-12 w-12 text-badgeflow-lightBlue mb-4" />
                <h4 className="text-lg font-semibold mb-1">Ready to Encode</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Place the card on the NFC reader now
                </p>
                <Button onClick={handleNfcEncoding} className="w-full max-w-xs">
                  Simulate NFC Encoding
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={goToPrevStep}>
                Back
              </Button>
            </div>
          </div>
        );
        
      case "complete":
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-8 rounded-lg border border-green-200 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-green-100 p-4 mb-4">
                <CheckCircle className="h-12 w-12 text-badgeflow-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Badge Process Complete!</h3>
              <p className="text-muted-foreground mb-6">
                The student ID card has been printed and encoded successfully.
              </p>
              
              {selectedStudent && (
                <div className="w-full max-w-md bg-white p-4 rounded-md border mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-semibold">Student:</div>
                    <div>{selectedStudent.name}</div>
                    <div className="font-semibold">ID Number:</div>
                    <div>{selectedStudent.studentId}</div>
                    <div className="font-semibold">NFC Serial:</div>
                    <div>{nfcSerial}</div>
                  </div>
                </div>
              )}
              
              <p className="text-sm font-medium text-badgeflow-blue">
                Please inform the student: "Your card will be ready to use from tomorrow."
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={resetProcess}>
                Process New Student
              </Button>
            </div>
          </div>
        );
    }
  };

  const getStepStatus = (currentStep: Step) => {
    if (currentStep === step) {
      return "step-active";
    } else if (
      (currentStep === "verify" && ["photo", "preview", "encode", "complete"].includes(step)) ||
      (currentStep === "photo" && ["preview", "encode", "complete"].includes(step)) ||
      (currentStep === "preview" && ["encode", "complete"].includes(step)) ||
      (currentStep === "encode" && step === "complete")
    ) {
      return "step-completed";
    } else {
      return "step-pending";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Badge Issuance Flow</h1>
      
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-2">
          {["verify", "photo", "preview", "encode", "complete"].map((s) => (
            <div 
              key={s} 
              className={`flex items-center ${s === "complete" ? "" : "after:content-[''] after:h-0.5 after:w-8 after:bg-gray-200 after:mx-2"}`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${getStepStatus(s as Step)}`}
              >
                {s === "verify" && "1"}
                {s === "photo" && "2"}
                {s === "preview" && "3"}
                {s === "encode" && "4"}
                {s === "complete" && "✓"}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {step === "verify" && "Student Verification"}
            {step === "photo" && "Photo Capture"}
            {step === "preview" && "Badge Preview & Printing"}
            {step === "encode" && "NFC Encoding"}
            {step === "complete" && "Process Complete"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeFlow;
