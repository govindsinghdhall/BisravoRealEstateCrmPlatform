function normalizeKey(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

/** Merge API + built-in defaults; preserve legacy edit values not in either list. */
export function mergeLookupOptions(
  defaults: readonly string[],
  saved: readonly string[] = [],
  legacyValue?: string | null,
): string[] {
  const seen = new Set<string>()
  const merged: string[] = []

  const add = (value?: string | null) => {
    if (!value?.trim()) return
    const trimmed = value.trim().replace(/\s+/g, ' ')
    const key = normalizeKey(trimmed)
    if (seen.has(key)) return
    seen.add(key)
    merged.push(trimmed)
  }

  for (const value of saved) add(value)
  for (const value of defaults) add(value)
  add(legacyValue)

  return merged.sort((a, b) => a.localeCompare(b))
}
