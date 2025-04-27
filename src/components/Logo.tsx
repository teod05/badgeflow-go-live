
import { CreditCard } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-8 h-8 bg-badgeflow-accent rounded-lg rotate-3 absolute -right-0.5 -bottom-0.5" />
        <div className="w-8 h-8 bg-white rounded-lg border-2 border-badgeflow-accent flex items-center justify-center relative">
          <CreditCard className="h-5 w-5 text-badgeflow-accent" />
        </div>
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-badgeflow-accent to-badgeflow-success bg-clip-text text-transparent">
        BadgeFlow
      </span>
    </div>
  );
};
