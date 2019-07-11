// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import { PromiseDelegate } from '@phosphor/coreutils';
import midi from 'webmidi';

export default async function enableMIDI() {
  if (midi.enabled) {
    return;
  }

  const midiEnabled = new PromiseDelegate<void>();
  midi.enable(function(err) {
    if (err) {
      midiEnabled.reject(err);
    } else {
      midiEnabled.resolve(undefined);
    }
  });  
  await midiEnabled.promise;
  // if (!(midi.inputs[0] && midi.outputs[0])) {
  //   throw new Error("Could not find MIDI device");
  // }
}
