class Path {
  cwd = "/";

  getCwd() {
    return this.cwd;
  }

  async setCwd(path) {
    this.cwd = path || "/";
  }

  resolve(...parts) {
    const base = parts[0].replace(/\/*$/, "/");
    return (
      parts
        .slice(1)
        .reduce((acc, p) => new URL(p, acc), new URL("https://_" + base))
        .pathname.replace(/\/*$/, "") || "/"
    );
  }

  relative(from, to) {
    const r = this.resolve(from, to);
    const parts = [from, r].map((e) => e.split("/").filter(Boolean));
    const i = parts[1].findIndex((e, index) => e !== parts[0][index]) ?? parts[0].length - 1;
    const base = i > parts[0].length - 1 ? ["."] : Array.from({ length: parts[0].length - i }, () => "..");
    return base.concat(parts[1].slice(i)).join("/");
  }

  basename(path) {
    if (path === "/") return "/";
    return /[^\/]+$/.exec(path)?.[0];
  }
}

const path = new Path();

export default path;
