'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(formData: FormData) {
  const id = formData.get('id') as string
  const role = formData.get('role') as 'consumer' | 'b2b' | 'admin'
  await prisma.user.update({ where: { id }, data: { role } })
  revalidatePath(`/admin/utenti/${id}`)
  revalidatePath('/admin/utenti')
}
