(function(){
  const sc=d.querySelector('.screen.active');
  const r=el=>{ if(!el) return null; const b=el.getBoundingClientRect(); return {t:Math.round(b.top),b:Math.round(b.bottom),l:Math.round(b.left),r:Math.round(b.right),w:Math.round(b.width),h:Math.round(b.height)}; };
  return {
    screen: sc && sc.dataset.screen,
    content: r(sc.querySelector('.quiz-content')),
    note: r(sc.querySelector('.gym-applet-note')),
    wrap: r(sc.querySelector('.quiz-content .table-zoom-wrap')),
    table: r(sc.querySelector('.gym-ratio-table')),
    charw: r(sc.querySelector('.character-widget')),
    bubble: r(sc.querySelector('.character-widget .speech-bubble')),
    img: r(sc.querySelector('.character-widget img')),
    bigtable: r(sc.querySelector('.dd-table'))
  };
})()
