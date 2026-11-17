(function(){
  const out=[];
  d.querySelectorAll('.screen').forEach(sc=>{
    const n=+sc.dataset.screen;
    if(n<28||n>40) return;
    const imgs=[...sc.querySelectorAll('img')].map(im=>({src:(im.getAttribute('src')||'').split('/').pop(), zoom:!!im.closest('.img-zoom-wrap'), noz:im.hasAttribute('data-no-zoom'), nw:im.naturalWidth}));
    const ov=[];
    sc.querySelectorAll('*').forEach(el=>{ if(el.scrollWidth>el.clientWidth+1&&el.clientWidth>0) ov.push((el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className)+'|'+el.scrollWidth+'/'+el.clientWidth); });
    if(imgs.length||ov.length) out.push({n, imgs, ov});
  });
  return out;
})()
