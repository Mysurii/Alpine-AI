export function getURLQueries(url = window.location.search): Record<string, string> {
  const urlSearchParams = new URLSearchParams(url)
  return Object.fromEntries(urlSearchParams.entries())
}
