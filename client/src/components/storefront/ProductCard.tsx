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
      <Link href={`/livres/${product.handle}`} className="block focus:outline-none">
        <div className="relative mb-5 aspect-[3/4] overflow-hidden rounded-sm bg-[#E7E0D4] shadow-[0_22px_38px_-29px_rgba(23,44,65,0.8)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_28px_45px_-25px_rgba(23,44,65,0.45)]">
          {image?.url ? (
            <img
              src={image.url}
              alt={image.altText || `Couverture de ${product.title}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#eee7db,#d8cfbf)]">
              <BookOpen className="h-10 w-10 text-[#172C41]/35" strokeWidth={1.2} />
            </div>
          )}
          <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[#F8F5EE] text-[#172C41] opacity-0 shadow-sm transition duration-200 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#C94E36]">
          {productKind}
        </p>
        <h3 className="font-display text-[25px] leading-[1.05] text-[#172C41] transition-colors group-hover:text-[#C94E36]">
          {product.title}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[#52606B]">
          <span className="truncate">{product.vendor || "Édition indépendante"}</span>
          <span className="shrink-0 font-semibold text-[#172C41]">
            {formatMoney(product.priceRange.min)}
          </span>
        </div>
      </Link>
    </article>
  );
}
