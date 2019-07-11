// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

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
import enableMidi from './enableMIDI';

import {
  MODULE_NAME, MODULE_VERSION
} from './version';

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

  await enableMidi();
}
