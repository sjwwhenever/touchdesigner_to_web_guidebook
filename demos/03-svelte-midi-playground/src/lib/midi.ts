/**
 * webmidi.js v3 wrapper.
 *
 * TD equivalent:
 *   MIDI In CHOP (listens to a device) → channels for CC 16..19
 *
 * We listen to ControlChange messages on any input device. If none is
 * available (no device plugged in, or Firefox which still lacks Web MIDI),
 * we switch to 'fallback' and the UI shows sliders instead.
 *
 * Why webmidi.js and not the raw navigator.requestMIDIAccess API?
 * The raw API makes you parse the raw MIDI byte triplets yourself. The
 * library is small, v3 has a clean event-based API, and it's the closest
 * analogue to "drag a wire from the CHOP" that you'll get in the browser.
 */

import { WebMidi, type Input } from 'webmidi';
import { rotSpeed, complexity, hue, glow, midiStatus, midiDeviceName } from './stores.js';

// Map CC number → store setter. Change these to match your controller.
const ccMap: Record<number, (v: number) => void> = {
  16: (v) => rotSpeed.set(v),
  17: (v) => complexity.set(v),
  18: (v) => hue.set(v),
  19: (v) => glow.set(v),
};

export async function initMidi(): Promise<void> {
  if (!('requestMIDIAccess' in navigator)) {
    midiStatus.set('unsupported'); // e.g. Firefox as of 2026
    return;
  }

  midiStatus.set('connecting');
  try {
    await WebMidi.enable();
  } catch (err) {
    console.warn('WebMidi.enable() failed:', err);
    midiStatus.set('fallback');
    return;
  }

  if (WebMidi.inputs.length === 0) {
    midiStatus.set('fallback');
    return;
  }

  // Listen on ALL inputs so you can plug in mid-session if you want.
  WebMidi.inputs.forEach(attach);
  WebMidi.addListener('connected', (e) => {
    if (e.port.type === 'input') attach(e.port as Input);
  });

  midiStatus.set('connected');
  midiDeviceName.set(WebMidi.inputs.map((i) => i.name).join(', '));
}

function attach(input: Input): void {
  // webmidi.js v3 API. `e.controller.number` is the CC index (0..127);
  // `e.value` is already normalized to 0..1 — that's our Math CHOP for free.
  input.addListener('controlchange', (e) => {
    const cc = e.controller.number;
    const value = typeof e.value === 'number' ? e.value : 0;
    const setter = ccMap[cc];
    if (setter) setter(value);
  });
}
