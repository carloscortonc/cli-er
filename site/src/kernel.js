class Kernel {
  cpid = 1;

  getpid() {
    return this.cpid;
  }
}

const kernel = new Kernel();

export default kernel;
