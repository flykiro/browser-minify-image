


export const OUTPUT_BASE64 = 'base64'
export const OUTPUT_BLOB = 'blob'

interface BrowserMinifyImageOptions {
  mimeType?: string;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  outputType?: string;
}

interface FileLoadEventTarget extends EventTarget {
  result: string
}

interface Image extends HTMLImageElement {
  mimeType: string
}


declare function browserMinifyImageMinifyCallback(data: any): void

export default class BrowserMinifyImage {
  constructor () {
  }

  minify (file: File, options: BrowserMinifyImageOptions) {
    return this.createFileReader(file)
      .then(progressEvent => {
        return this.onFileRead(<ProgressEvent>progressEvent)
      })
      .then(imageLoadEvent => {
        return this.onImageLoad(<Event>imageLoadEvent, options)
      })
  }

  createFileReader (file: File) {
    return new Promise((resolve, reject) => {
      if (file) {
        const fileReader = new FileReader()
        fileReader.addEventListener('load', resolve)
        fileReader.readAsDataURL(file)
      } else {
        reject()
      }
    })
  }

  onFileRead (event: ProgressEvent) {
    return new Promise((resolve, reject) => {
      if (event.target) {
        const image = new Image()
        image.addEventListener('load', resolve)
        image.src = (<FileLoadEventTarget>event.target).result
      } else {
        reject()
      }
    })
  }

  // eslint-disable-next-line no-unused-vars
  onImageLoad (event: Event, minifyOptions: BrowserMinifyImageOptions ={}) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (context) {
        const image = <Image>event.target
        const { width, height, mimeType: originMimeType }= image
        const {
          mimeType = originMimeType,
          maxWidth = 500,
          maxHeight = 500,
          outputType,
          quality
        } = minifyOptions
        let targetWidth = width
        let targetHeight = height;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (height / width));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (width / height));
          }
        }
        canvas.width = targetWidth
        canvas.height = targetHeight
        context.drawImage(image, 0, 0, targetWidth, targetHeight)
        if (outputType === OUTPUT_BLOB) {
          canvas.toBlob(<any>resolve, mimeType, quality)
        } else {
          const dataURL = canvas.toDataURL(mimeType, quality)
          resolve(dataURL)
        }
      } else {
        reject()
      }
    })
  }
}
