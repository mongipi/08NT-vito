'use server'
import { revalidatePath } from 'next/cache'
import { parseFormData } from '@/lib/validation/form'
import { userRoleSchema } from '@/lib/validation/admin'
import { setUserRole } from '@/services/users'

export async function updateUserRole(formData: FormData) {
  const { id, role } = parseFormData(userRoleSchema, formData)
  await setUserRole(id, role)
  revalidatePath(`/admin/utenti/${id}`)
  revalidatePath('/admin/utenti')
}
