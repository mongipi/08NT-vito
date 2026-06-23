import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const lines = [
    { slug: 'menopausa', name: 'Linea Menopausa', color: '#c94478', colorLight: '#fdf0f5' },
    { slug: 'beauty',    name: 'Linea Beauty',    color: '#7c2878', colorLight: '#f8f0f8' },
    { slug: 'circolo',   name: 'Linea Circolo',   color: '#405089', colorLight: '#eaecf5' },
    { slug: 'energia',   name: 'Linea Energia',   color: '#a86010', colorLight: '#faeedd' },
  ]

  for (const line of lines) {
    await prisma.line.upsert({
      where: { slug: line.slug },
      update: line,
      create: line,
    })
    console.log(`✓ ${line.name}`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
