type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[10px] bg-[#172C41]"
      >
        <i className="absolute h-4 w-5 -translate-y-1 rounded-[5px_9px_5px_9px] border border-[#F5F0E6]" />
        <i className="absolute h-4 w-5 translate-x-1 translate-y-1 rounded-[5px_9px_5px_9px] border border-[#C94E36]" />
      </span>
      {!compact && (
        <span className="font-display text-[15px] leading-none tracking-[0.12em] text-[#172C41]">
          L’ATELIER <em className="not-italic text-[#C94E36]">DES PAGES</em>
        </span>
      )}
    </div>
  );
}
