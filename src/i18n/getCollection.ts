import { getCollection as astroGetCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'
import type { Locale } from './utils'

// ---------------------------------------------------------------------------
// Supported collection names that carry a `lang` discriminator field.
// ---------------------------------------------------------------------------

type LocalizedCollectionName = 'projects' | 'services'

// ---------------------------------------------------------------------------
// getLocalizedCollection
//
// Wraps Astro's `getCollection()` and filters entries by the requested locale.
// Only entries whose `data.lang` matches `lang` are returned, keeping
// consumer code free from manual filter calls.
//
// Usage:
//   const projects = await getLocalizedCollection('projects', 'es')
//   const services = await getLocalizedCollection('services', lang)
// ---------------------------------------------------------------------------

export async function getLocalizedCollection<T extends LocalizedCollectionName>(
  collection: T,
  lang: Locale,
): Promise<CollectionEntry<T>[]> {
  const all = await astroGetCollection(collection)
  return (all as CollectionEntry<T>[]).filter(
    (entry) => (entry.data as { lang: Locale }).lang === lang,
  )
}
