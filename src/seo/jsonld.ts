export function buildPersonSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Hernán David Figueroa Cárdenas',
    jobTitle: 'Fullstack Developer',
    email: 'davshn@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bogota',
      addressCountry: 'CO',
    },
    sameAs: [
      'https://www.facebook.com/david.figueroa.184',
      'https://twitter.com/davshmr',
      'https://www.instagram.com/davidfigueroa9055',
      'https://github.com/davshn',
      'https://www.linkedin.com/in/davshn',
    ],
  }
}

export function buildWebSiteSchema(url: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'David Figueroa | Fullstack Developer',
    url,
    description:
      'Personal portfolio of David Figueroa — Fullstack Developer based in Bogota, Colombia with 6+ years of experience.',
  }
}
