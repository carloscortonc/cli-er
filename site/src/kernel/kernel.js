class Kernel {
  cpid = 1;
  fds = { 0: undefined, 1: undefined, 2: undefined };
  processmap = {};

  getpid() {
    return this.cpid;
  }

  gethostname() {
    return window.location.hostname;
  }

  getFD(fd) {
    return this.fds[fd];
  }

  setFD(fd, value) {
    this.fds[fd] = value;
  }

  registerProcess(w) {
    this.processmap[this.cpid] = w;
  }

  kill(signal) {
    if (!this.processmap[this.cpid]) return;
    this.processmap[this.cpid].postMessage(JSON.stringify({ type: "signal", value: signal }));
  }
}

const kernel = new Kernel();

export default kernel;
