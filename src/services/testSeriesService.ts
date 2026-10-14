import rawTestSeries from '../data/testSeries.json';
import type {TestSeries} from '../types/testSeries';

const ALL_TEST_SERIES = rawTestSeries as TestSeries[];

// Mock "API" settings. There is no backend, so the delay only makes the
// loading state visible. Set SIMULATE_FAILURE to true to preview the error
// state and its Retry button.
const SIMULATED_DELAY_MS = 400;
const SIMULATE_FAILURE: boolean = false;

export function fetchTestSeries(categoryIds: string[]): Promise<TestSeries[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (SIMULATE_FAILURE) {
        reject(new Error('Failed to load test series'));
        return;
      }
      resolve(
        ALL_TEST_SERIES.filter(item => categoryIds.includes(item.categoryId)),
      );
    }, SIMULATED_DELAY_MS);
  });
}

export function getTestSeriesById(id: string): TestSeries | undefined {
  return ALL_TEST_SERIES.find(item => item.id === id);
}
