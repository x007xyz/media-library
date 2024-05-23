export {};

declare global {
  interface MaterialItem {
    cover: string;
    name: string;
    desc: string;
    url: string;
    metainfo?: Record<string, any>;
  }
}