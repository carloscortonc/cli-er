class Kernel {
  cpid = 1;
  fds = { 0: undefined, 1: undefined, 2: undefined };

  getpid() {
    return this.cpid;
  }

  getFD(fd) {
    return this.fds[fd];
  }

  setFD(fd, value) {
    this.fds[fd] = value;
  }
}

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

const kernel = new Kernel();

export default kernel;
