/** One entry of `public/data.json`: a Chinese name and its four-letter code. */
export type WordEntry = readonly [name: string, code: string]

/** Per-letter verdict, following the original Wordle colouring. */
export type LetterState = 'correct' | 'present' | 'absent'

/** Colour strength, weakest first; used to decide a key's colour. */
export const STATE_RANK: Record<LetterState, number> = {
  absent: 0,
  present: 1,
  correct: 2,
}

/** Width of the code, in letters. */
export const CODE_LENGTH = 4

/** Number of allowed submissions. */
export const MAX_GUESSES = 4

/** A single letter tile of one submitted guess. */
export interface Tile {
  letter: string
  /**
   * The Chinese character standing at this position, revealed only where the
   * letter already matches the answer — otherwise the mapping stays hidden.
   */
  char: string | null
  state: LetterState
}

/** One submitted guess: the raw letters, the tile verdicts, and the name typed. */
export interface Guess {
  code: string
  name: string
  tiles: Tile[]
}

export interface Evaluation {
  tiles: Tile[]
  /** `true` when every letter is in its place. */
  solved: boolean
}
