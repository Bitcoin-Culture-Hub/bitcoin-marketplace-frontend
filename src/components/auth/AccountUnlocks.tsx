import {
  Bookmark,
  Tag,
  MessageSquare,
  Banknote,
  Star,
} from "lucide-react";

const AccountUnlocks = () => {
  const unlocks = [
    { icon: Bookmark, label: "Own a collection" },
    { icon: Tag, label: "List cards for sale" },
    { icon: MessageSquare, label: "Post escrow-backed offers" },
    { icon: Banknote, label: "Receive payouts" },
    { icon: Star, label: "Leave reviews" },
  ];

  return (
    <div className="border border-border p-5 bg-muted/30">
      <h3 className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] mb-4 font-light">
        Your account enables
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {unlocks.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-xs text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountUnlocks;
