(function () {
  "use strict";

  var roast = document.getElementById("roast");
  var stage = roast ? roast.querySelector("[data-sc-stage]") : null;
  var timeEl = roast ? roast.querySelector("[data-roast-time]") : null;
  var ticks = document.getElementById("dial-ticks");

  if (ticks) {
    var SVG = "http://www.w3.org/2000/svg";
    var cx = 300;
    var cy = 300;
    for (var i = 0; i < 72; i++) {
      var angle = (i / 72) * Math.PI * 2 - Math.PI / 2;
      var major = i % 6 === 0;
      var inner = major ? 214 : 220;
      var outer = 230;
      var line = document.createElementNS(SVG, "line");
      line.setAttribute("x1", (cx + Math.cos(angle) * inner).toFixed(2));
      line.setAttribute("y1", (cy + Math.sin(angle) * inner).toFixed(2));
      line.setAttribute("x2", (cx + Math.cos(angle) * outer).toFixed(2));
      line.setAttribute("y2", (cy + Math.sin(angle) * outer).toFixed(2));
      if (major) line.setAttribute("class", "is-major");
      ticks.appendChild(line);
    }
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function timeAt(p) {
    var total = 5 * 60 + 42 + p * 30;
    var mins = Math.round(total);
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    return pad(h) + ":" + pad(m);
  }

  function phaseAt(p) {
    if (p >= 0.695) return "first-light";
    if (p >= 0.62) return "cracking";
    return "pre-dawn";
  }

  var lastTime = "";
  var lastLight = null;
  var lastVerify = "";

  function paint(p) {
    if (!roast) return;

    var time = timeAt(p);
    if (timeEl && time !== lastTime) {
      timeEl.textContent = time;
      lastTime = time;
    }

    var light = p >= 0.695;
    if (light !== lastLight) {
      roast.classList.toggle("is-light", light);
      lastLight = light;
    }

    if (stage) {
      var state = time + "|" + phaseAt(p) + "|" + p.toFixed(3);
      if (state !== lastVerify) {
        stage.setAttribute("data-sc-verify-state", state);
        lastVerify = state;
      }
    }
  }

  function loop() {
    if (!roast) return;
    var p = 0;
    var api = window.ScrollCraft && window.ScrollCraft.instances && window.ScrollCraft.instances[0];
    if (api && api.acts) {
      for (var i = 0; i < api.acts.length; i++) {
        if (api.acts[i].el === roast) { p = api.acts[i].p; break; }
      }
    } else {
      var raw = getComputedStyle(roast).getPropertyValue("--sc-p");
      p = parseFloat(raw) || 0;
    }
    paint(Math.max(0, Math.min(1, p)));
    requestAnimationFrame(loop);
  }

  if (window.ScrollCraft) {
    window.ScrollCraft.mount(document.body);
  }

  paint(0);
  requestAnimationFrame(loop);
})();
