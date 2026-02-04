export class FileDescriptor {
  buffer = "";
  type = undefined;

  constructor(type) {
    this.type = type;
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
