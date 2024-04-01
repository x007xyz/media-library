<template>
  <a-modal
    v-model:visible="visible"
    @ok="onOk"
    @cancel="onCancel"
    title="文件夹详情"
    width="380px"
    :cancelText="null"
  >
    <div class="main">
      <img
        style="width: 100px; height: 100px; margin-bottom: 26px"
        src="/@/assets/folder.png"
        alt=""
        v-if="info.sourceType !== 7"
      />
      <img
        v-else
        style="width: 100px; height: 100px; margin-bottom: 26px"
        src="/@/assets/sync_folder.png"
        alt=""
      />
      <div class="item">
        <div class="label"> 文件夹名称 </div>
        <div class="value">{{ info.libName }}</div>
      </div>
      <div class="item">
        <div class="label"> 文件夹类型 </div>
        <div class="value">常规文件夹</div>
      </div>
      <div class="item" v-if="info.sourceType !== 7">
        <div class="label"> 创建人 </div>
        <div class="value">{{ info.creatorName || '-' }}</div>
      </div>
      <div class="item" v-else>
        <div class="label"> 来自 </div>
        <div class="value">任务：{{ info.libName }}搜集</div>
      </div>
      <div class="item">
        <div class="label"> 创建时间 </div>
        <div class="value">{{ dayjs(info.createTime * 1000).format('YYYY年MM月DD日 HH:mm') }}</div>
      </div>
    </div>
    <template #footer>
      <a-button key="submit" type="primary" @click="visible = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs'
  import { ref } from 'vue'

  const visible = ref(false)

  function onCancel() {
    visible.value = false
  }

  let _callback = null
  function onOk() {
    _callback && _callback()
  }

  const info = ref({})

  defineExpose({
    open(data, callback) {
      info.value = data
      _callback = callback
      visible.value = true
    },
  })
</script>

<style scoped>
  .item {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 8px;
  }

  .label {
    width: 94px;
    font-weight: 400;
    font-size: 14px;
    color: #99999f;
  }

  .value {
    font-size: 14px;
    color: #0a0a15;
  }

  .main {
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
