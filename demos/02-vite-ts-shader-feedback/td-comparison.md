# TD 对照：Demo 2 的节点图

在 TouchDesigner 里实现一个经典的 Feedback TOP 反馈图案，网络大概是这样：

```
┌────────────┐       ┌──────────────┐
│  Mouse In  │──────▶│  Circle TOP  │──┐
│   CHOP     │       │ (at mouse xy)│  │
└────────────┘       └──────────────┘  │
                                        │
                     ┌─────────────────┐│
                     │ Composite TOP   │◀┘
                     │ (add)           │
                     └────┬────────────┘
                          │
                          ▼
                     ┌────────────┐
                     │ Feedback   │  ◀──── loops from Level TOP
                     │ TOP        │
                     └─────┬──────┘
                           │
                           ▼
                     ┌────────────────┐
                     │ Transform TOP  │
                     │ rotate + scale │
                     └─────┬──────────┘
                           │
                           ▼
                     ┌────────────────┐
                     │ Level TOP      │
                     │ multiply 0.985 │
                     └─────┬──────────┘
                           │
                           └─── back to Feedback TOP (the reset1 input)
                           │
                           ▼
                     ┌───────────┐
                     │ Out TOP   │ → screen
                     └───────────┘
```

## 每个节点对应代码

| TD 节点 | 代码位置 |
|---|---|
| Mouse In CHOP | `main.ts` 里 `window.addEventListener('pointermove', ...)` |
| Circle TOP at mouse | `feedback.frag.glsl` 里 `exp(-d*d*400.0)` 生成的高斯亮点 |
| Composite TOP (add) | `feedback.frag.glsl` 最后一行 `prev + add` |
| Feedback TOP（前一帧读取） | `main.ts` 里 `rtA.texture` 传给 `uPrev` |
| Transform TOP（旋转+缩放） | `feedback.frag.glsl` 里 `rotate(centered, uRotation)` + `/= uZoom` |
| Level TOP（乘法） | `feedback.frag.glsl` 里 `prev * uFade` |
| 回环到 Feedback TOP | `main.ts` 里 `[rtA, rtB] = [rtB, rtA]` 的 swap |
| Out TOP | `copy.frag.glsl` + `renderer.setRenderTarget(null)` |

## TD 里是线，Web 里是什么

**在 TD 里你拖一根线；在 Three.js 里你把上一帧的 `texture` 作为下一帧的 `uniform sampler2D`。** 这就是「反馈回路」的全部本质。一旦理解了这一点，TD 里所有「把某个 TOP 的输出接回它自己的输入」的操作都能翻译成同样的 ping-pong 模式。

## 有趣的差异

- **TD 的 Feedback TOP 是隐式的双缓冲**；Three.js 里你必须自己声明两张 `WebGLRenderTarget` 并交替——**这其实是好事**，你能清楚地看到数据流。
- **TD 里 Transform TOP 作用于整个图像**；shader 里我们作用于 **UV**，数学上是等价的，但如果你从 C++/GLSL 背景来就会更直觉。
- **TD 里改 Level TOP 的参数会立刻反映**；Vite 的 HMR 也能做到同样的事——改 `feedback.frag.glsl`，保存，画面立刻更新，不会丢历史（除非你重启）。
- **TD 里 32-bit float pixel format 是一个菜单选项**；Three.js 里就是 `type: THREE.HalfFloatType` 或 `FloatType`。本 demo 用 HalfFloat 省带宽。

## 怎么把它拓展成更复杂的 TD 迁移

这个 demo 只是 4 个节点。当你的 TD 作品有 40 个节点时，**不要**试图一次性全部翻译。按这个方法：

1. 把 TD 网络分成「子网」（Container COMP 层级），每个子网对应 Web 里一个 `ShaderMaterial` 或一个函数；
2. 优先翻译**没有反馈循环**的那部分——它们是纯函数，最容易；
3. 最后处理反馈节点——每一个 Feedback TOP 对应一对 `WebGLRenderTarget`。
4. 用 `EffectComposer` 把多个 pass 串起来，或者手动调用 `renderer.render(scene, camera, rtX)` 多次。

再复杂的 TD 反馈网络也不过是这个模式的堆叠。
