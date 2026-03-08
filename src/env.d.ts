// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- required by Astro for ImportMetaEnv augmentation
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_EMAILJS_SERVICE_ID: string | undefined
  readonly PUBLIC_EMAILJS_TEMPLATE_ID: string | undefined
  readonly PUBLIC_EMAILJS_PUBLIC_KEY: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
