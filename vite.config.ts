import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': __dirname + '/src', // 设置 '@' 指向 'src' 目录
    }
  },
  plugins: [
    vue(),
    Components({
      dts: true, // 为了获得对自动导入组件的ts支持
      dirs: ['src/components'], // 用于搜索组件目录的相对路径
      resolvers: [AntDesignVueResolver()], // 导入组件库解析器
    }),
    AutoImport({
      dts: true,
      imports: ["vue"],
      dirs: ['src/hooks', 'src/utils'],
      // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
      // dts: 'src/auto-import.d.ts'
      eslintrc: { // 生成eslint的配置文件，需要在eslint配置中导入
        enabled: true, // Default `false`
        globalsPropValue: "readonly", // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    })
  ],
})
