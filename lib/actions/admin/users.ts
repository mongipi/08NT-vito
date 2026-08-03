'use server'
import { revalidatePath } from 'next/cache'
import { setUserRole } from '@/services/users'
import { isRole, ROLES } from '@/lib/domain/roles'

export async function updateUserRole(formData: FormData) {
  const id = formData.get('id') as string
  const role = formData.get('role') as string

  // Il ruolo arriva da una form: va validato contro l'enum prima di scriverlo.
  if (!isRole(role)) {
    throw new Error(`Ruolo non valido: "${role}". Ammessi: ${ROLES.join(', ')}`)
  }

  await setUserRole(id, role)
  revalidatePath(`/admin/utenti/${id}`)
  revalidatePath('/admin/utenti')
}
