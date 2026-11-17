(function(){
  const out=[];
  d.querySelectorAll('.screen').forEach(sc=>{
    const n=sc.dataset.screen;
    sc.style.display='';
    const wasHidden = !sc.classList.contains('active');
    if(wasHidden){ sc.classList.add('active'); }
    const ov=[]; const noZoom=[];
    sc.querySelectorAll('*').forEach(el=>{
      if(el.scrollWidth>el.clientWidth+1 && el.clientWidth>0) ov.push((el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className)+'|'+el.scrollWidth+'/'+el.clientWidth+'|'+getComputedStyle(el).overflowX);
    });
    sc.querySelectorAll('img').forEach(im=>{ if(!im.closest('.img-zoom-wrap')&&!im.closest('.character-widget')&&!im.closest('.zoom')) noZoom.push(im.getAttribute('src')); });
    if(wasHidden) sc.classList.remove('active');
    if(ov.length||noZoom.length) out.push({n, ov, noZoom});
  });
  return out;
})()
