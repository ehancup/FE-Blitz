// import { UNDERSCORE_NOT_FOUND_ROUTE_ENTRY } from 'next/dist/shared/lib/constants';
import React, { useState, useEffect } from 'react';

const useDebouncedValue = (inputValue: number, delay : number) => {
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  return debouncedValue;
};

export default useDebouncedValue