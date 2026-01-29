export default function handleKey(e, cbMap) {
  e.addEventListener("keydown", (e) => {
    cbMap[e.key]?.(e);
  });
}
