# TD 对照：Demo 1 的节点图长什么样

如果你在 TouchDesigner 里做同样的「麦克风驱动可视化」，网络大致是这样（伪节点图）：

```
┌─────────────────────┐
│ Audio Device In CHOP│   ← 打开麦克风
└──────────┬──────────┘
           │
           ├──────────────┬────────────────┐
           │              │                │
           ▼              ▼                ▼
┌──────────────────┐  ┌────────┐  ┌────────────────┐
│Audio Spectrum CHOP│  │Lag CHOP│  │  Analyze CHOP  │
│ (FFT → 512 bins) │  │        │  │  rms / average │
└─────┬────────────┘  └───┬────┘  └────┬───────────┘
      │                   │            │
      │                   └── smooth ──┤
      ▼                                ▼
┌──────────────┐              ┌──────────────────┐
│ Trail CHOP   │              │   Math CHOP      │
│ (歷史值)      │              │ scale to [0,1]  │
└──────┬───────┘              └────────┬─────────┘
       │                               │
       ▼                               ▼
 ┌──────────┐                  ┌───────────────┐
 │Replicator │                  │  Circle SOP   │
 │COMP (ring)│                  │  (radius CHOP)│
 └────┬─────┘                  └───────┬───────┘
      │                                │
      └─────────────┬──────────────────┘
                    ▼
          ┌───────────────────┐
          │ Render TOP / Out  │
          └───────────────────┘
```

## 每个节点对应到这个 demo 的哪一行？

| TD 节点 | 在 `index.html` 里 |
|---|---|
| Audio Device In CHOP | `getUserMedia({audio: true})` + `createMediaStreamSource` |
| Audio Spectrum CHOP | `analyser.getByteFrequencyData(freqBins)` |
| Analyze CHOP (mean) | `average(freqBins, 0, 16)` 等 |
| Lag CHOP | `smoothedLow += (low - smoothedLow) * 0.15` |
| Math CHOP (rescale) | `/255` 归一化；`* baseR * 4` 映射到半径 |
| Circle SOP | `p.circle(cx, cy, radius*2)` |
| Replicator COMP（辐射环） | `for (let i = 0; i < binsShown; i++)` 循环 |
| Trail CHOP / Feedback TOP | 半透明背景 `p.background(240, 30, 6, 0.15)` 就是「画不彻底」的反馈 |

## 几个有趣的差异

- **TD 里最头疼的「信号时序」在 Web 里免费**：所有 CHOP 数据都是**当前一帧**的快照；你想要过去的值就自己存。TD 里每个 CHOP 自带时间维度，是它的特点也是它的重量级之处。
- **TD 里 Replicator COMP 是 O(n) 个对象；Web 里是一个 `for` 循环**。对于 1000 个以下的元素，后者反而更好调试。
- **TD 里「半透明叠加=反馈」是一个 Feedback TOP**；在 Canvas 里只是每帧画一个半透明矩形遮盖前一帧。同一件事，两种表达。

## 当你想把这个思路扔给 AI 时

```
我做了一个 TD 网络：Audio Device In CHOP → Audio Spectrum CHOP → 分低中高三段求 RMS
→ 分别驱动一个 Circle SOP 的半径、一个 Replicator 的数量、一个颜色 uniform。
请给我一个 Three.js 版本，保留同样的信号流，但几何用 InstancedMesh。
```

这就是从节点图到 Web 代码的「翻译过程」。把**信号流**和**最终效果**讲清楚，库的选择交给映射表，代码交给 AI。
