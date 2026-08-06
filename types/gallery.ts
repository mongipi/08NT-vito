/** Immagine della galleria prodotto. Era ridichiarata identica in tre file. */
export type GallerySlideKind = 'front' | 'infographic' | 'composition' | 'back' | 'label'

export interface GallerySlide {
  src: string
  kind: GallerySlideKind
}
