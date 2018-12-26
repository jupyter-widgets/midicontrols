// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import midi from 'webmidi';
import { clamp } from './utils';


export type Nibble = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export class Fader {
  /**
   * control is the midi pitchblend channel number.
   */
  constructor(
    channel: Nibble,
    {
      min = 0,
      max = 127,
      value = 50,
      motorized = false
    }: Fader.IOptions = {}
  ) {
    this._channel = channel;
    this._motorized = motorized;
    this._min = min;
    this._max = max;
    // TODO: provide a 'pickup' fader mode?
    midi.inputs[0].addListener('pitchbend', this._channel, e => {
      // for the xtouch mini, we only have the 7 msb of pitchblend number
      this.value = ((this._max - this._min) * (e.data[2]/127)) + this._min;
    });
    this.value = value;
  }

  refresh() {
    if (this._motorized) {
      // TODO: if this value change came from the controller fader, we don't need to send it back?
      const faderValue =
      ((this._value - this._min) / (this._max - this._min)) * 2 - 1;
    midi.outputs[0].sendPitchBend(faderValue, this._channel);
    }
  }

  /**
   * value goes from min to max, inclusive.
   */
  get value() {
    return this._value;
  }
  set value(value: number) {
    value = clamp(value, this._min, this._max);
    console.log(value);
    if (value !== this._value) {
      this._value = value;
      // emit state change?
      this.refresh();
    }
  }

  private _channel: Nibble;
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
}
