import { LibraryModule } from "./struct";

class BufferReader {
  m: LibraryModule;
  ptr: number;
  len: number;
  off: number;

  constructor(m: LibraryModule, ptr: number, len: number) {
    this.m = m;
    this.ptr = ptr;
    this.len = len;
    this.off = 0;
  }
  readU8(): number {
    if (this.off + 1 > this.len) {
      throw new Error("eof");
    }
    const value = this.m.getValue(this.ptr + this.off, "i8");
    this.off += 1;
    return value < 0 ? 0xff - value : value;
  }
  readI8(): number {
    if (this.off + 1 > this.len) {
      throw new Error("eof");
    }
    const value = this.m.getValue(this.ptr + this.off, "i8");
    this.off += 1;
    return value;
  }
  readU16(): number {
    if (this.off + 2 > this.len) {
      throw new Error("eof");
    }
    const value = this.m.getValue(this.ptr + this.off, "i16");
    this.off += 2;
    return value < 0 ? 0xffff - value : value;
  }
  readI16(): number {
    if (this.off + 2 > this.len) {
      throw new Error("eof");
    }
    const value = this.m.getValue(this.ptr + this.off, "i16");
    this.off += 2;
    return value;
  }
  readU32(): number {
    if (this.off + 4 > this.len) {
      throw new Error("eof");
    }
    const value = this.m.getValue(this.ptr + this.off, "i32");
    this.off += 4;
    return value < 0 ? 0xffffffff - value : value;
  }
  readI32(): number {
    if (this.off + 4 > this.len) {
      throw new Error("eof");
    }
    const value = this.m.getValue(this.ptr + this.off, "i32");
    this.off += 4;
    return value;
  }
  readU64(): bigint {
    if (this.off + 8 > this.len) {
      throw new Error("eof");
    }
    const low = this.readU32();
    const high = this.readU32();
    return BigInt(low) | (BigInt(high) << 32n);
  }
  readI64(): bigint {
    if (this.off + 8 > this.len) {
      throw new Error("eof");
    }
    // TODO: fix
    return this.readU64();
  }
}
