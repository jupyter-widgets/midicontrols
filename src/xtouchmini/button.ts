// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import midi from 'webmidi';

import { ISignal, Signal } from '@phosphor/signaling';
import { IChangedArgs } from './utils';
import { Disposable } from './disposable';

/**
 * A button
 */
export class Button extends Disposable {
  /**
   * @param control - the note number corresponding to the button
   * @param light - true when there is an indicator light for the button that
   * should reflect the toggle state.
   */
  constructor(
    control: number,
    { mode = 'momentary', light = true }: Button.IOptions = {}
  ) {
    super();
    this._control = control;
    this._mode = mode;
    this._light = light;
    midi.inputs[0].addListener('noteon', 1, e => {
      if (this.mode === 'momentary' && e.note.number === this._control) {
        this.toggled = !this._toggled;
        this.refresh();
      }
    });

    midi.inputs[0].addListener('noteoff', 1, e => {
      if (e.note.number === this._control) {
        this._click.emit(undefined);
        this.toggled = !this._toggled;
        this.refresh();
      }
    });
  }

  get toggled() {
    return this._toggled;
  }
  set toggled(newValue: boolean) {
    const oldValue = this._toggled;
    if (oldValue !== newValue) {
      this._toggled = newValue;
      this.refresh();
      this._stateChanged.emit({ name: 'toggled', oldValue, newValue });
    }
  }

  /**
   * The toggle mode for the button.
   *
   * The mode can be:
   * * 'momentary' - the button state is only changed momentarily while the button is held down
   * * 'toggle' - each full click of the button toggles the state
   */
  get mode() {
    return this._mode;
  }
  set mode(newValue: Button.ButtonMode) {
    const oldValue = this._mode;
    if (oldValue !== newValue) {
      this._mode = newValue;
      this.refresh();
      this._stateChanged.emit({ name: 'mode', oldValue, newValue });
    }
  }

  /**
   * Set the button light, if available.
   *
   * Possible values are:
   * * 0: off
   * * 1: blinking
   * * 127 (0x7F): on
   */
  setButtonLight(value: 0 | 1 | 127) {
    if (this._light) {
      midi.outputs[0].playNote(this._control, 1, {
        velocity: value,
        rawVelocity: true
      });
    }
  }

  /**
   * Refresh the indicated button state.
   */
  refresh() {
    this.setButtonLight(this._toggled ? 0x7f : 0);
  }

  /**
   * A signal fired when a button is clicked.
   */
  get click(): ISignal<this, void> {
    return this._click;
  }

  /**
   * A signal fired when the widget state changes.
   */
  get stateChanged(): ISignal<this, Button.IStateChanged> {
    return this._stateChanged;
  }

  private _click = new Signal<this, void>(this);
  private _stateChanged = new Signal<this, Button.IStateChanged>(this);

  private _control: number;
  private _light: boolean;
  private _mode: Button.ButtonMode;
  private _toggled = false;
}

export namespace Button {
  export type ButtonMode = 'momentary' | 'toggle';

  export interface IOptions {
    mode?: Button.ButtonMode;
    light?: boolean;
  }

  export type IStateChanged =
    | IChangedArgs<boolean, 'toggled'>
    | IChangedArgs<ButtonMode, 'mode'>;
}
