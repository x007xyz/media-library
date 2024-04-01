<template>
  <div class="card-wrapper">
    <div class="content" @click="onClick">
      <img :src="coverImg" alt="" />
      <!-- 播放中遮罩 -->
      <div class="playing-mask" v-if="playingUrl === item.materialUrl">
        <span>播放中...</span>
      </div>
      <div class="handle">
        <div>
          <!-- <i class="icon-bofang_fill" v-if="item.materialType !== 2"></i> -->
        </div>
        <div>
          <i class="icon-xiazai_line" @click.stop="downFile"></i>
          <i class="icon-shanchu_line" @click.stop="onRemove"></i>
          <a-tooltip>
            <template #title> <div v-html="tooltip"></div></template>
            <i class="icon-xiangqing_line"></i>
          </a-tooltip>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="ellipsis">{{ title }}</div>
      <div class="desc">{{ desc }}</div>
    </div>
  </div>
  <teleport to="body" v-if="videoVisible">
    <div class="preview-mask" @click.self="videoVisible = false">
      <video :src="props.item.materialUrl" :controls="true" autoplay></video>
    </div>
  </teleport>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import {
    getFileSize,
    getVideoCoverUrl,
  } from '../../creation/createWork/components/framesContent/utils'
  import dayjs from 'dayjs'
  import AudioImage from '/@/assets/images/audio.png'
  import AudioImage2 from '/@/assets/CreationSideIcon/音频@2x.png'
  import { createImgPreview } from '/@/components/Preview/index'
  import { useSound } from '/@/hooks/web/useSound'
  import NoPicturePng from '/@/assets/nopicture_cover.png'
  import { useRouter } from 'vue-router'
  import { useMixedCut } from '/@/store/modules/mixedCut'

  const useCutStore = useMixedCut()

  const router = useRouter()

  const props = defineProps<{
    item: any
  }>()

  const emits = defineEmits(['remove'])

  const videoVisible = ref(false)

  const title = computed(() => {
    return props.item.mapName
  })

  const desc = computed(() => {
    return `${props.item.creatorNick}丨${dayjs(props.item.createTimestamp).format(
      'YYYY-MM-DD HH:mm:ss',
    )}`
  })

  const coverImg = computed(() => {
    if (props.item.mapType === 1) {
      return props.item.coverUrl
    }
    if (props.item.taskType === 3) {
      try {
        const reqData = JSON.parse(props.item.reqData)

        const videos = reqData.assembleInfo.holders.reduce((res, item) => {
          return res.concat(item.videos || [])
        }, [])

        return getVideoCoverUrl(videos[0].url)
      } catch (error) {
        console.log('error', error)
      }
    }
    return NoPicturePng
  })

  const coverImageSize = computed(() => {
    return { width: '80%', height: '80%' }
  })

  const tooltip = computed(() => {
    return `上传人：${props.item.creatorNick}<br>
上传时间：${dayjs(props.item.createTimestamp * 1000).format('YYYY-MM-DD HH:mm:ss')}`
  })

  const { toggle, playingUrl } = useSound()

  const onClick = () => {
    if(props.item.taskType == 1) {
      router.push('/creation/detail?id='+ props.item.mapId)
      return
    }else if(props.item.taskType == 3) {
      useCutStore.detailData = props.item
      router.push('/creation/vdoDetail')
      return
    }

    return console.log(props.item);
    
    if ([1, 5].includes(props.item.materialType)) {
      // 播放音频
      toggle(props.item.materialUrl)
      return
    }
    if (props.item.materialType === 3) {
      // 播放视频
      videoVisible.value = true
      return
    }
    // 打开图片
    createImgPreview({ imageList: [coverImg.value], defaultWidth: 800, maskClosable: true })
  }

  const onRemove = () => {
    emits('remove')
  }

  const downFile = () => {
    // 使用a标签的download属性下载文件
    const a = document.createElement('a')
    a.href = props.item.materialUrl
    a.download = props.item.materialName
    a.click()
  }
</script>

<style scoped lang="less">
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

    video {
      max-height: 80%;
      max-width: 80%;
    }
  }

  .card-wrapper {
    width: 214px;
    height: 212px;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid #e7e7ea;

    .content {
      height: 160px;
      background: #f4f4f7;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      justify-content: center;

      img {
        max-width: 80%;
        max-height: 80%;
      }

      .handle {
        display: none;
      }

      .playing-mask {
        inset: 0;
        position: absolute;
        background: rgba(10, 10, 21, 0.4);
        color: #fff;
        font-weight: 500;
        font-size: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &:hover .handle {
        display: flex;
        justify-content: space-between;
        color: #fff;
        height: 40px;
        line-height: 40px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-image: linear-gradient(180deg, #00000000 0%, #0000004d 100%);

        i {
          margin-left: 12px;

          &:last-child {
            margin-right: 12px;
          }
        }
      }
    }

    .info {
      height: 52px;
      background-color: #fff;
      font-weight: 400;
      font-size: 14px;
      color: #0a0a15;
      line-height: 1.8;
      padding: 0 10px;

      .desc {
        font-weight: 400;
        font-size: 12px;
        color: #99999f;
      }
    }
  }
</style>
