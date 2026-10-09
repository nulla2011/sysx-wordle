<script setup lang="ts">
import { Share2 } from '@lucide/vue'
import { buildShareText, shareResult } from '../game/share'
import type { Guess } from '../game/types'

const props = withDefaults(
  defineProps<{
    guesses: Guess[]
    solved: boolean
    maxGuesses: number
    /** Shared alongside the grid so the recipient can play the same puzzle. */
    url?: string
  }>(),
  { url: '' },
)

const emit = defineEmits<{ (event: 'done', message: string): void }>()

async function onShare() {
  const text = buildShareText(props.guesses, {
    solved: props.solved,
    guessCount: props.guesses.length,
    maxGuesses: props.maxGuesses,
    url: props.url || undefined,
  })

  const outcome = await shareResult(text, '字母 Wordle')
  if (outcome.method === 'clipboard') {
    emit('done', '成绩已复制到剪贴板')
  } else if (outcome.method === 'none') {
    emit('done', '分享失败，请手动复制')
  } else {
    emit('done', '已打开分享')
  }
}
</script>

<template>
  <button type="button" class="share" aria-label="分享成绩" @click="onShare">
    <Share2 class="icon" :size="16" :stroke-width="2.2" aria-hidden="true" />
    <span>分享成绩</span>
  </button>
</template>

<style scoped>
.share {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-h);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.share:hover {
  border-color: var(--tile-border-filled);
  background: var(--panel-bg);
}

.icon {
  flex: none;
}
</style>
