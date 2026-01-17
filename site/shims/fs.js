module.exports = {
  readFileSync: () => undefined,
  existsSync: (p) => {
    console.log("[existsSync]", p);
    return true;
  },
  realpathSync: () => "",
};
