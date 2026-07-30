export type MethodFeatureCard = {
  id: string
  icon: string
  title: string
  body: string
}

export type MethodStep = {
  id: string
  n: string
  title: string
  body: string
}

export type MethodFormula = {
  id: string
  line: string
  name: string
  body: string
  href?: string
}

export type MethodPanel = {
  title: string
  paragraphs: string[]
  items: string[]
}

export type MethodPageContent = {
  hero: {
    eyebrow: string
    title: string
    body: string
    ctaLabel: string
    ctaHref: string
    imageSrc: string
    imageAlt: string
  }
  promise: {
    eyebrow: string
    title: string
    body: string
    panel1: MethodPanel
    panel2: MethodPanel
  }
  values: {
    eyebrow: string
    title: string
    body: string
    cards: MethodFeatureCard[]
  }
  difference: {
    eyebrow: string
    title: string
    body: string
    steps: MethodStep[]
  }
  positioning: {
    audience: {
      eyebrow: string
      title: string
      paragraphs: string[]
      items: string[]
    }
    madeInItaly: {
      eyebrow: string
      title: string
      paragraphs: string[]
      items: string[]
    }
  }
  lineup: {
    eyebrow: string
    title: string
    body: string
    discoverLabel: string
    formulas: MethodFormula[]
  }
  vision: {
    title: string
    p1: string
    p2: string
    p3: string
    ctaPrimaryLabel: string
    ctaPrimaryHref: string
    ctaSecondaryLabel: string
    ctaSecondaryHref: string
  }
}

