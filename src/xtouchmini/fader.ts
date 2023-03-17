// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import { clamp, IChangedArgs, MIDIController } from './utils';
import { ISignal, Signal } from '@lumino/signaling';
import { Disposable } from './disposable';

export type MidiChannel =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16;

export class Fader extends Disposable {
  /**
   * control is the midi pitchblend control number.
   */
  constructor(
    controller: MIDIController,
    control: MidiChannel,
    { min = 0, max = 127, value = 0, motorized = false }: Fader.IOptions = {}
  ) {
    super();
    this._control = control;
    this._motorized = motorized;
    this._min = min;
    this._max = max;
    // TODO: provide a 'pickup' fader mode?

    controller.input.addListener('pitchbend', this._control, e => {
      // for the xtouch mini, we only have the 7 msb of the pitchblend number,
      // so we only use e.data[2]
      this.value = Math.round((this._max - this._min) * (e.data[2] / 127)) + this._min;
    });
    this.value = value;
  }

  refresh() {
    if (this._motorized) {
      // TODO: if this value change came from the controller fader, we don't need to send it back?
      const faderValue =
        ((this._value - this._min) / (this._max - this._min)) * 2 - 1;
      this._controller.output.sendPitchBend(faderValue, this._control);
    }
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
   * A signal fired when the widget state changes.
   */
  get stateChanged(): ISignal<this, Fader.IStateChanged> {
    return this._stateChanged;
  }

  private _stateChanged = new Signal<this, Fader.IStateChanged>(this);

  private _controller: MIDIController;
  private _control: MidiChannel;
  private _max: number;
  private _min: number;
  private _motorized: boolean;
  private _value: number;
}

export namespace Fader {
  export interface IOptions {
    min?: number;
    max?: number;
    value?: number;
    motorized?: boolean;
  }

  export type IStateChanged =
    | IChangedArgs<number, 'value'>
    | IChangedArgs<number, 'min'>
    | IChangedArgs<number, 'max'>;
}
