/* ============================================================
   主逻辑层：屏幕切换 / 存档 / 拖拽 / 关卡玩法 / 图鉴 / 问答 / 结局
   ============================================================ */

(function () {
  'use strict';

  const D = GAME_DATA;
  const SAVE_KEY = 'hzjy_zhanjiu_riji_v1';

  /* ---------------- 小工具 ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function h(tag, cls, html) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html != null) el.innerHTML = html;
    return el;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ---------------- 存档 ---------------- */
  const DEFAULT_SAVE = {
    v: 1, stars: 0,
    levels: { lv1: { state: 'open' }, lv2: { state: 'locked' } },
    step: {},
    codex: [],
    details: {},
    quiz: {},
    sound: true
  };

  const Store = {
    data: null,
    load() {
      let raw = null;
      try { raw = localStorage.getItem(SAVE_KEY); } catch (e) { raw = null; }
      let obj = null;
      if (raw) { try { obj = JSON.parse(raw); } catch (e) { obj = null; } }
      this.data = Object.assign(JSON.parse(JSON.stringify(DEFAULT_SAVE)), obj || {});
      this.data.levels = Object.assign(JSON.parse(JSON.stringify(DEFAULT_SAVE.levels)), this.data.levels || {});
      return this.data;
    },
    save() {
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); } catch (e) { /* 隐私模式下忽略 */ }
    },
    reset() {
      this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
      this.save();
    },
    get stars() { return this.data.stars; },
    addStar(n) { this.data.stars += n; this.save(); refreshStars(); }
  };

  /* ---------------- 全局 UI 反馈 ---------------- */
  function toast(msg, kind, dur) {
    const root = $('#toast-root');
    const t = h('div', 'toast' + (kind ? ' t-' + kind : ''), msg);
    root.appendChild(t);
    setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => t.remove(), 320);
    }, dur || 2600);
  }

  let modalOnClose = null;
  function openModal(opt) {
    const root = $('#modal-root');
    root.innerHTML = '';
    const mask = h('div', 'modal-mask');
    const box = h('div', 'modal' + (opt.wide ? ' wide' : ''));
    box.innerHTML =
      (opt.star ? '<div class="modal-star">' + ART.icon('star') + '</div>' : '') +
      (opt.kicker ? '<div class="m-kicker">' + esc(opt.kicker) + '</div>' : '') +
      (opt.title ? '<h3>' + opt.title + '</h3>' : '') +
      '<div class="m-body">' + (opt.body || '') + '</div>';
    const foot = h('div', 'modal-foot');
    (opt.buttons || [{ label: '继 续', cls: 'btn btn-primary', act: null }]).forEach(b => {
      const el = h('button', b.cls || 'btn btn-primary', b.label);
      el.addEventListener('click', () => {
        SFX.play('click');
        if (b.act) b.act(box);
        if (b.keep !== true) closeModal();
      });
      foot.appendChild(el);
    });
    box.appendChild(foot);
    mask.appendChild(box);
    root.appendChild(mask);
    modalOnClose = opt.onClose || null;
    if (opt.star) SFX.play('unlock');
    return box;
  }
  function closeModal() {
    const cb = modalOnClose; modalOnClose = null;
    $('#modal-root').innerHTML = '';
    if (cb) cb();
  }

  /* 星星飘落特效 */
  function starFalls(n) {
    const layer = h('div', 'star-fall');
    for (let i = 0; i < (n || 12); i++) {
      const s = h('i');
      s.innerHTML = ART.icon('star');
      s.style.left = (6 + Math.random() * 88) + '%';
      s.style.top = (10 + Math.random() * 40) + '%';
      s.style.animationDelay = (Math.random() * 0.7) + 's';
      layer.appendChild(s);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 2400);
  }

  function refreshStars() {
    const html = ART.icon('star') + ' 星光 ' + Store.data.stars;
    const a = $('#menu-score'); if (a) a.innerHTML = html;
    const b = $('#codex-score'); if (b) b.innerHTML = html;
  }

  /* ---------------- 屏幕切换 ---------------- */
  function showScreen(id) {
    $$('.screen').forEach(s => s.classList.toggle('is-active', s.id === id));
  }

  /* ============================================================
     拖拽系统：支持鼠标 / 触摸，并支持「点一下再点一下」
     ============================================================ */
  const Drag = (function () {
    let active = null;      // 正在拖拽
    let pending = null;     // 点击模式：已选中的源
    let ghost = null;

    function clearPending() {
      if (pending && pending.el) pending.el.classList.remove('dragging');
      pending = null;
      $$('[data-drop]').forEach(el => el.classList.remove('drop-hover'));
    }

    function markTargets(on) {
      $$('[data-drop]').forEach(el => el.classList.toggle('drop-hover', on));
    }

    function makeGhost(el) {
      const g = el.cloneNode(true);
      g.classList.add('drag-ghost');
      $('#drag-layer').appendChild(g);
      return g;
    }

    function targetAt(x, y) {
      if (ghost) ghost.style.display = 'none';
      const el = document.elementFromPoint(x, y);
      if (ghost) ghost.style.display = '';
      if (!el) return null;
      const t = el.closest ? el.closest('[data-drop]') : null;
      return t;
    }

    function register(el, opts) {
      el.style.touchAction = 'none';
      el.addEventListener('pointerdown', e => {
        if (el.dataset.locked === '1') return;
        e.preventDefault();
        const startX = e.clientX, startY = e.clientY;
        let dragging = false;
        const rect = el.getBoundingClientRect();

        el.setPointerCapture && el.setPointerCapture(e.pointerId);

        function move(ev) {
          const dx = ev.clientX - startX, dy = ev.clientY - startY;
          if (!dragging && Math.hypot(dx, dy) > 8) {
            dragging = true;
            clearPending();
            el.classList.add('dragging');
            ghost = makeGhost(el);
            SFX.play('cloth');
          }
          if (dragging && ghost) {
            ghost.style.left = ev.clientX + 'px';
            ghost.style.top = ev.clientY + 'px';
            markTargets(false);
            const t = targetAt(ev.clientX, ev.clientY);
            if (t && opts.isTarget && opts.isTarget(t)) t.classList.add('drop-hover');
            else if (t) t.classList.add('drop-hover');
          }
        }

        function up(ev) {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerup', up);
          el.removeEventListener('pointercancel', up);
          if (ghost) { ghost.remove(); ghost = null; }
          el.classList.remove('dragging');
          markTargets(false);

          if (!dragging) {
            // 点击模式
            if (pending && pending.el === el) { clearPending(); SFX.play('click'); return; }
            clearPending();
            pending = { el: el, payload: opts.payload, opts: opts };
            el.classList.add('dragging');
            markTargets(true);
            SFX.play('tap');
            return;
          }
          const t = targetAt(ev.clientX, ev.clientY);
          if (t) { SFX.play('drop'); opts.onDrop && opts.onDrop(t, opts.payload); }
          else { SFX.play('cloth'); }
        }

        if (rect && rect.width) { /* no-op，保持结构清晰 */ }
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
      });
    }

    /* 点击模式下：点目标完成投放 */
    document.addEventListener('click', e => {
      if (!pending) return;
      const t = e.target.closest ? e.target.closest('[data-drop]') : null;
      if (!t) return;
      // 槽位上的“取回”按钮不应触发放置
      if (e.target.closest('.slot-clear')) return;
      e.stopPropagation();
      SFX.play('drop');
      const p = pending; clearPending();
      p.opts.onDrop && p.opts.onDrop(t, p.payload);
    }, true);

    return {
      register,
      clearPending,
      isPending: () => !!pending
    };
  })();

  /* 列表内排序（用于“处理优先级”） */
  function enableSort(listEl, onSort) {
    function attach(el) {
      el.style.touchAction = 'none';
      el.addEventListener('pointerdown', e => {
        if (e.target.closest('button')) return;
        e.preventDefault();
        const startX = e.clientX, startY = e.clientY;
        let started = false, ghost = null;
        el.setPointerCapture && el.setPointerCapture(e.pointerId);

        function mv(ev) {
          if (!started) {
            if (Math.hypot(ev.clientX - startX, ev.clientY - startY) <= 8) return;
            started = true;
            el.classList.add('dragging');
            ghost = el.cloneNode(true);
            ghost.classList.add('drag-ghost');
            ghost.style.width = el.offsetWidth + 'px';
            $('#drag-layer').appendChild(ghost);
            SFX.play('cloth');
          }
          ghost.style.left = ev.clientX + 'px';
          ghost.style.top = ev.clientY + 'px';
          // 按指针纵坐标实时换位
          const others = Array.prototype.slice.call(listEl.querySelectorAll('.sort-item')).filter(i => i !== el);
          let next = null;
          for (const o of others) {
            const r = o.getBoundingClientRect();
            if (ev.clientY < r.top + r.height / 2) { next = o; break; }
          }
          listEl.insertBefore(el, next); // next 为 null 时追加到末尾
        }

        function up() {
          el.removeEventListener('pointermove', mv);
          el.removeEventListener('pointerup', up);
          el.removeEventListener('pointercancel', up);
          if (ghost) { ghost.remove(); ghost = null; }
          if (started) { el.classList.remove('dragging'); SFX.play('drop'); onSort && onSort(); }
          else SFX.play('click');
        }

        el.addEventListener('pointermove', mv);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
      });
    }
    Array.prototype.slice.call(listEl.querySelectorAll('.sort-item')).forEach(attach);
    return { refresh() { Array.prototype.slice.call(listEl.querySelectorAll('.sort-item')).forEach(el => { if (!el.dataset.bound) { el.dataset.bound = '1'; attach(el); } }); } };
  }

  /* ============================================================
     标题屏 / 开篇 / 菜单
     ============================================================ */
  function initTitle() {
    $('#title-star').innerHTML = ART.icon('star');
    $('#title-scene').innerHTML = ART.art('titleScene');
  }

  /* 开篇引导 */
  const Intro = {
    idx: 0,
    open() { this.idx = 0; showScreen('screen-intro'); this.render(); },
    render() {
      const p = D.intro[this.idx];
      $('#intro-portrait').innerHTML = ART.art(p.art);
      $('#intro-body').innerHTML = '<h3>' + esc(p.title) + '</h3>' + p.body;
      $('#intro-index').textContent = (this.idx + 1) + ' / ' + D.intro.length;
      $('#intro-progress').innerHTML = '<i style="width:' + ((this.idx + 1) / D.intro.length * 100) + '%"></i>';
      $('#btn-intro-prev').disabled = this.idx === 0;
      $('#btn-intro-next').textContent = this.idx === D.intro.length - 1 ? '入 列' : '下一页';
    },
    next() {
      SFX.play('page');
      if (this.idx < D.intro.length - 1) { this.idx++; this.render(); }
      else openMenu();
    },
    prev() { SFX.play('page'); if (this.idx > 0) { this.idx--; this.render(); } }
  };

  /* 主菜单 */
  function openMenu() {
    showScreen('screen-menu');
    refreshStars();
    renderMenu();
  }

  function renderMenu() {
    const list = $('#menu-list');
    list.innerHTML = '';
    D.levels.forEach((lv, i) => {
      const st = Store.data.levels[lv.id] ? Store.data.levels[lv.id].state : 'locked';
      const locked = st === 'locked';
      const savedStep = Store.data.step[lv.id] || 0;
      const btn = h('button', 'level-entry' + (locked ? ' locked' : ''));
      btn.innerHTML =
        '<div class="le-thumb">' + ART.icon(lv.thumb) + '</div>' +
        '<div class="le-main">' +
        '<div class="le-name">第' + (i === 0 ? '一' : '二') + '页 · ' + esc(lv.name) + '</div>' +
        '<div class="le-desc">' + esc(lv.subtitle) + '<br><span style="opacity:.7">' + esc(lv.era) + '</span></div>' +
        '</div>' +
        '<div class="le-state ' + (locked ? 'lock' : (st === 'done' ? 'done' : 'new')) + '">' +
        (locked ? '未解锁' : (st === 'done' ? '已通关' : (savedStep > 0 ? '继续' : '未开始'))) +
        '</div>';
      if (!locked) {
        btn.addEventListener('click', () => {
          SFX.play('click');
          Game.start(lv.id, Store.data.step[lv.id] || 0);
        });
      }
      list.appendChild(btn);
    });
  }

  /* ============================================================
     游戏主体
     ============================================================ */
  const Game = {
    level: null,
    index: 0,
    vitals: null,
    dlgQueue: [],
    dlgEnd: null,

    start(levelId, fromStep) {
      this.level = D.levels.find(l => l.id === levelId);
      this.index = fromStep || 0;
      this.vitals = this.level.vitals ? this.level.vitals.start : null;
      showScreen('screen-game');
      $('#hud-level').textContent = this.level.name + ' · ' + this.level.subtitle;
      $('#hud-vitals').hidden = !this.level.vitals;
      this.renderStep();
    },

    /* ---------- 逐步渲染 ---------- */
    renderStep() {
      const step = this.level.steps[this.index];
      Drag.clearPending();
      $('#stage').innerHTML = '';
      $('#stage').scrollTop = 0;
      $('#stage-scene').innerHTML = ART.scene(step.scene || this.level.scene);
      $('#hud-step').textContent = '第 ' + (this.index + 1) + ' / ' + this.level.steps.length + ' 段';
      if (this.level.vitals) this.updateVitals(0);

      if (step.dialogue && step.dialogue.length) {
        this.playDialogue(step.dialogue.slice(), () => {
          if (step.type === 'narrative') this.next();
          else this.renderPanel(step);
        });
      } else {
        $('#dialogue').hidden = true;
        this.renderPanel(step);
      }
    },

    /* ---------- 对话 ---------- */
    playDialogue(queue, done) {
      this.dlgQueue = queue; this.dlgEnd = done;
      const bar = $('#dialogue');
      bar.hidden = false;
      this.dlgNext();
    },
    dlgNext() {
      if (!this.dlgQueue.length) {
        $('#dialogue').hidden = true;
        const cb = this.dlgEnd; this.dlgEnd = null;
        if (cb) cb();
        return;
      }
      const line = this.dlgQueue.shift();
      const spk = $('#dialogue-speaker');
      spk.textContent = line.who || '';
      spk.style.color = (line.who === '旁白') ? 'var(--teal)' : 'var(--red)';
      $('#dialogue-text').innerHTML = line.text;
      $('#dialogue-next').textContent = this.dlgQueue.length ? '继续 ▾' : '开始 ▾';
      SFX.play('page');
    },

    /* ---------- 面板分发 ---------- */
    renderPanel(step) {
      const stage = $('#stage');
      const fn = this['render_' + step.type] || this.render_choice;
      fn.call(this, stage, step);
    },

    panelShell(step) {
      const wrap = h('div', 'panel');
      wrap.innerHTML =
        '<h3 class="task-title">' + esc(step.title) + '</h3>' +
        (step.tip ? '<p class="task-tip">' + esc(step.tip) + '</p>' : '') +
        (step.brief ? '<div class="task-brief">' + step.brief + '</div>' : '');
      return wrap;
    },

    pass(okHint) {
      SFX.play('correct');
      toast(okHint || '这一步走对了。', 'good');
      setTimeout(() => this.next(), 620);
    },

    next() {
      // 每走对一步，全队伤病值下降一段
      if (this.level.vitals) this.updateVitals(-8);
      this.index++;
      Store.data.step[this.level.id] = this.index;
      Store.save();
      if (this.index >= this.level.steps.length) this.finishLevel();
      else this.renderStep();
    },

    /* ---------- 叙述（无操作） ---------- */
    render_narrative(stage, step) {
      const wrap = h('div', 'panel panel-narrow narrative');
      wrap.innerHTML =
        '<div class="nar-icon">' + ART.icon(step.scene === 'snow' ? 'snow' : (step.scene === 'grass' ? 'herb' : 'lantern')) + '</div>' +
        (step.title ? '<h3 class="task-title">' + esc(step.title) + '</h3>' : '');
      stage.appendChild(wrap);
    },

    /* ---------- 选择 / 清点（单选、多选） ---------- */
    render_choice(stage, step) {
      const self = this;
      const wrap = this.panelShell(step);
      const grid = h('div', 'choice-grid');
      const selected = new Set();
      const correctIds = step.options.filter(o => o.correct).map(o => o.id);
      const need = step.multi ? (step.pickCount || correctIds.length) : 1;
      let solved = !!(this.level.cache && this.level.cache[step.id]);

      step.options.forEach(o => {
        const card = h('button', 'choice-card');
        card.dataset.id = o.id;
        card.innerHTML =
          '<div class="cc-icon">' + ART.icon(o.icon) + '</div>' +
          '<div class="cc-body"><div class="cc-name">' + esc(o.name) + '</div>' +
          '<div class="cc-desc">' + esc(o.desc) + '</div></div>' +
          '<div class="choice-mark"></div>';
        card.addEventListener('click', () => onPick(card, o));
        grid.appendChild(card);
      });

      if (step.booklet) {
        const bk = h('div', 'action-row');
        bk.innerHTML = '<button class="booklet-btn">' + ART.icon('booklet') + '翻开《中草药手册》</button>';
        bk.firstChild.addEventListener('click', () => {
          SFX.play('page');
          openModal({
            kicker: '随 身 手 册', title: '《中草药手册》',
            wide: true,
            body: '<p class="no-indent">认野菜，认的是<b>记号</b>，不是“长得像不像”：</p>' +
              '<p class="no-indent">· <b>车前草</b>：叶子贴地长成一圈，中间抽一根细穗。可食，也能利尿止泻。</p>' +
              '<p class="no-indent">· <b>灰灰菜</b>：叶背有一层白粉，掐断是清爽的草味。可食，先焯水。</p>' +
              '<p class="no-indent">· <b>毒芹</b>：茎上有紫色斑点，折断流黄水，气味刺鼻。<b>有毒，不可食。</b></p>' +
              '<div class="m-quote">拿不准就不采。野菜认错一次，整队的人都要跟着受罪。</div>',
            star: false
          });
        });
        wrap.appendChild(bk);
      }

      wrap.appendChild(grid);

      const row = h('div', 'action-row');
      const okBtn = h('button', 'btn btn-primary', step.multi ? '确 定' : '');
      okBtn.hidden = !step.multi;
      row.appendChild(okBtn);
      wrap.appendChild(row);
      stage.appendChild(wrap);

      function paint() {
        $$('.choice-card', grid).forEach(c => {
          const sel = selected.has(c.dataset.id);
          c.classList.toggle('selected', sel);
          c.querySelector('.choice-mark').textContent = sel ? '✓' : '';
        });
      }

      function onPick(card, o) {
        if (solved) return;
        if (!step.multi) {
          // 单选：立刻判定
          if (o.correct) {
            solved = true;
            card.classList.add('correct');
            $$('.choice-card', grid).forEach(c => { if (c !== card) c.classList.add('dim'); c.disabled = true; });
            SFX.play('correct');
            toast(o.feedback || '做得对。', 'good');
            if (o.effect) self.applyEffect(o.effect);
            setTimeout(() => self.next(), 1200);
          } else {
            SFX.play('wrong');
            card.classList.add('wrong');
            setTimeout(() => card.classList.remove('wrong'), 500);
            toast(o.feedback || GAME_DATA.tips.almostThere, 'gentle', 4200);
            if (o.effect) self.applyEffect(o.effect);
          }
          return;
        }
        // 多选：切换选中
        if (selected.has(o.id)) selected.delete(o.id);
        else {
          if (selected.size >= need) {
            toast('至多选 ' + need + ' 项。先想清楚再确定。', 'gentle');
            SFX.play('wrong');
            return;
          }
          selected.add(o.id);
        }
        SFX.play('tap');
        paint();
      }

      okBtn.addEventListener('click', () => {
        if (solved) return;
        if (selected.size === 0) { toast('先选一项再确定。', 'gentle'); SFX.play('wrong'); return; }
        const picked = Array.from(selected);
        const bad = picked.filter(id => !correctIds.includes(id));
        if (bad.length) {
          SFX.play('wrong');
          bad.forEach(id => {
            const o = step.options.find(x => x.id === id);
            const card = grid.querySelector('[data-id="' + id + '"]');
            if (card) { card.classList.add('wrong'); setTimeout(() => card.classList.remove('wrong'), 600); }
            if (o && o.feedback) setTimeout(() => toast(o.feedback, 'gentle', 4600), 200);
          });
          return;
        }
        const miss = correctIds.filter(id => !picked.includes(id));
        if (miss.length) {
          SFX.play('wrong');
          toast('还差 ' + miss.length + ' 项没有选到。' + GAME_DATA.tips.almostThere, 'gentle', 3400);
          return;
        }
        solved = true;
        $$('.choice-card', grid).forEach(c => { c.disabled = true; if (selected.has(c.dataset.id)) c.classList.add('correct'); });
        const notes = picked.map(id => (step.options.find(x => x.id === id) || {}).note).filter(Boolean);
        SFX.play('correct');
        toast((notes.length ? notes.join(' ') : '这一步走对了。'), 'good', 3000);
        setTimeout(() => self.next(), 1100);
      });

      if (solved) $$('.choice-card', grid).forEach(c => { c.disabled = true; c.classList.add('correct'); });
    },

    /* ---------- 顺序（拖/点 → 槽位） ---------- */
    render_order(stage, step) {
      if (step.items) return this.render_sort(stage, step);
      const self = this;
      const wrap = this.panelShell(step);
      const slotsBox = h('div', 'slot-list');
      const bank = h('div', 'token-bank');

      step.slots.forEach((s, i) => {
        const el = h('div', 'slot');
        el.dataset.drop = s.id;
        el.dataset.answer = s.answer;
        el.innerHTML = '<span class="slot-no">' + (i + 1) + '</span><span class="slot-body">' + esc(s.label) + '</span>';
        slotsBox.appendChild(el);
      });

      step.tokens.forEach(t => {
        const el = h('div', 'token');
        el.innerHTML =
          '<div class="cc-icon">' + ART.icon(t.icon) + '</div>' +
          '<div class="tk-name">' + esc(t.name) + '</div>' +
          '<div class="tk-desc">' + esc(t.desc) + '</div>';
        Drag.register(el, {
          payload: t.id,
          onDrop: (target, payload) => tryPlace(target, payload, el, t)
        });
        bank.appendChild(el);
      });

      wrap.appendChild(slotsBox);
      wrap.appendChild(bank);
      stage.appendChild(wrap);

      function tryPlace(target, payload, tokenEl, t) {
        if (target.dataset.filled) { toast('这个位置已经放好了。', 'gentle'); return; }
        if (target.dataset.answer === payload) {
          target.dataset.filled = payload;
          target.classList.add('filled', 'ok');
          target.querySelector('.slot-body').textContent = t.name;
          tokenEl.classList.add('picked');
          tokenEl.dataset.locked = '1';
          SFX.play('correct');
          toast((step.slots.find(s => s.id === target.dataset.drop) || {}).okText || '放对了。', 'good', 3200);
          const clear = h('button', 'slot-clear', '↺');
          clear.title = '取回';
          clear.addEventListener('click', () => {
            delete target.dataset.filled;
            target.classList.remove('filled', 'ok');
            target.querySelector('.slot-body').textContent = (step.slots.find(s => s.id === target.dataset.drop) || {}).label;
            clear.remove();
            tokenEl.classList.remove('picked');
            tokenEl.dataset.locked = '0';
            SFX.play('cloth');
          });
          target.appendChild(clear);
          const all = $$('.slot', slotsBox).every(s => s.dataset.filled);
          if (all) setTimeout(() => self.pass('顺序全对。这只脚，留住了。'), 500);
        } else {
          SFX.play('wrong');
          tokenEl.classList.add('wrong');
          setTimeout(() => tokenEl.classList.remove('wrong'), 500);
          toast('这一步的顺序不太对。想想：先做什么，才能看清下一层？', 'gentle', 3400);
        }
      }
    },

    /* ---------- 优先级排序 ---------- */
    render_sort(stage, step) {
      const self = this;
      const wrap = this.panelShell(step);
      const list = h('div', 'sort-list');

      step.items.forEach(it => {
        const el = h('div', 'sort-item');
        el.dataset.id = it.id;
        el.innerHTML =
          '<span class="si-rank">·</span>' +
          ART.icon(it.icon) +
          '<div class="si-body"><div class="si-name">' + esc(it.name) + '</div>' +
          '<div class="si-desc">' + esc(it.desc) + '</div>' +
          '<div class="pc-status">' + (it.tags || []).map(t => '<span class="status-chip ' + (t.k || '') + '">' + esc(t.t) + '</span>').join('') + '</div>' +
          '</div>';
        list.appendChild(el);
      });

      wrap.appendChild(list);
      const row = h('div', 'action-row');
      row.innerHTML = '<button class="btn btn-primary">确 定 顺 序</button>';
      wrap.appendChild(row);
      stage.appendChild(wrap);

      const upd = () => $$('.sort-item', list).forEach((el, i) => { el.querySelector('.si-rank').textContent = (i + 1); });
      upd();
      enableSort(list, upd);

      row.firstChild.addEventListener('click', () => {
        const order = $$('.sort-item', list).map(el => el.dataset.id);
        if (order.join(',') === step.answer.join(',')) {
          SFX.play('correct');
          const lines = (step.feedbackOk || []).join('<br>');
          $$('.sort-item', list).forEach(el => el.classList.add('done'));
          toast(step.feedbackOk ? step.feedbackOk[0] : '顺序正确。', 'good', 3600);
          if (lines) {
            setTimeout(() => openModal({
              kicker: '排 序 依 据', title: '为什么是这个顺序', wide: true,
              body: '<div class="codex-detail">' + lines + '</div>'
            }), 400);
          }
          setTimeout(() => self.next(), 600);
        } else {
          SFX.play('wrong');
          toast('再想想：谁拖下去会恶化？<b>冻伤最重、已经走不动的人排在最前。</b>', 'gentle', 4000);
        }
      });
    },

    /* ---------- 物资分配 ---------- */
    render_assign(stage, step) {
      const self = this;
      const wrap = this.panelShell(step);
      const grid = h('div', 'patient-grid');
      const doneMap = {};

      step.targets.forEach(t => {
        const card = h('div', 'patient-card');
        card.dataset.drop = t.id;
        card.innerHTML =
          '<div class="pc-head">' + ART.icon(t.icon) + '<div><div class="pc-name">' + esc(t.name) + '</div>' +
          '<div class="pc-age">' + esc(t.desc) + '</div></div></div>' +
          '<div class="mt-slot"><span class="mt-hint">把物资拖到这里</span></div>';
        grid.appendChild(card);
      });

      wrap.appendChild(grid);
      const bankWrap = h('div', 'token-bank compact');
      bankWrap.style.marginTop = '18px';
      step.supplies.forEach(s => {
        const el = h('div', 'token');
        el.innerHTML = ART.icon(s.icon) + '<div class="tk-name">' + esc(s.name) + '</div>';
        Drag.register(el, {
          payload: s.id,
          onDrop: (target, payload) => place(target, payload, el, s)
        });
        bankWrap.appendChild(el);
      });
      wrap.appendChild(bankWrap);
      stage.appendChild(wrap);

      function place(target, payload, tokenEl, s) {
        const cfg = step.targets.find(t => t.id === target.dataset.drop);
        if (!cfg) return;
        if (doneMap[cfg.id]) { toast('这位同志已经分到东西了。', 'gentle'); return; }
        if (cfg.answer === payload) {
          doneMap[cfg.id] = payload;
          tokenEl.classList.add('picked');
          tokenEl.dataset.locked = '1';
          const slot = target.querySelector('.mt-slot');
          slot.innerHTML = ART.icon(s.icon) + '<span class="mt-name" style="font-size:14px">' + esc(s.name) + '</span>';
          target.classList.add('done');
          SFX.play('correct');
          toast(cfg.okText, 'good', 3600);
          if (Object.keys(doneMap).length === step.targets.length) {
            setTimeout(() => self.pass('物资分得妥当。全队暖起来一些。'), 700);
          }
        } else {
          SFX.play('wrong');
          toast('这件东西给他，用处不大。<b>把每件物资给最需要的人。</b>', 'gentle', 3200);
        }
      }
    },

    /* ---------- 配对（草药 → 战士） ---------- */
    render_match(stage, step) {
      const self = this;
      const wrap = this.panelShell(step);
      const area = h('div', 'match-area');
      const left = h('div', 'match-col');
      const right = h('div', 'match-col');
      left.innerHTML = '<h4>需要调理的人</h4>';
      right.innerHTML = '<h4>随身带的草药</h4>';

      step.targets.forEach(t => {
        const el = h('div', 'match-target');
        el.dataset.drop = t.id;
        el.innerHTML =
          '<div class="mt-name">' + esc(t.name) + '</div>' +
          '<div class="mt-desc">' + esc(t.desc) + '</div>' +
          '<div class="mt-slot"><span class="mt-hint">把草药拖到这里</span></div>';
        left.appendChild(el);
      });

      step.sources.forEach(s => {
        const el = h('div', 'sort-item');
        el.style.cursor = 'grab';
        el.innerHTML = ART.icon(s.icon) +
          '<div class="si-body"><div class="si-name">' + esc(s.name) + '</div>' +
          '<div class="si-desc">' + esc(s.desc) + '</div></div>';
        Drag.register(el, {
          payload: s.id,
          onDrop: (target, payload) => place(target, payload, el, s)
        });
        right.appendChild(el);
      });

      area.appendChild(left); area.appendChild(right);
      wrap.appendChild(area);
      stage.appendChild(wrap);

      let done = 0;
      function place(target, payload, tokenEl, s) {
        const cfg = step.targets.find(t => t.id === target.dataset.drop);
        if (!cfg) return;
        if (target.dataset.filled) { toast('这里已经配好了。', 'gentle'); return; }
        if (cfg.answer === payload) {
          target.dataset.filled = payload;
          target.classList.add('filled', 'ok');
          target.querySelector('.mt-slot').innerHTML = ART.icon(s.icon) + '<span class="mt-name" style="font-size:15px">' + esc(s.name) + '</span>';
          tokenEl.dataset.locked = '1';
          tokenEl.classList.add('dragging');
          SFX.play('correct');
          toast(cfg.okText, 'good', 3600);
          done++;
          if (done === step.targets.length) setTimeout(() => self.pass('对症用药。两人都能跟上队伍。'), 800);
        } else {
          SFX.play('wrong');
          toast('这味药不是治这一症的。<b>《手册》上写着：一味草管一件事。</b>', 'gentle', 3400);
        }
      }
    },

    /* ---------- 伤病值 ---------- */
    applyEffect(kind) {
      if (!this.level.vitals) return;
      if (kind === 'diarrhea') {
        this.updateVitals(12);
        toast('有人开始腹泻、腹痛 —— 记下来，后面用草药调回来。', 'warn', 3800);
      }
    },
    updateVitals(delta) {
      if (!this.level.vitals) return;
      this.vitals = Math.max(0, Math.min(100, this.vitals + delta));
      const cfg = this.level.vitals;
      $('#vitals-fill').style.width = this.vitals + '%';
      $('#vitals-num').textContent = Math.round(this.vitals) + ' / 目标 ' + cfg.target;
      $('#vitals-fill').style.background = this.vitals <= cfg.target
        ? 'linear-gradient(90deg,#4C7C7A,#6FA07A)'
        : 'linear-gradient(90deg,var(--teal-soft),var(--red-soft))';
    },

    /* ---------- 通关 ---------- */
    finishLevel() {
      const lv = this.level;
      Store.data.levels[lv.id] = { state: 'done' };
      Store.data.step[lv.id] = 0;
      const next = D.levels[D.levels.indexOf(lv) + 1];
      if (next) Store.data.levels[next.id] = { state: 'open' };
      Store.save();
      SFX.play('win');
      starFalls(14);
      if (this.level.vitals) {
        const okV = this.vitals <= this.level.vitals.target;
        toast(okV
          ? '全队伤病值降到了安全线以内——这一程，一个人都不少。'
          : '全队伤病值还偏高。多一分谨慎，就少一个病人。',
          okV ? 'good' : 'warn', 3400);
      }

      setTimeout(() => {
        this.showScience(lv, () => {
          const cx = D.codex.find(c => c.level === lv.id);
          if (cx && Store.data.codex.indexOf(cx.id) < 0) {
            Storage_unlockCodex(cx, () => this.showQuiz(lv));
          } else {
            this.showQuiz(lv);
          }
        });
      }, 500);
    },

    showScience(lv, cb) {
      const s = lv.science;
      openModal({
        star: true, wide: true,
        kicker: s.kicker, title: s.title,
        body: s.paragraphs.map(p => '<p>' + p + '</p>').join('') +
          '<div class="m-quote">' + esc(s.quote) + '</div>',
        buttons: [{ label: '收 入 图 鉴', cls: 'btn btn-primary' }],
        onClose: cb
      });
    },

    showQuiz(lv) {
      const q = D.quizzes.find(x => x.level === lv.id);
      if (!q) { this.afterLevel(lv); return; }
      const already = Store.data.quiz[q.id];
      const body =
        '<p class="no-indent" style="font-size:16px;line-height:1.9">' + esc(q.title) + '</p>' +
        '<div class="quiz-options">' +
        q.options.map(o => '<button class="quiz-opt" data-k="' + o.key + '"><span class="qo-key">' + o.key + '.</span><span>' + esc(o.text) + '</span></button>').join('') +
        '</div>' +
        '<div class="quiz-result" id="quizResult"></div>';

      const box = openModal({
        star: false, wide: true,
        kicker: q.kicker, title: '答对可获得星光积分',
        body: body,
        buttons: [],
        onClose: () => this.afterLevel(lv)
      });

      const foot = $('.modal-foot', box);
      const goBtn = h('button', 'btn btn-primary', '继 续');
      goBtn.disabled = true;
      goBtn.addEventListener('click', () => { SFX.play('click'); closeModal(); });
      foot.appendChild(goBtn);

      let answered = false;
      $$('.quiz-opt', box).forEach(btn => {
        btn.addEventListener('click', () => {
          if (answered) return;
          const key = btn.dataset.k;
          if (key === q.answer) {
            answered = true;
            btn.classList.add('correct');
            SFX.play('correct');
            starFalls(8);
            $('#quizResult').innerHTML = '答对了。<b>' + esc(q.explain) + '</b>';
            if (!already) {
              Store.data.quiz[q.id] = 1;
              Store.addStar(2);
              $('#quizResult').innerHTML += '<br><span style="color:var(--amber-deep)">获得 <b>2</b> 点星光积分。</span>';
            } else {
              $('#quizResult').innerHTML += '<br><span style="opacity:.7">这题已经答过，不再重复计分。</span>';
            }
            Store.save();
            $$('.quiz-opt', box).forEach(b => b.disabled = true);
            goBtn.disabled = false;
          } else {
            SFX.play('wrong');
            btn.classList.add('wrong');
            $('#quizResult').innerHTML = '再想想 —— 这一题说的正是前面刚走过的那一段。';
            setTimeout(() => btn.classList.remove('wrong'), 600);
          }
        });
      });
    },

    afterLevel(lv) {
      const next = D.levels[D.levels.indexOf(lv) + 1];
      if (next && Store.data.levels[next.id] && Store.data.levels[next.id].state === 'open') {
        openModal({
          star: false, kicker: '日 记 翻 页', title: '下一页：' + next.name,
          body: '<p class="no-indent">' + esc(next.brief) + '</p>' +
            '<div class="m-quote">' + esc(next.subtitle) + '</div>',
          buttons: [
            { label: '回 到 首 页', cls: 'btn btn-ghost', act: () => openMenu() },
            { label: '继 续 下 一 页', cls: 'btn btn-primary', act: () => Game.start(next.id, 0) }
          ]
        });
      } else if (!next) {
        showEnding();
      } else {
        openMenu();
      }
    }
  };

  /* ---------------- 图鉴解锁 ---------------- */
  function Storage_unlockCodex(cx, cb) {
    if (Store.data.codex.indexOf(cx.id) < 0) Store.data.codex.push(cx.id);
    Store.save();
    SFX.play('unlock');
    starFalls(16);
    openModal({
      star: true, wide: true,
      kicker: '图 鉴 解 锁', title: cx.name,
      body: '<div class="codex-card-modal"><div class="codex-art">' + ART.art(cx.art) + '</div></div>' +
        '<p class="no-indent">' + esc(cx.line) + '</p>' +
        '<div class="m-quote">' + esc(cx.quote) + '</div>',
      buttons: [{ label: '好 的', cls: 'btn btn-primary' }],
      onClose: cb
    });
  }

  /* ---------------- 图鉴屏 ---------------- */
  function openCodex() {
    showScreen('screen-codex');
    refreshStars();
    const list = $('#codex-list');
    list.innerHTML = '';
    D.codex.forEach(cx => {
      const got = Store.data.codex.indexOf(cx.id) >= 0;
      const card = h('button', 'codex-card' + (got ? '' : ' locked'));
      card.innerHTML =
        '<div class="cx-art">' + ART.art(cx.art) + '</div>' +
        '<div class="cx-body">' +
        '<div class="cx-name">' + esc(cx.name) + '</div>' +
        '<div class="cx-line">' + (got ? esc(cx.line) : '通关对应章节后解锁这一页史料。') + '</div>' +
        (got ? '<div class="cx-got">已收入 · 点击查看</div>' : '<div class="cx-lock">未解锁</div>') +
        '</div>';
      if (got) card.addEventListener('click', () => { SFX.play('click'); openCodexDetail(cx); });
      list.appendChild(card);
    });
  }

  function openCodexDetail(cx) {
    const d = cx.unlockDetail;
    const unlocked = !!Store.data.details[cx.id];
    const cost = d.cost;
    const can = unlocked || Store.data.stars >= cost;

    const box = openModal({
      star: true, wide: true,
      kicker: '红 色 军 医 图 鉴', title: cx.name,
      body:
        '<div class="codex-card-modal"><div class="codex-art">' + ART.art(cx.art) + '</div></div>' +
        cx.body.map(t => '<p class="no-indent">' + t + '</p>').join('') +
        '<div class="m-quote">' + esc(cx.quote) + '</div>' +
        '<div class="codex-detail' + (unlocked ? '' : ' locked') + '" id="cxDetail">' +
        (unlocked
          ? '<h5>' + esc(d.title) + '</h5>' + esc(d.text)
          : '用 <b>' + cost + '</b> 点星光积分解锁这一段史料细节（当前 ' + Store.data.stars + ' 点）。') +
        '</div>',
      buttons: unlocked ? [{ label: '合 上 图 鉴', cls: 'btn btn-primary' }] : [],
      onClose: null
    });

    if (!unlocked) {
      const foot = $('.modal-foot', box);
      const b1 = h('button', 'btn btn-ghost', '合 上 图 鉴');
      b1.addEventListener('click', () => { SFX.play('click'); closeModal(); });
      const b2 = h('button', 'btn btn-primary', '用 ' + cost + ' 点星光解锁');
      b2.disabled = !can;
      b2.addEventListener('click', () => {
        if (Store.data.stars < cost) { SFX.play('wrong'); return; }
        Store.data.stars -= cost;
        Store.data.details[cx.id] = 1;
        Store.save();
        refreshStars();
        SFX.play('star'); starFalls(10);
        closeModal();
        setTimeout(() => openCodexDetail(cx), 260);
      });
      foot.appendChild(b1); foot.appendChild(b2);
    }
  }

  /* ---------------- 结局屏 ---------------- */
  function showEnding() {
    showScreen('screen-ending');
    const e = D.ending;
    $('#ending-scene').innerHTML = ART.art(e.art);
    $('#ending-text').innerHTML =
      '<h2>' + esc(e.title) + '</h2>' +
      e.paragraphs.map(p => '<p>' + p + '</p>').join('') +
      '<p class="end-quote">' + esc(e.quote) + '</p>' +
      '<p style="font-size:12px;opacity:.7;text-indent:0">' + esc(e.tail) + '</p>';
    SFX.play('win');
    starFalls(18);
  }

  /* ---------------- 事件绑定 ---------------- */
  function bind() {
    $('#btn-start').addEventListener('click', () => {
      SFX.init(); SFX.play('click');
      const introDone = Store.data.introDone;
      if (introDone) openMenu(); else { Store.data.introDone = 1; Store.save(); Intro.open(); }
    });
    $('#btn-menu-codex').addEventListener('click', () => { SFX.init(); SFX.play('click'); openCodex(); });
    $('#btn-menu-codex2').addEventListener('click', () => { SFX.play('click'); openCodex(); });
    $('#btn-codex-back').addEventListener('click', () => {
      SFX.play('click');
      if (Store.data.introDone) openMenu(); else showScreen('screen-title');
    });

    $('#btn-intro-next').addEventListener('click', () => Intro.next());
    $('#btn-intro-prev').addEventListener('click', () => Intro.prev());
    $('#btn-intro-skip').addEventListener('click', () => { SFX.play('click'); openMenu(); });

    $('#btn-reset').addEventListener('click', () => {
      openModal({
        kicker: '温 馨 提 示', title: '确定要重置进度吗？',
        body: '<p class="no-indent">关卡进度、图鉴收集与星光积分都会被清空，此操作不可撤销。</p>',
        buttons: [
          { label: '再 想 想', cls: 'btn btn-ghost' },
          {
            label: '确 定 重 置', cls: 'btn btn-primary', act: () => {
              Store.reset(); SFX.play('wrong'); toast('进度已重置。', 'gentle'); renderMenu(); refreshStars(); syncContinueBtn();
            }
          }
        ]
      });
    });

    $('#btn-game-quit').addEventListener('click', () => {
      SFX.play('click');
      openModal({
        kicker: '合 上 日 记', title: '要离开这一段吗？',
        body: '<p class="no-indent">当前进度已经自动保存，随时可以回来接着写。</p>',
        buttons: [
          { label: '继 续 救 护', cls: 'btn btn-ghost' },
          { label: '返 回 首 页', cls: 'btn btn-primary', act: () => openMenu() }
        ]
      });
    });

    $('#btn-sound').addEventListener('click', () => {
      const on = SFX.toggle();
      Store.data.sound = on; Store.save();
      $('#btn-sound').textContent = on ? '音效 开' : '音效 关';
      if (on) SFX.play('click');
    });

    $('#dialogue').addEventListener('click', () => Game.dlgNext());
    $('#dialogue-next').addEventListener('click', e => { e.stopPropagation(); SFX.play('click'); Game.dlgNext(); });

    $('#btn-ending-menu').addEventListener('click', () => { SFX.play('click'); openMenu(); });

    // 首次交互启动音频
    document.addEventListener('pointerdown', function once() {
      SFX.init();
      document.removeEventListener('pointerdown', once);
    });
  }

  function syncContinueBtn() {
    const btn = $('#btn-continue');
    const resume = D.levels.find(lv => {
      const st = Store.data.levels[lv.id];
      return st && st.state !== 'locked' && (Store.data.step[lv.id] || 0) > 0;
    });
    if (resume) {
      btn.hidden = false;
      btn.textContent = '继续 · ' + resume.name;
      btn.onclick = () => { SFX.init(); SFX.play('click'); Game.start(resume.id, Store.data.step[resume.id] || 0); };
    } else { btn.hidden = true; }
  }

  /* ---------------- 启动 ---------------- */
  let __booted = false;
  function boot() {
    if (__booted) return;
    __booted = true;
    Store.load();
    initTitle();
    bind();
    refreshStars();
    syncContinueBtn();
    if (!Store.data.sound) {
      $('#btn-sound').textContent = '音效 关';
      SFX.toggle();
    }
    showScreen('screen-title');
  }

  document.addEventListener('DOMContentLoaded', boot);
  if (document.readyState !== 'loading') boot();

  window.__Game = Game;
})();
