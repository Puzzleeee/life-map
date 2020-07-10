import React, { useState, useEffect } from "react";

/**
 * A general purpose debouncer hook
 * @param {*} inputValue - the value to debounce
 * @param {Number} delay - the debounce delay
 */
const useDebouncer = (inputValue, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    // only update debounced value after specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    // clean the timer up so that we reset the debouncer on each inputValue change
    return () => {
      clearTimeout(timer);
    };
    // add inputValue as a dependency so the debouncer refreshes when it changes
  }, [delay, inputValue]);

  return debouncedValue;
};

export default useDebouncer;
