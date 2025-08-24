type Item = {
  sku: string;
  qty: number;
  price: number;
};

export function generateRandomItems(count?: number): Item[] {
  const itemCount = count ?? Math.floor(Math.random() * 5) + 1; // losowo 1–5, jeśli brak count
  const items: Item[] = [];

  for (let i = 0; i < itemCount; i++) {
    const sku = `SKU-DEMO${i + 1}`;
    const qty = Math.floor(Math.random() * 5) + 1; // 1–5 sztuk
    const price = parseFloat((Math.random() * 100).toFixed(2)); // 0.00 – 100.00 zł

    items.push({ sku, qty, price });
  }

  return items;
}
