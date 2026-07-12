import { ShieldCheck } from "lucide-react";

export function Logo(): React.JSX.Element {
  return (
    <div className="logo" aria-label="DIZMO">
      <span className="logo-mark">
        <ShieldCheck size={17} strokeWidth={2.4} />
      </span>
      <span className="logo-text">DIZMO</span>
    </div>
  );
}
