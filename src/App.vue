<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import GameBoard from './components/GameBoard.vue'
import HelpModal from './components/HelpModal.vue'
import LetterKeyboard from './components/LetterKeyboard.vue'
import MappingPanel from './components/MappingPanel.vue'
import ResultOverlay from './components/ResultOverlay.vue'
import { useWordle } from './composables/useWordle'

const game = useWordle()
const helpOpen = ref(false)

onMounted(() => {
  void game.start()
  // Show the rules once on a first visit, then stay out of the way.
  helpOpen.value = !localStorage.getItem('sysx-wordle:help-seen')
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  game.dispose()
  window.removeEventListener('keydown', onKeydown)
})

function closeHelp() {
  helpOpen.value = false
  localStorage.setItem('sysx-wordle:help-seen', '1')
}

function onKeydown(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey) return

  if (helpOpen.value) {
    if (event.key === 'Escape' || event.key === 'Enter') {
      event.preventDefault()
      closeHelp()
    }
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    void game.submit()
    return
  }
  if (event.key === 'Backspace') {
    event.preventDefault()
    game.erase()
    return
  }
  if (event.key === 'Escape') {
    helpOpen.value = true
    return
  }
  if (!game.acceptsInput.value) return

  const letter = event.key.toLowerCase()
  if (letter.length === 1 && game.letters.value.includes(letter)) {
    event.preventDefault()
    game.press(letter)
  }
}
</script>

<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">
        <h1>字母 Wordle</h1>
        <p class="tagline">四位字母 · 四步机会 · 每步翻开汉字</p>
      </div>
      <div class="tools">
        <button type="button" class="ghost" @click="helpOpen = true">玩法</button>
        <button
          type="button"
          class="ghost"
          :disabled="game.status.value === 'loading'"
          @click="game.restart()"
        >
          重开
        </button>
      </div>
    </header>

    <main class="stage">
      <p v-if="game.status.value === 'loading'" class="placeholder">正在获取今日答案…</p>

      <template v-else-if="game.status.value === 'error'">
        <p class="placeholder is-error">{{ game.errorMessage.value }}</p>
        <button type="button" class="retry" @click="game.restart()">重试</button>
      </template>

      <template v-else>
        <GameBoard
          :guesses="game.guesses.value"
          :draft="game.draft.value"
          :code-length="game.codeLength"
          :max-guesses="game.maxGuesses"
          :current-row="game.currentRow.value"
          :revealing="game.revealing.value"
          :shaky="game.shaky.value"
        />

        <p class="message" :class="{ 'is-visible': !!game.message.value }">
          {{ game.message.value || ' ' }}
        </p>

        <MappingPanel :guesses="game.guesses.value" />
      </template>
    </main>

    <footer class="dock">
      <ResultOverlay
        v-if="game.status.value === 'won' || game.status.value === 'lost'"
        :status="game.status.value"
        :answer-code="game.answerCode.value"
        :answer-name="game.answerName.value"
        :guess-count="game.guesses.value.length"
        :max-guesses="game.maxGuesses"
        @restart="game.restart()"
      />

      <LetterKeyboard
        v-if="game.wordList.value"
        :letters="game.letters.value"
        :key-states="game.keyStates.value"
        :disabled="!game.acceptsInput.value"
        @letter="game.press"
        @erase="game.erase"
        @submit="game.submit"
      />
    </footer>

    <HelpModal
      :open="helpOpen"
      :max-guesses="game.maxGuesses"
      :code-length="game.codeLength"
      @close="closeHelp"
    />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 620px;
  min-height: 100svh;
  margin: 0 auto;
  padding: 18px 16px 22px;
  box-sizing: border-box;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.brand h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--text-h);
}

.tagline {
  margin-top: 3px;
  font-size: 13px;
  color: var(--text);
}

.tools {
  display: flex;
  gap: 8px;
}

.ghost {
  padding: 7px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-h);
  font-size: 14px;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.ghost:hover:not(:disabled) {
  border-color: var(--tile-border-filled);
  background: var(--panel-bg);
}

.ghost:disabled {
  opacity: 0.5;
  cursor: default;
}

.stage {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

.placeholder {
  font-size: 15px;
  color: var(--text);
}

.placeholder.is-error {
  max-width: 380px;
  color: var(--color-present);
  text-align: center;
}

.retry {
  padding: 8px 20px;
  border: 0;
  border-radius: 8px;
  background: var(--key-bg);
  color: var(--text-h);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.message {
  min-height: 22px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-h);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.message.is-visible {
  opacity: 1;
}

.dock {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
}
</style>
