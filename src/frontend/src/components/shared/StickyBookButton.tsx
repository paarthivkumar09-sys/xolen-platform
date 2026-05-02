import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface StickyBookButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  price?: string;
}

export function StickyBookButton({
  label = "Book Now",
  onClick,
  disabled = false,
  isLoading = false,
  price,
}: StickyBookButtonProps) {
  return (
    <div className="button-sticky-mobile">
      <div className="mx-auto max-w-lg">
        {price && (
          <p className="mb-2 text-center text-sm text-muted-foreground">
            Total: <span className="font-bold text-foreground">{price}</span>
          </p>
        )}
        <Button
          type="button"
          data-ocid="property.book_now.primary_button"
          onClick={onClick}
          disabled={disabled || isLoading}
          className="w-full rounded-xl bg-primary py-6 font-display text-base font-bold text-primary-foreground shadow-lg transition-smooth hover:bg-primary/90 active:scale-95"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {label}
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Not satisfied? Get{" "}
          <span className="font-semibold text-primary">90% refund</span>{" "}
          instantly
        </p>
      </div>
    </div>
  );
}
