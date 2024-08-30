import { ChartData } from '../models/chart-data'

interface DecoderInt<TData> {
  decode: (dataArray: Uint8Array, initialPosition?: number, maxLength?: number) => ChartData<TData>
}

abstract class Decoder<TData> implements DecoderInt<TData> {
  public position: number = 0

  public abstract decode(
    dataArray: Uint8Array,
    initialPosition?: number,
    maxLength?: number
  ): ChartData<TData>

  protected getBuffer(buf: Uint8Array, setPositionLength: boolean = false) {
    const uint = this.uint(buf)
    const pos = this.position
    const length = this.position + uint

    if (setPositionLength) {
      this.position = length
    }

    return buf.slice(pos, length)
  }

  protected getString(buf: Uint8Array): string {
    return new TextDecoder().decode(this.getBuffer(buf, true))
  }

  protected getFloat(buf: Uint8Array): number {
    let view = new DataView(new ArrayBuffer(4))
    let bytes = buf.slice(this.position, this.position + 4)
    // reverse the bytes
    for (let i = 0; i < 4; i++) {
      view.setUint8(i, bytes[3 - i])
    }

    this.position += 4

    return view.getFloat32(0)
  }

  protected getInt(buf: Uint8Array) {
    const buffer = this.getBuffer(buf)

    if (buffer.length < 2) {
      return 0
    }
    const view = new DataView(buffer.buffer)

    return view.getInt8(0)
  }

  protected uint(buf: Uint8Array) {
    let l = 4294967295

    if (((l = (127 & buf[this.position]) >>> 0), buf[this.position++] < 128)) {
      return l
    }
    if (((l = (l | ((127 & buf[this.position]) << 7)) >>> 0), buf[this.position++] < 128)) {
      return l
    }
    if (((l = (l | ((127 & buf[this.position]) << 14)) >>> 0), buf[this.position++] < 128)) {
      return l
    }
    if (((l = (l | ((127 & buf[this.position]) << 21)) >>> 0), buf[this.position++] < 128)) {
      return l
    }
    if (((l = (l | ((15 & buf[this.position]) << 28)) >>> 0), buf[this.position++] < 128)) {
      return l
    }
    return l
  }
}

export class LineDecoder extends Decoder<number> {
  decode(dataArray: Uint8Array, initialPosition?: number, maxLength?: number): ChartData<number> {
    const chartData = new ChartData<number>()

    this.position = initialPosition ?? 0

    const length = maxLength ?? dataArray.length

    while (this.position < length) {
      const t = this.uint(dataArray)
      switch (t >>> 3) {
        case 2:
          if ((t & 7) === 2) {
            const uint = this.uint(dataArray)
            const c2 = uint + this.position
            while (this.position < c2) {
              const production = this.getFloat(dataArray)

              chartData.data.push(parseFloat((Math.round(production) / 1000).toFixed(2)))
            }
            break
          }
          chartData.data.push(this.getFloat(dataArray))
          break

        case 3:
          break

        default:
          break
      }
    }

    return chartData
  }
}

export class ChartDecoder extends Decoder<number> {
  decode(dataArray: Uint8Array, initialPosition?: number, maxLength?: number): ChartData<number> {
    this.position = initialPosition ?? 0

    const length = maxLength ?? dataArray.length

    let chartData = new ChartData<number>()

    const lineDecoder = new LineDecoder()

    const labels = []

    while (this.position < length) {
      const index = this.uint(dataArray)

      switch (index >>> 3) {
        case 1:
          labels.push(this.getString(dataArray))
          break

        case 2:
          chartData = lineDecoder.decode(
            dataArray,
            this.position,
            this.position + this.uint(dataArray)
          )

          this.position += lineDecoder.position
          break

        default:
          break
      }
    }

    chartData.labels = labels
    return chartData
  }
}
