// Copyright (c) Project Jupyter Contributors
// Distributed under the terms of the Modified BSD License.

import { WebMidi } from 'webmidi';

export type MIDIInput = WebMidi['inputs'][0];
export type MIDIOutput = WebMidi['outputs'][0];

export type MIDIController = {
  input: MIDIInput;
  output: MIDIOutput;
}
