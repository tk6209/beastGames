import { resolveCanonicalDeck, type OwnedCard } from './canonicalDeck';

// Staged only. Both sources must be fetched by the server, never from request JSON.
export type ActiveCard = { card_key: string; active: boolean; card_data: Record<string, unknown> };
export type InventoryQuantity = Pick<OwnedCard, 'user_id' | 'card_key' | 'quantity'>;

export function resolveActiveCatalogDeck(
  uid: string, requested: unknown,
  inventory: readonly InventoryQuantity[],
  catalog: readonly ActiveCard[]
): Record<string, unknown>[] | null {
  try {
    if (!uid || !Array.isArray(requested) || requested.length !== 10 ||
        !Array.isArray(inventory) || !Array.isArray(catalog)) return null;
    const definitions = new Map<string, ActiveCard>();
    for (const card of catalog) {
      if (!card || typeof card.card_key !== 'string' || !card.card_key ||
          card.card_key.length > 128 || definitions.has(card.card_key) ||
          typeof card.active !== 'boolean') return null;
      definitions.set(card.card_key, card);
    }
    const wanted = new Set<string>();
    for (const key of requested) {
      if (typeof key !== 'string' || !key || key.length > 128) return null;
      wanted.add(key);
    }
    const rows: OwnedCard[] = [];
    const seen = new Set<string>();
    for (const row of inventory) {
      if (!row || row.user_id !== uid || typeof row.card_key !== 'string' ||
          !row.card_key || seen.has(row.card_key) ||
          !Number.isSafeInteger(row.quantity) || row.quantity < 0) return null;
      seen.add(row.card_key);
      if (!wanted.has(row.card_key)) continue;
      const definition = definitions.get(row.card_key);
      if (!definition || !definition.active || !definition.card_data ||
          typeof definition.card_data !== 'object' || Array.isArray(definition.card_data) ||
          ![Object.prototype, null].includes(Object.getPrototypeOf(definition.card_data))) return null;
      rows.push({ user_id: uid, card_key: row.card_key, quantity: row.quantity,
        card_data: definition.card_data });
    }
    return resolveCanonicalDeck(uid, requested, rows);
  } catch {
    // Malformed sources or clone failures must never authorize a deck.
    return null;
  }
}
