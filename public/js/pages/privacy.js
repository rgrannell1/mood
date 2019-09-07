!(function (e) { var t = {}; function n (s) { if (t[s]) return t[s].exports; var i = t[s] = { i: s, l: !1, exports: {} }; return e[s].call(i.exports, i, i.exports, n), i.l = !0, i.exports }n.m = e, n.c = t, n.d = function (e, t, s) { n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: s }) }, n.r = function (e) { typeof Symbol !== 'undefined' && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(e, '__esModule', { value: !0 }) }, n.t = function (e, t) { if (1 & t && (e = n(e)), 8 & t) return e; if (4 & t && typeof e === 'object' && e && e.__esModule) return e; var s = Object.create(null); if (n.r(s), Object.defineProperty(s, 'default', { enumerable: !0, value: e }), 2 & t && typeof e !== 'string') for (var i in e)n.d(s, i, function (t) { return e[t] }.bind(null, i)); return s }, n.n = function (e) { var t = e && e.__esModule ? function () { return e.default } : function () { return e }; return n.d(t, 'a', t), t }, n.o = function (e, t) { return Object.prototype.hasOwnProperty.call(e, t) }, n.p = '', n(n.s = 3) }([function (e, t, n) {
  'use strict'
  /**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const s = new WeakMap(); const i = e => typeof e === 'function' && s.has(e); const o = void 0 !== window.customElements && void 0 !== window.customElements.polyfillWrapFlushCallback; const r = (e, t, n = null) => { for (;t !== n;) { const n = t.nextSibling; e.removeChild(t), t = n } }; const a = {}; const l = {}; const c = `{{lit-${String(Math.random()).slice(2)}}}`; const d = `\x3c!--${c}--\x3e`; const u = new RegExp(`${c}|${d}`); const h = '$lit$'; class p {constructor (e, t) { this.parts = [], this.element = t; const n = []; const s = []; const i = document.createTreeWalker(t.content, 133, null, !1); let o = 0; let r = -1; let a = 0; const { strings: l, values: { length: d } } = e; for (;a < d;) { const e = i.nextNode(); if (e !== null) { if (r++, e.nodeType === 1) { if (e.hasAttributes()) { const t = e.attributes; const { length: n } = t; let s = 0; for (let e = 0; e < n; e++)m(t[e].name, h) && s++; for (;s-- > 0;) { const t = l[a]; const n = _.exec(t)[2]; const s = n.toLowerCase() + h; const i = e.getAttribute(s); e.removeAttribute(s); const o = i.split(u); this.parts.push({ type: 'attribute', index: r, name: n, strings: o }), a += o.length - 1 } }e.tagName === 'TEMPLATE' && (s.push(e), i.currentNode = e.content) } else if (e.nodeType === 3) { const t = e.data; if (t.indexOf(c) >= 0) { const s = e.parentNode; const i = t.split(u); const o = i.length - 1; for (let t = 0; t < o; t++) { let n; let o = i[t]; if (o === '')n = v(); else { const e = _.exec(o); e !== null && m(e[2], h) && (o = o.slice(0, e.index) + e[1] + e[2].slice(0, -h.length) + e[3]), n = document.createTextNode(o) }s.insertBefore(n, e), this.parts.push({ type: 'node', index: ++r }) }i[o] === '' ? (s.insertBefore(v(), e), n.push(e)) : e.data = i[o], a += o } } else if (e.nodeType === 8) if (e.data === c) { const t = e.parentNode; e.previousSibling !== null && r !== o || (r++, t.insertBefore(v(), e)), o = r, this.parts.push({ type: 'node', index: r }), e.nextSibling === null ? e.data = '' : (n.push(e), r--), a++ } else { let t = -1; for (;(t = e.data.indexOf(c, t + 1)) !== -1;) this.parts.push({ type: 'node', index: -1 }), a++ } } else i.currentNode = s.pop() } for (const e of n)e.parentNode.removeChild(e) }} const m = (e, t) => { const n = e.length - t.length; return n >= 0 && e.slice(n) === t }; const g = e => e.index !== -1; const v = () => document.createComment(''); const _ = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/
  /**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
  class f {constructor (e, t, n) { this.__parts = [], this.template = e, this.processor = t, this.options = n }update (e) { let t = 0; for (const n of this.__parts) void 0 !== n && n.setValue(e[t]), t++; for (const e of this.__parts) void 0 !== e && e.commit() }_clone () { const e = o ? this.template.element.content.cloneNode(!0) : document.importNode(this.template.element.content, !0); const t = []; const n = this.template.parts; const s = document.createTreeWalker(e, 133, null, !1); let i; let r = 0; let a = 0; let l = s.nextNode(); for (;r < n.length;) if (i = n[r], g(i)) { for (;a < i.index;)a++, l.nodeName === 'TEMPLATE' && (t.push(l), s.currentNode = l.content), (l = s.nextNode()) === null && (s.currentNode = t.pop(), l = s.nextNode()); if (i.type === 'node') { const e = this.processor.handleTextExpression(this.options); e.insertAfterNode(l.previousSibling), this.__parts.push(e) } else this.__parts.push(...this.processor.handleAttributeExpressions(l, i.name, i.strings, this.options)); r++ } else this.__parts.push(void 0), r++; return o && (document.adoptNode(e), customElements.upgrade(e)), e }}
  /**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const y = ` ${c} `; class x {constructor (e, t, n, s) { this.strings = e, this.values = t, this.type = n, this.processor = s }getHTML () { const e = this.strings.length - 1; let t = ''; let n = !1; for (let s = 0; s < e; s++) { const e = this.strings[s]; const i = e.lastIndexOf('\x3c!--'); n = (i > -1 || n) && e.indexOf('--\x3e', i + 1) === -1; const o = _.exec(e); t += o === null ? e + (n ? y : d) : e.substr(0, o.index) + o[1] + o[2] + h + o[3] + c } return t += this.strings[e] }getTemplateElement () { const e = document.createElement('template'); return e.innerHTML = this.getHTML(), e }}
  /**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
  const N = e => e === null || !(typeof e === 'object' || typeof e === 'function'); const b = e => Array.isArray(e) || !(!e || !e[Symbol.iterator]); class w {constructor (e, t, n) { this.dirty = !0, this.element = e, this.name = t, this.strings = n, this.parts = []; for (let e = 0; e < n.length - 1; e++) this.parts[e] = this._createPart() }_createPart () { return new V(this) }_getValue () { const e = this.strings; const t = e.length - 1; let n = ''; for (let s = 0; s < t; s++) { n += e[s]; const t = this.parts[s]; if (void 0 !== t) { const e = t.value; if (N(e) || !b(e))n += typeof e === 'string' ? e : String(e); else for (const t of e)n += typeof t === 'string' ? t : String(t) } } return n += e[t] }commit () { this.dirty && (this.dirty = !1, this.element.setAttribute(this.name, this._getValue())) }} class V {constructor (e) { this.value = void 0, this.committer = e }setValue (e) { e === a || N(e) && e === this.value || (this.value = e, i(e) || (this.committer.dirty = !0)) }commit () { for (;i(this.value);) { const e = this.value; this.value = a, e(this) } this.value !== a && this.committer.commit() }} class T {constructor (e) { this.value = void 0, this.__pendingValue = void 0, this.options = e }appendInto (e) { this.startNode = e.appendChild(v()), this.endNode = e.appendChild(v()) }insertAfterNode (e) { this.startNode = e, this.endNode = e.nextSibling }appendIntoPart (e) { e.__insert(this.startNode = v()), e.__insert(this.endNode = v()) }insertAfterPart (e) { e.__insert(this.startNode = v()), this.endNode = e.endNode, e.endNode = this.startNode }setValue (e) { this.__pendingValue = e }commit () { for (;i(this.__pendingValue);) { const e = this.__pendingValue; this.__pendingValue = a, e(this) } const e = this.__pendingValue; e !== a && (N(e) ? e !== this.value && this.__commitText(e) : e instanceof x ? this.__commitTemplateResult(e) : e instanceof Node ? this.__commitNode(e) : b(e) ? this.__commitIterable(e) : e === l ? (this.value = l, this.clear()) : this.__commitText(e)) }__insert (e) { this.endNode.parentNode.insertBefore(e, this.endNode) }__commitNode (e) { this.value !== e && (this.clear(), this.__insert(e), this.value = e) }__commitText (e) { const t = this.startNode.nextSibling; const n = typeof (e = e == null ? '' : e) === 'string' ? e : String(e); t === this.endNode.previousSibling && t.nodeType === 3 ? t.data = n : this.__commitNode(document.createTextNode(n)), this.value = e }__commitTemplateResult (e) { const t = this.options.templateFactory(e); if (this.value instanceof f && this.value.template === t) this.value.update(e.values); else { const n = new f(t, e.processor, this.options); const s = n._clone(); n.update(e.values), this.__commitNode(s), this.value = n } }__commitIterable (e) { Array.isArray(this.value) || (this.value = [], this.clear()); const t = this.value; let n; let s = 0; for (const i of e) void 0 === (n = t[s]) && (n = new T(this.options), t.push(n), s === 0 ? n.appendIntoPart(this) : n.insertAfterPart(t[s - 1])), n.setValue(i), n.commit(), s++; s < t.length && (t.length = s, this.clear(n && n.endNode)) }clear (e = this.startNode) { r(this.startNode.parentNode, e.nextSibling, this.endNode) }} class E {constructor (e, t, n) { if (this.value = void 0, this.__pendingValue = void 0, n.length !== 2 || n[0] !== '' || n[1] !== '') throw new Error('Boolean attributes can only contain a single expression'); this.element = e, this.name = t, this.strings = n }setValue (e) { this.__pendingValue = e }commit () { for (;i(this.__pendingValue);) { const e = this.__pendingValue; this.__pendingValue = a, e(this) } if (this.__pendingValue === a) return; const e = !!this.__pendingValue; this.value !== e && (e ? this.element.setAttribute(this.name, '') : this.element.removeAttribute(this.name), this.value = e), this.__pendingValue = a }} class S extends w {constructor (e, t, n) { super(e, t, n), this.single = n.length === 2 && n[0] === '' && n[1] === '' }_createPart () { return new $(this) }_getValue () { return this.single ? this.parts[0].value : super._getValue() }commit () { this.dirty && (this.dirty = !1, this.element[this.name] = this._getValue()) }} class $ extends V {} let j = !1; try { const e = { get capture () { return j = !0, !1 } }; window.addEventListener('test', e, e), window.removeEventListener('test', e, e) } catch (e) {} class A {constructor (e, t, n) { this.value = void 0, this.__pendingValue = void 0, this.element = e, this.eventName = t, this.eventContext = n, this.__boundHandleEvent = e => this.handleEvent(e) }setValue (e) { this.__pendingValue = e }commit () { for (;i(this.__pendingValue);) { const e = this.__pendingValue; this.__pendingValue = a, e(this) } if (this.__pendingValue === a) return; const e = this.__pendingValue; const t = this.value; const n = e == null || t != null && (e.capture !== t.capture || e.once !== t.once || e.passive !== t.passive); const s = e != null && (t == null || n); n && this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options), s && (this.__options = P(e), this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)), this.value = e, this.__pendingValue = a }handleEvent (e) { typeof this.value === 'function' ? this.value.call(this.eventContext || this.element, e) : this.value.handleEvent(e) }} const P = e => e && (j ? { capture: e.capture, passive: e.passive, once: e.once } : e.capture)
  /**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const O = new class {handleAttributeExpressions (e, t, n, s) { const i = t[0]; if (i === '.') { return new S(e, t.slice(1), n).parts } return i === '@' ? [new A(e, t.slice(1), s.eventContext)] : i === '?' ? [new E(e, t.slice(1), n)] : new w(e, t, n).parts }handleTextExpression (e) { return new T(e) }}()
  /**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */function M (e) { let t = k.get(e.type); void 0 === t && (t = { stringsArray: new WeakMap(), keyString: new Map() }, k.set(e.type, t)); let n = t.stringsArray.get(e.strings); if (void 0 !== n) return n; const s = e.strings.join(c); return void 0 === (n = t.keyString.get(s)) && (n = new p(e, e.getTemplateElement()), t.keyString.set(s, n)), t.stringsArray.set(e.strings, n), n } const k = new Map(); const H = new WeakMap(); const I = (e, t, n) => { let s = H.get(t); void 0 === s && (r(t, t.firstChild), H.set(t, s = new T(Object.assign({ templateFactory: M }, n))), s.appendInto(t)), s.setValue(e), s.commit() }
  /**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */n.d(t, 'a', function () { return C }), n.d(t, 'b', function () { return I }),
  /**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
  (window.litHtmlVersions || (window.litHtmlVersions = [])).push('1.1.2'); const C = (e, ...t) => new x(e, t, 'html', O)
}, function (e, t, n) { 'use strict'; n.d(t, 'a', function () { return s }), n.d(t, 'c', function () { return i }), n.d(t, 'b', function () { return o }); const s = { set: (e, t) => typeof t === 'string' ? localStorage.setItem(e, t) : localStorage.setItem(e, JSON.stringify(t)), get (e) { try { return JSON.parse(localStorage.getItem(e)) } catch (t) { return localStorage.getItem(e) } } }; async function i () { try { const e = await navigator.serviceWorker.register('./../service-worker.js'); console.log(`registered service-worker: scope is ${e.scope}`) } catch (e) { console.error(`failed to register service-worker: ${e.message}`) } } const o = { event (e) { const t = Date.now(); return { id: `${e.title} ${t}`, type: 'send-mood', mood: e.title, timestamp: t } } } }, function (e, t, n) {
  'use strict'; var s = n(0); const i = {
    page: e => s.a`
    <div class="grid-container">
      ${i.header()}
      <main>
      ${e}
      </main>
    </div>
  `,
    header: () => s.a`
    <header>
      <nav id="mood-header">
        <a href="/"><h1 id="brand">mood.</h1></a>
        <div id="google-signin" class="g-signin2"></div>
        </nav>
    </header>`,
    sectionHeader: e => s.a`<h2 class="mood-h2">${e}</h2>`,
    moodGraph: () => s.a`
    <section id="mood-graph" class="mood-panel">
      ${i.sectionHeader('Mood over time')}
      <canvas id="mood-over-time"></canvas>
    </section>`,
    mood: ({ title: e, emoji: t }, n) => s.a`<div id="mood-${n}" class="mood-emotion" title="${e}">${t}</div>`,
    moodPanel: () => {
      return s.a`
    <section id="mood-box" class="mood-panel">
    ${i.sectionHeader('How are you?')}
    <div class="emoji-container">
      ${[{ title: 'Atrocious', emoji: '💀' }, { title: 'In pain', emoji: '😩' }, { title: 'Ennui', emoji: '😔' }, { title: 'Bad', emoji: '😑' }, { title: 'Neutral', emoji: '😐' }, { title: 'Decent', emoji: '🙂' }, { title: 'Fine', emoji: '😊' }, { title: 'Stellar', emoji: '😇' }].map(i.mood)}
    </div>
    </section>
  `
    },
    privacyPolicy: () => s.a`
    <section id="mood-box" class="mood-panel">
    ${i.sectionHeader('Privacy Policy')}
    <div>
      <p>TLDR: this site will not use your data in a malicious manner</p>

      <p>The site may track:</p>
      <ul>
        <li>a hash of the users ip-address</li>
        <li>the user-agent</li>
      </ul>

      <p>the user-agent is only used to spot poorly-crafted bots.</p>

      <p>NOTE: this site is not finished!</p>
    </div>
    </section>
  `
  }; const o = {
    index: () => {
      const e = s.a`
    ${i.moodPanel()}
    ${i.moodGraph()}
  `;return i.page(e)
    },
    privacy: () => {
      const e = s.a`
    ${i.privacyPolicy()}
  `;return i.page(e)
    }
  }; t.a = o
}, function (e, t, n) { 'use strict'; n.r(t); var s = n(0); var i = n(2); var o = n(1); !(async function () { await Object(o.c)() }()), Object(s.b)(i.a.privacy(), document.body) }]))
