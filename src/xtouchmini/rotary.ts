// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import midi from 'webmidi';
import { clamp, IChangedArgs } from './utils';
import { ISignal, Signal } from '@phosphor/signaling';
import { Disposable } from './disposable';

export class Rotary extends Disposable {
  /**
   * control is the midi CC number.
   */
  constructor(
    control: number,
    {
      lightMode = 'single',
      min = 0,
      max = 100,
      value = 50
    }: Rotary.IOptions = {}
  ) {
    super();
    this._control = control;
    this._lightMode = lightMode;
    this._min = min;
    this._max = max;
    midi.inputs[0].addListener('controlchange', 1, e => {
      if (e.controller.number === this._control) {
        // Value is relative
        let sign = e.value & 0x40 ? -1 : 1;
        let increment = sign * (e.value & 0x3f);
        console.log(increment);
        this.value += increment;
      }
    });
    this.value = value;
  }

  refresh() {
    let factor = this._lightMode === 'spread' ? 6.999999 : 10.999999;
    //  assumes 11 leds around rotary, so convert value to between 1 and 11
    let leds =
      Math.trunc(
        ((this._value - this._min) / (this._max - this._min)) * factor
      ) + 1;

    midi.outputs[0].sendControlChange(
      0x20 + this._control,
      lightModeNums.get(this._lightMode) + leds,
      1
    );
  }

  /**
   * value goes from min to max, inclusive.
   */
  get value() {
    return this._value;
  }
  set value(value: number) {
    const newValue = clamp(value, this._min, this._max);
    const oldValue = this._value;
    if (oldValue !== newValue) {
      this._value = newValue;
      this.refresh();
      this._stateChanged.emit({
        name: 'value',
        oldValue,
        newValue
      });
    }
  }

  /**
   * Setting the min may bump the value and max if necessary.
   */
  get min() {
    return this._min;
  }
  set min(newValue: number) {
    const oldValue = this._min;
    if (oldValue !== newValue) {
      if (newValue > this.value) {
        this.value = newValue;
      }
      if (newValue > this.max) {
        this.max = newValue;
      }
      this._min = newValue;
      this.refresh();
      this._stateChanged.emit({
        name: 'min',
        oldValue,
        newValue
      });
    }
  }

  /**
   * Setting the max may bump the value and min if necessary.
   */
  get max() {
    return this._max;
  }
  set max(newValue: number) {
    const oldValue = this._max;
    if (oldValue !== newValue) {
      if (newValue < this.value) {
        this.value = newValue;
      }
      if (newValue < this.min) {
        this.min = newValue;
      }
      this._max = newValue;
      this.refresh();
      this._stateChanged.emit({
        name: 'max',
        oldValue,
        newValue
      });
    }
  }

  /**
   * values can be:
   * * 'single' - light up a single light on value
   * * 'trim' - light from current value to top
   * * 'fan' - light up from left to current value
   * * 'spread' - light up from top down both sides
   */
  get lightMode() {
    return this._lightMode;
  }
  set lightMode(newValue: Rotary.LightMode) {
    const oldValue = this._lightMode;
    if (oldValue !== newValue) {
      this._lightMode = newValue;
      this.refresh();
      this._stateChanged.emit({
        name: 'lightMode',
        oldValue,
        newValue
      });
    }
  }

  /**
   * A signal fired when the widget state changes.
   */
  get stateChanged(): ISignal<this, Rotary.IStateChanged> {
    return this._stateChanged;
  }

  private _stateChanged = new Signal<this, Rotary.IStateChanged>(this);

  private _value: number;
  private _lightMode: Rotary.LightMode;
  private _min: number;
  private _max: number;
  private _control: number;
}

export namespace Rotary {
  export interface IOptions {
    lightMode?: LightMode;
    min?: number;
    max?: number;
    value?: number;
  }
  export type LightMode = 'single' | 'trim' | 'wrap' | 'spread';

  export type IStateChanged =
    | IChangedArgs<number, 'value'>
    | IChangedArgs<number, 'min'>
    | IChangedArgs<number, 'max'>
    | IChangedArgs<LightMode, 'lightMode'>;
}

/**
 * Map from the knob light mode to the appropriate MIDI command.
 */
const lightModeNums = new Map<Rotary.LightMode, number>([
  ['single', 0],
  ['trim', 0x10],
  ['wrap', 0x20],
  ['spread', 0x30]
]);
