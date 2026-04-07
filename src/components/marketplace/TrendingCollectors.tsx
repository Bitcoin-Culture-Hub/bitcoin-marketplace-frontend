import { Eye } from "lucide-react";
import SectionTitle from "./SectionTitle";

interface Collector {
  id: number;
  name: string;
  subtitle: string;
  avatarColor: string;
  views: string;
}

const collectors: Collector[] = [
  { id: 1, name: "CryptoKing", subtitle: "Top Collector", avatarColor: "#7DCFD7", views: "1.3k" },
  { id: 2, name: "BitMaster", subtitle: "Rare Finder", avatarColor: "#A8D0A8", views: "1.3k" },
  { id: 3, name: "TokenHunter", subtitle: "Gold Tier", avatarColor: "#F9E783", views: "1.3k" },
  { id: 4, name: "SatCollector", subtitle: "Rising Star", avatarColor: "#F97696", views: "1.3k" },
];

const TrendingCollectors = () => {
  return (
    <section className="bg-[#fafafa] px-[96px] py-16">
      <div className="flex justify-center mb-10">
        <SectionTitle text="Trending Collectors" />
      </div>

      <div className="flex flex-wrap justify-center gap-5">
        {collectors.map((collector) => (
          <div
            key={collector.id}
            className="w-[290px] h-[290px] bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.08)] rounded-[16px] relative"
          >
            {/* Cover image placeholder */}
            <div className="w-[290px] h-[140px] bg-[#D9D9D9] rounded-t-[16px]" />

            {/* Avatar */}
            <div
              className="w-[100px] h-[100px] rounded-full absolute left-1/2 -translate-x-1/2 top-[90px] border-4 border-white"
              style={{ backgroundColor: collector.avatarColor }}
            />

            {/* View count badge */}
            <div className="absolute top-4 right-4 bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.08)] rounded-full px-2.5 py-2.5 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#333333]" />
              <span className="font-['Inter'] font-medium text-[13px] text-[#333333]">
                {collector.views}
              </span>
            </div>

            {/* Text area */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="font-['Inter'] font-medium text-[18px] text-[#121212]">
                {collector.name}
              </p>
              <p className="font-['Inter'] font-medium text-[16px] text-[rgba(18,18,18,0.5)]">
                {collector.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingCollectors;
