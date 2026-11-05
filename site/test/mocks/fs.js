const fs = {
  stdin: "",
  async info() {},
  setStdin(value) {
    this.stdin = value || "";
  },
};

export default fs;
