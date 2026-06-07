import kernel, { FileDescriptor } from "../kernel";
import * as renderer from "../renderer";
import fs from "../fs";

/**
 * Object containing a stack for each FD.
 * When a FD's value is updated, the new FD value is pushed into the stack. Once it has been used,
 * is should popped, so previous FD value is restored
 */
class FileDescriptorStack {
  value = { 0: [], 1: [], 2: [] };

  init() {
    for (const fd in this.value) {
      this.value[fd] = [];
      this.push(fd, new FileDescriptor("TTY"));
    }
  }

  push(fd, value) {
    kernel.setFD(fd, value);
    this.value[fd].push(value);
  }

  pop(fd) {
    const v = this.value[fd].pop();
    const s = this.value[fd];
    kernel.setFD(fd, s[s.length - 1]);
    return v;
  }

  async flush() {
    for (const fd of [2, 1]) {
      const d = kernel.getFD(fd);
      if (d.type === "TTY") {
        const buffer = d.flush();
        buffer && renderer.renderOutput(buffer.replace(/\n?$/, "\n"), { error: fd == 2 });
      } else if (d.type === "FILE") {
        const buffer = d.flush();
        await fs.writeFile(d.metadata.name, buffer, { concat: true });
      }
    }
  }
}

const FDStack = new FileDescriptorStack();

export default FDStack;
