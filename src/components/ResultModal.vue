<script setup lang="ts">
import ShareResult from './ShareResult.vue'
import type { Guess } from '../game/types'

withDefaults(
  defineProps<{
    status: 'won' | 'lost'
    guesses: Guess[]
    maxGuesses: number
    /** Page link appended to the shared result. Never part of the grid. */
    shareUrl?: string
    /** Revealed only on a win. */
    answerCode?: string
    answerName?: string
  }>(),
  { shareUrl: '', answerCode: '', answerName: '' },
)

const emit = defineEmits<{
  (event: 'restart'): void
  (event: 'close'): void
  (event: 'shared', message: string): void
}>()
</script>

<template>
  <Transition name="fade">
    <div class="backdrop" @click.self="emit('close')">
      <div class="dialog" :class="`is-${status}`" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <p id="result-title" class="title">
          {{ status === 'won' ? '猜对了！' : '机会用完了' }}
        </p>

        <p class="answer" v-if="status === 'won'">
          <span class="code">{{ answerCode }}</span>
          <span class="arrow" aria-hidden="true">→</span>
          <span class="name">{{ answerName }}</span>
        </p>

        <p class="answer" v-else-if="answerName">
          <span class="name">{{ answerName }}</span>
        </p>

        <p class="meta" v-if="status === 'won'">
          第 {{ guesses.length }} / {{ maxGuesses }} 步成功
        </p>
        <p class="meta" v-else-if="answerName">
          答案是「{{ answerName }}」，{{ maxGuesses }} 步都没猜中
        </p>
        <p class="meta" v-else>试试分享你的成绩，看看别人要几步。</p>

        <div class="actions">
          <ShareResult
            :guesses="guesses"
            :solved="status === 'won'"
            :max-guesses="maxGuesses"
            :url="shareUrl"
            @done="emit('shared', $event)"
          />
          <button type="button" class="ghost" @click="emit('close')">关闭</button>
          <button type="button" class="again" @click="emit('restart')">
            {{ status === 'won' ? '再来一局' : '重试' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(8, 6, 13, 0.55);
  backdrop-filter: blur(2px);
}

.dialog {
  width: min(340px, 100%);
  padding: 24px;
  border: 2px solid var(--border);
  border-radius: 14px;
  background: var(--bg);
  box-shadow: var(--shadow);
  text-align: center;
  animation: rise 0.24s ease;
}

.dialog.is-won {
  border-color: var(--color-correct);
}

.dialog.is-lost {
  border-color: var(--color-present);
}

.title {
  font-size: 19px;
  font-weight: 700;
  color: var(--text-h);
}

.answer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
}

.code {
  font-family: var(--mono);
  font-size: 24px;
  font-weight: 700;
  color: var(--text-h);
}

.arrow {
  color: var(--text);
}

.name {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-correct);
}

.is-lost .name {
  color: var(--color-present);
}

.meta {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text);
}

/* Stacked full-width actions: three buttons read better than a cramped row. */
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
}

.actions > * {
  width: 100%;
}

.ghost,
.again {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.ghost {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-h);
}

.ghost:hover {
  border-color: var(--tile-border-filled);
  background: var(--panel-bg);
}

.again {
  border: 1px solid transparent;
  background: var(--color-correct);
  color: #fff;
}

.again:hover {
  filter: brightness(1.08);
}

.is-lost .again {
  background: var(--color-present);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
