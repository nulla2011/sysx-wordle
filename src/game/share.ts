import type { Guess } from './types'

/** One square per letter verdict, Wordle-style. */
const SQUARES: Record<string, string> = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
}

const HIDDEN = '⬜'

export interface ShareOptions {
  /** Wins are reported by guess count; losses as a plain failure. */
  solved: boolean
  guessCount: number
  maxGuesses: number
  /** Appended so the recipient can play the same puzzle. */
  url?: string
}

/**
 * The shareable result: plain text plus emoji, never the answer itself.
 *
 * ```
 * 字母 Wordle 3/4
 *
 * ⬛🟩⬛⬛
 * 🟨⬛⬛🟨
 * 🟩🟩🟩🟩
 * ```
 */
export function buildShareText(
  guesses: readonly Guess[],
  { solved, guessCount, maxGuesses, url }: ShareOptions,
): string {
  const score = solved ? `${guessCount}/${maxGuesses}` : `X/${maxGuesses}`
  const lines = [`字母 Wordle ${score}`, '']

  for (const guess of guesses) {
    lines.push(guess.tiles.map((tile) => SQUARES[tile.state] ?? HIDDEN).join(''))
  }
  if (url) {
    lines.push('', url)
  }
  return lines.join('\n')
}

/** Copy `text`, preferring the async clipboard and falling back to a selection. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Older browsers, or a non-secure context. Fall through to the legacy path.
  }
  return copyWithSelection(text)
}

/**
 * The deprecated path, kept for browsers without the async clipboard. The text
 * is fully selected first, so a rejected `execCommand` still leaves the player
 * one copy keystroke away.
 */
function copyWithSelection(text: string): boolean {
  if (typeof document === 'undefined') return false

  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.top = '0'
  area.style.opacity = '0'
  document.body.appendChild(area)

  try {
    area.select()
    area.setSelectionRange(0, text.length)
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(area)
  }
}

export interface ShareOutcome {
  ok: boolean
  /** How the text left the page, for the confirmation message. */
  method: 'share' | 'clipboard' | 'none'
}

/**
 * Hand the result to the platform: the native share sheet where the Web Share
 * API is available (phones), a clipboard copy everywhere else (desktop).
 */
export async function shareResult(text: string, title: string): Promise<ShareOutcome> {
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean }
  const data: ShareData = { title, text }

  // if (typeof nav.share === 'function' && (typeof nav.canShare !== 'function' || nav.canShare(data))) {
  //   try {
  //     await nav.share(data)
  //     return { ok: true, method: 'share' }
  //   } catch (error) {
  //     // A dismissed share sheet is not a failure worth reporting.
  //     if (error instanceof DOMException && error.name === 'AbortError') {
  //       return { ok: true, method: 'share' }
  //     }
  //     // Anything else: fall back to copying.
  //   }
  // }

  const copied = await copyText(text)
  return { ok: copied, method: copied ? 'clipboard' : 'none' }
}
