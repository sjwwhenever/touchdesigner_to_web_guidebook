/**
 * Svelte stores that hold the four "CC" values (0..1).
 *
 * TD equivalent:
 *   MIDI In CHOP → Math CHOP (rescale) → 4 channels
 *
 * Either the real MIDI device (via midi.ts) or the on-screen fallback sliders
 * write to these. Scene.ts reads them every frame.
 *
 * This is the moment where Svelte's reactive-store model feels closest to
 * TD's CHOP mindset: one source of truth, every consumer updates "for free."
 */

import { writable } from 'svelte/store';

export const rotSpeed   = writable(0.5); // CC 16
export const complexity = writable(0.5); // CC 17
export const hue        = writable(0.5); // CC 18
export const glow       = writable(0.5); // CC 19

export const midiStatus = writable<'idle' | 'connecting' | 'connected' | 'fallback' | 'unsupported'>('idle');
export const midiDeviceName = writable<string>('');
