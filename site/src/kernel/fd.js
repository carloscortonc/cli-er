export class FileDescriptor {
  buffer = "";
  type = undefined;
  metadata = {};

  constructor(type, metadata) {
    this.type = type;
    this.metadata = metadata;
  }

  write(v) {
    this.buffer += v;
  }

  flush() {
    const v = this.buffer;
    this.buffer = "";
    return v;
  }
}
