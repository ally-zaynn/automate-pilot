/*! Automate Pilot chat widget v2. Add before </body>:  <script src="/chatbot-widget.js" defer></script> */
(function () {
  if (window.__apChat) return;
  window.__apChat = true;

  /* ====== SETTINGS: change only this block ====== */
  var CONFIG = {
    startUrl: 'https://mateenb.app.n8n.cloud/webhook/chat-start',
    messageUrl: 'https://mateenb.app.n8n.cloud/webhook/chat-message',
    bookingUrl: 'https://calendly.com/ally-seoberg/30min',
    teaser: 'Questions about automating your business? Ask Pilot.',
    suggestions: [
      { t: 'What can you automate for my business?', i: 'bolt' },
      { t: 'How does the free audit work?', i: 'search' },
      { t: 'Do you have real client results?', i: 'chart' },
      { t: 'Can I book a call with your team?', i: 'cal' }
    ],
    fallback: ['How does the free audit work?', 'Can I book a call with your team?'],
    storageKey: 'ap_chat_v1'
  };
  /* ============================================== */

  try {
    var fl = document.createElement('link');
    fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&display=swap';
    document.head.appendChild(fl);
  } catch (e) {}

  var P = {
    plane: '<path d="M21 3 3 10.5l7 2.5 2.5 7L21 3Z"/><path d="m10 13 4-4"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    chart: '<path d="M4 20V11M10 20V5M16 20v-8M21 20H3"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>'
  };
  function ic(n) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>';
  }

  var CSS = `
:host{all:initial}*{box-sizing:border-box}[hidden]{display:none!important}
.w{--bg:#050B1A;--panel:#0A1430;--raise:#101D40;--line:#1C2B57;--sky:#38BDF8;--blue:#2F6BFF;--tx:#E6EEFF;--mu:#8DA0C8;--err:#FF7A8A;
font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--tx);font-size:15px;line-height:1.5}
svg{width:20px;height:20px;flex:none;display:block}
button,a{font-family:inherit}
button:focus-visible,input:focus-visible,a:focus-visible{outline:2px solid var(--sky);outline-offset:2px}
.grad{background:linear-gradient(135deg,#1d4ed8,#0ea5e9)}

/* dock */
.dock{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147483002;display:flex;align-items:center;gap:6px;padding:6px;border-radius:999px;background:rgba(8,16,40,.78);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(90,130,255,.28);box-shadow:0 14px 40px rgba(0,0,0,.45),0 0 0 1px rgba(56,189,248,.06)}
.d1,.d2{position:relative;display:flex;align-items:center;gap:9px;height:46px;padding:0 18px 0 14px;border-radius:999px;border:0;cursor:pointer;font-size:14px;font-weight:600;text-decoration:none;white-space:nowrap}
.d1{color:#fff;background:linear-gradient(135deg,#1d4ed8,#0ea5e9);box-shadow:0 6px 20px rgba(14,165,233,.35)}
.d2{color:#cfe0ff;background:transparent}
.d1:hover{filter:brightness(1.1)}.d2:hover{background:rgba(255,255,255,.07);color:#fff}
.ping{position:absolute;top:2px;right:2px;width:11px;height:11px;border-radius:50%;background:#34d399;border:2px solid #0a1430}
.ping::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:2px solid #34d399;animation:ping 2s ease-out infinite}
@keyframes ping{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.2);opacity:0}}
.tease{position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:2147483002;display:flex;align-items:center;gap:6px;max-width:min(360px,calc(100vw - 28px));padding:8px 8px 8px 16px;border-radius:18px;background:#0d1a3d;border:1px solid #2b4aa0;box-shadow:0 14px 40px rgba(0,0,0,.5);animation:rise .35s ease-out}
.tb{border:0;background:none;color:var(--tx);font-size:14px;text-align:left;cursor:pointer;padding:4px 0}
.tx{flex:none;width:28px;height:28px;border-radius:50%;border:0;background:#1a2a58;color:var(--mu);display:grid;place-items:center;cursor:pointer}
.tx svg{width:14px;height:14px}.tx:hover{color:#fff}
@keyframes rise{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%)}}

/* panel */
.shade{position:fixed;inset:0;z-index:2147483000;background:rgba(2,6,15,.6);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);animation:fade .2s}
@keyframes fade{from{opacity:0}to{opacity:1}}
.panel{position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:2147483001;width:min(780px,calc(100vw - 32px));height:min(720px,calc(100vh - 110px));display:flex;flex-direction:column;overflow:hidden;border-radius:28px;border:1px solid var(--line);box-shadow:0 30px 90px rgba(0,0,0,.65),0 0 0 1px rgba(56,189,248,.07);animation:open .26s cubic-bezier(.2,.8,.2,1);
background:radial-gradient(80% 45% at 50% 0,rgba(47,107,255,.24),transparent 72%),radial-gradient(55% 40% at 100% 100%,rgba(14,165,233,.13),transparent 70%),var(--bg)}
.panel::before{content:"";position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(120,160,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(120,160,255,.05) 1px,transparent 1px);background-size:44px 44px;-webkit-mask-image:radial-gradient(70% 60% at 50% 20%,#000,transparent);mask-image:radial-gradient(70% 60% at 50% 20%,#000,transparent)}
.panel>*{position:relative}
@keyframes open{from{opacity:0;transform:translateX(-50%) translateY(18px) scale(.97)}to{opacity:1;transform:translateX(-50%)}}
.hd{flex:none;display:flex;align-items:center;gap:12px;margin:14px 14px 0;padding:8px 10px 8px 8px;border-radius:999px;background:rgba(16,29,64,.72);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--line)}
.av{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#1d4ed8,#0ea5e9);flex:none}
.ti{flex:1;min-width:0}.ti b{display:block;font:700 16px/1.2 Sora,system-ui,sans-serif}
.ti small{display:flex;align-items:center;gap:6px;color:var(--mu);font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dot{width:7px;height:7px;border-radius:50%;background:#34d399;flex:none}
.book{flex:none;display:flex;align-items:center;gap:8px;height:38px;padding:0 15px;border-radius:999px;border:1px solid #2f5fd0;color:#d6e4ff;font-size:13.5px;font-weight:600;text-decoration:none;white-space:nowrap}
.book svg{width:17px;height:17px}.book:hover{background:#12214a;border-color:var(--sky);color:#fff}
.x{flex:none;width:38px;height:38px;border-radius:50%;border:0;background:rgba(255,255,255,.06);color:var(--mu);display:grid;place-items:center;cursor:pointer}
.x:hover{background:rgba(255,255,255,.12);color:#fff}
.rs span{display:none;font-size:13px;font-weight:600;white-space:nowrap}
.rs.armed{width:auto;padding:0 14px;gap:7px;grid-auto-flow:column;align-items:center;background:rgba(255,122,138,.16);color:#ffb0bb}
.rs.armed span{display:block}
.view{flex:1;min-height:0;display:flex;flex-direction:column}
.scr{flex:1;overflow:auto;scroll-behavior:smooth;scrollbar-width:thin;scrollbar-color:#25397a transparent}
.scr::-webkit-scrollbar{width:6px}.scr::-webkit-scrollbar-track{background:transparent}.scr::-webkit-scrollbar-thumb{background:#25397a;border-radius:6px}
.col{width:100%;max-width:680px;margin:0 auto;padding:0 20px}
h2{margin:0;font:700 30px/1.2 Sora,system-ui,sans-serif;letter-spacing:-.02em}
.lead{margin:10px 0 0;color:var(--mu);font-size:15.5px}

/* form */
.formwrap{padding-top:34px;padding-bottom:24px}
.fcard{position:relative;margin-top:24px;padding:22px;border-radius:22px;background:rgba(10,20,48,.8);border:1px solid var(--line)}
.fcard::before,.fcard::after{content:"";position:absolute;top:-1px;width:0}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.full{grid-column:1/-1}
.f span{display:block;margin-bottom:6px;font-size:12.5px;font-weight:600;color:var(--mu)}
.f input{width:100%;padding:13px 15px;border-radius:13px;border:1px solid var(--line);background:var(--bg);color:var(--tx);font:inherit;font-size:15px}
.f input::placeholder{color:#566a99}.f input:focus{border-color:var(--sky)}.f.bad input{border-color:var(--err)}
.f em{display:none;margin-top:5px;font-style:normal;font-size:12.5px;color:var(--err)}.f.bad em{display:block}
.go{width:100%;margin-top:18px;height:50px;border:0;border-radius:14px;cursor:pointer;color:#fff;font-size:16px;font-weight:600;background:linear-gradient(135deg,#1d4ed8,#0ea5e9);box-shadow:0 8px 24px rgba(14,165,233,.28)}
.go:hover{filter:brightness(1.1)}.go:disabled{opacity:.6;cursor:wait}
.note{margin:12px 0 0;color:#6f82b0;font-size:12px;text-align:center}.err{margin:0 0 14px;color:var(--err);font-size:13.5px}

/* chat */
.hero{padding-top:36px;padding-bottom:8px;text-align:center}
.cards{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:26px;text-align:left}
.qc{display:flex;align-items:center;gap:12px;padding:14px 14px 14px 12px;border-radius:16px;border:1px solid var(--line);background:rgba(16,29,64,.6);color:var(--tx);font-size:14.5px;font-weight:500;cursor:pointer;text-align:left;transition:border-color .15s,background .15s,transform .15s}
.qc:hover{border-color:var(--sky);background:rgba(20,38,84,.85);transform:translateY(-1px)}
.ci{flex:none;width:38px;height:38px;border-radius:11px;display:grid;place-items:center;color:var(--sky);background:rgba(56,189,248,.1)}
.ct{flex:1}.qc>svg{width:18px;height:18px;color:var(--mu)}.qc:hover>svg{color:#fff}
.msgs{display:flex;flex-direction:column;gap:14px;padding-top:20px;padding-bottom:12px}
.row{display:flex;gap:10px;align-items:flex-end}.row.user{justify-content:flex-end}
.mav{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#1d4ed8,#0ea5e9)}.mav svg{width:15px;height:15px}
.m{max-width:82%;padding:11px 15px;border-radius:18px;white-space:pre-wrap;overflow-wrap:anywhere}
.m a{color:inherit;text-decoration:underline}
.m.bot{background:var(--raise);border:1px solid var(--line);border-bottom-left-radius:6px}
.m.user{color:#fff;background:linear-gradient(135deg,#2F6BFF,#0ea5e9);border-bottom-right-radius:6px}
.typing{display:flex;gap:5px;padding:15px 16px}.typing i{width:7px;height:7px;border-radius:50%;background:var(--mu);animation:b 1.1s infinite}
.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}
@keyframes b{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-4px);opacity:1}}
.bar{flex:none;padding-bottom:14px}
.chips{display:flex;flex-wrap:wrap;gap:8px;padding-bottom:10px}
.chip{padding:9px 14px;border-radius:999px;border:1px solid #27428f;background:rgba(10,20,48,.7);color:#c3d6ff;font-size:13.5px;cursor:pointer;text-align:left}
.chip:hover{background:#12214a;border-color:var(--sky);color:#fff}
.comp{display:flex;align-items:center;gap:10px;padding:8px 8px 8px 20px;border-radius:999px;background:rgba(16,29,64,.85);border:1px solid #2a4390;box-shadow:0 10px 30px rgba(0,0,0,.3)}
.comp:focus-within{border-color:var(--sky)}
.comp input{flex:1;min-width:0;border:0;background:transparent;color:var(--tx);font:inherit;font-size:15.5px;padding:9px 0}
.comp input:focus-visible{outline:none}.comp input::placeholder{color:#6b7fae}
.snd{flex:none;width:44px;height:44px;border-radius:50%;border:0;cursor:pointer;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#1d4ed8,#0ea5e9)}
.snd:disabled{opacity:.4;cursor:not-allowed}
.hint{margin:9px 0 0;text-align:center;color:#6f82b0;font-size:11.5px}

@media(max-width:640px){
 .panel{left:0;right:0;top:0;bottom:0;transform:none;width:100%;height:100%;border-radius:0;border:0;animation:fade .2s}
 .open .dock,.open .tease{display:none}
 .hd{margin:10px 10px 0}.book span{display:none}.book{padding:0 11px}
 .grid,.cards{grid-template-columns:1fr}h2{font-size:25px}
 .formwrap{padding-top:22px}.hero{padding-top:22px}.col{padding:0 14px}
 .d1,.d2{height:44px;padding:0 14px 0 12px;font-size:13.5px}
}
@media(prefers-reduced-motion:reduce){*{animation:none!important;scroll-behavior:auto!important;transition:none!important}}
`;

  var HTML = `
<div class="w" id="w">
<div class="shade" id="shade" hidden></div>
<section class="panel" id="panel" role="dialog" aria-label="Chat with Pilot" hidden>
 <header class="hd"><div class="av">${ic('plane')}</div>
  <div class="ti"><b>Pilot</b><small><i class="dot"></i>Automate Pilot AI, online</small></div>
  <a class="book" id="book" target="_blank" rel="noopener">${ic('cal')}<span>Book a call</span></a>
  <button class="x rs" id="reset" aria-label="Start a new chat" title="New chat" hidden>${ic('refresh')}<span></span></button>
  <button class="x" id="close" aria-label="Close chat">${ic('x')}</button></header>
 <div class="view" id="formView"><div class="scr"><div class="col formwrap">
  <h2>Hey, I'm Pilot.</h2>
  <p class="lead">Tell me a little about you and we'll get started. I can answer questions about automation and set up a free call with the team.</p>
  <form class="fcard" id="form" novalidate>
   <p class="err" id="ferr" hidden></p>
   <div class="grid">
    <label class="f full" id="f-name"><span>Full name</span><input id="name" autocomplete="name" placeholder="Your name"><em>Enter your name.</em></label>
    <label class="f" id="f-phone"><span>Phone number</span><input id="phone" type="tel" autocomplete="tel" placeholder="+1 555 000 0000"><em>Enter a valid phone number.</em></label>
    <label class="f" id="f-email"><span>Email</span><input id="email" type="email" autocomplete="email" placeholder="you@company.com"><em>Enter a valid email address.</em></label>
   </div>
   <button class="go" id="go" type="submit">Start chat</button>
   <p class="note">We use your details only to follow up on your enquiry.</p>
  </form></div></div></div>
 <div class="view" id="chatView" hidden>
  <div class="scr" id="scr"><div class="col">
   <div class="hero" id="hero"><h2 id="hh"></h2><p class="lead">Pick a topic below or type your own question.</p><div class="cards" id="cards"></div></div>
   <div class="msgs" id="msgs" aria-live="polite"></div></div></div>
  <div class="bar"><div class="col"><div class="chips" id="chips"></div>
   <form class="comp" id="comp"><input id="inp" autocomplete="off" placeholder="Ask me anything about automation" aria-label="Message"><button class="snd" id="snd" type="submit" aria-label="Send">${ic('arrow')}</button></form>
   <p class="hint">Pilot is an AI assistant and can make mistakes. Pricing is discussed on a call.</p></div></div>
 </div>
</section>
<div class="tease" id="tease" hidden><button class="tb" id="tbody"></button><button class="tx" id="tclose" aria-label="Dismiss">${ic('x')}</button></div>
<nav class="dock" id="dock">
 <button class="d1" id="fab" aria-label="Open chat with Pilot">${ic('plane')}<span>Ask Pilot</span><i class="ping"></i></button>
 <a class="d2" id="dbook" target="_blank" rel="noopener">${ic('cal')}<span>Book a call</span></a>
</nav></div>`;

  var host = document.createElement('div');
  host.id = 'ap-chat';
  document.body.appendChild(host);
  var root = host.attachShadow({ mode: 'open' });
  root.innerHTML = '<style>' + CSS + '</style>' + HTML;
  var $ = function (id) { return root.getElementById(id); };
  $('book').href = CONFIG.bookingUrl;
  $('dbook').href = CONFIG.bookingUrl;
  $('tbody').textContent = CONFIG.teaser;

  var session = null, lead = null, msgs = [], busy = false, lastChips = [], armT;

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(CONFIG.storageKey) || 'null');
      if (d && d.id && d.name) { session = { id: d.id, name: d.name }; msgs = d.msgs || []; lastChips = d.chips || []; lead = d.lead || null; }
    } catch (e) {}
  }
  function save() {
    try {
      if (session) localStorage.setItem(CONFIG.storageKey, JSON.stringify({ id: session.id, name: session.name, msgs: msgs.slice(-60), chips: lastChips, lead: lead }));
      else localStorage.removeItem(CONFIG.storageKey);
    } catch (e) {}
  }

  function linkify(el, text) {
    var re = /(https?:\/\/[^\s]+)/g, last = 0, m;
    while ((m = re.exec(text))) {
      el.appendChild(document.createTextNode(text.slice(last, m.index)));
      var raw = m[0].replace(/[.,;:!?)]+$/, ''), a = document.createElement('a');
      a.textContent = raw; a.href = raw; a.target = '_blank'; a.rel = 'noopener';
      el.appendChild(a);
      last = m.index + raw.length; re.lastIndex = last;
    }
    el.appendChild(document.createTextNode(text.slice(last)));
  }
  function scroll() { var s = $('scr'); s.scrollTop = s.scrollHeight; }
  function row(role) {
    var r = document.createElement('div'); r.className = 'row ' + role;
    if (role === 'bot') { var a = document.createElement('div'); a.className = 'mav'; a.innerHTML = ic('plane'); r.appendChild(a); }
    return r;
  }
  function addMsg(role, text, persist) {
    var r = row(role), d = document.createElement('div');
    d.className = 'm ' + role; linkify(d, text); r.appendChild(d);
    $('msgs').appendChild(r); scroll();
    if (persist !== false) { msgs.push({ r: role, t: text }); save(); }
  }
  function typing(on) {
    var t = $('typing');
    if (on && !t) {
      var r = row('bot'), d = document.createElement('div');
      r.id = 'typing'; d.className = 'm bot typing'; d.innerHTML = '<i></i><i></i><i></i>';
      r.appendChild(d); $('msgs').appendChild(r); scroll();
    } else if (!on && t) t.remove();
  }

  /* drops suggestions that sound like the bot questioning the visitor */
  var BOTQ = /(are you in|you use\b|your (biggest|main|current|industry|business|company|goal|workflow|tools?|pain)|you currently|are you (looking|using|interested)|what industry|which industry|when can we|what('s| is) your)/i;
  function parseReply(text) {
    var m = /\n?[ \t]*\**SUGGESTIONS?\**[ \t]*:\**[ \t]*([\s\S]*)$/i.exec(text), list = [], body = text;
    if (m) {
      body = text.slice(0, m.index).trim();
      var parts = m[1].split('|');
      if (parts.length < 2) parts = m[1].split(/(?<=\?)\s+/);
      list = parts.map(function (x) { return x.replace(/^[\s\-*"'\u2022\u201c]+|[\s"'\u201d]+$/g, ''); })
        .filter(function (x) { return x.length > 1 && x.length <= 70 && !BOTQ.test(x); }).slice(0, 3);
    }
    return { body: body, list: list };
  }
  function chips(list) {
    lastChips = list || []; save();
    var c = $('chips'); c.innerHTML = '';
    lastChips.forEach(function (q) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.textContent = q;
      b.onclick = function () { send(q); };
      c.appendChild(b);
    });
  }
  function cards() {
    var c = $('cards'); c.innerHTML = '';
    CONFIG.suggestions.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'qc';
      b.innerHTML = '<span class="ci">' + ic(s.i) + '</span><span class="ct"></span>' + ic('arrow');
      b.querySelector('.ct').textContent = s.t;
      b.onclick = function () { send(s.t); };
      c.appendChild(b);
    });
  }
  function showChat() {
    $('formView').hidden = true; $('chatView').hidden = false; $('reset').hidden = false;
    $('msgs').innerHTML = '';
    var first = session.name.split(' ')[0];
    $('hh').textContent = 'Hi ' + first + ', what should we automate first?';
    cards();
    $('hero').hidden = msgs.length > 0;
    msgs.forEach(function (m) { addMsg(m.r, m.t, false); });
    chips(msgs.length ? lastChips : []);
    setTimeout(function () { $('inp').focus(); }, 60);
  }
  function showForm(err) {
    $('chatView').hidden = true; $('formView').hidden = false; $('reset').hidden = true; disarm();
    if (lead) { $('name').value = lead.name; $('phone').value = lead.phone; $('email').value = lead.email; }
    var e = $('ferr'); e.hidden = !err; e.textContent = err || '';
  }

  function post(url, body) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) {
        return r.text().then(function (t) {
          var j = {}; try { j = JSON.parse(t); } catch (e) {}
          return { status: r.status, data: j };
        });
      });
  }

  function validate() {
    var name = $('name').value.trim(), phone = $('phone').value.trim(), email = $('email').value.trim();
    var ok = {
      name: name.length > 1,
      phone: phone.replace(/\D/g, '').length >= 7 && /^[+\d\s().-]+$/.test(phone),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    };
    ['name', 'phone', 'email'].forEach(function (k) { $('f-' + k).classList.toggle('bad', !ok[k]); });
    return ok.name && ok.phone && ok.email ? { name: name, phone: phone, email: email } : null;
  }

  $('form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = validate(); if (!v) return;
    var btn = $('go'); btn.disabled = true; btn.textContent = 'Connecting...';
    $('ferr').hidden = true;
    post(CONFIG.startUrl, v).then(function (res) {
      if (res.data && res.data.ok && res.data.session_id) {
        session = { id: res.data.session_id, name: res.data.name || v.name }; lead = v; msgs = []; lastChips = []; save(); showChat();
      } else {
        showForm((res.data && res.data.error) || 'Could not start the chat. Check your details and try again.');
      }
    }).catch(function () {
      showForm('No connection. Check your internet and try again.');
    }).then(function () { btn.disabled = false; btn.textContent = 'Start chat'; });
  });

  function send(text) {
    text = (text || '').trim();
    if (!text || busy || !session) return;
    busy = true; $('snd').disabled = true; $('inp').value = '';
    $('hero').hidden = true; chips([]);
    addMsg('user', text); typing(true);
    post(CONFIG.messageUrl, { session_id: session.id, message: text }).then(function (res) {
      typing(false);
      if (res.data && res.data.ok && res.data.reply) {
        var p = parseReply(String(res.data.reply));
        addMsg('bot', p.body || 'Could you rephrase that?');
        chips(p.list.length ? p.list : CONFIG.fallback);
      } else if (res.status === 404) {
        session = null; msgs = []; lastChips = []; save(); $('form').reset();
        showForm('Your session expired. Enter your details to start again.');
      } else addMsg('bot', 'Sorry, something went wrong on my side. Please try again in a moment.', false);
    }).catch(function () {
      typing(false); addMsg('bot', 'No connection. Check your internet and send that again.', false);
    }).then(function () { busy = false; $('snd').disabled = false; $('inp').focus(); });
  }
  $('comp').addEventListener('submit', function (e) { e.preventDefault(); send($('inp').value); });

  function disarm() { clearTimeout(armT); $('reset').classList.remove('armed'); }
  function newChat() {
    if (busy || !session) return;
    msgs = []; lastChips = [];
    if (!lead) { session = null; save(); showForm(); return; }
    busy = true;
    post(CONFIG.startUrl, lead).then(function (res) {
      if (res.data && res.data.ok && res.data.session_id) {
        session = { id: res.data.session_id, name: res.data.name || lead.name }; save(); showChat();
      } else { session = null; save(); showForm('Could not restart the chat. Please check your details and start again.'); }
    }).catch(function () {
      session = null; save(); showForm('No connection. Check your internet and try again.');
    }).then(function () { busy = false; });
  }
  $('reset').onclick = function () {
    var b = $('reset');
    if (!b.classList.contains('armed')) {
      b.classList.add('armed'); b.querySelector('span').textContent = 'Clear chat?';
      clearTimeout(armT); armT = setTimeout(disarm, 3500); return;
    }
    disarm(); newChat();
  };

  var isOpen = false;
  function open() {
    isOpen = true; $('panel').hidden = false; $('shade').hidden = false; $('tease').hidden = true;
    $('w').classList.add('open');
    setTimeout(function () { var el = session ? $('inp') : $('name'); el.focus(); }, 60);
  }
  function close() {
    disarm(); isOpen = false; $('panel').hidden = true; $('shade').hidden = true; $('w').classList.remove('open'); $('fab').focus();
  }
  $('fab').onclick = function () { isOpen ? close() : open(); };
  $('close').onclick = close; $('shade').onclick = close;
  $('tbody').onclick = open;
  $('tclose').onclick = function () { $('tease').hidden = true; try { sessionStorage.setItem('ap_teaser', '1'); } catch (e) {} };
  root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) close(); });

  load();
  if (session) showChat(); else showForm();

  var seen = false; try { seen = sessionStorage.getItem('ap_teaser') === '1'; } catch (e) {}
  if (!seen) setTimeout(function () { if (!isOpen) $('tease').hidden = false; }, 3500);
})();
