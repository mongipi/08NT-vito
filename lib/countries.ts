export const COUNTRIES = [
  { code: 'IT', label: 'Italia' },
  { code: 'SM', label: 'San Marino' },
  { code: 'VA', label: 'Città del Vaticano' },
  { code: 'DE', label: 'Germania' },
  { code: 'FR', label: 'Francia' },
  { code: 'ES', label: 'Spagna' },
  { code: 'AT', label: 'Austria' },
  { code: 'CH', label: 'Svizzera' },
  { code: 'BE', label: 'Belgio' },
  { code: 'NL', label: 'Paesi Bassi' },
  { code: 'PT', label: 'Portogallo' },
  { code: 'GR', label: 'Grecia' },
  { code: 'PL', label: 'Polonia' },
  { code: 'SE', label: 'Svezia' },
  { code: 'NO', label: 'Norvegia' },
  { code: 'DK', label: 'Danimarca' },
  { code: 'FI', label: 'Finlandia' },
  { code: 'IE', label: 'Irlanda' },
  { code: 'CZ', label: 'Repubblica Ceca' },
  { code: 'SK', label: 'Slovacchia' },
  { code: 'HU', label: 'Ungheria' },
  { code: 'RO', label: 'Romania' },
  { code: 'BG', label: 'Bulgaria' },
  { code: 'HR', label: 'Croazia' },
  { code: 'SI', label: 'Slovenia' },
  { code: 'LT', label: 'Lituania' },
  { code: 'LV', label: 'Lettonia' },
  { code: 'EE', label: 'Estonia' },
  { code: 'LU', label: 'Lussemburgo' },
  { code: 'MT', label: 'Malta' },
  { code: 'CY', label: 'Cipro' },
  { code: 'GB', label: 'Regno Unito' },
  { code: 'US', label: 'Stati Uniti' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
  { code: 'OTHER', label: 'Altro paese' },
] as const

export type CountryCode = typeof COUNTRIES[number]['code']

export const DOMESTIC_COUNTRIES = ['IT', 'SM', 'VA'] as const

// Province delle isole italiane — solo Poste Italiane per i punti di ritiro
export const ISLAND_PROVINCES = [
  // Sicilia
  'AG','CL','CT','EN','ME','PA','RG','SR','TP',
  // Sardegna
  'CA','CI','MD','NU','OG','OR','OT','SS','SU','VS',
  // Isole minori (province di riferimento)
  'LI', // Elba → Livorno
] as const
