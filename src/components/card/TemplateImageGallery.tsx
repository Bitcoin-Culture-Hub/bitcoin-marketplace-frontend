import { useState } from "react";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TemplateImageGalleryProps {
  images: string[];
  name: string;
}

const TemplateImageGallery = ({ images, name }: TemplateImageGalleryProps) => {
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
        {/* Label */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-1 bg-background/90 border border-border text-[10px] uppercase tracking-wider text-muted-foreground">
            Reference Art
          </span>
        </div>

        <div className="aspect-[4/5] flex items-center justify-center p-8">
          <img
            src={images[activeIndex]}
            alt={`${name} - Template Art ${activeIndex + 1}`}
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

    </div>
  );
};

export default TemplateImageGallery;
