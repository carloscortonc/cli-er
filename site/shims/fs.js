module.exports = {
  readFileSync: (fd) => FS_FILES?.[fd],
  existsSync: () => true,
  realpathSync: () => "",
};
