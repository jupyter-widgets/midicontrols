// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import { Application, IPlugin } from '@lumino/application';

import { Widget } from '@lumino/widgets';

import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';

import midi from 'webmidi';

import * as widgetExports from './widget';

import { MODULE_NAME, MODULE_VERSION } from './version';

const EXTENSION_ID = '@jupyter-widgets/midicontrols:plugin';

/**
 * The midicontrols plugin.
 */
const plugin: IPlugin<Application<Widget>, void> = {
  id: EXTENSION_ID,
  requires: [IJupyterWidgetRegistry],
  autoStart: true,
  activate: (_, registry: IJupyterWidgetRegistry): Promise<void> => {
    registry.registerWidget({
      name: MODULE_NAME,
      version: MODULE_VERSION,
      exports: widgetExports,
    });
    console.log('i still work here');
    return new Promise((resolve, reject) => {
      midi.enable(error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
};

export default plugin;
