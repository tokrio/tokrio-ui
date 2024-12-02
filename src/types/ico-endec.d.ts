declare module 'ico-endec' {
  interface IcoImageData {
    width: number;
    height: number;
    data: Buffer;
    bpp: number;
  }

  export function encode(images: IcoImageData[]): Buffer;
  export function decode(buffer: Buffer): IcoImageData[];
} 