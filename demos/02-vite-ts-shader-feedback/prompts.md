# Demo 2 的 AI 提示词

## 原始 Prompt

```
我要把我在 TouchDesigner 里的一个经典效果迁移到浏览器。

TD 的节点组合是：
  Feedback TOP → Transform TOP (rotate 0.15°/frame + scale 1.006)
               → Level TOP (multiply 0.985)
               → 回环到 Feedback TOP 的 input
  + 鼠标位置在当前帧画一个高斯亮点并 Composite TOP (add) 到反馈链里
  + 亮点颜色随时间做 HSV 色相滚动
效果是：
  从鼠标位置持续向外螺旋扩散的反馈辉光，经典的 TD Feedback 教学案例。

请用 Vite + TypeScript + Three.js (r160+) 实现。

关键要求：
- 用两张 WebGLRenderTarget 做 ping-pong
- fragment shader 必须写在单独的 .glsl 文件里，不要嵌入字符串
- 用 Vite 的 ?raw import 加载 GLSL 文件（不要装 vite-plugin-glsl）
- uniform 命名前缀一律 u（uPrev, uResolution, uMouse, uTime, uRotation, uZoom, uFade）
- 写一个 passthrough.vert.glsl 用于全屏 quad，别用 RawShaderMaterial（那样要手动写 attributes）
- 用 HalfFloatType 减少 banding
- 代码里每一块要加注释说明它对应 TD 的哪个节点
- pixelRatio 上限 2，否则高分屏太慢

交付物：
  package.json, tsconfig.json, vite.config.ts, index.html,
  src/main.ts, src/feedback.frag.glsl, src/passthrough.vert.glsl
```

## 微调 Prompt（当第一版有小问题时）

```
第一版跑起来了但有三个问题：
1. 亮点只画一次，之后就完全靠反馈，应该每帧都画。检查 shader 里亮点是否被放在反馈分支外。
2. 整个画面一直在闪黑，应该是两张 RT 初始是 undefined。请在 main.ts 里首次 render 前
   用 renderer.setRenderTarget(rtA); renderer.clear() 清一下。
3. 鼠标 y 坐标是反的（我把鼠标移到屏幕上方，亮点出现在下方）。请加 1 - clientY/height 的翻转。

只改这三处，别动别的。
```

```
现在我想把 "把 rtB 画到屏幕" 和 "跑 feedback shader" 分成两个 material，
因为现在这个做法在显示 pass 里也重复计算了一遍 feedback 逻辑，浪费算力。

请加一个 src/copy.frag.glsl 只做 texture2D(uMap, vUv)，
在 main.ts 里创建一个 copyMat 和一个 copyScene，
改成：pass A 用 feedbackMat 渲染到 rtB，pass B 用 copyMat 把 rtB 渲染到 null。
```

## 为什么这些约束重要

### 「fragment shader 写在单独的 .glsl 文件」
避免在 TS 里塞大段字符串——难读、难 diff、AI 也容易在字符串里写错反引号。用 `?raw` 导入是 Vite 原生支持，不需要额外插件。

### 「pixelRatio 上限 2」
4K 显示器默认 `devicePixelRatio` 可能是 2~3，Feedback 要渲染每一个物理像素，会爆炸地慢。设上限 2 是 Three.js 官方推荐做法。

### 「HalfFloatType」
8-bit RGBA 反馈会在 fade 的时候出现明显的量化 banding（因为 0.985 × 255 ≈ 251，误差会累积）。Half float (16-bit) 几乎没有这个问题，性能损失可忽略。

### 「命名前缀 u」
这是 Three.js 社区的惯例，也是绝大多数教程代码风格。让 AI 遵守后续所有 uniform 都能一眼认出来。

## 把这个模版用到你自己的反馈作品

把「TD 节点组合」那一段换成你自己的，保留「关键要求」和「交付物」两段基本不变——这两段是**把 AI 约束到一个可靠输出格式**的秘诀。
