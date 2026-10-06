<script setup lang="ts">
import { computed } from 'vue'
import type { LetterState } from '../game/types'

const props = defineProps<{
  letters: string
  keyStates: Record<string, LetterState>
  disabled: boolean
}>()

const emit = defineEmits<{
  (event: 'letter', letter: string): void
  (event: 'erase'): void
  (event: 'submit'): void
}>()

/** Split the alphabet of the word list across two rows, splitting near the middle. */
const rows = computed(() => {
  const all = [...props.letters]
  const half = Math.ceil(all.length / 2)
  return [all.slice(0, half), all.slice(half)]
})
</script>

<template>
  <div class="keyboard" :class="{ 'is-disabled': disabled }">
    <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="row">
      <button
        v-if="rowIndex === 1"
        type="button"
        class="key key-wide"
        :disabled="disabled"
        aria-label="提交"
        @click="emit('submit')"
      >
        提交
      </button>

      <button
        v-for="letter in row"
        :key="letter"
        type="button"
        class="key"
        :class="keyStates[letter] ? `is-${keyStates[letter]}` : ''"
        :disabled="disabled"
        @click="emit('letter', letter)"
      >
        {{ letter }}
      </button>

      <button
        v-if="rowIndex === 1"
        type="button"
        class="key key-wide"
        :disabled="disabled"
        aria-label="删除"
        @click="emit('erase')"
      >
        删除
      </button>
    </div>
  </div>
</template>

<style scoped>
.keyboard {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 520px;
  transition: opacity 0.2s ease;
}

.keyboard.is-disabled {
  opacity: 0.55;
}

.row {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.key {
  flex: 1 1 0;
  min-width: 0;
  height: 52px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: var(--key-bg);
  color: var(--text-h);
  font-family: var(--mono);
  font-size: 17px;
  font-weight: 700;
  text-transform: lowercase;
  cursor: pointer;
  transition:
    background-color 0.14s ease,
    transform 0.08s ease;
}

.key:disabled {
  cursor: default;
}

.key:not(:disabled):active {
  transform: scale(0.95);
}

.key-wide {
  flex: 1.6 1 0;
  font-family: var(--sans);
  font-size: 14px;
  letter-spacing: 0.04em;
}

.key.is-correct {
  background: var(--color-correct);
  color: #fff;
}

.key.is-present {
  background: var(--color-present);
  color: #fff;
}

.key.is-absent {
  background: var(--color-absent);
  color: #fff;
}

@media (max-width: 480px) {
  .key {
    height: 46px;
    font-size: 15px;
  }

  .key-wide {
    font-size: 12px;
  }
}
</style>
