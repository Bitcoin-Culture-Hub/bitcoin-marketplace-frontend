import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardImageGalleryProps {
  images: string[];
  name: string;
}

const CardImageGallery = ({ images, name }: CardImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative border border-border bg-muted/30">
        <div className="aspect-[4/5] flex items-center justify-center p-8">
          <img
            src={images[activeIndex]}
            alt={`${name} - Image ${activeIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-20 h-24 border overflow-hidden transition-all ${
                index === activeIndex
                  ? "border-foreground"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <img
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardImageGallery;
