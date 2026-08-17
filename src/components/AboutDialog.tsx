import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FAQ } from "@/lib/i18n";

export function AboutDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-charcoal">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-gradient-gold">About & FAQ</DialogTitle>
          <DialogDescription className="text-silver">
            Billionaire Speedrun is a free novelty simulator. Every dollar, diamond and dubious meme
            coin here is invented.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 className="font-display text-base text-gold">{f.q}</h3>
              <p className="mt-1 text-sm text-silver">{f.a}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}