import {useCallback, useEffect, useState} from 'react';
import {fetchTestSeries} from '../services/testSeriesService';
import type {TestSeries} from '../types/testSeries';

type Status = 'loading' | 'success' | 'error';

interface State {
  status: Status;
  data: TestSeries[];
}

/** Loads the test series for the given category ids. */
export function useTestSeries(categoryIds: string[]) {
  const key = categoryIds.join(',');
  const [state, setState] = useState<State>({status: 'loading', data: []});
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState(current => ({...current, status: 'loading'}));
    fetchTestSeries(key ? key.split(',') : [])
      .then(data => {
        if (active) {
          setState({status: 'success', data});
        }
      })
      .catch(() => {
        if (active) {
          setState({status: 'error', data: []});
        }
      });
    return () => {
      active = false;
    };
  }, [key, attempt]);

  const retry = useCallback(() => setAttempt(count => count + 1), []);

  return {...state, retry};
}
