export function unreachable(
  _value: never,
  message = "Entered unreachable code"
) {
  throw Error(message);
}
