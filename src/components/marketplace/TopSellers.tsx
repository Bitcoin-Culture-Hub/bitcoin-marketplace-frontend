import SectionTitle from "./SectionTitle";

interface Seller {
  id: number;
  rank: number;
  name: string;
  subtitle: string;
  avatarColor: string;
}

const sellers: Seller[] = [
  { id: 1, rank: 1, name: "CryptoKing", subtitle: "2.5 BTC", avatarColor: "#7DCFD7" },
  { id: 2, rank: 2, name: "BitMaster", subtitle: "2.3 BTC", avatarColor: "#A8D0A8" },
  { id: 3, rank: 3, name: "TokenHunter", subtitle: "2.1 BTC", avatarColor: "#F9E783" },
  { id: 4, rank: 4, name: "SatCollector", subtitle: "1.9 BTC", avatarColor: "#F97696" },
  { id: 5, rank: 5, name: "BlockTrader", subtitle: "1.7 BTC", avatarColor: "#C4A8E0" },
  { id: 6, rank: 6, name: "HashMiner", subtitle: "1.5 BTC", avatarColor: "#F0A8A8" },
  { id: 7, rank: 7, name: "ChainRunner", subtitle: "1.3 BTC", avatarColor: "#A8C4E0" },
  { id: 8, rank: 8, name: "NodeKeeper", subtitle: "1.1 BTC", avatarColor: "#E0D4A8" },
  { id: 9, rank: 9, name: "WalletWiz", subtitle: "0.9 BTC", avatarColor: "#A8E0C4" },
  { id: 10, rank: 10, name: "LedgerPro", subtitle: "0.8 BTC", avatarColor: "#D4A8E0" },
  { id: 11, rank: 11, name: "MintMaster", subtitle: "0.7 BTC", avatarColor: "#E0C4A8" },
  { id: 12, rank: 12, name: "SatStacker", subtitle: "0.6 BTC", avatarColor: "#A8E0D4" },
];

const TopSellers = () => {
  return (
    <section className="px-[96px] py-16">
      <div className="flex justify-center mb-10">
        <SectionTitle text="Top Sellers" />
      </div>

      <div className="grid grid-cols-4 gap-x-0 gap-y-[44px] justify-items-center">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="w-[270px] h-[85px] rounded-[100px] shadow-[0px_4px_16px_rgba(0,0,0,0.07)] p-2.5 flex items-center gap-2.5"
          >
            <span className="font-['Inter'] font-medium text-[16px] text-[#121212] min-w-[24px] text-center">
              {seller.rank}
            </span>

            <div
              className="w-[65px] h-[65px] rounded-full flex-shrink-0"
              style={{ backgroundColor: seller.avatarColor }}
            />

            <div className="flex flex-col min-w-0">
              <span className="font-['Inter'] font-medium text-[16px] text-[#121212] truncate">
                {seller.name}
              </span>
              <span className="font-['Inter'] font-medium text-[16px] text-[rgba(18,18,18,0.5)]">
                {seller.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopSellers;