export const DEFAULT_METHOD_PAGE_CONTENT: MethodPageContent = {
  hero: {
    eyebrow: 'Qualità 08',
    title: "L'**Eccellenza**\ncome Standard.",
    body: 'Non volevamo semplicemente realizzare degli integratori, ma dare vita a prodotti sviluppati con passione, attenzione e rispetto per le persone che ogni giorno ripongono la loro fiducia in noi.',
    ctaLabel: 'Scopri le formule',
    ctaHref: '/prodotti',
    imageSrc: '/v61/img/qualita08-hero-sunset-contact.png',
    imageAlt: 'Qualità 08 Natural Technology',
  },
  promise: {
    eyebrow: 'La nostra promessa',
    title: 'Qualità, innovazione\ne **fiducia.**',
    body: 'Dietro ogni formula ci sono ricerca, impegno e una scelta accurata degli ingredienti, perché crediamo che la qualità non sia un dettaglio, ma un valore fondamentale.',
    panel1: {
      title: 'Più di un marchio.',
      paragraphs: [
        'Per noi il benessere non è una semplice parola: è energia, equilibrio, serenità e qualità della vita. È qualcosa di prezioso che merita attenzione e cura.',
        'Per questo lavoriamo ogni giorno con lo stesso obiettivo: offrire prodotti che uniscano qualità, innovazione e fiducia, mettendo sempre la persona al centro di ogni scelta.',
      ],
      items: [
        'Formule sviluppate con attenzione.',
        'Ingredienti selezionati con cura.',
        'Comunicazione chiara e responsabile.',
        'Rispetto verso chi sceglie il nostro brand.',
      ],
    },
    panel2: {
      title: 'La promessa 08.',
      paragraphs: [
        'La qualità, per noi, non è solo un obiettivo: è un metodo.',
        'Ogni formula 08 Natural Technology viene sviluppata con attenzione alla composizione, alla selezione degli ingredienti e alla chiarezza delle informazioni.',
        'Vogliamo costruire un rapporto di fiducia attraverso prodotti curati, comunicazione trasparente e un’identità coerente con i valori del benessere quotidiano.',
      ],
      items: [
        'Processi chiari, pensati per garantire coerenza.',
        'Standard elevati, in ogni fase del percorso.',
        'Una visione orientata alla qualità, al valore e alla fiducia.',
        'Qualità percepita e sostanziale.',
      ],
    },
  },
  values: {
    eyebrow: 'I valori del benessere',
    title: 'Energia, equilibrio,\nserenità e qualità della vita.',
    body: 'Questi sono i concetti che guidano il linguaggio di 08 Natural Technology: non semplici integratori, ma prodotti pensati per accompagnare il benessere quotidiano con attenzione, qualità e rispetto.',
    cards: [
      {
        id: 'value-1',
        icon: '⚡',
        title: 'Energia',
        body: 'Il desiderio di sostenere la vitalità quotidiana, nei momenti in cui il corpo richiede maggiore attenzione.',
      },
      {
        id: 'value-2',
        icon: '⚖',
        title: 'Equilibrio',
        body: 'La ricerca di formule ordinate, sensate e coerenti con le reali esigenze della persona.',
      },
      {
        id: 'value-3',
        icon: '☾',
        title: 'Serenità',
        body: 'La fiducia di scegliere un prodotto curato, chiaro e sviluppato senza scorciatoie comunicative.',
      },
      {
        id: 'value-4',
        icon: '♡',
        title: 'Qualità della vita',
        body: 'Il benessere quotidiano come obiettivo: più consapevolezza, più cura, più attenzione ai dettagli.',
      },
    ],
  },
  difference: {
    eyebrow: 'Cosa ci rende diversi',
    title: 'Alta qualità e attenzione\n**sulle formule.**',
    body: 'Il posizionamento di 08 non nasce dal voler essere “un altro integratore”, ma dal desiderio di costruire prodotti curati, con formule pensate e ingredienti selezionati evitando materie prime di scarsa qualità.',
    steps: [
      {
        id: 'step-1',
        n: '01',
        title: 'Formula',
        body: 'Ogni prodotto nasce da una funzione precisa e da una scelta attenta degli attivi.',
      },
      {
        id: 'step-2',
        n: '02',
        title: 'Ingredienti',
        body: 'La selezione degli ingredienti è uno dei punti centrali dell’identità 08.',
      },
      {
        id: 'step-3',
        n: '03',
        title: 'Conservazione',
        body: 'Il vetro farmaceutico comunica protezione, qualità e maggiore attenzione alla conservazione.',
      },
      {
        id: 'step-4',
        n: '04',
        title: 'Persona',
        body: 'Il cliente non è un numero: ogni scelta deve trasmettere rispetto, cura e fiducia.',
      },
    ],
  },
  positioning: {
    audience: {
      eyebrow: 'A chi ci rivolgiamo',
      title: 'Per chi riconosce il valore della qualità.',
      paragraphs: [
        '08 Natural Technology si rivolge a chi cerca integratori alimentari curati, chiari e sviluppati con una logica formulativa precisa.',
        'Ogni prodotto nasce per accompagnare il benessere quotidiano con attenzione, coerenza e rispetto verso chi sceglie il brand.',
      ],
      items: [
        'Persone che cercano prodotti affidabili e riconoscibili.',
        'Chi desidera formule curate e facili da comprendere.',
        'Chi vuole scegliere con maggiore consapevolezza.',
      ],
    },
    madeInItaly: {
      eyebrow: 'Made in Italy',
      title: 'Un valore centrale, non una decorazione.',
      paragraphs: [
        'Il Made in Italy rappresenta un elemento distintivo dell’identità di 08 Natural Technology.',
        'Ogni prodotto nasce in Italia, in un contesto orientato alla qualità, alla cura del dettaglio e alla coerenza del brand.',
        'Più che un semplice riferimento d’origine, è un valore che accompagna il progetto e ne rafforza l’affidabilità.',
      ],
      items: [
        'Identità italiana riconoscibile.',
        'Qualità e coerenza in ogni scelta.',
        'Un’origine che valorizza il prodotto.',
        'Un approccio fondato su fiducia e credibilità.',
      ],
    },
  },
  lineup: {
    eyebrow: 'Linea prodotti',
    title: 'Le nostre formule,\nin continuo sviluppo.',
    body: '08 è all’inizio del proprio percorso. Lo 0 rappresenta la nascita del progetto, l’8 rappresenta la volontà di crescere, migliorare e ampliare la linea nel tempo.',
    discoverLabel: 'Scopri',
    formulas: [
      {
        id: 'formula-1',
        line: 'Linea beauty',
        name: 'Capelli, Pelle & Unghie',
        body: 'Formula dedicata con attivi selezionati ed estratti secchi naturali per capelli, pelle e unghie.',
        href: '/prodotti/capelli-pelle-unghie',
      },
      {
        id: 'formula-2',
        line: 'Linea donna',
        name: 'MenoPausa Complex',
        body: 'Supporto nutrizionale, con estratti secchi naturali, per il benessere femminile, azione giorno e notte.',
        href: '/prodotti/menopausa-complex',
      },
      {
        id: 'formula-3',
        line: 'Linea microcircolo',
        name: 'Microcircolo Superior',
        body: 'Formula pensata per il microcircolo e il drenaggio dei liquidi nelle zone periferiche.',
        href: '/prodotti/microcircolo-superior',
      },
      {
        id: 'formula-4',
        line: 'Linea energia',
        name: 'Multivitaminico & Minerali',
        body: 'Formula dedicata per supportare energia, vitalità, benessere quotidiano e stress ossidativo.',
        href: '/prodotti/multivitaminico-minerali',
      },
      {
        id: 'formula-5',
        line: 'In arrivo',
        name: 'Magnesio NP3',
        body: 'Neuro Performance 3: nuova formula in sviluppo.',
      },
    ],
  },
  vision: {
    title: 'Vision.',
    p1: "L’**Eccellenza come Standard** è il principio che definisce la visione di 08 Natural Technology.",
    p2: 'Un modo di intendere il benessere che parte dalla qualità, dalla coerenza e dalla cura di ogni dettaglio, con l’obiettivo di costruire un’identità riconoscibile e duratura.',
    p3: 'Ogni formula diventa parte di un progetto più ampio: creare prodotti affidabili, curati e distintivi, pensati per accompagnare il quotidiano con serietà e valore.',
    ctaPrimaryLabel: 'Scopri i prodotti',
    ctaPrimaryHref: '/prodotti',
    ctaSecondaryLabel: 'Contattaci',
    ctaSecondaryHref: '/contatti',
  },
}

