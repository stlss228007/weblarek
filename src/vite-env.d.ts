/// <reference types="vite/client" />

declare module '*.scss' {
    const content: Record<string, string>;
    export default content;
}

interface ImportMetaEnv {
    readonly VITE_API_ORIGIN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}