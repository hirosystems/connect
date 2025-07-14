/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@stacks/connect-react' {
  export * from '@stacks/connect-react/src'
}

declare module '@stacks/connect' {
  export * from '@stacks/connect/src'
} 