// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import midi from 'webmidi';

import {
  Application, IPlugin
} from '@phosphor/application';

import {
  Widget
} from '@phosphor/widgets';

import {
  IJupyterWidgetRegistry
 } from '@jupyter-widgets/base';

import * as widgetExports from './widget';

import {
  MODULE_NAME, MODULE_VERSION
} from './version';

import { PromiseDelegate } from '@phosphor/coreutils';

const EXTENSION_ID = '@jupyter-widgets/midicontrols:plugin';

/**
 * The example plugin.
 */
const examplePlugin: IPlugin<Application<Widget>, void> = {
  id: EXTENSION_ID,
  requires: [IJupyterWidgetRegistry],
  activate: activateWidgetExtension,
  autoStart: true
};

export default examplePlugin;


/**
 * Activate the widget extension.
 */
async function activateWidgetExtension(app: Application<Widget>, registry: IJupyterWidgetRegistry): Promise<void> {
  registry.registerWidget({
    name: MODULE_NAME,
    version: MODULE_VERSION,
    exports: widgetExports,
  });

  const midiEnabled = new PromiseDelegate<void>();
  midi.enable(function(err) {
    if (err) {
      midiEnabled.reject(err);
    } else {
      midiEnabled.resolve(undefined);
    }
  });  
  await midiEnabled.promise;
  if (!(midi.inputs[0] && midi.outputs[0])) {
    throw new Error("Could not find MIDI device");
  }
}
