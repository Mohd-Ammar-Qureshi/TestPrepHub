# TestPrep Hub

A React Native mobile app for students. Register, pick the subjects you want to practise, browse mock test series for those subjects, and manage your profile, in light or dark mode.

> **Demo app:** there is no backend. Accounts, login sessions and settings are saved on your device with AsyncStorage, and test series come from mock JSON. Passwords are stored in plain text locally, so this is **demo authentication only and not secure**. Do not use real passwords.

## Features

- Splash screen, then registration and login (with email **or** mobile number)
- Category selection after registration: General Knowledge, Mathematics, Reasoning, English, Computer Science
- Home screen listing test series for your selected categories, with filters and your best score on each card
- Test series details: questions, duration, total marks, difficulty, topics, and your past performance
- **Random questions:** every test draws its questions at random from a larger pool and shuffles the answer options, so a retake gives a different paper
- **Timed tests** with a countdown, question navigation, answer changes, confirm-before-submit and automatic submission when time runs out
- **Results** with score, percentage, correct / incorrect / unanswered counts and time taken
- Custom, theme-aware confirmation dialogs (log out, leave test, submit test, profile updated) instead of system alerts
- **Answer review** showing your answer and the correct answer for every question
- **Attempt history** saved per student, with average and best score on the profile
- Student profile, edit profile, update categories, logout
- Dark, light or system theme, remembered between launches

## Assignment coverage

This project was built for the *React Native Developer Task: Student Test Series Application*. It covers the complete student journey: registration, category selection, viewing relevant test series, and managing profile details.

**Required screens (8)**

| # | Screen | File |
|---|---|---|
| 1 | Splash | `src/screens/SplashScreen.tsx` |
| 2 | Student Registration | `src/screens/RegisterScreen.tsx` |
| 3 | Student Login | `src/screens/LoginScreen.tsx` |
| 4 | Category Selection | `src/screens/CategorySelectionScreen.tsx` |
| 5 | Home / Test Series | `src/screens/HomeScreen.tsx` |
| 6 | Test Series Details | `src/screens/TestSeriesDetailsScreen.tsx` |
| 7 | Student Profile (menu) and Student Details | `src/screens/ProfileScreen.tsx`, `src/screens/StudentDetailsScreen.tsx` |
| 8 | Edit Profile | `src/screens/EditProfileScreen.tsx` |

**Technical requirements**

| Requirement | How it is met |
|---|---|
| React Native for Android and iOS | React Native CLI project (Android and iOS projects included; iOS untested) |
| Navigation with React Navigation | Native stack navigator in `src/navigation/` |
| Reusable components, clean structure | Shared UI in `src/components/`, feature code split into screens, services, hooks, context, utils |
| Form validation and error handling | React Hook Form, shared rules in `src/utils/validation.ts`, error messages and banners |
| Persist student preferences and session | AsyncStorage: accounts, login session, categories, theme and test attempts |
| Mock data or APIs | Mock JSON in `src/data/testSeries.json` and `src/data/questions.json`, served by mock services |
| Modern, responsive UI | Theme system with light and dark mode, flexible layouts, keyboard-aware screens |

**Extensions beyond the assignment:** the assignment does not require taking tests. This project adds four more screens (Take Test, Test Result, Answer Review, Attempt History) so the student journey continues after **Start Test**.

| Extension | File |
|---|---|
| Take Test (timer, questions, submit) | `src/screens/TakeTestScreen.tsx` |
| Test Result | `src/screens/TestResultScreen.tsx` |
| Answer Review | `src/screens/AnswerReviewScreen.tsx` |
| Attempt History | `src/screens/AttemptHistoryScreen.tsx` |

**Test series cards** show the name, category, number of questions, duration, total marks, difficulty and a **Start Test** button, and the Home screen has an empty state when nothing matches.

## Tech stack

React Native CLI, TypeScript, React Navigation, React Hook Form, AsyncStorage.

## Requirements

- Node.js (a current LTS version) and npm
- JDK and Android Studio with an emulator or a USB-connected Android device (for Android)
- Xcode and CocoaPods (for iOS, macOS only)

Follow the official React Native guide to set up your machine: https://reactnative.dev/docs/set-up-your-development-environment

## Getting started

```bash
# 1. Download the project
git clone <repository-url>
cd TestPrepHub

# 2. Install dependencies
npm install
```

### Run on Android

Start an emulator (or connect a device with USB debugging on), then:

```bash
# Terminal 1: start the bundler
npx react-native start

# Terminal 2: build and launch the app
npx react-native run-android
```

### Run on iOS (macOS only)

```bash
cd ios
bundle install
bundle exec pod install
cd ..
npx react-native run-ios
```

