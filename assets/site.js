// Tenuta Tremollito v2. Reveals run once; the portrait hero cycles slowly and can be paused.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // mask urls are resolved against the page, not the stylesheet
  const setMask = (el, path) => el.style.setProperty("--m", `url("${new URL(path, location.href).href}")`);
  document.querySelectorAll("[data-mask]").forEach(el => setMask(el, el.dataset.mask));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.2 });
  document.querySelectorAll(".paint:not(.in-on-load), .rise, .bleed:not(.in-on-load)").forEach(el => io.observe(el));
  requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll(".in-on-load").forEach(el => el.classList.add("in"))));

  const W = window.TT_WINES, stage = document.getElementById("stage");
  if (!W || !stage) return;
  const $ = id => document.getElementById(id), hero = stage.closest(".hero"), dots = $("dots");
  const lead = stage.querySelector("img"); // the first portrait is already in the page
  W.forEach((w, i) => {
    let im = i === 1 && lead;
    if (!im) { im = new Image(); im.src = w.face; im.alt = ""; im.className = "face bleed"; setMask(im, w.wash); im.style.opacity = 0; }
    stage.appendChild(im);
    const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", w.name);
    b.innerHTML = `<img src="${w.face}" alt="">`; b.onclick = () => { show(i); stop(); }; dots.appendChild(b);
  });
  const T = hero.dataset; const pause = document.createElement("button"); pause.type = "button"; pause.className = "pause"; pause.textContent = T.pause;
  pause.onclick = () => timer ? stop() : start(); dots.appendChild(pause);
  let cur = -1, timer = null;
  function show(i) {
    cur = i; const w = W[i];
    [...stage.children].forEach((im, j) => {
      im.style.opacity = j === i ? 1 : 0; im.style.viewTransitionName = j === i ? "face-" + w.slug : "none";
      im.classList.remove("in"); if (j === i) requestAnimationFrame(() => requestAnimationFrame(() => im.classList.add("in")));
    });
    hero.style.setProperty("--k", w.colour); hero.style.setProperty("--kt", w.textc);
    $("h-name").textContent = w.name.toUpperCase();
    $("h-grape").textContent = w.grape + " · " + w.cls;
    $("h-quote").textContent = w.quote ? "“" + w.quote + "”" : ""; $("h-quote").hidden = !w.quote;
    $("h-who").textContent = w.who;
    const m = $("h-meet"); m.href = w.href; m.textContent = T.meet + " " + w.name;
    [...dots.children].forEach((d, j) => d.setAttribute && d !== pause && d.setAttribute("aria-pressed", j === i));
  }
  function stop() { clearInterval(timer); timer = null; pause.textContent = T.play; pause.setAttribute("aria-pressed", "true"); }
  function start() { if (reduce) return; clearInterval(timer); timer = setInterval(() => show((cur + 1) % W.length), 7000); pause.textContent = T.pause; pause.setAttribute("aria-pressed", "false"); }
  show(1); start();
  if (reduce) pause.hidden = true;
})();
