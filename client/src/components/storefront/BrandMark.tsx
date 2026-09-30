type BrandMarkProps = {
  compact?: boolean;
  className?: string;
};

export function BrandMark({ compact = false, className = "" }: BrandMarkProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/H-BUSINESS-SUCCESS.png"
        alt="H-BUSINESS-SUCCESS"
        className={compact ? "h-8 w-auto object-contain" : "h-9 md:h-10 w-auto object-contain drop-shadow-xs"}
      />
    </div>
  );
}
