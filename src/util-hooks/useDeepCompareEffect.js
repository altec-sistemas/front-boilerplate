import { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import usePrevious from './usePrevious';

export default function useDeepCompareEffect(callback, inputs) {
  const cleanupRef = useRef();
  const previousInputs = usePrevious(inputs);
  useEffect(() => {
    if (!isEqual(previousInputs, inputs)) {
      cleanupRef.current = callback();
    }
    return cleanupRef.current;
  });
}
