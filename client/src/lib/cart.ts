export function getNextCartQuantity(quantity: number, delta: number): number {
  return Math.max(0, quantity + delta);
}

export function canProceedToCheckout(itemCount: number, checkoutUrl?: string | null): boolean {
  return itemCount > 0 && Boolean(checkoutUrl);
}
