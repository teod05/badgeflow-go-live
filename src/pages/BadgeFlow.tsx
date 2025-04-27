import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  Camera, 
  Printer, 
  CreditCard, 
  CheckCircle, 
  User,
  Database,
  Upload,
  FileText,
  Check,
  RefreshCcw,
  SkipForward
} from "lucide-react";
import { StudentCard } from "@/components/StudentCard";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";
import { StudentIdPreview } from "@/components/StudentIdPreview";

type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
  studentId: string;
  profileImage?: string;
  hasAllData: boolean;
};

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

export const BadgeFlow = () => {
  const [step, setStep] = useState<Step>("verify");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [nfcSerial, setNfcSerial] = useState<string>("");
  const [saltoSerial, setSaltoSerial] = useState<string>("");
  const [csvGenerated, setCsvGenerated] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

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

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: facingMode
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not access camera. Please check permissions."
      });
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    if (facingMode === "user") {
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
    }
    ctx.drawImage(video, 0, 0);
    ctx.restore();

    try {
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((b) => b ? resolve(b) : null, 'image/jpeg', 0.8)
      );

      const img = await loadImage(blob);
      
      const processedBlob = await removeBackground(img);
      
      const processedDataUrl = URL.createObjectURL(processedBlob);
      
      setCapturedImage(processedDataUrl);
      handlePhotoCapture(processedDataUrl);

      const stream = video.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraActive(false);
      
      toast({
        title: "Success",
        description: "Photo captured and background removed successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: "Failed to process the image. Please try again."
      });
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    activateCamera();
  };

  const toggleCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    setTimeout(activateCamera, 100);
  };

  const handlePhotoCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    
    toast({
      title: "Photo captured and uploaded",
      description: "Photo has been saved to student profile in HubSpot.",
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
    const generatedNfcSerial = "NFC-" + Math.floor(Math.random() * 10000000).toString();
    setNfcSerial(generatedNfcSerial);
    
    const generatedSaltoSerial = "SALTO-" + Math.floor(Math.random() * 10000000).toString();
    setSaltoSerial(generatedSaltoSerial);
    
    setCsvGenerated(true);
    
    toast({
      title: "NFC encoded successfully",
      description: "Card encoded for both MyCard and Salto systems.",
    });
    goToNextStep();
  };

  const downloadCsv = () => {
    if (!selectedStudent || !nfcSerial || !saltoSerial) return;
    
    const csvContent = [
      "Student ID,Name,NFC Serial,Salto Serial",
      `${selectedStudent.studentId},${selectedStudent.name},${nfcSerial},${saltoSerial}`
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `student_serials_${selectedStudent.studentId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSV Downloaded",
      description: "Student serials have been exported to CSV for Salto import.",
    });
  };

  const resetProcess = () => {
    setStep("verify");
    setSelectedStudent(null);
    setCapturedImage(null);
    setNfcSerial("");
    setSaltoSerial("");
    setCsvGenerated(false);
    setSearchQuery("");
    setIsCameraActive(false);
    setIsProcessing(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case "verify":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-badgeflow-accent" />
              <h3 className="text-lg font-semibold">Student Verification</h3>
            </div>
            <div>
              <Label htmlFor="search-student">Search Student in HubSpot</Label>
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
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-badgeflow-accent" />
                  <h3 className="text-lg font-semibold">Data Verification</h3>
                </div>
                <StudentCard student={selectedStudent} />
                
                {selectedStudent.hasAllData ? (
                  <div className="mt-4 bg-green-50 p-4 rounded-md border border-green-200">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-green-700">All Data Available</span>
                    </h4>
                    <p className="text-sm text-green-600 mt-1">
                      HubSpot data is complete. Ready to proceed with badge creation.
                    </p>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={goToNextStep}>
                        Continue to Photo Capture
                      </Button>
                    </div>
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
                <Camera className="h-5 w-5 text-badgeflow-accent" />
                <h3 className="text-lg font-semibold">Photo Capture</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Ensure the student is positioned against a white background and looking directly at the camera.
              </p>
              
              <div className="camera-container border rounded-lg overflow-hidden bg-gray-50 relative">
                {isCameraActive || capturedImage ? (
                  <div className="relative">
                    {isCameraActive && !capturedImage && (
                      <>
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className={`w-full h-auto max-h-96 ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
                        />
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="border-2 border-dashed border-badgeflow-accent rounded-lg w-64 h-80 opacity-50">
                              <div className="h-full w-full flex items-center justify-center text-badgeflow-accent text-sm font-medium">
                                Align face within frame
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-4 left-4 bg-white bg-opacity-70 px-3 py-2 rounded-md text-sm font-medium">
                          Center face in frame
                        </div>
                      </>
                    )}
                    {capturedImage && (
                      <img 
                        src={capturedImage} 
                        alt="Captured" 
                        className="w-full h-auto max-h-96" 
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Camera className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-muted-foreground">Camera inactive</p>
                    <p className="text-xs text-muted-foreground mb-4">Click activate button below or skip</p>
                    <div className="flex gap-2">
                      <Button onClick={activateCamera} variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Activate Camera
                      </Button>
                      <Button onClick={handleSkipPhoto}>
                        <SkipForward className="h-4 w-4 mr-2" />
                        Skip Photo
                      </Button>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={goToPrevStep}>
                  Back
                </Button>
                <div className="flex gap-2">
                  {isCameraActive && (
                    <>
                      <Button variant="outline" onClick={toggleCamera}>
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Switch Camera
                      </Button>
                      <Button 
                        onClick={capturePhoto} 
                        disabled={isProcessing}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {isProcessing ? 'Processing...' : 'Capture Photo'}
                      </Button>
                    </>
                  )}
                  
                  {capturedImage && (
                    <>
                      <Button variant="outline" onClick={retakePhoto}>
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Retake Photo
                      </Button>
                      <Button onClick={goToNextStep}>
                        Continue to Preview
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case "preview":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Printer className="h-5 w-5 text-badgeflow-accent" />
                <h3 className="text-lg font-semibold">Badge Preview & Printing</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Review the badge before printing. Make sure all information is correct.
              </p>
              
              <StudentIdPreview 
                studentPhotoUrl={capturedImage || undefined}
                isProcessing={isProcessing}
                student={selectedStudent || undefined}
              />
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
                <CreditCard className="h-5 w-5 text-badgeflow-accent" />
                <h3 className="text-lg font-semibold">NFC Encoding</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Tap the printed card against both readers to encode access details.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                  <CreditCard className="h-8 w-8 text-badgeflow-lightBlue mb-2" />
                  <h4 className="font-semibold mb-1">MyCard NFC Reader</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Tap card to encode student access data
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                  <CreditCard className="h-8 w-8 text-badgeflow-lightBlue mb-2" />
                  <h4 className="font-semibold mb-1">Salto System</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Tap card to store access profile
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
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
            <div className="bg-green-50 p-8 rounded-lg border border-green-200">
              <div className="flex flex-col items-center justify-center text-center mb-6">
                <div className="rounded-full bg-green-100 p-4 mb-4">
                  <CheckCircle className="h-12 w-12 text-badgeflow-success" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Badge Process Complete!</h3>
                <p className="text-muted-foreground">
                  The student ID card has been printed and encoded successfully.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-badgeflow-accent" />
                  <h4 className="text-lg font-semibold">Serial Number Logging</h4>
                </div>
                
                {selectedStudent && (
                  <div className="bg-white p-4 rounded-md border">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-semibold">Student:</div>
                      <div>{selectedStudent.name}</div>
                      <div className="font-semibold">ID Number:</div>
                      <div>{selectedStudent.studentId}</div>
                      <div className="font-semibold">NFC Serial:</div>
                      <div className="font-mono">{nfcSerial}</div>
                      <div className="font-semibold">Salto Serial:</div>
                      <div className="font-mono">{saltoSerial}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-2 mt-6">
                  <Upload className="h-5 w-5 text-badgeflow-accent" />
                  <h4 className="text-lg font-semibold">Data Export to Salto</h4>
                </div>
                
                <Button onClick={downloadCsv} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Download CSV for Salto
                </Button>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-700">Final Confirmation</h4>
                  </div>
                  <p className="text-sm text-blue-600 mt-2">
                    Please inform the student: "Your card will be ready to use from tomorrow."
                  </p>
                </div>
              </div>
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
          <div className={`flex items-center after:content-[''] after:h-0.5 after:w-8 after:bg-gray-200 after:mx-2`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border ${getStepStatus("verify") === "step-active" ? "border-blue-500 text-blue-500" : getStepStatus("verify") === "step-completed" ? "border-green-500 bg-green-500 text-white" : "border-gray-300 text-gray-400"}`}>
              <User className="h-4 w-4" />
            </div>
          </div>
          <div className={`flex items-center after:content-[''] after:h-0.5 after:w-8 after:bg-gray-200 after:mx-2`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border ${getStepStatus("photo") === "step-active" ? "border-blue-500 text-blue-500" : getStepStatus("photo") === "step-completed" ? "border-green-500 bg-green-500 text-white" : "border-gray-300 text-gray-400"}`}>
              <Camera className="h-4 w-4" />
            </div>
          </div>
          <div className={`flex items-center after:content-[''] after:h-0.5 after:w-8 after:bg-gray-200 after:mx-2`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border ${getStepStatus("preview") === "step-active" ? "border-blue-500 text-blue-500" : getStepStatus("preview") === "step-completed" ? "border-green-500 bg-green-500 text-white" : "border-gray-300 text-gray-400"}`}>
              <Printer className="h-4 w-4" />
            </div>
          </div>
          <div className={`flex items-center after:content-[''] after:h-0.5 after:w-8 after:bg-gray-200 after:mx-2`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border ${getStepStatus("encode") === "step-active" ? "border-blue-500 text-blue-500" : getStepStatus("encode") === "step-completed" ? "border-green-500 bg-green-500 text-white" : "border-gray-300 text-gray-400"}`}>
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border ${getStepStatus("complete") === "step-active" ? "border-blue-500 text-blue-500" : getStepStatus("complete") === "step-completed" ? "border-green-500 bg-green-500 text-white" : "border-gray-300 text-gray-400"}`}>
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {step === "verify" && "Student Verification & Data Check"}
            {step === "photo" && "Photo Capture & HubSpot Upload"}
            {step === "preview" && "Badge Preview & Printing"}
            {step === "encode" && "NFC Encoding & Access Management"}
            {step === "complete" && "Process Complete & Data Export"}
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
