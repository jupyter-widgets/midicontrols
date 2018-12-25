// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * A generic interface for change emitter payloads.
 */
export interface IChangedArgs<T, U = string> {
  /**
   * The name of the changed attribute.
   */
  name: U;
  /**
   * The old value of the changed attribute.
   */
  oldValue: T;
  /**
   * The new value of the changed attribute.
   */
  newValue: T;
}
