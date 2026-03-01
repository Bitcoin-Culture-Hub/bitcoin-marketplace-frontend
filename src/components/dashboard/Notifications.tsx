import { useState } from "react";
import { Bell, ChevronDown, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationType = "dispute" | "warning" | "info" | "resolved";

interface Notification {
  id: string;
  title: string;
  description?: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
}

interface NotificationsProps {
  notifications: Notification[];
}

const Notifications = ({ notifications }: NotificationsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasNotifications = notifications.length > 0;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "dispute":
        return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
      case "warning":
        return <AlertCircle className="h-3.5 w-3.5 text-warning" />;
      case "resolved":
        return <CheckCircle2 className="h-3.5 w-3.5 text-success" />;
      default:
        return <Info className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  return (
    <section className="border border-border bg-card/30">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-card/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-mono bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isExpanded && "rotate-180"
          )} 
        />
      </button>
      
      {isExpanded && (
        <div className="border-t border-border divide-y divide-border">
          {hasNotifications ? (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "p-4 transition-colors",
                  !notification.isRead && "bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn(
                        "text-sm",
                        notification.isRead ? "text-foreground" : "text-foreground font-medium"
                      )}>
                        {notification.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {notification.timestamp}
                      </span>
                    </div>
                    {notification.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {notification.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                No notifications to review.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Notifications;
