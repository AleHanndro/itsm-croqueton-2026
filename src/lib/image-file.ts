export const MAX_IMAGE_SIZE = 8 * 1024 * 1024
export const MAX_IMAGE_DIMENSION = 720
export const IMAGE_QUALITY = 0.82

export type ImageFileError = 'invalid' | 'read' | 'too_large'

export function readImageFile(
  file: File | undefined,
  onLoad: (dataUrl: string) => void,
  onError: (reason: ImageFileError) => void
) {
  if (!file) return

  if (!file.type.startsWith('image/')) {
    onError('invalid')
    return
  }

  if (file.size > MAX_IMAGE_SIZE) {
    onError('too_large')
    return
  }

  const reader = new FileReader()

  reader.addEventListener('load', () => {
    if (typeof reader.result !== 'string') {
      onError('read')
      return
    }

    const image = new window.Image()

    image.addEventListener('load', () => {
      try {
        const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext('2d')

        if (!context) {
          onError('read')
          return
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        onLoad(canvas.toDataURL('image/webp', IMAGE_QUALITY))
      } catch {
        onError('read')
      }
    })
    image.addEventListener('error', () => onError('read'))
    image.src = reader.result
  })
  reader.addEventListener('error', () => onError('read'))
  reader.readAsDataURL(file)
}
