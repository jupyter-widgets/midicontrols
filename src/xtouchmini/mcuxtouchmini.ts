// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import { MCUButton } from './mcubutton';
import { MCUKnob } from './mcuknob';
import { MCUFader } from './mcufader';

/**
 * Mini controller in MCU mode.
 */
export class MCUXTouchMini {
  constructor() {
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
    ].map(i => new MCUButton(i, { mode: 'toggle' }));
    this.sideButtons = [0x54, 0x55].map(i => new MCUButton(i));
    this.knobButtons = [0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27].map(
      i => new MCUButton(i)
    );
    let lightModes: MCUKnob.LightMode[] = ['single', 'spread', 'trim', 'wrap'];
    this.knobs = [0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17].map((i, j) => new MCUKnob(i, {lightMode: lightModes[j%4]}));
    this.fader = new MCUFader(9);
  }

  refresh() {
    this.buttons.forEach(b => {
      b.refresh();
    });
  }

  readonly knobs: MCUKnob[];
  readonly knobButtons: MCUButton[];
  readonly buttons: MCUButton[];
  readonly sideButtons: MCUButton[];
  readonly fader: MCUFader;
}
