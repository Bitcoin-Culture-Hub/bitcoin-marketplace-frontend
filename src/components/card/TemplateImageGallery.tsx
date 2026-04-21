import { useState } from "react";

interface TemplateImageGalleryProps {
  images: string[];
  name: string;
}

const TemplateImageGallery = ({ images, name }: TemplateImageGalleryProps) => {
  const state = useTemplateImageState();

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <TemplateMainImage images={images} name={name} state={state} />
      <TemplateThumbnails images={images} name={name} state={state} />
    </div>
  );
};

export default TemplateImageGallery;

// ─── Split-render API ─────────────────────────────────────────────────────────

export type TemplateImageState = {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
};

export function useTemplateImageState(initial: number = 0): TemplateImageState {
  const [activeIndex, setActiveIndex] = useState(initial);
  return { activeIndex, setActiveIndex };
}

interface SplitProps {
  images: string[];
  name: string;
  state: TemplateImageState;
  className?: string;
}

export const TemplateMainImage = ({
  images,
  name,
  state,
  className,
}: SplitProps) => {
  if (images.length === 0) return null;

  return (
    <div
      className={[
        "rounded-3xl bg-card-image-bg aspect-square flex items-center justify-center p-10 overflow-hidden",
        className ?? "",
      ].join(" ")}
    >
      <img
        src={images[state.activeIndex]}
        alt={`${name} - ${state.activeIndex + 1}`}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export const TemplateThumbnails = ({
  images,
  name,
  state,
  className,
}: SplitProps) => {
  if (images.length <= 1) return null;

  return (
    <div className={["flex items-center gap-3", className ?? ""].join(" ")}>
      {images.map((src, idx) => {
        const isActive = idx === state.activeIndex;
        return (
          <button
            key={`${src}-${idx}`}
            type="button"
            onClick={() => state.setActiveIndex(idx)}
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
  );
};
