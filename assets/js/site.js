/* Theme toggle, map/list cross-highlighting, and scroll-spy for the nav. */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- theme */
  var root = document.documentElement;
  var btn = document.getElementById("theme");
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M2 12h2M20 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function stored() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }
  function resolved() {
    return root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function paint() { if (btn) btn.innerHTML = resolved() === "dark" ? MOON : SUN; }

  var saved = stored();
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  paint();

  if (btn) {
    btn.addEventListener("click", function () {
      var next = resolved() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* private mode: session only */ }
      paint();
    });
  }
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (!stored()) paint();
  });

  /* ------------------------------------------------- map <-> list linking */
  var rows = document.querySelectorAll(".site-row[data-site]");
  var pins = document.querySelectorAll(".wm-site[data-site]");

  function highlight(id, on) {
    rows.forEach(function (r) { if (r.dataset.site === id) r.classList.toggle("on", on); });
    pins.forEach(function (p) {
      if (p.dataset.site === id) {
        var pin = p.querySelector(".wm-pin");
        if (pin) pin.setAttribute("r", on ? "11" : "8");
      }
    });
  }
  function bind(nodes) {
    nodes.forEach(function (n) {
      var id = n.dataset.site;
      n.addEventListener("mouseenter", function () { highlight(id, true); });
      n.addEventListener("mouseleave", function () { highlight(id, false); });
      n.addEventListener("focus", function () { highlight(id, true); });
      n.addEventListener("blur", function () { highlight(id, false); });
    });
  }
  bind(rows); bind(pins);

  /* ------------------------------------------------------------ scrollspy */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute("href")); })
                     .filter(Boolean);
  if ("IntersectionObserver" in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + e.target.id;
          a.style.color = on ? "var(--text)" : "";
          a.style.fontWeight = on ? "600" : "";
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }
})();
