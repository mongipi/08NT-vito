/**
 * Elimina dalla tabella `Setting` le righe la cui chiave non è più in SETTING_KEYS,
 * cioè i residui dei campi rimossi dalla pagina /admin/impostazioni.
 *
 * Dry-run (default):  npx tsx scripts/cleanup-orphan-settings.ts
 * Esecuzione reale:   npx tsx scripts/cleanup-orphan-settings.ts --confirm
 */
import { PrismaClient } from '@prisma/client'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { SETTING_KEYS } from '../lib/settings'

const prisma = new PrismaClient()

async function main() {
  const confirm = process.argv.includes('--confirm')
  const activeKeys = new Set<string>(Object.values(SETTING_KEYS))

  const rows = await prisma.setting.findMany({ select: { key: true, value: true } })
  const orphans = rows.filter((row) => !activeKeys.has(row.key))

  console.log(`Righe in Setting: ${rows.length} (${activeKeys.size} chiavi attive)`)

  if (orphans.length === 0) {
    console.log('Nessuna riga orfana. Niente da fare.')
    return
  }

  console.log(`\nRighe orfane da eliminare: ${orphans.length}`)
  for (const row of orphans) {
    const preview = row.value.replace(/\s+/g, ' ').slice(0, 60)
    console.log(`  - ${row.key}  →  ${preview}${row.value.length > 60 ? '…' : ''}`)
  }

  if (!confirm) {
    console.log('\nDry-run: nessuna modifica applicata.')
    console.log('Per eliminarle davvero: npx tsx scripts/cleanup-orphan-settings.ts --confirm')
    return
  }

  const backupDir = join(process.cwd(), '.backups')
  mkdirSync(backupDir, { recursive: true })
  const backupFile = join(backupDir, `orphan-settings-${Date.now()}.json`)
  writeFileSync(backupFile, JSON.stringify(orphans, null, 2), 'utf8')
  console.log(`\nBackup salvato in ${backupFile}`)

  const result = await prisma.setting.deleteMany({
    where: { key: { in: orphans.map((row) => row.key) } },
  })
  console.log(`Eliminate ${result.count} righe.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
