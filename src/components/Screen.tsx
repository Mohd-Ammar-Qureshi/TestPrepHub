import React, {
  createContext,
  type ComponentRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme, type Theme} from '../theme';
import {getKeyboardScrollDelta} from '../utils/keyboard';

interface ScreenProps {
  children: React.ReactNode;
  /** Wrap content in a ScrollView (default). Set false for fixed layouts. */
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

interface ScreenKeyboardContextValue {
  /** Scrolls the focused input above the keyboard if it is hidden. */
  ensureFocusedVisible: () => void;
}

const ScreenKeyboardContext = createContext<ScreenKeyboardContextValue | null>(
  null,
);

/** Lets an input ask its parent Screen to keep it above the keyboard. */
export function useScreenKeyboard() {
  return useContext(ScreenKeyboardContext);
}

// Space kept between the focused input and the keyboard. It is large enough to
// also reveal the next field or the submit button below the input.
const KEYBOARD_MARGIN = 80;
const SCROLL_DELAY_MS = 150;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {flex: 1, backgroundColor: theme.colors.background},
    flex: {flex: 1},
    scrollContent: {flexGrow: 1, padding: theme.spacing.lg},
    fixedContent: {flex: 1, padding: theme.spacing.lg},
  });

export function Screen({
  children,
  scroll = true,
  contentContainerStyle,
}: ScreenProps) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const scrollYRef = useRef(0);
  const keyboardTopRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollFocusedInputIntoView = useCallback(() => {
    const input = TextInput.State.currentlyFocusedInput();
    const keyboardTop = keyboardTopRef.current;
    if (!scroll || !input || keyboardTop === null) {
      return;
    }
    // Status bar height is added on Android because input positions can be
    // measured from below it on devices that are not edge-to-edge.
    const margin =
      KEYBOARD_MARGIN +
      (Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0);
    input.measureInWindow((_x, y, _width, height) => {
      const delta = getKeyboardScrollDelta(y + height, keyboardTop, margin);
      if (delta > 0) {
        scrollRef.current?.scrollTo({
          y: scrollYRef.current + delta,
          animated: true,
        });
      }
    });
  }, [scroll]);

  const ensureFocusedVisible = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Wait a moment so the keyboard and the layout have settled.
    timerRef.current = setTimeout(scrollFocusedInputIntoView, SCROLL_DELAY_MS);
  }, [scrollFocusedInputIntoView]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', event => {
      keyboardTopRef.current = event.endCoordinates.screenY;
      // On iOS KeyboardAvoidingView shrinks the view. On Android the window is
      // not always resized (edge-to-edge), so room for the keyboard is added
      // to the scrollable content instead. Extra space there is harmless.
      if (Platform.OS === 'android') {
        setKeyboardHeight(event.endCoordinates.height);
      }
      ensureFocusedVisible();
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      keyboardTopRef.current = null;
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [ensureFocusedVisible]);

  const contextValue = useMemo(
    () => ({ensureFocusedVisible}),
    [ensureFocusedVisible],
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = event.nativeEvent.contentOffset.y;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScreenKeyboardContext.Provider value={contextValue}>
          {scroll ? (
            <ScrollView
              ref={scrollRef}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={
                Platform.OS === 'ios' ? 'interactive' : 'on-drag'
              }
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={[
                styles.scrollContent,
                contentContainerStyle,
                keyboardHeight > 0
                  ? {paddingBottom: theme.spacing.lg + keyboardHeight}
                  : null,
              ]}>
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.fixedContent, contentContainerStyle]}>
              {children}
            </View>
          )}
        </ScreenKeyboardContext.Provider>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
