<template>
  <div class="preview-mask" @click.self="onClose">
    <img :src="url" alt="预览图">
  </div>
</template>

<script setup lang="ts">
  defineProps<{ url: string }>()
  const emit = defineEmits(['close'])

  function onClose() {
    emit('close')
  }
</script>

<style scoped>
.preview-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);

  img {
    max-height: 80%;
    max-width: 80%;
  }
}
</style>