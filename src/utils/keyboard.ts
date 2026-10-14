/**
 * How far (in px) to scroll so a focused input ends up above the keyboard.
 * Returns 0 when the input is already visible.
 *
 * @param inputBottom Bottom edge of the input in window coordinates.
 * @param keyboardTop Top edge of the keyboard in screen coordinates.
 * @param margin Extra space to keep between the input and the keyboard.
 */
export function getKeyboardScrollDelta(
  inputBottom: number,
  keyboardTop: number,
  margin: number,
): number {
  return Math.max(0, inputBottom + margin - keyboardTop);
}
