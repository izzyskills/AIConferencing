export function mergeBuffers(lhs, rhs) {
  const mergedBuffer = new Int16Array(lhs.length + rhs.length);
  mergedBuffer.set(lhs, 0);
  mergedBuffer.set(rhs, lhs.length);
  return mergedBuffer;
}
