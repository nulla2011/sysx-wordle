<script setup lang="ts">
import { computed } from 'vue'
import type { Guess } from '../game/types'

const props = defineProps<{
  guesses: Guess[]
}>()

/** The newest submission is the one worth reading in full. */
const latest = computed<Guess | null>(() => props.guesses[props.guesses.length - 1] ?? null)

/** Every letter of the latest guess, paired with the character it stood for. */
const pairs = computed(() =>
  (latest.value?.tiles ?? []).map((tile) => ({
    letter: tile.letter,
    char: tile.char,
    state: tile.state,
  })),
)
</script>

<template>
  <section v-if="latest" class="mapping" aria-live="polite">
    <header class="head">
      <h2>第 {{ guesses.length }} 步 · 字母 ⇄ 汉字对照</h2>
      <p class="name">{{ latest.name }}</p>
    </header>

    <ul class="pairs">
      <li v-for="(pair, index) in pairs" :key="index" class="pair">
        <span class="slot">{{ index + 1 }}</span>
        <span class="letter">{{ pair.letter }}</span>
        <span class="arrow" aria-hidden="true">⇄</span>
        <span class="char">{{ pair.char ?? '？' }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.mapping {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  padding: 14px 18px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--panel-bg);
}

.head {
  text-align: center;
}

.head h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text-h);
}

.name {
  margin-top: 3px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text-h);
}

.pairs {
  display: flex;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pair {
  position: relative;
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-items: center;
  gap: 0 6px;
  min-width: 72px;
  padding: 6px 10px 8px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
}

.slot {
  position: absolute;
  top: 2px;
  left: 4px;
  font-size: 10px;
  color: var(--text);
  opacity: 0.7;
}

.letter {
  grid-column: 1;
  font-family: var(--mono);
  font-size: 19px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-h);
}

.arrow {
  grid-column: 2;
  font-size: 12px;
  color: var(--text);
  opacity: 0.65;
}

.char {
  grid-column: 1 / -1;
  margin-top: 2px;
  font-size: 17px;
  line-height: 1.2;
  color: var(--text-h);
}

@media (max-width: 480px) {
  .pairs {
    gap: 6px;
  }

  .pair {
    min-width: 62px;
    padding: 6px 6px 8px;
  }
}
</style>
