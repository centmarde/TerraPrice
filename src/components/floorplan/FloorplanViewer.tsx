import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import { Button } from '../ui/Button';

interface FloorplanViewerProps {
  imageUrl: string;
  alt?: string;
}

export const FloorplanViewer: React.FC<FloorplanViewerProps> = ({ 
  imageUrl, 
  alt = 'Floorplan' 
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'floorplan.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <h3 className="font-semibold text-gray-900">Floorplan View</h3>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="px-2 py-1 text-sm bg-white rounded border">
            {Math.round(zoom * 100)}%
          </span>
          <Button size="sm" variant="outline" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleRotate}>
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image container */}
      <div className="relative overflow-auto max-h-96 bg-gray-100">
        <div className="flex items-center justify-center min-h-full p-4">
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-none transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDIwMCA1MEwyNTAgMTAwTDMwMCA1MFYyNTBIMjAwVjIwMEgxNTBWMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIyMDAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZCNzI4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkZsb29ycGxhbiBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
            }}
          />
        </div>
      </div>
    </div>
  );
};