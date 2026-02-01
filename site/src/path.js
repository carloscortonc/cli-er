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

  basename(path) {
    if (path === "/") return "/";
    return /[^\/]+$/.exec(path)?.[0];
  }
}

const path = new Path();

export default path;
