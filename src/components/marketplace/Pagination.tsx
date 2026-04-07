interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-[8px] font-['Open_Sans'] font-semibold text-[13px] cursor-pointer ${
            page === currentPage
              ? "bg-[#F7931A] text-white"
              : "bg-white border border-[#F1F1F1] text-[#333333]"
          }`}
        >
          {page}
        </button>
      ))}

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
