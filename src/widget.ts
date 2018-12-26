// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import midi from 'webmidi';

import {
  unpack_models,
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
  resolvePromisesDict
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';
import { Button } from './xtouchmini/button';

export class ButtonModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'ButtonModel',
      _model_module: MODULE_NAME,
      _model_module_version: MODULE_VERSION,
      _view_name: 'ButtonView',
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,

      // Private attributes for just this widget
      _control: 0,
      _light: true,

      value: false,
      mode: 'momentary'
    };
  }

  initialize(attributes: any, options: any) {
    super.initialize(attributes, options);
    if (!midi.enabled) {
      throw new Error('WebMidi library not enabled');
    }
    this._button = new Button(attributes._control, {
      mode: attributes.mode,
      light: attributes._light
    });
    this._button.stateChanged.connect((sender, args) => {
      switch (args.name) {
        case 'toggled':
          this.set('value', args.newValue);
          break;
        case 'mode':
          this.set('mode', args.newValue);
          break;
      }
      this.save_changes();
    });
    this.listenTo(this, 'change', () => {
      const changed = this.changedAttributes() || {};
      if (changed.hasOwnProperty('value')) {
        this._button.toggled = changed.value;
      }
      if (changed.hasOwnProperty('mode')) {
        this._button.mode = changed.mode;
      }
    });
  }

  destroy(options: any) {
    this._button.dispose();
    super.destroy(options);
  }

  private _button: Button;
}

export class XTouchMiniModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'XTouchMiniModel',
      _model_module: MODULE_NAME,
      _model_module_version: MODULE_VERSION,
      _view_name: 'XTouchMiniView',
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,
      buttons: [],
      side_buttons: [],
      rotary_encoders: [],
      rotary_buttons: [],
      faders: []
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    buttons: { deserialize: unpack_models },
    side_buttons: { deserialize: unpack_models },
    rotary: { deserialize: unpack_models },
    rotary_buttons: { deserialize: unpack_models },
    fader: { deserialize: unpack_models }
  };

  initialize(attributes: any, options: any) {
    super.initialize(attributes, options);
    if (!midi.enabled) {
      throw new Error('WebMidi library not enabled');
    }
    // Make sure we are in MCU protocol mode
    // midi.outputs[0].sendChannelMode(
    //   127,
    //   1 /* MCU mode */,
    //   1 /* global channel */
    // );
    this.setup().then((controls: any) => {
      this.set(controls);
      this.save_changes();
    });
  }

  async setup() {
    // Create control widgets
    return resolvePromisesDict({
      buttons: Promise.all(this._createButtons())
      // side_buttons: this._createSideButtons(),
      // rotary_encoders: this._createRotaryEncoders(),
      // rotary_buttons: this._createRotaryButtons(),
      // faders: this._createFaders()
    });
  }

  _createButtons() {
    // Buttons are indexed top row left to right, then bottom row left to right.
    return [
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
    ].map(_control =>
      this._createButtonModel({
        _control,
        mode: 'momentary'
      })
    );
  }

  /**
   * Creates a gamepad button widget.
   */
  async _createButtonModel(state: any): Promise<ButtonModel> {
    return (await this.widget_manager.new_widget(
      {
        model_name: 'ButtonModel',
        model_module: MODULE_NAME,
        model_module_version: MODULE_VERSION,
        view_name: 'ButtonView',
        view_module: MODULE_NAME,
        view_module_version: MODULE_VERSION
      },
      state
    )) as ButtonModel;
  }
}

export class ButtonView extends DOMWidgetView {
  render() {
    this.value_changed();
    this.model.on('change:value', this.value_changed, this);
  }

  value_changed() {
    this.el.textContent = this.model.get('value');
  }
}
