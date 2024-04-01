import { getToken } from '/@/utils/auth'
import { useTenantStore } from '/@/store/modules/tenant'
import { getAppEnvConfig } from '/@/utils/env'
import FontFaceObserver from 'fontfaceobserver'
import fontJson from './free-font.json'
import { message } from 'ant-design-vue'

const { VITE_GLOB_UPLOAD_URL } = getAppEnvConfig()

const tenantStore = useTenantStore()

interface FileUploadOptions {
  accept: string
  multiple: boolean
  max?: string
}

export const selectFile = (options: FileUploadOptions): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    // 创建input[file]元素
    const input = document.createElement('input')
    // 设置相应属性
    input.setAttribute('type', 'file')
    input.setAttribute('accept', options.accept)
    options.multiple
      ? input.setAttribute('multiple', 'multiple')
      : input.removeAttribute('multiple')
    // 绑定事件
    input.onchange = function () {
      let files = Array.from(this.files)
      // 获取文件列表
      if (files) {
        const length = files.length
        files = files.filter((file) => {
          if (options.max) {
            return !compareSize(file.size, options.max)
          } else {
            return true
          }
        })
        if (files && files.length > 0) {
          if (length !== files.length) {
            message.warning(`已过滤上传文件中大小大于${options.max}的文件`)
          }
          resolve(files)
        } else {
          message.warning(`上传文件大小不能大于${options.max}`)
          reject(new Error(`上传文件大小不能大于${options.max}`))
        }
      } else {
        reject(new Error('No files selected'))
      }
    }

    input.oncancel = function () {
      reject(new Error('No files selected'))
    }
    input.click()
  })
}

export const fileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = () => {
      reject(reader.error)
    }
    reader.readAsDataURL(file)
  })
}

let loadingQueue = []

let hideLoading

let failureCount = 0

function showLoading() {
  if (loadingQueue.length === 0) {
    hideLoading = message.loading('文件上传中...', 0)
  }

  const uuid = Math.random().toString(36).substr(2)
  loadingQueue.push(uuid)
  console.log('🚀 ~ showLoading ~ loadingQueue:', loadingQueue)

  return function (flag: boolean) {
    console.log('uuid', uuid)
    if (!flag) {
      failureCount++
    }
    if (uuid) {
      loadingQueue = loadingQueue.filter((item) => uuid !== item)
    }
    if (loadingQueue.length === 0) {
      hideLoading()
      if (failureCount > 0) {
        message.error(failureCount + '个文件上传失败')
      } else {
        message.success('文件上传成功')
      }
      failureCount = 0
    }
  }
}

interface UploadOptions {
  url?: string
  onProgress?: Function
  showToastFn?: Function
  body?: Record<string, any>
}

// 上传文件并获取URL
export const uploadFile = (file: File, options?: UploadOptions): Promise<string> => {
  const { url, onProgress, showToastFn } = Object.assign(
    {},
    {
      url: VITE_GLOB_UPLOAD_URL,
      showToastFn: showLoading,
    },
    options,
  )
  const hide = showToastFn && showToastFn()
  const formData = new FormData()
  formData.append('file', file)

  if (options?.body) {
    for (const key in options.body) {
      formData.append(key, options.body[key])
    }
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    // 为请求设置headers
    xhr.open('POST', url)
    xhr.setRequestHeader('Authorization', getToken())
    xhr.setRequestHeader('appCode', 'dsops')
    xhr.setRequestHeader('tenantId', tenantStore.getTenantVal)
    xhr.setRequestHeader('Org-Type', tenantStore.getOrgType)
    xhr.setRequestHeader('Org-Id', tenantStore.getOrgId)
    xhr.onload = () => {
      hide && hide(true)
      const response = JSON.parse(xhr.responseText)
      if (xhr.status === 200) {
        resolve(response.data)
      } else {
        reject(response)
      }
    }
    xhr.upload.onprogress = (event) => {
      console.log('🚀 ~ returnnewPromise ~ event:', event)
      if (event.lengthComputable) {
        const percentComplete = ((event.loaded / event.total) * 100).toFixed(0)
        onProgress && onProgress(percentComplete)
      }
    }
    xhr.onerror = () => {
      hide && hide(false)
      reject(xhr.statusText)
    }
    xhr.send(formData)
  })
}

export const getVideoCoverUrl = (url: string) => {
  return url + '?x-oss-process=video/snapshot,t_0,f_png,m_fast'
}

// 计算文件大小
export const getFileSize = (size: number): string => {
  if (!size) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  return (size / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}
/**
 * 比较文件大小，第一个参数为文件大小，为纯数字，第二个参数为目标大小，是一个数字+单位的字符串，如'1MB'
 * @param size
 * @param target
 */
export const compareSize = (size: number, target: string): boolean => {
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = sizes.findIndex((item) => item === target.replace(/\d+/, ''))
  return size > parseInt(target) * Math.pow(k, i)
}

// 将Base64数据转换为Blob对象
export function base64ToBlob(base64Data, contentType) {
  contentType = contentType || ''
  const sliceSize = 1024
  const byteCharacters = atob(base64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType })
}

// 将Blob对象转换为File对象
export function blobToFile(blob, fileName) {
  const file = new File([blob], fileName, { type: blob.type })
  return file
}

const fontList = fontJson

// 下载贴图字体
export function downStickerFont(layers) {
  return Promise.all(
    layers.map((item: any) => {
      if (item.fontFamily && fontList.find((font) => font.name === item.fontFamily)) {
        const font = new FontFaceObserver(item.fontFamily)
        return font.load(null, 150000)
      }
      return Promise.resolve()
    }),
  )
}