export function normalizeMethodPageContent(
  raw: string | undefined,
  fallback: MethodPageContent = DEFAULT_METHOD_PAGE_CONTENT
) {
  if (!raw?.trim()) return fallback

  try {
    const parsed = JSON.parse(raw)
    return {
      hero: { ...fallback.hero, ...(parsed?.hero ?? {}) },
      promise: {
        ...fallback.promise,
        ...(parsed?.promise ?? {}),
        panel1: {
          ...fallback.promise.panel1,
          ...(parsed?.promise?.panel1 ?? {}),
          paragraphs: normalizeStringArray(parsed?.promise?.panel1?.paragraphs, fallback.promise.panel1.paragraphs),
          items: normalizeStringArray(parsed?.promise?.panel1?.items, fallback.promise.panel1.items),
        },
        panel2: {
          ...fallback.promise.panel2,
          ...(parsed?.promise?.panel2 ?? {}),
          paragraphs: normalizeStringArray(parsed?.promise?.panel2?.paragraphs, fallback.promise.panel2.paragraphs),
          items: normalizeStringArray(parsed?.promise?.panel2?.items, fallback.promise.panel2.items),
        },
      },
      values: {
        ...fallback.values,
        ...(parsed?.values ?? {}),
        cards: normalizeCards(parsed?.values?.cards, fallback.values.cards),
      },
      difference: {
        ...fallback.difference,
        ...(parsed?.difference ?? {}),
        steps: normalizeSteps(parsed?.difference?.steps, fallback.difference.steps),
      },
      positioning: {
        audience: {
          ...fallback.positioning.audience,
          ...(parsed?.positioning?.audience ?? {}),
          paragraphs: normalizeStringArray(
            parsed?.positioning?.audience?.paragraphs,
            fallback.positioning.audience.paragraphs
          ),
          items: normalizeStringArray(parsed?.positioning?.audience?.items, fallback.positioning.audience.items),
        },
        madeInItaly: {
          ...fallback.positioning.madeInItaly,
          ...(parsed?.positioning?.madeInItaly ?? {}),
          paragraphs: normalizeStringArray(
            parsed?.positioning?.madeInItaly?.paragraphs,
            fallback.positioning.madeInItaly.paragraphs
          ),
          items: normalizeStringArray(
            parsed?.positioning?.madeInItaly?.items,
            fallback.positioning.madeInItaly.items
          ),
        },
      },
      lineup: {
        ...fallback.lineup,
        ...(parsed?.lineup ?? {}),
        formulas: normalizeFormulas(parsed?.lineup?.formulas, fallback.lineup.formulas),
      },
      vision: { ...fallback.vision, ...(parsed?.vision ?? {}) },
    }
  } catch {
    return fallback
  }
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback
  const next = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
  return next.length > 0 ? next : fallback
}

function normalizeCards(value: unknown, fallback: MethodFeatureCard[]) {
  if (!Array.isArray(value)) return fallback
  const next = value
    .map((item, index) => ({
      id: typeof item?.id === 'string' && item.id.trim() ? item.id.trim() : `value-${index + 1}`,
      icon: typeof item?.icon === 'string' ? item.icon.trim() : '',
      title: typeof item?.title === 'string' ? item.title.trim() : '',
      body: typeof item?.body === 'string' ? item.body.trim() : '',
    }))
    .filter((item) => item.title && item.body)
  return next.length > 0 ? next : fallback
}

function normalizeSteps(value: unknown, fallback: MethodStep[]) {
  if (!Array.isArray(value)) return fallback
  const next = value
    .map((item, index) => ({
      id: typeof item?.id === 'string' && item.id.trim() ? item.id.trim() : `step-${index + 1}`,
      n: typeof item?.n === 'string' && item.n.trim() ? item.n.trim() : `0${index + 1}`,
      title: typeof item?.title === 'string' ? item.title.trim() : '',
      body: typeof item?.body === 'string' ? item.body.trim() : '',
    }))
    .filter((item) => item.title && item.body)
  return next.length > 0 ? next : fallback
}

function normalizeFormulas(value: unknown, fallback: MethodFormula[]) {
  if (!Array.isArray(value)) return fallback
  const next = value
    .map((item, index) => ({
      id: typeof item?.id === 'string' && item.id.trim() ? item.id.trim() : `formula-${index + 1}`,
      line: typeof item?.line === 'string' ? item.line.trim() : '',
      name: typeof item?.name === 'string' ? item.name.trim() : '',
      body: typeof item?.body === 'string' ? item.body.trim() : '',
      href: typeof item?.href === 'string' && item.href.trim() ? item.href.trim() : undefined,
    }))
    .filter((item) => item.name && item.body)
  return next.length > 0 ? next : fallback
}
