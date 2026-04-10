# Demo 1 · 麦克风驱动的音频可视化

**面向人群**：零基础。没写过 JavaScript 也没关系。
**技术栈**：纯 HTML + [p5.js](https://p5js.org/)（CDN）+ 浏览器原生 Web Audio API。
**零构建**：没有 `npm`、没有 `package.json`、没有任何依赖安装。一个 `index.html` 文件。

**English:** [README.en.md](./README.en.md)

---

## 跑起来

因为 `getUserMedia`（浏览器的麦克风权限 API）不允许从 `file://` 加载，你**不能**双击 `index.html` 打开。必须起一个本地服务器。最简单的方式：

```bash
cd demos/01-vanilla-audio-reactive
python3 -m http.server 8000
# 然后浏览器打开 http://localhost:8000
```

点击页面中间的 "Click to start" 按钮，允许麦克风，对着麦克风说话 / 拍手 / 放音乐，你会看到：

- 一个中心的圆，半径随**低频能量**鼓动；
- 一圈辐射线，长度随**各频段强度**变化（= TD 的 Audio Spectrum CHOP）；
- 底部一条波形线（= TD 的 Audio Device In CHOP 的原始信号）。

## 它在做什么

### 对应的 TD 节点图

如果你在 TD 里做同样的事，节点网大概是这样：

```
[Audio Device In CHOP] ──→ [Audio Spectrum CHOP] ──→ [Analyze CHOP]──┐
                                                                      ├──→ [Geometry COMP]
                                                                      ├──→ [Circle SOP]
                                                                      └──→ [Color]
```

详细对照见 [`td-comparison.md`](./td-comparison.md)。

### 对应的 Web API

| TD 节点 | 代码里的对应物 |
|---|---|
| Audio Device In CHOP | `navigator.mediaDevices.getUserMedia({ audio: true })` |
| 进入音频图 | `AudioContext` + `createMediaStreamSource` |
| Audio Spectrum CHOP | `AnalyserNode` + `getByteFrequencyData()` |
| Analyze CHOP（取低中高频均值） | 一个 `average()` 小函数 |
| Lag CHOP（平滑） | 一行指数平滑 `x += (target - x) * k` |
| 画几何 | p5 的 `circle()` / `line()` |

**核心思想转变**：TD 里你拖线，Web 里你「每帧从一个 `Uint8Array` 里取数」。一旦你接受了这个思维模式，后面的一切都是变奏。

## 源代码怎么读

打开 [`index.html`](./index.html)，从上往下读：

1. **HTML + CSS**（前 20 行）：一个遮罩按钮和一个 canvas。别想多了。
2. **`startBtn` 事件**（第 31~48 行）：这是**整个音频管线**。四行代码：请求权限 → 创建 AudioContext → 创建 Analyser → 连起来。
3. **`sketch` 函数**（第 51~130 行）：p5 的 `setup` 和 `draw`。`draw` 每秒被 p5 调用 60 次。
4. **`average()` 辅助函数**：把一段频谱求平均，就是 Analyze CHOP。

总共大约 140 行，包括注释和空行。

## 练习题

1. **改颜色映射**：在第 75 行附近，把 `hue = frameCount * 0.3 + ...` 改成 `hue = smoothedLow * 360`，看看色相如何跟着低频呼吸。
2. **加一个新频段**：现在代码只用了 low / mid / high，试着加一个 "sub"（0-4 bins）只画一个极大的圆。
3. **去掉 p5**：挑战——把整个画面改成用原生 Canvas 2D（`canvas.getContext('2d')`）。你会发现 p5 省掉的只是几个 `setFillStyle` 的字符而已。
4. **让 AI 改写成 Three.js 版本**：用 [AI 提示词备忘单](../../docs/ai-prompt-cheatsheet.md) 里的模版，让 AI 把这个 demo 翻译成一个 3D 场景。比较它和这个 2D 版本的代码量差异。

## 踩坑备忘

- **麦克风权限弹不出来？** 检查是不是用 `file://` 打开的。必须 `http://localhost`。
- **音频有尖锐反馈啸叫？** 不应该有——代码里**没有**把 `analyser` 连到 `ctx.destination`。如果你试图连，关掉。
- **手机上不工作？** iOS 对 `getUserMedia` 有额外限制（必须 HTTPS）。把它 push 到 GitHub Pages 就能工作。

## 下一步

- 读 [映射表](../../docs/mapping-table.md)，找你熟悉的别的 CHOP 节点。
- 去 [Demo 2](../02-vite-ts-shader-feedback/) 看「怎么写 shader」。
