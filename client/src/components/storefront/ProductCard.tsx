import { formatMoney } from "@/lib/format";
import type { Product } from "@shared/commerce/types";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Link } from "wouter";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const image = product.images[0];
  const productKind = product.productType || "Livre";

  return (
    <article className="group animate-rise" style={{ animationDelay: `${index * 65}ms` }}>
      <Link href={`/livres/${product.handle}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BC3B2C] rounded-2xl">
        <div className="relative mb-5 aspect-[3/4] overflow-hidden rounded-2xl bg-[#E9DFCF] shadow-[0_16px_32px_-12px_rgba(20,30,51,0.18)] ring-1 ring-[#141E33]/08 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:shadow-[0_24px_48px_-10px_rgba(20,30,51,0.28)]">
          {image?.url ? (
            <img
              src={image.url}
              alt={image.altText || `Couverture de ${product.title}`}
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#F6F1E7,#E9DFCF)]">
              <BookOpen className="h-10 w-10 text-[#141E33]/30" strokeWidth={1.2} />
            </div>
          )}
          <span className="glass-pill absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full text-[#141E33] opacity-0 shadow-md backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-105 border border-white/80">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#BC3B2C]">
          {productKind}
        </p>
        <h3 className="font-display text-[25px] leading-[1.05] text-[#141E33] transition-colors duration-300 group-hover:text-[#BC3B2C]">
          {product.title}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[#5C574C]">
          <span className="truncate">{product.vendor || "Édition indépendante"}</span>
          <span className="shrink-0 font-bold text-[#141E33]">
            {formatMoney(product.priceRange.min)}
          </span>
        </div>
      </Link>
    </article>
  );
}
