/* C4.5.36.4 · integrated modular princess maker.
 * Uses independent PNG parts based on the approved flower-princess artwork.
 * Other drawing/webtoon features remain unchanged.
 */
(()=>{'use strict';
 const root=document.getElementById('assemblyMaker'); if(!root) return;
 const by=id=>root.querySelector('#'+id);
 const W=480,H=840,VERSION='45364';
 const STORE='webtoon.princessAssembly.v2.records';
 const defaults={name:'나의 꽃빛공주',hair:'long',dress:'pink'};
 const files={face:'face-common.png',longBack:'hair-long-back.png',longFront:'hair-long-front.png',bobBack:'hair-bob-back.png',bobFront:'hair-bob-front.png',pink:'dress-pink.png',lavender:'dress-lavender.png'};
 const choices={hair:[['long','🌸 긴 웨이브 머리'],['bob','🌷 단발머리']],dress:[['pink','💗 꽃빛 드레스'],['lavender','💜 라벤더 드레스']]};
 const imgs={};
 let ready=false, recordId=null, state={...defaults};
 
 const previewWrap=by('pmPreview');
 const canvas=document.createElement('canvas');
 canvas.width=960; canvas.height=1680; canvas.setAttribute('role','img'); canvas.setAttribute('aria-label','현재 꾸미는 꽃빛공주');
 previewWrap.replaceChildren(canvas);
 const g=canvas.getContext('2d');
 
 function normalize(v){
   const s={...defaults,...(v||{})};
   s.hair=s.hair==='bob'?'bob':'long';
   s.dress=s.dress==='lavender'?'lavender':'pink';
   s.name=(s.name||'나의 꽃빛공주').toString().slice(0,35);
   return s;
 }
 function message(text){ const el=by('pmMessage'); if(el) el.textContent=text; }
 function safeName(s){ return String(s||'나의 꽃빛공주').replace(/[\\/:*?"<>|]/g,'_').slice(0,50); }
 function comboParts(v){ const s=normalize(v); return [s.hair+'Back',s.dress,'face',s.hair+'Front']; }
 function paint(ctx,v){
   const s=normalize(v); ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height); ctx.save();
   ctx.scale(ctx.canvas.width/W, ctx.canvas.height/H);
   comboParts(s).forEach(k=>{ if(imgs[k]) ctx.drawImage(imgs[k],0,0,W,H); });
   ctx.restore();
 }
 function updateButtons(){
   for(const kind of Object.keys(choices)){
     const holder=by('pm_'+kind); holder.replaceChildren();
     for(const [value,label] of choices[kind]){
       const b=document.createElement('button'); b.type='button'; b.className='pm-choice'+(state[kind]===value?' on':'');
       b.textContent=label; b.setAttribute('aria-pressed', state[kind]===value ? 'true' : 'false');
       b.addEventListener('click', ()=>{ state[kind]=value; render(); }); holder.appendChild(b);
     }
   }
 }
 function render(){ by('pmName').value=state.name; updateButtons(); if(ready) paint(g,state); }
 function records(){ try{ const a=JSON.parse(localStorage.getItem(STORE)||'[]'); return Array.isArray(a)?a:[]; }catch{return [];} }
 function writeRecords(rows){ localStorage.setItem(STORE, JSON.stringify(rows)); }
 function makeThumb(v,w=150){ const c=document.createElement('canvas'); c.width=w; c.height=Math.round(w*H/W); paint(c.getContext('2d'), v); return c; }
 function refreshGallery(){
   const holder=by('pmSaved'); holder.replaceChildren();
   const rows=records();
   if(!rows.length){ holder.textContent='아직 저장한 공주가 없어요.'; return; }
   const grid=document.createElement('div'); grid.className='pm-gallery';
   rows.slice().reverse().forEach(row=>{
     const item=document.createElement('article'); item.className='pm-saved-item';
     const photo=document.createElement('button'); photo.type='button'; photo.className='pm-thumb-button'; photo.setAttribute('aria-label',(row.name||'꽃빛공주')+' 다시 꾸미기');
     const thumb=makeThumb(row.state,150); const img=document.createElement('img'); img.alt=(row.name||'꽃빛공주')+' 미리보기'; img.src=thumb.toDataURL('image/png'); photo.appendChild(img);
     const title=document.createElement('strong'); title.className='pm-saved-name'; title.textContent=row.name||'꽃빛공주';
     const actions=document.createElement('div'); actions.className='pm-saved-actions';
     const open=document.createElement('button'); open.type='button'; open.textContent='다시 꾸미기';
     const rename=document.createElement('button'); rename.type='button'; rename.textContent='이름 변경';
     const del=document.createElement('button'); del.type='button'; del.textContent='삭제';
     const openRow=()=>{ state=normalize(row.state); state.name=row.name||state.name; recordId=row.id; render(); root.scrollIntoView({behavior:'smooth',block:'start'}); message('저장한 공주를 불러왔어요. 머리와 드레스를 다시 바꿀 수 있어요.'); };
     photo.onclick=openRow; open.onclick=openRow;
     rename.onclick=()=>{ const next=prompt('공주의 새 이름을 적어 주세요.', row.name||'꽃빛공주'); if(next===null) return; const name=next.trim().slice(0,35); if(!name){ message('공주 이름을 입력해 주세요.'); return; }
       const rows2=records(); const found=rows2.find(x=>x.id===row.id); if(!found) return; found.name=name; found.state.name=name; found.updated=Date.now(); writeRecords(rows2); if(recordId===row.id){ state.name=name; render(); } refreshGallery(); };
     del.onclick=()=>{ if(!confirm('이 조립식 공주 저장본만 삭제할까요? 기존 웹툰 작품은 그대로예요.')) return; writeRecords(records().filter(x=>x.id!==row.id)); if(recordId===row.id) recordId=null; refreshGallery(); };
     actions.append(open,rename,del); item.append(photo,title,actions); grid.append(item);
   });
   holder.append(grid);
 }
 function loadAssets(){
   const getImg=(file)=>new Promise((resolve,reject)=>{ const i=new Image(); i.decoding='async'; i.onload=()=>resolve(i); i.onerror=()=>reject(Error(file)); i.src=file+'?v='+VERSION; });
   message('공주 그림 부품을 준비하는 중이에요…');
   Promise.allSettled(Object.entries(files).map(async([key,file])=>[key,await getImg(file)])).then(results=>{
     const failed=[]; results.forEach((r,i)=>{ if(r.status==='fulfilled'){ const [key,img]=r.value; imgs[key]=img; } else failed.push(Object.values(files)[i]); });
     ready=Object.keys(files).every(k=>imgs[k]);
     if(!ready){ message('공주 그림 파일을 불러오지 못했어요. 실패한 파일: '+failed.join(', ')); return; }
     render(); refreshGallery(); message('꽃빛공주 독립 부품 7개를 읽었어요. 머리와 드레스를 바꿔 보세요.');
   });
 }
 by('pmName').addEventListener('input', e=>{ state.name=e.target.value.slice(0,35); });
 by('pmSave').onclick=()=>{
   if(!ready){ message('공주 그림이 준비된 뒤 저장해 주세요.'); return; }
   state.name=by('pmName').value.trim() || '나의 꽃빛공주';
   const rows=records(); if(!recordId) recordId='assembly-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);
   const data={id:recordId, name:state.name, state:normalize(state), updated:Date.now(), schemaVersion:4, artPack:'flower-modular-v2'};
   const idx=rows.findIndex(r=>r.id===recordId); if(idx>=0) rows[idx]=data; else rows.push(data);
   try{ writeRecords(rows); refreshGallery(); message('공주를 저장했어요. 기존 웹툰 작품은 바뀌지 않았어요.'); }catch{ message('기기 저장 공간이 부족해 저장하지 못했어요.'); }
 };
 by('pmNew').onclick=()=>{ state={...defaults}; recordId=null; render(); message('새 꽃빛공주를 꾸며 보세요.'); };
 by('pmExport').onclick=()=>{
   if(!ready){ message('공주 그림이 준비된 뒤 PNG로 저장해 주세요.'); return; }
   const out=document.createElement('canvas'); out.width=960; out.height=1680; paint(out.getContext('2d'), state);
   out.toBlob(blob=>{ if(!blob){ message('PNG 파일을 만들 수 없어요.'); return; } const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=safeName(state.name||'꽃빛공주')+'.png'; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),60000); message('공주 그림을 PNG로 저장했어요.'); }, 'image/png');
 };
 render(); refreshGallery(); loadAssets();
})();
