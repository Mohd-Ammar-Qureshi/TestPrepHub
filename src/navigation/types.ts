import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {TestResult} from '../types/test';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  /**
   * First-time category choice. It has its own route name so that, once the
   * categories are saved, the navigator drops it and lands on Home. (Reusing
   * the name CategorySelection kept the student on this screen.)
   */
  CategorySetup: undefined;
  /** Updating categories later, opened from Home or Profile. */
  CategorySelection: {mode?: 'onboarding' | 'edit'} | undefined;
  Home: undefined;
  TestSeriesDetails: {testSeriesId: string};
  TakeTest: {testSeriesId: string};
  /** saved is false when the attempt could not be stored on the device. */
  TestResult: {result: TestResult; saved?: boolean};
  AnswerReview: {result: TestResult};
  AttemptHistory: undefined;
  Profile: undefined;
  StudentDetails: undefined;
  EditProfile: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
