import { useState, useEffect } from 'react';

function useDebounce<T>(initValue: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(initValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(initValue);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [initValue, delay]);

  return debouncedValue;
}
export default useDebounce;
