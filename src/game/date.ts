/** Local-time ISO date (`YYYY-MM-DD`) of a timestamp, matching the API's dates. */
export function beijingDate(timestamp: number): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  // const date = new Date(timestamp)
  // const month = `${date.getMonth() + 1}`.padStart(2, '0')
  // const day = `${date.getDate()}`.padStart(2, '0')
  // return `${date.getFullYear()}-${month}-${day}`
  return formatter.format(new Date(timestamp))
}

/** Today in the player's timezone — the daily puzzle's day. */
export function todayBeijing(): string {
  return beijingDate(Date.now())
}
