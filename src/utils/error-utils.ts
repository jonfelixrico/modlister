export function isError(e: unknown): e is Error {
  if (typeof e !== 'object') {
    return false
  }

  return e instanceof Error
}
