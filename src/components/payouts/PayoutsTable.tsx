import PayoutRow, { Payout } from "./PayoutRow";
import { PayoutStatus } from "./PayoutStatusBadge";

interface PayoutsTableProps {
  payouts: Payout[];
  statusFilter: string | null;
  onStatusFilterChange: (status: string | null) => void;
  onViewDetails: (payout: Payout) => void;
}

const PayoutsTable = ({
  payouts,
  statusFilter,
  onStatusFilterChange,
  onViewDetails,
}: PayoutsTableProps) => {
  const filteredPayouts = payouts.filter((payout) => {
    if (statusFilter && payout.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="border border-border bg-card/30">

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Order / Card
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="py-2 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Destination
              </th>
              <th className="py-2 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayouts.length > 0 ? (
              filteredPayouts.map((payout) => (
                <PayoutRow
                  key={payout.id}
                  payout={payout}
                  onViewDetails={onViewDetails}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">No payouts found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutsTable;
