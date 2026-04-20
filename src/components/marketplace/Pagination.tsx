interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Build a condensed page list: [1, '...', current-1, current, current+1, '...', last]
// Keeps first page, last page, current page, one neighbor on each side, and
// collapses everything else into ellipses.
function buildPageItems(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: (number | "…")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) items.push("…");
  for (let p = left; p <= right; p++) items.push(p);
  if (right < total - 1) items.push("…");

  items.push(total);
  return items;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const items = buildPageItems(currentPage, totalPages);

  return (
    <div className="flex flex-row gap-[5px]">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`bg-white rounded-[8px] px-1 py-2.5 font-['Open_Sans'] font-semibold text-[13px] ${
          currentPage === 1 ? "text-[#CCCCCC] cursor-not-allowed" : "text-[#333333] cursor-pointer"
        }`}
      >
        Prev
      </button>

      {items.map((item, idx) =>
        item === "…" ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-8 h-8 flex items-center justify-center font-['Open_Sans'] font-semibold text-[13px] text-[#999999] select-none"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`w-8 h-8 rounded-[8px] font-['Open_Sans'] font-semibold text-[13px] cursor-pointer ${
              item === currentPage
                ? "bg-[#F7931A] text-white"
                : "bg-white border border-[#F1F1F1] text-[#333333]"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`bg-white rounded-[8px] px-1 py-2.5 font-['Open_Sans'] font-semibold text-[13px] ${
          currentPage === totalPages ? "text-[#CCCCCC] cursor-not-allowed" : "text-[#333333] cursor-pointer"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
