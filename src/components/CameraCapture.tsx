
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCcw } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
}

export const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640,
          height: 480,
          facingMode: "user" 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      // In a real app, we would show a proper error message
      alert("Could not access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageDataUrl);
        onCapture(imageDataUrl);
        
        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraActive(false);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    activateCamera();
  };

  return (
    <div className="space-y-4">
      <div className="camera-container border rounded-lg overflow-hidden bg-gray-50 relative">
        {isCameraActive ? (
          <div className="relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-auto max-h-96 camera-guide"
            />
            <div className="absolute top-4 left-4 bg-white bg-opacity-50 p-1 rounded-md text-xs font-medium">
              Center face in frame
            </div>
          </div>
        ) : capturedImage ? (
          <div className="relative">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-auto max-h-96" 
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Camera className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-muted-foreground">Camera inactive</p>
            <p className="text-xs text-muted-foreground">Click activate button below</p>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      <div className="flex justify-center space-x-4">
        {!isCameraActive && !capturedImage && (
          <Button onClick={activateCamera}>
            <Camera className="h-4 w-4 mr-2" />
            Activate Camera
          </Button>
        )}
        
        {isCameraActive && (
          <Button onClick={capturePhoto}>
            <Camera className="h-4 w-4 mr-2" />
            Capture Photo
          </Button>
        )}
        
        {capturedImage && (
          <Button variant="outline" onClick={retakePhoto}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retake Photo
          </Button>
        )}
      </div>
    </div>
  );
};
