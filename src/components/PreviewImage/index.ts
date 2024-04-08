import PreviewImage from './index.vue';
import { renderComp } from "@/utils/renderComp"

export const previewImage = (url: string) => {
  renderComp(PreviewImage, { url });
}
export default PreviewImage;