/// <reference types="vite/client" />

/* fontsource 的子路径导出没有类型入口，导入时按副作用模块处理 */
declare module '@fontsource/*';
