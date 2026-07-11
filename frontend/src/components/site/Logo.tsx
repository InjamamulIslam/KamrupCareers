import logoAsset from "@/assets/logo.jpeg";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={logoAsset}
        alt="KamrupCareers logo"
        width={40}
        height={40}
        className="h-9 w-9 rounded-lg object-cover"
      />
      <div className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-bold tracking-tight">
          <span className="text-[#155EEF]">Kamrup</span>
          <span className="text-[#16B364]">Careers</span>
        </span>
        <span className="mt-0.5 text-[10px] font-medium text-muted-foreground">
          Connecting Talent with Opportunity
        </span>
      </div>
    </div>
  );
}
