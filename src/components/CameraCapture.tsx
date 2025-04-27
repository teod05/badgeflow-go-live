
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
}

export const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const { toast } = useToast();

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
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((b) => b ? resolve(b) : null, 'image/jpeg', 0.8)
      );

      // Load image for background removal
      const img = await loadImage(blob);
      
      // Remove background
      const processedBlob = await removeBackground(img);
      
      // Convert processed blob to data URL
      const processedDataUrl = URL.createObjectURL(processedBlob);
      
      setCapturedImage(processedDataUrl);
      onCapture(processedDataUrl);

      // Stop the camera stream
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

  return (
    <div className="space-y-4">
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
            <p className="text-xs text-muted-foreground">Click activate button below</p>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      <div className="flex justify-center gap-4">
        {!isCameraActive && !capturedImage && (
          <Button onClick={activateCamera}>
            <Camera className="h-4 w-4 mr-2" />
            Activate Camera
          </Button>
        )}
        
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
          <Button variant="outline" onClick={retakePhoto}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retake Photo
          </Button>
        )}
      </div>
    </div>
  );
};
