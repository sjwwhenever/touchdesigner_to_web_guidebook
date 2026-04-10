<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { rotSpeed, complexity, hue, glow, midiStatus, midiDeviceName } from '$lib/stores.js';
  import { initMidi } from '$lib/midi.js';
  import { Scene } from '$lib/Scene.js';

  let canvas: HTMLCanvasElement;
  let scene: Scene | undefined;

  onMount(() => {
    scene = new Scene(canvas);
    scene.start();
    initMidi();
  });

  onDestroy(() => {
    scene?.stop();
  });

  function onResize() {
    scene?.resize();
  }
</script>

<svelte:window on:resize={onResize} />

<main>
  <canvas bind:this={canvas}></canvas>

  <aside>
    <header>
      <h1>MIDI Playground</h1>
      <p class="status" data-state={$midiStatus}>
        {#if $midiStatus === 'idle' || $midiStatus === 'connecting'}
          Connecting MIDI…
        {:else if $midiStatus === 'connected'}
          ✅ MIDI: {$midiDeviceName}
        {:else if $midiStatus === 'fallback'}
          ⚠️ No MIDI device detected. Using sliders.
        {:else}
          ⚠️ Browser doesn't support Web MIDI. Using sliders.
        {/if}
      </p>
    </header>

    <!--
      Each slider is directly bound to one of the four Svelte stores.
      If a real MIDI device sends CC 16..19, midi.ts writes to the same
      stores and the slider position updates automatically — one source
      of truth, the TD CHOP model.
    -->

    <label>
      <span class="row"><span>Rotation speed</span><span class="cc">CC 16</span></span>
      <input type="range" min="0" max="1" step="0.001" bind:value={$rotSpeed} />
      <span class="value">{$rotSpeed.toFixed(2)}</span>
    </label>

    <label>
      <span class="row"><span>Geometry complexity</span><span class="cc">CC 17</span></span>
      <input type="range" min="0" max="1" step="0.001" bind:value={$complexity} />
      <span class="value">{$complexity.toFixed(2)}</span>
    </label>

    <label>
      <span class="row"><span>Hue</span><span class="cc">CC 18</span></span>
      <input type="range" min="0" max="1" step="0.001" bind:value={$hue} />
      <span class="value">{$hue.toFixed(2)}</span>
    </label>

    <label>
      <span class="row"><span>Glow</span><span class="cc">CC 19</span></span>
      <input type="range" min="0" max="1" step="0.001" bind:value={$glow} />
      <span class="value">{$glow.toFixed(2)}</span>
    </label>

    <footer>
      <a href="../../docs/mapping-table.md">↩︎ mapping table</a>
    </footer>
  </aside>
</main>

<style>
  :global(html), :global(body) {
    margin: 0;
    height: 100%;
    background: #0a0a0f;
    color: #eee;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    overflow: hidden;
  }

  main {
    position: fixed;
    inset: 0;
    display: grid;
    grid-template-columns: 1fr 320px;
  }

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  aside {
    padding: 24px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    border-left: 1px solid #222;
    overflow-y: auto;
  }

  h1 {
    font-size: 16px;
    margin: 0 0 4px 0;
    font-weight: 600;
  }

  .status {
    font-size: 12px;
    opacity: 0.7;
    margin: 0 0 24px 0;
  }

  .status[data-state='connected'] { color: #7dd3a8; }
  .status[data-state='fallback'],
  .status[data-state='unsupported'] { color: #e0b66c; }

  label {
    display: block;
    margin-bottom: 18px;
    font-size: 12px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .cc {
    opacity: 0.5;
    font-variant-numeric: tabular-nums;
  }

  input[type='range'] {
    width: 100%;
    accent-color: #7dd3a8;
  }

  .value {
    display: inline-block;
    margin-top: 4px;
    opacity: 0.6;
    font-variant-numeric: tabular-nums;
  }

  footer {
    margin-top: 32px;
    font-size: 11px;
    opacity: 0.4;
  }

  footer a { color: inherit; }
</style>
