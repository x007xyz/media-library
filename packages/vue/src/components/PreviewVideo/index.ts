import PreviewVideo from './index.vue';
import { renderComp } from "@/utils/renderComp"

export const previewVideo = (url: string) => {
  renderComp(PreviewVideo, { url });
}
export default PreviewVideo;