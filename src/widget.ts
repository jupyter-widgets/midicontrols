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
import { Fader } from './xtouchmini/fader';

export class ButtonModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'ButtonModel',
      _model_module: MODULE_NAME,
      _model_module_version: MODULE_VERSION,
      _view_name: 'ValueView',
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,

      // Private attributes for just this widget
      _controller_input: 0,
      _controller_output: 0,
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
    const input = midi.inputs[values._controller_input];
    const output = midi.outputs[values._controller_output];
    this._button = new Button({input, output}, values._control, {
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
      _view_name: 'ValueView',
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,

      // Private attributes for just this widget
      _controller_input: 0,
      _controller_output: 0,
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
    const input = midi.inputs[values._controller_input];
    const output = midi.outputs[values._controller_output];
    this._rotary = new Rotary({input, output}, values._control, {
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

export class FaderModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'FaderModel',
      _model_module: MODULE_NAME,
      _model_module_version: MODULE_VERSION,
      _view_name: 'ValueView',
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,

      // Private attributes for just this widget
      _controller_input: 0,
      _controller_output: 0,
      _control: 0,

      value: 0,
      min: 0,
      max: 127
    };
  }

  initialize(attributes: any, options: any) {
    super.initialize(attributes, options);
    if (!midi.enabled) {
      throw new Error('WebMidi library not enabled');
    }
    const values = {...this.defaults(), ...attributes};
    const input = midi.inputs[values._controller_input];
    const output = midi.outputs[values._controller_output];
    this._fader = new Fader({input, output}, values._control, {
      min: values.min,
      max: values.max,
      value: values.value
    });
    this._fader.stateChanged.connect((sender, args) => {
      switch (args.name) {
        case 'value':
        case 'min':
        case 'max':
          this.set(args.name, args.newValue);
          break;
      }
      this.save_changes();
    });
    this.listenTo(this, 'change', () => {
      const changed = this.changedAttributes() || {};
      if (changed.hasOwnProperty('value')) {
        this._fader.value = changed.value;
      }
      if (changed.hasOwnProperty('min')) {
        this._fader.min = changed.min;
      }
      if (changed.hasOwnProperty('max')) {
        this._fader.max = changed.max;
      }
    });
  }

  destroy(options: any) {
    this._fader.dispose();
    super.destroy(options);
  }

  private _fader: Fader;
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
      faders: [],

      _controller_input: 0,
      _controller_output: 0,
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

    const input = midi.inputs.findIndex(x => x.manufacturer === "Behringer" && x.name.startsWith("X-TOUCH MINI"));
    if (input === -1) {
      throw new Error("Could not find Behringer X-TOUCH MINI input");
    }

    const output = midi.outputs.findIndex(x => x.manufacturer === "Behringer" && x.name.startsWith("X-TOUCH MINI"));
    if (output === -1) {
      throw new Error("Could not find Behringer X-TOUCH MINI output");
    }

    this.set('_controller_input', input);
    this.set('_controller_output', output);


    // Make sure we are in MCU protocol mode
    midi.outputs[output].sendChannelMode(
      127,
      1 /* MCU mode */,
      1 /* global channel */
    );
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
      rotary_buttons: Promise.all(this._createRotaryButtons()),
      faders: Promise.all(this._createFaders())
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
        _controller_input: this.get('_controller_input'),
        _controller_output: this.get('_controller_output')
      })
    );
  }

  _createSideButtons() {
    // Buttons are indexed top to bottom.
    return [0x54, 0x55].map(_control =>
      this._createButtonModel({
        _control,
        _controller_input: this.get('_controller_input'),
        _controller_output: this.get('_controller_output')
      })
    );
  }

  _createRotaryButtons() {
    // Buttons are indexed left to right.
    return [0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27].map(_control =>
      this._createButtonModel({
        _control,
        _controller_input: this.get('_controller_input'),
        _controller_output: this.get('_controller_output'),
        _light: false
      })
    );
  }

  _createRotaryEncoders() {
    // Buttons are indexed left to right.
    return [0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17].map(_control =>
      this._createRotaryModel({
        _control,
        _controller_input: this.get('_controller_input'),
        _controller_output: this.get('_controller_output')
      })
    );
  }

  _createFaders() {
    // Fader are indexed left to right.
    return [9].map(_control =>
      this._createFaderModel({
        _control,
        _controller_input: this.get('_controller_input'),
        _controller_output: this.get('_controller_output')
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
        view_name: 'ValueView',
        view_module: MODULE_NAME,
        view_module_version: MODULE_VERSION,
      },
      state
    )) as ButtonModel;
  }

  /**
   * Creates a rotary encoder widget.
   */
  async _createRotaryModel(state: any): Promise<ButtonModel> {
    return (await this.widget_manager.new_widget(
      {
        model_name: 'RotaryModel',
        model_module: MODULE_NAME,
        model_module_version: MODULE_VERSION,
        view_name: 'ValueView',
        view_module: MODULE_NAME,
        view_module_version: MODULE_VERSION
      },
      state
    )) as ButtonModel;
  }

  /**
   * Creates a fader widget.
   */
  async _createFaderModel(state: any): Promise<ButtonModel> {
    return (await this.widget_manager.new_widget(
      {
        model_name: 'FaderModel',
        model_module: MODULE_NAME,
        model_module_version: MODULE_VERSION,
        view_name: 'ValueView',
        view_module: MODULE_NAME,
        view_module_version: MODULE_VERSION
      },
      state
    )) as ButtonModel;
  }
}

export class ValueView extends DOMWidgetView {
  render() {
    this.value_changed();
    this.model.on('change:value', this.value_changed, this);
  }

  value_changed() {
    this.el.textContent = this.model.get('value');
  }
}
