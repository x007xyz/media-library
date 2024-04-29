import jsmediatags from 'jsmediatags';
import { fileAsDataUrl } from '../utils';

interface AudioInfo {
  name: string;
  duration: number;
  cover: string;
  artist: string;
}

export const getAudioDuration = async (url: string): Promise<number> => {
  const audio = new Audio(url);
  return new Promise((resolve) => {
    audio.addEventListener('loadedmetadata', function () {
      resolve(audio.duration);
    });
  });
}

export const getAudioMetaInfo = async (file: File): Promise<Omit<AudioInfo, 'name' | 'duration'>> => {
  return new Promise((resolve, reject) => {
    jsmediatags.read(file, {
      onSuccess: function (tag) {
        const result = { artist: '', cover: '' }
        const artist = tag?.tags?.artist;
        artist && (result.artist = artist);
        if (tag?.tags?.picture) {
          // 转本地地址
          result.cover = URL.createObjectURL(new Blob([new Uint8Array(tag.tags.picture.data).buffer]));
        }
        resolve(result)
      },
      onError(error: any) {
        reject(error);
      }
    });
  })
}

export const getAudioInfo = async (file: File): Promise<AudioInfo> => {

  const [duration, { cover, artist }] = await Promise.all([fileAsDataUrl(file).then(getAudioDuration), getAudioMetaInfo(file)])

  return {
    name: file.name,
    duration,
    cover,
    artist
  }
}