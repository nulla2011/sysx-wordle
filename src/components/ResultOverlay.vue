<script setup lang="ts">
defineProps<{
  status: 'won' | 'lost'
  answerCode: string
  answerName: string
  guessCount: number
  maxGuesses: number
}>()

const emit = defineEmits<{ (event: 'restart'): void }>()
</script>

<template>
  <div class="result" :class="`is-${status}`" aria-live="assertive">
    <p class="title">
      {{ status === 'won' ? '猜对了！' : '机会用完了' }}
    </p>
    <p class="answer">
      <span class="code">{{ answerCode }}</span>
      <span class="arrow" aria-hidden="true">→</span>
      <span class="name">{{ answerName }}</span>
    </p>
    <p class="meta">
      {{ status === 'won' ? `第 ${guessCount} / ${maxGuesses} 步成功` : `正确答案是「${answerName}」` }}
    </p>
    <button type="button" class="again" @click="emit('restart')">再来一局</button>
  </div>
</template>

<style scoped>
.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 22px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--panel-bg);
  animation: rise 0.24s ease;
}

.result.is-won {
  border-color: var(--color-correct);
}

.result.is-lost {
  border-color: var(--color-present);
}

.title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-h);
}

.answer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.code {
  font-family: var(--mono);
  font-size: 21px;
  font-weight: 700;
  color: var(--text-h);
}

.arrow {
  color: var(--text);
}

.name {
  font-size: 21px;
  font-weight: 600;
  color: var(--color-correct);
}

.result.is-lost .name {
  color: var(--color-present);
}

.meta {
  font-size: 13px;
  color: var(--text);
}

.again {
  margin-top: 4px;
  padding: 8px 20px;
  border: 0;
  border-radius: 8px;
  background: var(--key-bg);
  color: var(--text-h);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.again:hover {
  background: var(--color-correct);
  color: #fff;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
