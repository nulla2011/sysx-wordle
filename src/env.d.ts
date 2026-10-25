/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Answer endpoint base URL from `.env`, e.g. `https://…/wordle`. */
  readonly VITE_ANSWER_API?: string
}