iOS has not been tested.

## Using the app

1. Tap **Create account** and register with your name, email, a 10-digit mobile number and a password (8 or more characters, with a letter and a number).
2. Choose one or more categories and tap **Continue**.
3. Browse the test series. Use the filter chips and open a card to see its details.
4. On the details screen, tap **Start Test**. Answer the questions (you can move between them, change or clear answers, and jump using the numbered buttons), then tap **Submit**. The test also submits itself when the timer reaches zero.
5. See your result, then tap **Review answers** to compare your answers with the correct ones, **Retake test**, or go back to the list.
6. Your best score appears on each test card. Tap **History** on Home, or open your profile (avatar, top right) and choose **View attempt history**.
7. The profile is a menu of options: **Student details** (your saved name, email, mobile, registration date and categories), **Edit profile**, **Update categories** and **Attempt history**. It also has the theme switch and **Log out**.
8. Close and reopen the app. Your session, categories, theme and attempts are restored.

Each test has 5 questions, drawn at random from a pool of 10 for that test and shown in random order with the answer options shuffled, so a retake gives a different paper. All questions carry equal marks and there is no negative marking.

## Screenshots and demo

Add your screenshots or a short screen recording of the full journey to a `docs/` folder and update the links below.

| Screen | Image |
|---|---|
| Splash | `docs/screenshots/01-splash.png` |
| Registration | `docs/screenshots/02-register.png` |
| Login | `docs/screenshots/03-login.png` |
| Category selection | `docs/screenshots/04-categories.png` |
| Home / test series | `docs/screenshots/05-home.png` |
| Test series details | `docs/screenshots/06-details.png` |
| Profile | `docs/screenshots/07-profile.png` |
| Edit profile | `docs/screenshots/08-edit-profile.png` |
| Take test | `docs/screenshots/09-take-test.png` |
| Test result | `docs/screenshots/10-result.png` |
| Answer review | `docs/screenshots/11-review.png` |
| Attempt history | `docs/screenshots/12-history.png` |
| Dark theme | `docs/screenshots/13-dark-theme.png` |

Demo video: *add a link or the file path here*

## Project structure

```
App.tsx                  Root file: re-exports src/App
src/
  components/            Reusable UI components
  context/               Auth state, saved test attempts, and the custom dialog provider
  data/                  Categories, mock test series (testSeries.json) and questions (questions.json)
  hooks/                 Custom hooks (test series loading, countdown timer, logout confirmation)
  navigation/            Navigator and route types
  screens/               App screens
  services/              Local account and attempt storage, mock test series and question services
  theme/                 Light/dark colours and ThemeProvider
  types/                 TypeScript types
  utils/                 Storage, validation, scoring and formatting helpers
```

## Mock data helpers

- Edit or add test series in `src/data/testSeries.json`. Each series needs a matching pool in `src/data/questions.json`, keyed by the series `id`. Add at least `totalQuestions` questions; adding more gives more variety, because each test draws `totalQuestions` of them at random.
- Each question has `text`, four `options` and `correctIndex` (the position of the right option, starting at 0). Options are shuffled when a test starts, and the paper the student saw is saved with the attempt so the review matches it.
- Marks are split equally: marks per question = `totalMarks` / number of questions.
- To change how long a test lasts, edit `durationMinutes` in `testSeries.json`.
- To preview the **empty state**, remove all entries for one category from `testSeries.json` and select only that category.
- To preview the **error state**, set `SIMULATE_FAILURE` to `true` in `src/services/testSeriesService.ts` and reload. Set it back to `false` afterwards.
- To reset all saved data (accounts, attempts, theme), clear the app's storage in Android settings or uninstall the app.

## Troubleshooting

| Problem | Fix |
|---|---|
| Old code keeps showing | Restart the bundler with `npx react-native start --reset-cache` |
| App won't build after `npm install` | Run `cd android`, then `gradlew.bat clean` (Windows) or `./gradlew clean` (macOS/Linux), then run the app again |
| "No devices found" | Start an emulator or connect a device, then check `adb devices` |
| Red error screen about a missing module | Run `npm install`, then rebuild with `npx react-native run-android` |
| iOS build fails | Run `bundle exec pod install` again inside `ios/` |

## Known limitations

- Local demo authentication only: no backend, password reset or password change.
- Attempts are saved only on the device. They are not synced and are lost if the app data is cleared.
- Each test draws 5 questions from a pool of only 10 (150 in total), so questions repeat across retakes, although the selection, order and answer positions change. The facts in the questions were not independently reviewed.
- A test cannot be paused or resumed. Leaving a test discards its answers.
- No automated tests.#   T e s t P r e p H u b  
 