/** Last-write-wins on ISO updated_at timestamps. */
export function pickWinnerByUpdatedAt<T extends { updatedAt: string }>(local: T, remote: T): T {
  return remote.updatedAt > local.updatedAt ? remote : local;
}

/** True when remote should overwrite local. */
export function remoteIsNewer(localUpdatedAt: string, remoteUpdatedAt: string): boolean {
  return remoteUpdatedAt > localUpdatedAt;
}
