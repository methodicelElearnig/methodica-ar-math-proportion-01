(function(){
  const scs=[...d.querySelectorAll('.screen')].map(s=>s.dataset.screen+(s.classList.contains('active')?'*':''));
  const a=d.querySelector('.screen.active');
  return {all:scs.join(','), active:a?a.dataset.screen:null, html:a?a.innerHTML.length:0};
})()
