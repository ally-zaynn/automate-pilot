/*! Automate Pilot chat widget. Add before </body>:  <script src="/chatbot-widget.js" defer></script> */
(function () {
  if (window.__apChat) return;
  window.__apChat = true;

  /* ====== SETTINGS: change only this block ====== */
  var CONFIG = {
    startUrl: 'https://mateenb.app.n8n.cloud/webhook/chat-start',
    messageUrl: 'https://mateenb.app.n8n.cloud/webhook/chat-message',
    botName: 'Pilot',
    bookingUrl: 'https://calendly.com/ally-seoberg/30min',
    suggestions: [
      'What can you automate for my business?',
      'How does the free audit work?',
      'Do you have real client results?',
      'Can I book a call with your team?'
    ],
    fallback: ['How does the free audit work?', 'Can I book a call with your team?'],
    storageKey: 'ap_chat_v1'
  };
  /* ============================================== */

  var CSS = '\
:host{all:initial}*{box-sizing:border-box}[hidden]{display:none!important}\
.w{--bg:#050B1A;--panel:#0A1430;--raise:#101D40;--line:#1C2B57;--sky:#38BDF8;--blue:#2F6BFF;--tx:#E6EEFF;--mu:#8DA0C8;--err:#FF7A8A;\
font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--tx);font-size:14px;line-height:1.45}\
.fab{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:flex;align-items:center;gap:10px;padding:12px 18px 12px 14px;border:1px solid #2a4a9a;border-radius:999px;cursor:pointer;color:#fff;font:600 14px/1 inherit;font-family:inherit;background:linear-gradient(135deg,#1d4ed8,#0ea5e9);box-shadow:0 10px 30px rgba(14,165,233,.35)}\
.fab svg{width:22px;height:22px}.fab:hover{filter:brightness(1.1)}\
.fab .ping{position:absolute;top:-2px;right:-2px;width:12px;height:12px;border-radius:50%;background:#34d399;border:2px solid var(--bg)}\
.fab .ping::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:2px solid #34d399;animation:ping 2s ease-out infinite}\
@keyframes ping{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2);opacity:0}}\
.panel{position:fixed;right:20px;bottom:20px;z-index:2147483001;width:384px;height:min(640px,calc(100vh - 40px));display:flex;flex-direction:column;overflow:hidden;border-radius:20px;background:var(--bg);border:1px solid var(--line);box-shadow:0 24px 70px rgba(0,0,0,.6),0 0 0 1px rgba(56,189,248,.08);transform-origin:bottom right;animation:open .22s ease-out}\
@keyframes open{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:none}}\
header{display:flex;align-items:center;gap:12px;padding:14px 16px;background:radial-gradient(120% 140% at 0 0,#14307a 0,#0A1430 60%);border-bottom:1px solid var(--line)}\
.av{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,#1d4ed8,#0ea5e9)}.av svg{width:20px;height:20px}\
.ti{flex:1;min-width:0}.ti b{display:block;font-size:15px}.ti small{display:flex;align-items:center;gap:6px;color:var(--mu);font-size:12px}\
.dot{width:7px;height:7px;border-radius:50%;background:#34d399}\
.x{border:0;background:transparent;color:var(--mu);width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:22px;line-height:1}.x:hover{background:var(--raise);color:var(--tx)}\
button:focus-visible,input:focus-visible,a:focus-visible{outline:2px solid var(--sky);outline-offset:2px}\
.view{flex:1;min-height:0;display:flex;flex-direction:column}\
.msgs,.pass,.chips{scrollbar-width:thin;scrollbar-color:#25397a transparent}\
.msgs::-webkit-scrollbar,.pass::-webkit-scrollbar,.chips::-webkit-scrollbar{width:6px}\
.msgs::-webkit-scrollbar-track,.pass::-webkit-scrollbar-track,.chips::-webkit-scrollbar-track{background:transparent}\
.msgs::-webkit-scrollbar-thumb,.pass::-webkit-scrollbar-thumb,.chips::-webkit-scrollbar-thumb{background:#25397a;border-radius:6px}\
.msgs::-webkit-scrollbar-thumb:hover{background:#3358c4}\
.book{flex:none;padding:7px 12px;border-radius:999px;border:1px solid #2f5fd0;color:#cfe0ff;font-size:12.5px;font-weight:600;text-decoration:none;white-space:nowrap}\
.book:hover{background:#12214a;border-color:var(--sky);color:#fff}\
.pass{flex:1;overflow:auto;padding:22px 20px}\
.pass h3{margin:0 0 4px;font-size:21px;font-weight:700;letter-spacing:-.01em}.pass p.s{margin:0;color:var(--mu)}\
.perf{position:relative;margin:18px -20px;border-top:2px dashed var(--line)}\
.perf::before,.perf::after{content:"";position:absolute;top:-11px;width:20px;height:20px;border-radius:50%;background:#02060f;border:1px solid var(--line)}\
.perf::before{left:-10px}.perf::after{right:-10px}\
.f{display:block;margin-bottom:14px}.f span{display:block;margin-bottom:6px;font-size:12px;font-weight:600;color:var(--mu)}\
.f input{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--panel);color:var(--tx);font:inherit;font-size:15px}\
.f input::placeholder{color:#566a99}.f input:focus{border-color:var(--sky)}.f.bad input{border-color:var(--err)}\
.f em{display:none;margin-top:5px;font-style:normal;font-size:12px;color:var(--err)}.f.bad em{display:block}\
.go{width:100%;padding:13px;border:0;border-radius:12px;cursor:pointer;color:#fff;font:600 15px/1 inherit;font-family:inherit;background:linear-gradient(135deg,#1d4ed8,#0ea5e9)}\
.go:hover{filter:brightness(1.1)}.go:disabled{opacity:.6;cursor:wait}\
.note{margin:12px 0 0;color:#6f82b0;font-size:11.5px}.err{margin:0 0 12px;color:var(--err);font-size:13px}\
.msgs{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}\
.m{max-width:84%;padding:10px 13px;border-radius:16px;white-space:pre-wrap;word-wrap:break-word;overflow-wrap:anywhere}\
.m a{color:inherit;text-decoration:underline}\
.m.bot{align-self:flex-start;background:var(--raise);border:1px solid var(--line);border-bottom-left-radius:5px}\
.m.user{align-self:flex-end;color:#fff;background:linear-gradient(135deg,#2F6BFF,#0ea5e9);border-bottom-right-radius:5px}\
.typing{display:flex;gap:5px;padding:13px 14px}.typing i{width:7px;height:7px;border-radius:50%;background:var(--mu);animation:b 1.1s infinite}\
.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}\
@keyframes b{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-4px);opacity:1}}\
.chips{display:flex;flex-wrap:wrap;gap:8px;padding:2px 16px 12px;max-height:150px;overflow-y:auto}\
.chip{padding:8px 12px;border-radius:14px;border:1px solid #27428f;background:transparent;color:#bcd2ff;font:inherit;font-size:13px;cursor:pointer;text-align:left}\
.chip:hover{background:#12214a;border-color:var(--sky);color:#fff}\
.comp{display:flex;gap:8px;padding:12px;border-top:1px solid var(--line);background:var(--panel)}\
.comp input{flex:1;min-width:0;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--tx);font:inherit;font-size:15px}\
.comp input:focus{border-color:var(--sky)}\
.snd{width:44px;border:0;border-radius:12px;cursor:pointer;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#1d4ed8,#0ea5e9)}\
.snd:disabled{opacity:.45;cursor:not-allowed}.snd svg{width:18px;height:18px}\
@media(max-width:520px){.panel{inset:0;width:100%;height:100%;border-radius:0;border:0}.fab{right:14px;bottom:14px}}\
@media(prefers-reduced-motion:reduce){*{animation:none!important;scroll-behavior:auto!important}}';

  var PLANE = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 3 10.5l7 2.5 2.5 7L21 3Z"/><path d="m10 13 4-4"/></svg>';
  var SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';

  var HTML = '\
<div class="w">\
<button class="fab" id="fab" aria-label="Open chat with Pilot">' + PLANE + '<span>Ask Pilot</span><i class="ping"></i></button>\
<section class="panel" id="panel" role="dialog" aria-label="Chat with Pilot" hidden>\
<header><div class="av">' + PLANE + '</div><div class="ti"><b>Pilot</b><small><i class="dot"></i>Automate Pilot AI assistant, online</small></div><a class="book" id="book" target="_blank" rel="noopener">Book a call</a><button class="x" id="close" aria-label="Close chat">&times;</button></header>\
<div class="view" id="formView"><div class="pass">\
<h3>Start your chat</h3><p class="s">Tell us who you are and Pilot takes it from there.</p><div class="perf"></div>\
<form id="form" novalidate>\
<p class="err" id="ferr" hidden></p>\
<label class="f" id="f-name"><span>Full name</span><input id="name" autocomplete="name" placeholder="Your name"><em>Enter your name.</em></label>\
<label class="f" id="f-phone"><span>Phone number</span><input id="phone" type="tel" autocomplete="tel" placeholder="+1 555 000 0000"><em>Enter a valid phone number with country code.</em></label>\
<label class="f" id="f-email"><span>Email</span><input id="email" type="email" autocomplete="email" placeholder="you@company.com"><em>Enter a valid email address.</em></label>\
<button class="go" id="go" type="submit">Start chat</button>\
<p class="note">We use your details only to follow up on your enquiry.</p>\
</form></div></div>\
<div class="view" id="chatView" hidden>\
<div class="msgs" id="msgs" aria-live="polite"></div><div class="chips" id="chips"></div>\
<form class="comp" id="comp"><input id="inp" autocomplete="off" placeholder="Type your message" aria-label="Message"><button class="snd" id="snd" type="submit" aria-label="Send">' + SEND + '</button></form>\
</div></section></div>';

  var host = document.createElement('div');
  host.id = 'ap-chat';
  document.body.appendChild(host);
  var root = host.attachShadow({ mode: 'open' });
  root.innerHTML = '<style>' + CSS + '</style>' + HTML;
  var $ = function (id) { return root.getElementById(id); };

  $('book').href = CONFIG.bookingUrl;
  var session = null, msgs = [], busy = false, lastChips = [];

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(CONFIG.storageKey) || 'null');
      if (d && d.id && d.name) { session = { id: d.id, name: d.name }; msgs = d.msgs || []; lastChips = d.chips || []; }
    } catch (e) {}
  }
  function save() {
    try {
      if (session) localStorage.setItem(CONFIG.storageKey, JSON.stringify({ id: session.id, name: session.name, msgs: msgs.slice(-60), chips: lastChips }));
      else localStorage.removeItem(CONFIG.storageKey);
    } catch (e) {}
  }

  function linkify(el, text) {
    var re = /(https?:\/\/[^\s]+|hello@automatepilot\.com|\/contact\b)/g, last = 0, m;
    while ((m = re.exec(text))) {
      el.appendChild(document.createTextNode(text.slice(last, m.index)));
      var raw = m[0].replace(/[.,;:!?)]+$/, ''), a = document.createElement('a');
      a.textContent = raw;
      a.href = raw.indexOf('@') > -1 ? 'mailto:' + raw : raw.charAt(0) === '/' ? location.origin + raw : raw;
      if (raw.indexOf('@') < 0) { a.target = '_blank'; a.rel = 'noopener'; }
      el.appendChild(a);
      last = m.index + raw.length; re.lastIndex = last;
    }
    el.appendChild(document.createTextNode(text.slice(last)));
  }
  function scroll() { var m = $('msgs'); m.scrollTop = m.scrollHeight; }
  function addMsg(role, text, persist) {
    var d = document.createElement('div');
    d.className = 'm ' + role;
    linkify(d, text);
    $('msgs').appendChild(d);
    scroll();
    if (persist !== false) { msgs.push({ r: role, t: text }); save(); }
  }
  function typing(on) {
    var t = $('typing');
    if (on && !t) {
      t = document.createElement('div'); t.id = 'typing'; t.className = 'm bot typing';
      t.innerHTML = '<i></i><i></i><i></i>'; $('msgs').appendChild(t); scroll();
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
  function showChat() {
    $('formView').hidden = true; $('chatView').hidden = false;
    $('msgs').innerHTML = '';
    if (!msgs.length) {
      var first = session.name.split(' ')[0];
      addMsg('bot', 'Hi ' + first + ', I\'m Pilot, the AI assistant at Automate Pilot. Ask me about our services or how the free audit works, or pick one of the options below.');
      chips(CONFIG.suggestions);
    } else {
      msgs.forEach(function (m) { addMsg(m.r, m.t, false); });
      chips(lastChips);
    }
    setTimeout(function () { $('inp').focus(); }, 50);
  }
  function showForm(err) {
    $('chatView').hidden = true; $('formView').hidden = false;
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
        session = { id: res.data.session_id, name: res.data.name || v.name }; msgs = []; save(); showChat();
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
    busy = true; $('snd').disabled = true; $('inp').value = ''; $('chips').innerHTML = '';
    addMsg('user', text); typing(true);
    post(CONFIG.messageUrl, { session_id: session.id, message: text }).then(function (res) {
      typing(false);
      if (res.data && res.data.ok && res.data.reply) {
        var p = parseReply(String(res.data.reply));
        addMsg('bot', p.body || 'Could you rephrase that?');
        chips(p.list.length ? p.list : CONFIG.fallback);
      }
      else if (res.status === 404) { session = null; msgs = []; lastChips = []; save(); $('form').reset(); showForm('Your session expired. Enter your details to start again.'); }
      else addMsg('bot', 'Sorry, something went wrong on my side. Please try again in a moment.', false);
    }).catch(function () {
      typing(false); addMsg('bot', 'No connection. Check your internet and send that again.', false);
    }).then(function () { busy = false; $('snd').disabled = false; $('inp').focus(); });
  }
  $('comp').addEventListener('submit', function (e) { e.preventDefault(); send($('inp').value); });

  function open() { $('panel').hidden = false; $('fab').hidden = true; if (session && !$('chatView').hidden) $('inp').focus(); else $('name').focus(); }
  function close() { $('panel').hidden = true; $('fab').hidden = false; $('fab').focus(); }
  $('fab').onclick = open; $('close').onclick = close;
  root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('panel').hidden) close(); });

  load();
  if (session) showChat(); else showForm();
})();
