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
import { Rotary } from './xtouchmini/rotary';

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
    const values = {...this.defaults(), ...attributes};
    this._button = new Button(values._control, {
      mode: values.mode,
      light: values._light
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

export class RotaryModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'RotaryModel',
      _model_module: MODULE_NAME,
      _model_module_version: MODULE_VERSION,
      _view_name: 'RotaryView',
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,

      // Private attributes for just this widget
      _control: 0,

      value: 0,
      light_mode: 'single',
      min: 0,
      max: 100
    };
  }

  initialize(attributes: any, options: any) {
    super.initialize(attributes, options);
    if (!midi.enabled) {
      throw new Error('WebMidi library not enabled');
    }
    const values = {...this.defaults(), ...attributes};
    this._rotary = new Rotary(values._control, {
      lightMode: values.light_mode,
      min: values.min,
      max: values.max,
      value: values.value
    });
    this._rotary.stateChanged.connect((sender, args) => {
      switch (args.name) {
        case 'value':
        case 'min':
        case 'max':
          this.set(args.name, args.newValue);
          break;
        case 'lightMode':
          this.set('light_mode', args.newValue);
          break;
      }
      this.save_changes();
    });
    this.listenTo(this, 'change', () => {
      const changed = this.changedAttributes() || {};
      if (changed.hasOwnProperty('value')) {
        this._rotary.value = changed.value;
      }
      if (changed.hasOwnProperty('light_mode')) {
        this._rotary.lightMode = changed.light_mode;
      }
      if (changed.hasOwnProperty('min')) {
        this._rotary.min = changed.min;
      }
      if (changed.hasOwnProperty('max')) {
        this._rotary.max = changed.max;
      }
    });
  }

  destroy(options: any) {
    this._rotary.dispose();
    super.destroy(options);
  }

  private _rotary: Rotary;
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
      buttons: Promise.all(this._createButtons()),
      side_buttons: Promise.all(this._createSideButtons()),
      rotary_encoders: Promise.all(this._createRotaryEncoders()),
      rotary_buttons: Promise.all(this._createRotaryButtons())
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
        _control
      })
    );
  }

  _createSideButtons() {
    // Buttons are indexed top to bottom.
    return [0x54, 0x55].map(_control =>
      this._createButtonModel({
        _control
      })
    );
  }

  _createRotaryButtons() {
    // Buttons are indexed left to right.
    return [0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27].map(_control =>
      this._createButtonModel({
        _control,
        _light: false
      })
    );
  }

  _createRotaryEncoders() {
    // Buttons are indexed left to right.
    return [0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17].map(_control =>
      this._createRotaryModel({
        _control
      })
    );
  }

  /**
   * Creates a button widget.
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

  /**
   * Creates a button widget.
   */
  async _createRotaryModel(state: any): Promise<ButtonModel> {
    return (await this.widget_manager.new_widget(
      {
        model_name: 'RotaryModel',
        model_module: MODULE_NAME,
        model_module_version: MODULE_VERSION,
        view_name: 'RotaryView',
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

export class RotaryView extends DOMWidgetView {
  render() {
    this.value_changed();
    this.model.on('change:value', this.value_changed, this);
  }

  value_changed() {
    this.el.textContent = this.model.get('value');
  }
}
