import bcrypt from 'bcryptjs'

/**
 * Hashing password, unico punto dell'applicazione.
 *
 * Prima il costo era 10 in registrazione e reset e 12 nel checkout: gli account
 * risultavano protetti diversamente a seconda di dove erano stati creati.
 * Il costo e' ora uniforme. Gli hash esistenti restano validi: bcrypt memorizza
 * il costo nell'hash, quindi la verifica funziona anche per quelli a costo 10.
 */
const BCRYPT_COST = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
