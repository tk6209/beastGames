// Staged only. Inventory must be fetched by the trusted server for the verified JWT subject.
export type OwnedCard = { user_id: string; card_key: string; quantity: number; card_data: Record<string, unknown> };
export function resolveCanonicalDeck(uid: string, requested: unknown, rows: readonly OwnedCard[]): Record<string, unknown>[] | null {
  if (!uid || !Array.isArray(requested) || requested.length !== 10) return null;
  const owned = new Map<string, OwnedCard>();
  for (const row of rows) {
    if (row.user_id !== uid || typeof row.card_key !== 'string' || !row.card_key || owned.has(row.card_key) ||
        !Number.isSafeInteger(row.quantity) || row.quantity < 1 || !row.card_data ||
        typeof row.card_data !== 'object' || Array.isArray(row.card_data)) return null;
    owned.set(row.card_key, row);
  }
  const counts = new Map<string, number>();
  const deck: Record<string, unknown>[] = [];
  for (const key of requested) {
    if (typeof key !== 'string' || key.length > 128) return null;
    const card = owned.get(key);
    const count = (counts.get(key) ?? 0) + 1;
    if (!card || count > 2 || count > card.quantity) return null;
    counts.set(key, count);
    deck.push({ ...structuredClone(card.card_data), card_key: key });
  }
  return deck;
}
