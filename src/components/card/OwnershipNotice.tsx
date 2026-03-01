import { useNavigate } from "react-router-dom";

interface OwnershipNoticeProps {
  copiesOwned: number;
}

const OwnershipNotice = ({ copiesOwned }: OwnershipNoticeProps) => {
  const navigate = useNavigate();

  if (copiesOwned === 0) return null;

  return (
    <div className="border border-border bg-muted/30 px-5 py-4 flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        You own{" "}
        <span className="text-foreground font-medium">{copiesOwned}</span>{" "}
        {copiesOwned === 1 ? "copy" : "copies"} of this card.
      </span>
      <button
        onClick={() => navigate("/dashboard")}
        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
      >
        View My Copy
      </button>
    </div>
  );
};

export default OwnershipNotice;
