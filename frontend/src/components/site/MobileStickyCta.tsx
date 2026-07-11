import { Link } from "@tanstack/react-router";
import { FileUp } from "lucide-react";

export function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/90 p-3 backdrop-blur md:hidden">
      <Link
        to="/submit-resume"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand py-3.5 text-sm font-semibold text-white shadow-float"
      >
        <FileUp className="h-4 w-4" />
        Submit Your CV — It's Free
      </Link>
    </div>
  );
}
