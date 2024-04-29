import { fileAsDataUrl } from "@/utils";

interface VideoInfo {
  name: string;
  duration: number;
  cover: string;
  width: number;
  height: number;
}

export const getVideoMetaInfo = async (url: string): Promise<Omit<VideoInfo, 'cover' | 'name'>> => {
  const video = document.createElement('video');
  video.muted = true;
  video.src = url;
  return new Promise((resolve) => {
    video.addEventListener('loadedmetadata', function () {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
    });
  });
}

/**
 * Retrieves the thumbnails of a video given its URL.
 * 参考张鑫旭博客：https://www.zhangxinxu.com/study/202401/js-get-mp4-video-image-demo.php
 * @param url - The URL of the video.
 * @returns A promise that resolves to an array of thumbnail URLs.
 */
export const getVideoThumbs = async (url: string): Promise<string[]> => {
  return new Promise((resolve) => {
    // 基于视频元素绘制缩略图，而非解码视频
    const video = document.createElement('video');
    // 静音
    video.muted = true;
  
    // 绘制缩略图的canvas画布元素
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', {
      willReadFrequently: true
    });
  
    // 绘制缩略图的标志量
    let isTimeUpdated = false;
    // 几个视频事件
    // 1. 获取视频尺寸
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      // 开始执行绘制
      draw();
    });
    // 2. 触发绘制监控
    video.addEventListener('timeupdate', () => {
      isTimeUpdated = true;
    });
  
    // 请求视频地址，如果是本地文件，直接执行
    if (/^blob:|base64,/i.test(url)) {
      video.src = url;
    } else {
      fetch(url).then(res => res.blob()).then(blob => {
        // 赋予视频
        video.src = URL.createObjectURL(blob);
      });
    }
  
    // 绘制方法
    const draw = () => {
      const arrThumb: string[] = [];
      const duration = video.duration;
      let seekTime = 0.1;
  
      const loop = () => {
        if (isTimeUpdated && context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
          canvas.toBlob(blob => {
            if (blob) {
              arrThumb.push(URL.createObjectURL(blob));
            }
  
            seekTime += 1;
  
            if (seekTime > duration) {
              // 执行完毕
              resolve(arrThumb)
              return;
            }
  
            step();
          }, 'image/jpeg');
  
          return;
        }
        // 监控状态
        requestAnimationFrame(loop);
      }
  
      // 逐步绘制，因为currentTime修改生效是异步的
      const step = () => {
        isTimeUpdated = false;
        video.currentTime = seekTime;
  
        loop();
      }
  
      step();
    }
  });
}

export const getVideoCover = async (url: string): Promise<string> => {
  const video = document.createElement('video');
  video.muted = true;
  video.src = url;

  return new Promise((resolve) => {

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const loop = () => {
      if (isTimeUpdated) {
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          console.log('blob', blob)
          if (blob) {
            const cover = URL.createObjectURL(blob);
            resolve(cover);
          } else {
            resolve('');
          }
        })
      } else {
        requestAnimationFrame(loop);
      }
    }


    // 绘制缩略图的标志量
    let isTimeUpdated = false;
    video.addEventListener('timeupdate', () => {
      isTimeUpdated = true;
    });
    video.addEventListener('loadedmetadata', function () {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      video.currentTime = 0.1;

      loop();
    });
  });
}

export const getVideoInfo = async (file: File): Promise<VideoInfo> => {
  const url = await fileAsDataUrl(file)
  const [metaInfo, cover] = await Promise.all([getVideoMetaInfo(url), getVideoCover(url)]);
  return {
    name: file.name,
    cover,
    ...metaInfo
  }
}