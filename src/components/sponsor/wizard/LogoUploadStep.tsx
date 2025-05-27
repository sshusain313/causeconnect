
import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';

interface LogoUploadStepProps {
  formData: {
    logoUrl: string;
    message: string;
    logoPosition?: {
      x: number;
      y: number;
      scale: number;
      angle: number;
    };
  };
  updateFormData: (data: Partial<{
    logoUrl: string;
    message: string;
    logoPosition?: {
      x: number;
      y: number;
      scale: number;
      angle: number;
    };
  }>) => void;
}

const LogoUploadStep = ({ formData, updateFormData }: LogoUploadStepProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>(formData.logoUrl);
  const [uploading, setUploading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(formData.logoPosition || { x: 200, y: 200, scale: 0.25, angle: 0 });
  
  // Initialize canvas and draw tote bag with logo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;
    
    // Clear canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw tote bag image
    const toteBag = new Image();
    toteBag.src = '/totebag.png';
    console.log('Loading totebag image from:', toteBag.src);
    
    toteBag.onload = () => {
      console.log('Totebag image loaded successfully');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw tote bag centered
      const scale = Math.min(canvas.width / toteBag.width, canvas.height / toteBag.height) * 0.9;
      const x = (canvas.width - toteBag.width * scale) / 2;
      const y = (canvas.height - toteBag.height * scale) / 2;
      ctx.drawImage(toteBag, x, y, toteBag.width * scale, toteBag.height * scale);
      
      // Draw logo if available
      if (previewUrl && logoRef.current) {
        console.log('Drawing logo on canvas');
        drawLogo(ctx, logoRef.current, position);
      } else {
        console.log('Logo not available for drawing', { previewUrl, logoLoaded: !!logoRef.current });
      }
    };
    
    toteBag.onerror = (error) => {
      console.error('Error loading totebag image:', error);
      console.error('Failed URL:', toteBag.src);
    };
  }, [previewUrl, position]);
  
  // Load logo image when URL changes
  useEffect(() => {
    if (!previewUrl) return;
    
    const logoImg = new Image();
    // Handle server-side URLs
    if (previewUrl.startsWith('/uploads/')) {
      logoImg.src = `http://localhost:5000${previewUrl}`;
      console.log('Loading server image from:', `http://localhost:5000${previewUrl}`);
    } else {
      logoImg.src = previewUrl;
      console.log('Loading image from:', previewUrl);
    }
    
    logoImg.onload = () => {
      console.log('Logo image loaded successfully');
      logoRef.current = logoImg;
      // Trigger redraw
      setPosition(prev => ({ ...prev }));
    };
    
    logoImg.onerror = (error) => {
      console.error('Error loading logo image:', error);
      console.error('Failed URL:', logoImg.src);
    };
  }, [previewUrl]);
  
  // Function to draw logo on canvas
  const drawLogo = (ctx: CanvasRenderingContext2D, logo: HTMLImageElement, pos: { x: number, y: number, scale: number, angle: number }) => {
    ctx.save();
    
    // Move to position and apply transformations
    ctx.translate(pos.x, pos.y);
    ctx.rotate(pos.angle * Math.PI / 180);
    ctx.scale(pos.scale, pos.scale);
    
    // Draw logo centered
    const width = logo.width;
    const height = logo.height;
    ctx.drawImage(logo, -width / 2, -height / 2, width, height);
    
    ctx.restore();
  };
  
  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!previewUrl) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is within logo bounds
    const logoX = position.x;
    const logoY = position.y;
    const logoWidth = (logoRef.current?.width || 0) * position.scale;
    const logoHeight = (logoRef.current?.height || 0) * position.scale;
    
    if (
      x >= logoX - logoWidth / 2 &&
      x <= logoX + logoWidth / 2 &&
      y >= logoY - logoHeight / 2 &&
      y <= logoY + logoHeight / 2
    ) {
      setIsDragging(true);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition(prev => ({
      ...prev,
      x,
      y
    }));
  };
  
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Save position to form data
      updateFormData({ logoPosition: position });
    }
  };
  
  // Handle logo upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('logo', file);
      
      // Upload the file to the server
      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }
      
      const data = await response.json();
      const serverImageUrl = data.url; // Get the URL from the server response
      
      // Update the UI with the server URL
      setPreviewUrl(serverImageUrl);
      updateFormData({ logoUrl: serverImageUrl });
      
      // Reset position for new logo
      const newPosition = { x: 200, y: 280, scale: 0.25, angle: 0 };
      setPosition(newPosition);
      updateFormData({ logoPosition: newPosition });
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle message change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ message: e.target.value });
  };
  
  // Logo manipulation functions
  const handleZoomIn = () => {
    setPosition(prev => {
      const newPosition = { ...prev, scale: prev.scale * 1.1 };
      updateFormData({ logoPosition: newPosition });
      return newPosition;
    });
  };
  
  const handleZoomOut = () => {
    setPosition(prev => {
      const newPosition = { ...prev, scale: prev.scale * 0.9 };
      updateFormData({ logoPosition: newPosition });
      return newPosition;
    });
  };
  
  const handleRotateClockwise = () => {
    setPosition(prev => {
      const newPosition = { ...prev, angle: prev.angle + 15 };
      updateFormData({ logoPosition: newPosition });
      return newPosition;
    });
  };
  
  const handleRotateCounterClockwise = () => {
    setPosition(prev => {
      const newPosition = { ...prev, angle: prev.angle - 15 };
      updateFormData({ logoPosition: newPosition });
      return newPosition;
    });
  };
  
  const handleResetLogo = () => {
    const newPosition = { x: 200, y: 200, scale: 0.25, angle: 0 };
    setPosition(newPosition);
    updateFormData({ logoPosition: newPosition });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Logo Upload</h2>
      <p className="text-gray-600 mb-6">
        Upload your organization's logo to be displayed on the cause page and tote bags.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="space-y-4">
            <Label htmlFor="logoUpload">Upload Logo</Label>
            <div className="flex items-center gap-4">
              <Input
                id="logoUpload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                className="w-full h-32 border-dashed"
                onClick={() => document.getElementById('logoUpload')?.click()}
                disabled={uploading}
              >
                <div className="flex flex-col items-center text-gray-500">
                  <Upload className="h-8 w-8 mb-2" />
                  <span>{uploading ? 'Uploading...' : 'Click to upload logo'}</span>
                  <span className="text-xs mt-1">PNG, JPG, SVG (max 5MB)</span>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="space-y-4 mt-6">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Any special requests or details about your sponsorship?"
              value={formData.message}
              onChange={handleMessageChange}
              rows={4}
            />
          </div>
        </div>
        
        <div>
          <Label className="block mb-4">Logo Preview</Label>
          <Card className="border-2 border-gray-200">
            <CardContent className="p-4">
              {previewUrl ? (
                <div className="space-y-4">
                  <p className="font-medium">Your logo on a tote:</p>
                  <div className="relative bg-gray-50 rounded-lg flex flex-col items-center">
                    {/* HTML5 Canvas */}
                    <canvas 
                      ref={canvasRef} 
                      className="border rounded-lg cursor-move" 
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    />
                    
                    {/* Logo Controls */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleZoomIn}
                        title="Zoom In"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleZoomOut}
                        title="Zoom Out"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleRotateClockwise}
                        title="Rotate Clockwise"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleRotateCounterClockwise}
                        title="Rotate Counter-Clockwise"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleResetLogo}
                        title="Reset Position"
                      >
                        Reset
                      </Button>
                    </div>
                    
                    <p className="mt-2 text-xs text-muted-foreground text-center">
                      Drag to position, use corner handles to resize, or use the controls above.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[400px]">
                  <p className="text-gray-400 text-center">
                    Your logo preview will appear here after upload
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {previewUrl && (
            <div className="mt-4 text-sm text-gray-500">
              <p>This is how your logo will appear on sponsored totes. Position and size it as desired.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoUploadStep;
