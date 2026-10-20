/* ============================================================
   音效层：Web Audio 实时合成（不加载任何外部音频文件，无版权风险）
   风格：轻柔点击 / 布料摩擦 / 温和提示 / 庄重温情的五声音阶环境音
   全部无爆炸、无枪声、无惊悚音效
   ============================================================ */

const SFX = (function () {
  let ctx = null;
  let master = null;
  let bgmGain = null;
  let bgmTimer = null;
  let enabled = true;
  let started = false;

  // 五声音阶（宫商角徵羽），用于治愈系音色
  const PENTA = [523.25, 587.33, 659.25, 783.99, 880.00]; // C D E G A

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { enabled = false; return null; }
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = enabled ? 0.9 : 0;
    master.connect(ctx.destination);
    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0.0;
    bgmGain.connect(master);
    return ctx;
  }

  function resume() {
    ensure();
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  /* 单音：柔和正弦/三角，带包络 */
  function tone(freq, dur, opts) {
    if (!enabled) return;
    const c = ensure(); if (!c) return;
    opts = opts || {};
    const t0 = c.currentTime + (opts.delay || 0);
    const osc = c.createOscillator();
    const g = c.createGain();
    const filt = c.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = opts.cutoff || 2200;

    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.slideTo) osc.frequency.linearRampToValueAtTime(opts.slideTo, t0 + dur);

    const vol = (opts.vol == null ? 0.18 : opts.vol);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.04, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(filt); filt.connect(g); g.connect(master);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }

  /* 噪声：布料摩擦 / 翻页 */
  function noise(dur, opts) {
    if (!enabled) return;
    const c = ensure(); if (!c) return;
    opts = opts || {};
    const t0 = c.currentTime + (opts.delay || 0);
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.6;

    const src = c.createBufferSource();
    src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = opts.filter || 'bandpass';
    filt.frequency.value = opts.freq || 1400;
    filt.Q.value = opts.q || 1.1;
    const g = c.createGain();
    const vol = opts.vol == null ? 0.12 : opts.vol;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(filt); filt.connect(g); g.connect(master);
    src.start(t0); src.stop(t0 + dur + 0.02);
  }

  const sounds = {
    /* 轻柔点击 */
    click() { tone(660, 0.09, { type: 'sine', vol: 0.13, cutoff: 1800 }); },
    /* 轻响提示（选中） */
    tap() { tone(820, 0.11, { type: 'triangle', vol: 0.11, cutoff: 2400 }); },
    /* 布料摩擦 */
    cloth() { noise(0.22, { freq: 1100, q: 0.8, vol: 0.09 }); },
    /* 放置到槽位 */
    drop() {
      tone(392, 0.14, { type: 'sine', vol: 0.14 });
      noise(0.12, { freq: 700, q: 0.9, vol: 0.07 });
    },
    /* 做对了 —— 温和上行两音 */
    correct() {
      tone(PENTA[2], 0.2, { type: 'sine', vol: 0.15 });
      tone(PENTA[4], 0.34, { type: 'sine', vol: 0.14, delay: 0.1 });
    },
    /* 做错了 —— 温和下行（不刺耳，不恐吓） */
    wrong() {
      tone(392, 0.22, { type: 'sine', vol: 0.12, slideTo: 330 });
    },
    /* 解锁图鉴 —— 三音琶音 */
    unlock() {
      tone(PENTA[0], 0.24, { type: 'sine', vol: 0.14 });
      tone(PENTA[2], 0.26, { type: 'sine', vol: 0.14, delay: 0.11 });
      tone(PENTA[4], 0.4, { type: 'sine', vol: 0.15, delay: 0.22 });
      tone(1046.5, 0.5, { type: 'sine', vol: 0.1, delay: 0.33 });
    },
    /* 翻页 */
    page() { noise(0.18, { freq: 2600, q: 0.7, vol: 0.07, filter: 'highpass' }); },
    /* 星光 */
    star() {
      tone(1318.5, 0.26, { type: 'sine', vol: 0.1 });
      tone(1760, 0.3, { type: 'sine', vol: 0.07, delay: 0.08 });
    },
    /* 通关 */
    win() {
      [PENTA[0], PENTA[1], PENTA[2], PENTA[4]].forEach((f, i) => {
        tone(f, 0.5, { type: 'sine', vol: 0.13, delay: i * 0.14 });
      });
    }
  };

  /* ----- 环境配乐：极轻的五声音阶 pad 循环 ----- */
  function startBgm() {
    const c = ensure(); if (!c || bgmTimer) return;
    bgmGain.gain.setTargetAtTime(enabled ? 0.055 : 0, c.currentTime, 1.5);
    let i = 0;
    const step = () => {
      if (!ctx) return;
      const base = PENTA[i % PENTA.length];
      const oct = (i % 8) < 4 ? 0.5 : 0.5;
      tone(base * oct, 1.6, { type: 'sine', vol: 0.055, cutoff: 900, delay: 0 });
      tone(base * oct * 1.5, 1.4, { type: 'sine', vol: 0.03, cutoff: 800, delay: 0.12 });
      i++;
    };
    step();
    bgmTimer = setInterval(step, 2400);
  }

  function stopBgm() {
    if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }
    if (bgmGain && ctx) bgmGain.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
  }

  return {
    init() {
      resume();
      if (!started) { started = true; if (enabled) startBgm(); }
    },
    play(name) {
      if (!enabled) return;
      resume();
      const f = sounds[name];
      if (f) { try { f(); } catch (e) { /* 忽略音频异常 */ } }
    },
    toggle() {
      enabled = !enabled;
      const c = ensure();
      if (c && master) master.gain.setTargetAtTime(enabled ? 0.9 : 0, c.currentTime, 0.15);
      if (enabled) startBgm(); else stopBgm();
      return enabled;
    },
    isEnabled() { return enabled; }
  };
})();
