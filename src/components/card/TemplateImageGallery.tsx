import { useState } from "react";

interface TemplateImageGalleryProps {
  images: string[];
  name: string;
}

const TemplateImageGallery = ({ images, name }: TemplateImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="rounded-3xl bg-card-image-bg aspect-square flex items-center justify-center p-10 overflow-hidden">
        <img
          src={images[activeIndex]}
          alt={`${name} - ${activeIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3">
          {images.map((src, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                className={`relative w-[104px] h-[104px] rounded-2xl bg-card-image-bg flex items-center justify-center p-3 overflow-hidden transition-all ${
                  isActive
                    ? "ring-2 ring-btc-orange ring-offset-2 ring-offset-white"
                    : "hover:opacity-90"
                }`}
              >
                <img
                  src={src}
                  alt={`${name} thumbnail ${idx + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TemplateImageGallery;
