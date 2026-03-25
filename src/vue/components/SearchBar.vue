<template>
  <div class="search-bar">
    <img src="/magnifying-glass.svg" width="10px" style="filter: invert(1)" />

    <input
      :value="modelValue"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      placeholder="Browse movies..."
      type="search"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue'])
</script>

<style>
.icon {
  opacity: 0.6;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 12px;
  margin: 20px;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);

  border: 1px solid var(--main-green-light);

  width: 100%;
  max-width: 400px;

  transition:
    background 0.3s ease,
    border 0.2s ease,
    box-shadow 0.2s ease;
}

.search-bar.disabled {
  opacity: 0;
  pointer-events: none;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;

  background: transparent;
  color: white;
  transition: background 0.3s ease;
  font-size: 14px;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;

  background: transparent;
  color: white;
  font-family: 'Iosevka Charon Mono', monospace;
  font-weight: 700;
  font-size: 14px;
}

.search-bar:has(input:hover) {
  background: var(--main-green-darker);
}

.search-bar input::placeholder {
  color: white;
  opacity: 0.4;
}
</style>
