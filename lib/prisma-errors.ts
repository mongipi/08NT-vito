import { Prisma } from '@prisma/client'

export function isPrismaInitError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientInitializationError
    || (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P1001')
  )
}

export function logPrismaInitError(scope: string, error: unknown) {
  if (!isPrismaInitError(error)) return
  console.error(`[prisma-init:${scope}]`, error)
}
