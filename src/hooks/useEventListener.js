import { useEffect, useRef } from 'react';

const useEventListener = (eventType, callback, element) => {
  const savedHandler = useRef(callback);

  useEffect(() => {
    savedHandler.current = callback;
  }, [callback]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;

    if (isSupported) {
      const eventListener = (event) => savedHandler.current(event);
      element.addEventListener(eventType, eventListener);

      return () => {
        element.removeEventListener(eventType, eventListener);
      };
    }

    return undefined;
  }, [eventType, element]);
};

export default useEventListener;
