type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-[#141E33] shadow-xs"
      >
        <i className="absolute h-4 w-5 -translate-y-1 rounded-[5px_9px_5px_9px] border border-[#F6F1E7]" />
        <i className="absolute h-4 w-5 translate-x-1 translate-y-1 rounded-[5px_9px_5px_9px] border border-[#BC3B2C]" />
      </span>
      {!compact && (
        <span className="font-display text-[15px] leading-none tracking-[0.12em] text-[#141E33]">
          L’ATELIER <em className="not-italic text-[#BC3B2C]">DES PAGES</em>
        </span>
      )}
    </div>
  );
}
