import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";

interface TemplateTileProps {
  id: string;
  name: string;
  series: string;
  cardNumber: string;
  image: string;
  backImage?: string | null;
  availableCount: number;
  floorPriceBTC: number | null;
  offersAcceptedCount: number;
  isNewSupply?: boolean;
  isLowPop?: boolean;
  /** Grade of the floor (lowest-priced available) copy, e.g. "9.5" */
  floorGrade?: string | null;
  /** Grading company of the floor copy, e.g. "PSA" */
  floorGradingCompany?: string | null;
  /** When set, the detail page will filter listings to this seller only */
  sellerFilter?: string;
}

const TemplateTile = ({
  id,
  name,
  series,
  cardNumber,
  image,
  backImage,
  availableCount,
  floorPriceBTC,
  offersAcceptedCount,
  isNewSupply,
  isLowPop,
  floorGrade,
  floorGradingCompany,
  sellerFilter,
}: TemplateTileProps) => {
  const gradeLabel =
    floorGrade && floorGradingCompany
      ? `${floorGradingCompany} - ${floorGrade}`
      : floorGrade
      ? floorGrade
      : floorGradingCompany
      ? floorGradingCompany
      : null;

  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const hasListings = availableCount > 0;
  const hasBack = !!backImage;

  const detailUrl = `/marketplace/templates/${id}${sellerFilter ? `?seller=${sellerFilter}` : ""}`;

  return (
    <div
      onClick={() => navigate(detailUrl)}
      className="group w-full h-full flex flex-col cursor-pointer p-4 bg-white shadow-card rounded-card transition-all duration-200 hover:shadow-card-hover"
    >
      {/* Image Area */}
      <div
        className="relative h-[169px]"
        style={hasBack ? { perspective: "600px" } : undefined}
        onMouseEnter={() => hasBack && setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        {hasBack ? (
          <div
            className="relative w-full h-full transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front face */}
            <div
              className="absolute inset-0 bg-card-image-bg rounded-card-inner overflow-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              <img
                src={image}
                alt={name}
                className="w-full h-full object-contain -rotate-[40deg] scale-75"
              />
            </div>
            {/* Back face */}
            <div
              className="absolute inset-0 bg-card-image-bg rounded-card-inner overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <img
                src={backImage}
                alt={`${name} back`}
                className="w-full h-full object-contain -rotate-[40deg] scale-75"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-card-image-bg rounded-card-inner overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain -rotate-[40deg] scale-75"
            />
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorited((prev) => !prev);
          }}
          className="absolute top-[9px] right-[9px] z-10 w-[30px] h-[30px] bg-white rounded-full shadow-[0px_4px_10px_rgba(0,0,0,0.06)] flex items-center justify-center"
        >
          <Heart
            size={16}
            className={
              isFavorited
                ? "text-red-500 fill-red-500"
                : "text-[#121212]/60"
            }
          />
        </button>
      </div>

      {/* Content Below Image */}
      <div className="flex flex-col gap-3 mt-3 flex-1">
        {/* Title */}
        <h3 className="font-sans font-medium text-[14px] leading-[17px] tracking-[0.014em] text-[#121212] line-clamp-1">
          {name}
        </h3>

        {/* Divider */}
        <div className="border-t border-[rgba(175,175,175,0.2)]" />

        {/* Category Line */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-0.5 min-w-0">
            <span className="text-[12px] text-[rgba(18,18,18,0.6)] tracking-[0.014em] truncate shrink">
              {series}
            </span>
            <span className="text-[12px] text-[rgba(18,18,18,0.6)] tracking-[0.014em] shrink-0">
              &middot;
            </span>
            <span className="text-[12px] text-[rgba(18,18,18,0.6)] tracking-[0.014em] truncate shrink">
              {cardNumber}
            </span>
          </div>
          {gradeLabel && (
            <span className="shrink-0 inline-flex items-center h-6 px-2 rounded-md border border-gray-200 text-[11px] font-semibold text-gray-700">
              {gradeLabel}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-[rgba(175,175,175,0.2)] mt-auto" />

        {/* Bottom Row */}
        <div className="flex justify-between items-center">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-[rgba(18,18,18,0.6)]">
              Price
            </span>
            <span className="text-[14px] font-medium text-[#121212]">
              {floorPriceBTC !== null ? (
                <>
                  {floorPriceBTC} <span className="text-[#F7931A]">BTC</span>
                </>
              ) : (
                "—"
              )}
            </span>
          </div>

          {/* BUY Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(detailUrl);
            }}
            className="bg-[#F7931A] text-white rounded-btn px-4 py-2.5 text-[14px] font-medium flex items-center gap-2 hover:brightness-110 transition-all"
          >
            BUY
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateTile;
