<template>
  <div class="main-area">
    <div class="header">
      <div class="title">
        {{ selectedMenuLabel }}
        <!-- <a-breadcrumb style="cursor: pointer">
          <a-breadcrumb-item @click="jumpToFolder(-1)">{{ selectedMenuLabel }}</a-breadcrumb-item>
          <a-breadcrumb-item
            v-for="(item, index) in folderPaths"
            :key="item.libId"
            @click="jumpToFolder(index)"
          >
            {{ item['libName'] }}
          </a-breadcrumb-item>
        </a-breadcrumb> -->
      </div>
      <div style="display: flex">
        <SearchInput></SearchInput>
        <a-button @click="onUpload">
          <upload-outlined />
          上传{{ selectedMenuLabel }}
        </a-button>
      </div>
    </div>
    <div class="area-content" ref="scrollRef">
      <!-- <div v-if="list.length === 0" class="empty-content">
        <img src="@/assets/empty.png" alt="" />
        <span>暂时还没有内容</span>
      </div> -->
      <!-- <div v-if="list.length" class="card-grid">
        <FolderCard
          v-for="item in list1"
          :key="item.libId"
          :item="item"
          @click="enterFolder(item)"
          @remove="onRemoveFolder(item)"
          @rename="onRenameFolder(item)"
          @check="onCheckFolder(item)"
        />
      </div> -->
      <div class="card-grid">
        <!-- <MaterialCard
          v-for="item in list2"
          :key="item.materialId"
          :item="item"
          @remove="onRemoveMaterial(item)"
        /> -->
        <ImageMaterialCard v-for="item in images" :key="item.url" :item="item" @remove="onRemoveMaterial(item)"></ImageMaterialCard>
        <VideoMaterialCard v-for="item in videos" :key="item.url" :item="item" @remove="onRemoveMaterial(item)"></VideoMaterialCard>
        <AudioMaterialCard v-for="item in audios" :key="item.url" :item="item" @remove="onRemoveMaterial(item)"></AudioMaterialCard>
      </div>
    </div>
  </div>
  <!-- <FolderDialog ref="folderDialogRef" /> -->
  <!-- <addQAModal ref="addQAModalRef" /> -->
  <!-- <FolderInfoDialog ref="folderInfoDialogRef" /> -->
</template>

<script setup lang="ts">
  // import MaterialCard from './MaterialCard.vue'
  // import FolderCard from './FolderCard.vue'
  // // import { UploadOutlined, PlusOutlined } from '@ant-design/icons-vue'
  // import SearchInput from '@/components/SearchInput/index.vue'
  // import { computed, ref, defineProps, watch, getCurrentInstance } from 'vue'
  // import {
  //   selectFile,
  //   uploadFile,
  // } from '@/utils'
  // // import { getAppEnvConfig } from '/@/utils/env'
  // import { useScrollLoad } from '../useScrollLoad'
  // import FolderDialog from './FolderDialog.vue'
  // import FolderInfoDialog from './FolderInfoDialog.vue'
  // // import {
  // //   createAutoReply,
  // //   createMaterialDir,
  // //   deleteMaterial,
  // //   deleteMaterialDir,
  // //   renameMaterialDir,
  // // } from '/@/api/material'
  // import addQAModal from './addQAModal.vue'
  import { MaterialItem } from '../index';
  import ImageMaterialCard from './ImageMaterialCard.vue';
  import AudioMaterialCard from './AudioMaterialCard.vue';
  import VideoMaterialCard from './VideoMaterialCard.vue';
