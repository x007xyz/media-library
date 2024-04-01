<template>
  <a-modal
    v-model:visible="openModal"
    title="新建自动回复"
    okText="保存"
    @ok="onOk"
    @cancel="closeModal"
    centered
  >
    <div class="formArea">
      <div class="searchForm">
        <div class="title">
          名称
          <span class="required">*</span>
        </div>
        <a-input
          v-model:value="QAObj.materialName"
          placeholder="请输入自动回复名称，例如：“关于价格的自动回复”"
        />
      </div>
      <div class="searchForm">
        <div class="title">
          触发关键字
          <span class="required">*</span>
        </div>
        <a-select
          v-model:value="QAObj.keywords"
          mode="tags"
          style="width: 100%"
          placeholder="请输入触发自动回复的关键词。例如：“多少钱、怎么卖”"
        />
      </div>
      <div class="searchForm">
        <div class="title">
          回复内容
          <span class="required">*</span>
        </div>
        <a-button @click="onUpload" v-if="!QAObj.materialUrl">
          <PlusOutlined />
          添加音频文件
        </a-button>
        <div class="audioItems" v-if="QAObj.materialUrl">
          <div class="video">
            <div class="thumb">
              <img src="/@/assets/images/audio.png" alt="" />
              <div
                class="mask"
                :class="audio.audioUrl === playingUrl && 'playing'"
                @click.stop="toggle(audio.audioUrl)"
              >
                <i class="icon-bofang_fill play-btn" v-if="audio.audioUrl !== playingUrl"></i>
                <i class="icon-zanting_fill play-btn" v-else></i>
              </div>
            </div>
            <div class="mid">
              <div class="ellipsis">{{ audio.title || '自定义音频' }}</div>
              <!-- <div class="ellipsis">{{ fileName }}</div> -->
              <div class="timeSize"
                >{{ dayjs(audio.duration * 1000).format('mm:ss') }} |
                {{ getFileSize(audio.size) }}</div
              >
              <!-- <div class="timeSize">{{ audioSizeList[index] }}MB</div> -->
            </div>
            <!-- <i class="handle icon-tuodongbing_fill"></i> -->
            <i
              @click="delVoice"
              class="icon-guanbi_line"
              style="color: #99999f; cursor: pointer"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { message } from 'ant-design-vue'
  import { PlusOutlined } from '@ant-design/icons-vue'
  import { getAppEnvConfig } from '/@/utils/env'
  import {
    selectFile,
    uploadFile,
    getFileSize,
  } from '/@/views/creation/createWork/components/framesContent/utils'
  import { useSound } from '/@/hooks/web/useSound'
  import dayjs from 'dayjs'

  const { VITE_GLOB_UPLOAD_URL3 } = getAppEnvConfig()

  const { toggle, playingUrl } = useSound()

  const audio = ref({ duration: '', url: '', size: 0, title: '' })

  function onUpload() {
    selectFile({ multiple: false, accept: '.mp3, .wav, .m4a' }).then((files) =>
      uploadFile(files[0], { url: VITE_GLOB_UPLOAD_URL3 }).then(({ url, duration }) => {
        QAObj.value.materialUrl = url
        audio.value.duration = duration
        audio.value.size = files[0].size
        audio.value.url = url
        audio.value.title = files[0].name
      }),
    )
  }
  // import { useGoodsStore } from '/@/store/modules/goods'
  // const useStore = useGoodsStore()

  function delVoice() {
    // useStore.delVoice(index)
    QAObj.value.materialUrl = ''
    audio.value = {}
  }

  const openModal = ref<any>(false)

  // QA数据
  const QAObj = ref<any>({
    materialName: '',
    keywords: [],
    materialUrl: '',
  })

  function onOk() {
    if (!QAObj.value.materialName) {
      message.warn('请输入名称')
      return
    }
    if (QAObj.value.keywords.length === 0) {
      message.warn('请输入触发关键字')
      return
    }
    if (!QAObj.value.materialUrl) {
      message.warn('请添加回复内容')
      return
    }

    _callback && _callback({ ...QAObj.value, audio: audio.value })
    openModal.value = false
  }

  let _callback: any = null

  // 关闭QA窗口回调
  const closeModal = () => {
    openModal.value = false
    QAObj.value = {
      answer: '',
      keywords: [],
      question: '',
    }
  }

  defineExpose({
    open(_, callback) {
      _callback = callback
      openModal.value = true
    },
  })
</script>
<style lang="less" scoped>
  .required {
    color: #e64d4d;
  }
  .searchForm {
    padding: 20px;

    .title {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }

  .audioItems {
    display: flex;
    flex-wrap: wrap;

    .handle {
      margin-right: 8px;
      color: #99999f;
      cursor: move;
    }
  }

  .thumb {
    position: relative;
    cursor: pointer;
    width: 36px;
    height: 36px;
    background-color: #fff;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      display: block;
      width: 90%;
      height: 90%;
    }

    .mask {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 8px;
      color: #fff;
      align-items: center;
      justify-content: center;

      &.playing {
        display: flex;
      }
    }

    &:hover {
      .mask {
        display: flex;
      }
    }
  }

  .video {
    width: 570px;
    height: 56px;
    background: #f4f4f7;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px 8px 11px;
    margin-top: 16px;

    .maskSound {
      position: relative;
      width: 26px;
      height: 26px;
      overflow: hidden;
      cursor: pointer;

      .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        text-align: center;
        line-height: 23px;
        border-radius: 4px;

        i {
          color: #fff;
          font-size: 12px;
        }
      }
    }

    // img {
    //   width: 26px;
    //   height: 26px;
    // }

    .mid {
      flex: 1;
      width: 0;
      margin-left: 8px;
      display: flex;
      flex-direction: column;

      div {
        font-size: 12px;
        color: #0a0a15;
        font-weight: 700;
      }

      .timeSize {
        color: #99999f;
        font-weight: 400;
      }
    }
  }
</style>
