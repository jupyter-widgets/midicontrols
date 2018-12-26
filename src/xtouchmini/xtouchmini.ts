// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import midi from 'webmidi';
import { Button } from './button';
import { Rotary } from './rotary';
import { Fader } from './fader';

/**
 * Mini controller in  mode.
 */
export class XTouchMini {
  constructor() {
    // Make sure we are in MCU protocol mode
    midi.outputs[0].sendChannelMode(
      127,
      1 /* MCU mode */,
      1 /* global channel */
    );

    // Buttons are indexed top row left to right, then bottom row left to right.
    this.buttons = [
      0x59,
      0x5a,
      0x28,
      0x29,
      0x2a,
      0x2b,
      0x2c,
      0x2d,
      0x57,
      0x58,
      0x5b,
      0x5c,
      0x56,
      0x5d,
      0x5e,
      0x5f
    ].map(i => new Button(i, { mode: 'toggle' }));

    // The two buttons on the left side, top then bottom.
    this.sideButtons = [0x54, 0x55].map(i => new Button(i));

    // The press buttons for the rotary encoders, left to right.
    this.rotaryButtons = [0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27].map(
      i => new Button(i)
    );

    // Rotary encoders, left to right.
    this.rotary = [0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17].map(
      i => new Rotary(i)
    );

    this.fader = new Fader(9);
  }

  refresh() {
    this.buttons.forEach(b => {
      b.refresh();
    });
  }

  readonly rotary: Rotary[];
  readonly rotaryButtons: Button[];
  readonly buttons: Button[];
  readonly sideButtons: Button[];
  readonly fader: Fader;
}
