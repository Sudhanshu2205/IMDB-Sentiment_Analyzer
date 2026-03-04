import type { SentimentLabel } from "@/lib/sentiment";

interface SentimentBadgeProps {
  label: SentimentLabel;
}

export default function SentimentBadge({ label }: SentimentBadgeProps) {
  return (
    <span className={`sentiment-badge ${label}`}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
}
