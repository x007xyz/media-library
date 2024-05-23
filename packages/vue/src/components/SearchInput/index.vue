<template>
  <div class="input-wrapper">
    <input
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onChange"
      @keydown.enter="onSearch"
    />
    <i class="icon-fangdajing_sousuo_line" @click="onSearch"></i>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    modelValue?: string
    placeholder: string
  }>()

  const emits = defineEmits(['change', 'update:modelValue', 'search'])

  function onChange(event: Event) {
    emits('change', (event.target as HTMLInputElement).value)
    emits('update:modelValue', (event.target as HTMLInputElement).value)
  }

  function onSearch() {
    emits('search')
  }
</script>

<style scoped lang="scss">
  .input-wrapper {
    width: 100%;
    height: 32px;
    line-height: 32px;
    background: #ffffff;
    border: 1px solid #cfcfd5;
    border-radius: 4px;
    display: flex;
    padding: 0 12px;
    align-items: center;
    overflow: hidden;

    input[type='text'] {
      flex: 1;
      outline: none;
      border: none;
    }
  }
</style>
