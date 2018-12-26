// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import { Button } from './button';

/**
 * A group of toggle buttons, one of which can be selected.
 */
export class ButtonGroup {
  constructor(buttons: Button[]) {
    this._buttons = buttons;
    this._activeIndex = 0;
    // Any time a button's state changes, set all other buttons to not toggled.
    const updateActive = (button: Button, args: Button.IStateChanged) => {
      if (args.name === 'toggled' && args.newValue === true) {
        this.activeIndex = this._buttons.indexOf(button);
      }
    };

    buttons.forEach(button => {
      button.stateChanged.connect(updateActive);
    });
  }

  get activeIndex() {
    return this._activeIndex;
  }
  set activeIndex(newValue: number) {
    let oldValue = this._activeIndex;
    if (oldValue !== newValue) {
      this._buttons.forEach((button, j) => {
        button.toggled = j === newValue;
      });
    }
  }

  private _buttons: Button[];
  private _activeIndex: number;

  // Perhaps this logic can be on the python side. We just want a toggle button on the js side?
}
