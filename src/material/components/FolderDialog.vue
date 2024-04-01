<template>
  <a-modal v-model:visible="visible" @ok="onOk" @cancel="onCancel" title="新建文件夹" width="280px">
    <div class="content">
      <img src="/@/assets/folder.png" alt="" />
      <a-input v-model:value="text" ref="inputRef" />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, nextTick } from 'vue'

  const visible = ref(false)

  const text = ref('新建文件夹')

  const inputRef = ref(null)

  function onCancel() {
    visible.value = false
  }

  function onOk() {
    _callback && _callback(text.value)
    visible.value = false
  }

  let _callback = null

  defineExpose({
    open(data, callback) {
      text.value = data.text || '新建文件夹'
      _callback = callback
      visible.value = true

      nextTick(() => {
        inputRef.value.focus()
        inputRef.value.select()
      })
    },
  })
</script>

<style scoped lang="less">
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;

    img {
      width: 100px;
      height: 100px;
      margin-bottom: 30px;
    }
  }
</style>
