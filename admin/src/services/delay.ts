export async function mockDelay(ms = 180): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
