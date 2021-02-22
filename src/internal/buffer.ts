import { LibraryModule } from "./struct";

export class BufferReader {
  view: DataView;
  off: number;

  static create(m: LibraryModule, ptr: number, len: number) {
    return new BufferReader(new DataView(m.HEAP8.buffer, ptr, len));
  }

  constructor(view: DataView, off?: number) {
    this.view = view;
    this.off = off ?? 0;
  }
  get avail(): number {
    return this.view.byteLength - this.off;
  }
  sub(length: number): BufferReader {
    if (this.avail < length) {
      throw new Error("eof");
    }
    const b = new BufferReader(
      new DataView(this.view.buffer, this.view.byteOffset + this.off, length),
      0
    );
    this.off += length;
    return b;
  }
  bytes(length: number): number[] {
    if (this.avail < length) {
      throw new Error("eof");
    }
    const bytes = this.view.buffer.slice(
      this.view.byteOffset + this.off,
      this.view.byteOffset + this.off + length
    );
    return Array.from(new Uint8Array(bytes));
  }
  u8(): number {
    if (this.avail < 1) {
      throw new Error("eof");
    }
    const value = this.view.getUint8(this.off);
    this.off += 1;
    return value;
  }
  i8(): number {
    if (this.avail < 1) {
      throw new Error("eof");
    }
    const value = this.view.getInt8(this.off);
    this.off += 1;
    return value;
  }
  u16(): number {
    if (this.avail < 2) {
      throw new Error("eof");
    }
    const value = this.view.getUint16(this.off, true);
    this.off += 2;
    return value;
  }
  i16(): number {
    if (this.avail < 2) {
      throw new Error("eof");
    }
    const value = this.view.getInt16(this.off, true);
    this.off += 2;
    return value;
  }
  u32(): number {
    if (this.avail < 4) {
      throw new Error("eof");
    }
    const value = this.view.getUint32(this.off, true);
    this.off += 4;
    return value;
  }
  i32(): number {
    if (this.avail < 4) {
      throw new Error("eof");
    }
    const value = this.view.getInt32(this.off, true);
    this.off += 4;
    return value;
  }
  u64(): bigint {
    if (this.avail < 8) {
      throw new Error("eof");
    }
    const value = this.view.getBigUint64(this.off, true);
    this.off += 8;
    return value;
  }
  i64(): bigint {
    if (this.avail < 8) {
      throw new Error("eof");
    }
    const value = this.view.getBigInt64(this.off, true);
    this.off += 8;
    return value;
  }
}
