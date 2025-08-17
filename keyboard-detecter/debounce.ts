type DebouncedFunction = {
  (): void;
  cancel: () => void;
};

export function debounce(fn: () => void, wait: number): DebouncedFunction {
  let timeout: number | null = null;
  const debounced = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(fn, wait);
  };
  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  return debounced;
}
