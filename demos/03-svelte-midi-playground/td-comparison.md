# TD 对照：Demo 3 的节点图

```
┌───────────────┐
│ MIDI In CHOP  │  (controller on channel 1)
└───────┬───────┘
        │ raw values 0..127
        ▼
┌───────────────┐
│ Select CHOP    │  pick CC16, CC17, CC18, CC19
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Math CHOP      │  range 0..127 → 0..1
└───────┬───────┘
        │
        ├──→ channel 1 "rotSpeed"      ──→ Transform SOP rotation
        ├──→ channel 2 "complexity"    ──→ Torus SOP p, q
        ├──→ channel 3 "hue"           ──→ GLSL TOP uniform uHue
        └──→ channel 4 "glow"          ──→ GLSL TOP uniform uGlow

                             ┌─────────────────┐
                             │ Torus SOP       │  (knot winding)
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │ Transform SOP   │  rotation from MIDI
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │ Geometry COMP   │
                             │ + GLSL TOP mat  │
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │  Render TOP     │ → Out TOP
                             └─────────────────┘
```

## 每个节点对应代码

| TD 节点 | 代码位置 |
|---|---|
| MIDI In CHOP | `src/lib/midi.ts` 里 `WebMidi.enable()` + `addListener('controlchange', ...)` |
| Select CHOP（选通道） | `ccMap` 字典，key 就是 CC 号 |
| Math CHOP（0-127 → 0-1） | `e.message.dataBytes[1] / 127` |
| 4 个 channel 暴露给下游 | `src/lib/stores.ts` 里的 4 个 `writable` |
| Torus SOP | `TorusKnotGeometry(1, 0.35, 200, 32, p, q)` |
| Transform SOP（rotation） | `Scene.ts` 里 `mesh.rotation.y += speed * dt` |
| Geometry COMP | `THREE.Mesh(geom, material)` |
| GLSL TOP 的 uniform | `material.uniforms.uHue.value = get(hue)` |
| Render TOP | `renderer.render(scene, camera)` |

## TD 的 CHOP 数据流 vs Svelte 的 store

这才是本 demo 真正想让你带走的东西。对比一下：

| 在 TD 里 | 在 Svelte 里 |
|---|---|
| 拖一根线从 MIDI In CHOP 到 Math CHOP | `rotSpeed.set(value / 127)` |
| 再拖一根线到 Transform SOP | `get(rotSpeed)` 或 `$rotSpeed` |
| 任何节点改动，所有下游节点自动重算 | store `set()` 后，所有 `$store` 引用自动更新 |
| 通道是一维数据流 | store 是一个值（复合型的话可以用 object） |

Svelte store 最贴近 TD 心智模型的特性是**「写入方和读取方不用互相知道」**。在 React 里你要么 lift state up 要么 Context，两者都要求写入方和读取方存在一个「共同祖先组件」。Svelte store 没有祖先概念——就像 TD 的 CHOP 一样。

## 一个思考题

如果你的 TD 作品有 20 个控制参数，**你会想要把它们全塞进一个大 store 还是 20 个小 store？**

- 一个大 store（比如 `writable({ rotSpeed: 0.5, complexity: 0.5, ... })`）：改任何一个值，所有订阅者都会被通知（等效 TD 的 "dirty" 全部 channel 的行为）。
- 20 个小 store：只有订阅那个特定 store 的地方会被通知，性能更好但组织起来更乱。

**答：小 store 更像 TD 的 CHOP 通道**——每个通道独立。**大 store 更像 TD 的 DAT Table**——一次性获取一批数据。按你的需求选。

这里我们选了 4 个独立 store，因为这样 `bind:value={$rotSpeed}` 的语法最干净。
