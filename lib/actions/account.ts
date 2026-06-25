'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateUserInfo(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name:        (formData.get('name') as string) || null,
      phone:       (formData.get('phone') as string) || null,
      fiscalCode:  (formData.get('fiscalCode') as string) || null,
      company:     (formData.get('company') as string) || null,
      vatNumber:   (formData.get('vatNumber') as string) || null,
      pec:         (formData.get('pec') as string) || null,
      sdiCode:     (formData.get('sdiCode') as string) || null,
    },
  })

  revalidatePath('/account')
  revalidatePath('/account/profilo')
  redirect('/account/profilo?saved=1')
}

export async function createAddress(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const isDefault = formData.get('isDefault') === 'on'

  if (isDefault) {
    await prisma.userAddress.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    })
  }

  await prisma.userAddress.create({
    data: {
      userId:     session.user.id,
      label:      (formData.get('label') as string) || null,
      isDefault,
      firstName:  formData.get('firstName') as string,
      lastName:   formData.get('lastName') as string,
      company:    (formData.get('company') as string) || null,
      vatNumber:  (formData.get('vatNumber') as string) || null,
      fiscalCode: (formData.get('fiscalCode') as string) || null,
      address:    formData.get('address') as string,
      city:       formData.get('city') as string,
      postalCode: formData.get('postalCode') as string,
      province:   (formData.get('province') as string) || null,
      country:    (formData.get('country') as string) || 'IT',
      phone:      (formData.get('phone') as string) || null,
    },
  })

  revalidatePath('/account/profilo')
  redirect('/account/profilo')
}

export async function updateAddress(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const id = formData.get('id') as string
  const existing = await prisma.userAddress.findUnique({ where: { id } })
  if (!existing || existing.userId !== session.user.id) redirect('/account/profilo')

  const isDefault = formData.get('isDefault') === 'on'

  if (isDefault) {
    await prisma.userAddress.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    })
  }

  await prisma.userAddress.update({
    where: { id },
    data: {
      label:      (formData.get('label') as string) || null,
      isDefault,
      firstName:  formData.get('firstName') as string,
      lastName:   formData.get('lastName') as string,
      company:    (formData.get('company') as string) || null,
      vatNumber:  (formData.get('vatNumber') as string) || null,
      fiscalCode: (formData.get('fiscalCode') as string) || null,
      address:    formData.get('address') as string,
      city:       formData.get('city') as string,
      postalCode: formData.get('postalCode') as string,
      province:   (formData.get('province') as string) || null,
      country:    (formData.get('country') as string) || 'IT',
      phone:      (formData.get('phone') as string) || null,
    },
  })

  revalidatePath('/account/profilo')
  redirect('/account/profilo')
}

export async function deleteAddress(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const id = formData.get('id') as string
  const existing = await prisma.userAddress.findUnique({ where: { id } })
  if (!existing || existing.userId !== session.user.id) redirect('/account/profilo')

  await prisma.userAddress.delete({ where: { id } })

  revalidatePath('/account/profilo')
  redirect('/account/profilo')
}

export async function setDefaultAddress(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const id = formData.get('id') as string
  const existing = await prisma.userAddress.findUnique({ where: { id } })
  if (!existing || existing.userId !== session.user.id) return

  await prisma.userAddress.updateMany({
    where: { userId: session.user.id },
    data: { isDefault: false },
  })
  await prisma.userAddress.update({ where: { id }, data: { isDefault: true } })

  revalidatePath('/account/profilo')
}