import { selectFile } from '../../utils';
import { getAudioInfo } from '@/utils/getAudioInfo';

  // const instance = getCurrentInstance()

  // console.log('getCurrentInstance', instance)
  const props = defineProps<{ selectedMenu: string }>()

  const selectedMenu = computed(() => props.selectedMenu)

  const videos: MaterialItem[] = [{ coverImg: "https://oss-odds-digital-asset-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/eds/9s21df6e-1234-4596-adac-a920ds6afd322/dsops/upload/4befec5a-2785-435b-bd63-17e3b9f8a275_20240325174732.mp4?x-oss-process=video/snapshot,t_0,f_png,m_fast",
    name: "视频1",
    desc: "视频描述1",
    url: "https://oss-odds-digital-asset-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/eds/9s21df6e-1234-4596-adac-a920ds6afd322/dsops/upload/4befec5a-2785-435b-bd63-17e3b9f8a275_20240325174732.mp4"
,
    tooltip: '上传人：陈01<br/>上传时间：2024-03-15 16:31:31'
  }];

  const images: MaterialItem[] = [{ coverImg: "https://oss-odds-digital-asset-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/eds/9s21df6e-1234-4596-adac-a920ds6afd322/dsops/upload/e840b99cd5db42759fbf5570b7671670_20240315163131.png",
    name: "图片1",
    desc: "图片描述1",
    url: "https://oss-odds-digital-asset-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/eds/9s21df6e-1234-4596-adac-a920ds6afd322/dsops/upload/e840b99cd5db42759fbf5570b7671670_20240315163131.png",
    tooltip: '上传人：陈01<br/>上传时间：2024-03-15 16:31:31'
  }];

  const audios: MaterialItem[] = [{
    name: "图片1",
    desc: "图片描述1",
    url: "https://oss-odds-digital-asset-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/eds/9s21df6e-1234-4596-adac-a920ds6afd322/dsops/upload/华语群星 - 笑旺新年_20240315163738.mp3"
,
    tooltip: '上传人：陈01<br/>上传时间：2024-03-15 16:31:31'
  }];

  // const keyword = ref<string>('')

  // function onSearch() {
  //   refreshData()
  // }

  // const folderDialogRef = ref(null)

  // function onCreateFolder() {
  //   folderDialogRef.value.open('', (text) => {
  //     createMaterialDir({
  //       libName: text,
  //       topicId: selectedMenu.value,
  //       libId: curFolderId.value,
  //     }).then(() => {
  //       refreshData()
  //     })
  //   })
  // }

  // function onRenameFolder(item) {
  //   folderDialogRef.value.open({ text: item.libName }, (text) => {
  //     renameMaterialDir({
  //       libName: text,
  //       libId: item.libId,
  //     }).then(() => {
  //       refreshData()
  //     })
  //   })
  // }

  // const folderInfoDialogRef = ref(null)

  // function onCheckFolder(item) {
  //   folderInfoDialogRef.value.open(item)
  // }

  // function onRemoveFolder(item) {
  //   deleteMaterialDir({ libId: item.libId }).then(() => {
  //     refreshData()
  //   })
  // }

  // const { VITE_GLOB_UPLOAD_URL2 } = getAppEnvConfig()

  const scrollRef = ref(null)

  // const folderPaths = ref([])

  // const curFolderId = computed(() => {
  //   if (folderPaths.value.length === 0) {
  //     return ''
  //   }
  //   return folderPaths.value[folderPaths.value.length - 1].libId
  // })
  // function enterFolder(folder) {
  //   folderPaths.value.push(folder)
  //   refreshData()
  // }

  // function jumpToFolder(index) {
  //   folderPaths.value = folderPaths.value.slice(0, index + 1)
  //   refreshData()
  // }

  const menus = [
    { label: '图片', value: 'dsops_img', icon: 'icon-tupian_line' },
    { label: '视频', value: 'dsops_video', icon: 'icon-shipin_line' },
    { label: '音频', value: 'dsops_audio', icon: 'icon-yinle_line' },
  ]

  // function onRemoveMaterial(data) {
  //   deleteMaterial({ materialId: data.materialId }).then(() => {
  //     refreshData()
  //   })
  // }

  const selectedMenuLabel = computed(() => {
    return menus.find((menu) => menu.value === selectedMenu.value)?.label
  })

  // const { list, refresh } = useScrollLoad(scrollRef, {})

  const list = []

  // watch(
  //   selectedMenu,
  //   () => {
  //     folderPaths.value = []
  //     refreshData()
  //   },
  //   { immediate: true },
  // )

  function onUpload() {
    const accept = { dsops_img: 'image/*', dsops_video: 'video/*', dsops_audio: 'audio/*' }
    selectFile({ multiple: true, accept: accept[selectedMenu.value] })
      .then((files) => {
        getAudioInfo(files[0]).then(res => {
          console.log(res)
        })
      })
  }

  // const addQAModalRef = ref(null)

  // function onAutoReply() {
  //   addQAModalRef.value.open({}, (data) => {
  //     console.log('🚀 ~ addQAModalRef.value.open ~ data:', data)
  //     createAutoReply({
  //       materialName: data.materialName,
  //       materialUrl: data.materialUrl,
  //       metaInfo: {
  //         size: data.audio.size,
  //         duration: data.audio.duration,
  //         keywords: data.keywords,
  //       },
  //       extendInfo: {
  //         urlTitle: data.audio.title,
  //       },
  //     }).then(() => {
  //       refreshData()
  //     })
  //   })
  // }

  // function refreshData() {
  //   refresh(selectedMenu.value, { libId: curFolderId.value, keyword: keyword.value })
  // }
</script>

<style scoped lang="scss">
  .empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    color: #0a0a15;
    img {
      width: 176px;
      height: 176px;
      margin-top: 200px;
    }
  }
  .main-area {
    padding: 24px;
    display: flex;
    flex-direction: column;
    flex: 1;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      button {
        margin-left: 12px;
      }
    }

    .title {
      font-weight: 500;
      font-size: 16px;
      color: #0a0a15;
    }

    .area-content {
      flex: 1;
      overflow-y: auto;
    }
  }

  .card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
</style>
