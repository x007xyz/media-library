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
      let files: File[] = Array.from(input.files || [])
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
            // message.warning(`已过滤上传文件中大小大于${options.max}的文件`)
          }
          resolve(files)
        } else {
          // message.warning(`上传文件大小不能大于${options.max}`)
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
export function base64ToBlob(base64Data: string, contentType: string) {
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
export function blobToFile(blob: Blob, fileName: string) {
  const file = new File([blob], fileName, { type: blob.type })
  return file
}
