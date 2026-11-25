/* C4.5.36.0 · rebuilt princess renderer using stable full-combo illustrations.
 * The princess maker remains isolated from drawing/webtoon features.
 * To prevent face outlines and mismatched jaw joins, each visible choice is rendered from a polished complete illustration.
 */
(()=>{'use strict';
 const root=document.getElementById('assemblyMaker');if(!root)return;
 const by=id=>root.querySelector('#'+id);
 const STORE='webtoon.princessAssembly.v1';
 const defaults={name:'나의 꽃빛공주',hair:'long',dress:'pink',pose:'standing',expression:'happy'};
 const choices={hair:[['long','🌸 긴 웨이브 머리'],['bob','🌷 단발머리']],dress:[['pink','💗 꽃빛 드레스'],['lavender','💜 라벤더 드레스']]};
 const W=600,H=1052;
 const comboFiles={
   'long__pink':'princess-combo-long-pink.png?v=45360',
   'bob__pink':'princess-combo-bob-pink.png?v=45360',
   'long__lavender':'princess-combo-long-lavender.png?v=45360',
   'bob__lavender':'princess-combo-bob-lavender.png?v=45360'
 };
 let state={...defaults},recordId=null,ready=false,loading=false;
 const artMap={};
 const canvas=document.createElement('canvas');canvas.width=W*2;canvas.height=H*2;
 canvas.setAttribute('role','img');canvas.setAttribute('aria-label','현재 꾸미는 꽃빛공주');
 canvas.style.cssText='display:block;width:100%;height:auto;max-height:790px;object-fit:contain;';
 const context=canvas.getContext('2d',{alpha:true});
 const safeName=s=>String(s||'나의 꽃빛공주').replace(/[\/:*?"<>|]/g,'_').slice(0,50);
 function normalize(value){
   const s={...defaults,...(value||{})};
   s.hair=s.hair==='bob'?'bob':'long';
   s.dress=(s.dress==='lavender'||s.dressColor==='lavender'||s.dress==='a-line')?'lavender':'pink';
   s.expression='happy';s.pose='standing';return s;
 }
 function comboKey(value){const s=normalize(value);return s.hair+'__'+s.dress}
 function getRecords(){try{const a=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(a)?a:[]}catch{return []}}
 function writeRecords(a){localStorage.setItem(STORE,JSON.stringify(a))}
 function message(s){const el=by('pmMessage');if(el)el.textContent=s}
 function currentArt(value){return artMap[comboKey(value)]||null}
 function paint(){
   context.clearRect(0,0,canvas.width,canvas.height);
   const art=currentArt(state); if(!art)return;
   context.drawImage(art,0,0,canvas.width,canvas.height);
 }
 function thumbnailFor(value){
   const art=currentArt(value); if(!art)return '';
   const sc=document.createElement('canvas'); sc.width=150; sc.height=263;
   const g=sc.getContext('2d',{alpha:true}); g.drawImage(art,0,0,sc.width,sc.height);
   return sc.toDataURL('image/png');
 }
 function refresh(){
   by('pmName').value=state.name;
   for(const kind of Object.keys(choices)){
     const area=by('pm_'+kind); if(!area)continue; area.replaceChildren();
     for(const [key,label] of choices[kind]){
       const button=document.createElement('button'); button.type='button'; button.className='pm-choice'+(state[kind]===key?' on':'');
       button.setAttribute('aria-pressed',state[kind]===key?'true':'false'); button.textContent=label;
       button.addEventListener('click',()=>{state[kind]=key; refresh();}); area.appendChild(button);
     }
   }
   paint();
 }
 function showRecords(){
   const holder=by('pmSaved'); holder.replaceChildren(); const rows=getRecords();
   if(!rows.length){holder.textContent='아직 저장한 공주가 없어요.'; return}
   const grid=document.createElement('div'); grid.className='pm-gallery';
   rows.slice().reverse().forEach(row=>{
     const wrap=document.createElement('article'); wrap.className='pm-saved-item';
     const photo=document.createElement('button'); photo.type='button'; photo.className='pm-thumb-button';
     photo.setAttribute('aria-label',(row.name||'꽃빛공주')+' 다시 꾸미기');
     const img=document.createElement('img'); img.alt=(row.name||'꽃빛공주')+' 미리보기'; img.loading='lazy'; img.decoding='async';
     if(ready){try{img.src=thumbnailFor(row.state)}catch(err){console.warn('공주 미리보기',err)}}
     photo.append(img);
     const text=document.createElement('strong'); text.className='pm-saved-name'; text.textContent=row.name||'꽃빛공주';
     const actions=document.createElement('div'); actions.className='pm-saved-actions';
     const open=document.createElement('button'); open.type='button'; open.textContent='다시 꾸미기';
     const openRow=()=>{state=normalize(row.state); recordId=row.id; refresh(); root.scrollIntoView({behavior:'smooth',block:'start'}); message('저장한 공주를 불러왔어요. 머리와 드레스를 다시 바꿀 수 있어요.')};
     photo.addEventListener('click',openRow); open.addEventListener('click',openRow);
     const rename=document.createElement('button'); rename.type='button'; rename.textContent='이름 변경';
     rename.addEventListener('click',()=>{
       const next=prompt('공주의 새 이름을 적어 주세요.',row.name||'꽃빛공주'); if(next===null)return;
       const name=next.trim().slice(0,35); if(!name){message('공주 이름을 입력해 주세요.'); return}
       const saved=getRecords(),found=saved.find(x=>x.id===row.id); if(!found)return;
       found.name=name; found.state={...found.state,name}; found.updated=Date.now();
       try{writeRecords(saved); if(recordId===row.id){state.name=name; by('pmName').value=name} showRecords()}catch(e){message('이름을 바꾸지 못했어요.')}
     });
     const del=document.createElement('button'); del.type='button'; del.textContent='삭제';
     del.addEventListener('click',()=>{if(!confirm('이 조립식 공주 저장본만 삭제할까요? 기존 웹툰 작품은 그대로예요.'))return; try{writeRecords(getRecords().filter(x=>x.id!==row.id)); if(recordId===row.id)recordId=null; showRecords()}catch(e){message('삭제 작업에 실패했어요.')}});
     actions.append(open,rename,del); wrap.append(photo,text,actions); grid.append(wrap);
   });
   holder.append(grid);
 }
 function loadArt(){
   if(loading||ready)return; loading=true; message('공주 그림을 준비하는 중이에요…');
   const load=(src)=>new Promise((ok,fail)=>{const im=new Image(); im.decoding='async'; im.onload=()=>ok(im); im.onerror=()=>fail(new Error(src)); im.src=src});
   Promise.all(Object.entries(comboFiles).map(([key,src])=>load(src).then(img=>[key,img])))
     .then(entries=>{entries.forEach(([key,img])=>artMap[key]=img); ready=true; loading=false; refresh(); showRecords(); message('얼굴 윤곽선이 남지 않도록 공주 그림을 다시 정리했어요. 머리와 드레스를 바꿔 보세요.')})
     .catch(()=>{loading=false; message('공주 그림 파일을 불러오지 못했어요. ZIP의 공주 그림 파일 4개가 함께 업로드되었는지 확인해 주세요.')});
 }
 by('pmPreview').replaceChildren(canvas);
 by('pmName').addEventListener('input',e=>state.name=e.target.value.slice(0,35));
 by('pmSave').onclick=()=>{
   state.name=by('pmName').value.trim()||'나의 꽃빛공주';
   const rows=getRecords(); if(!recordId)recordId='assembly-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);
   const data={id:recordId,name:state.name,state:{...state},updated:Date.now(),schemaVersion:3,artPack:'flower-hq-2'};
   const i=rows.findIndex(r=>r.id===recordId); if(i>=0)rows[i]=data; else rows.push(data);
   try{writeRecords(rows); showRecords(); message('공주를 저장했어요. 이전 웹툰 작품은 바뀌지 않았어요.')}catch(e){message('기기 저장 공간이 부족해 저장하지 못했어요.')}
 };
 by('pmNew').onclick=()=>{state={...defaults}; recordId=null; refresh(); message('새 꽃빛공주를 꾸며 보세요.')};
 by('pmExport').onclick=()=>{const art=currentArt(state); if(!art){message('공주 그림을 불러온 다음 PNG로 저장해 주세요.'); return} try{
     const out=document.createElement('canvas'); out.width=art.naturalWidth||W; out.height=art.naturalHeight||H;
     out.getContext('2d',{alpha:true}).drawImage(art,0,0,out.width,out.height);
     out.toBlob(blob=>{if(!blob){message('PNG 파일을 만들 수 없어요.');return}
       const url=URL.createObjectURL(blob),a=document.createElement('a'); a.href=url; a.download=safeName(state.name)+'.png'; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),60000);
       message('공주 그림을 PNG로 저장했어요.');
     },'image/png');
   }catch(e){message('PNG 저장에 실패했어요.')}
 };
 refresh(); showRecords(); loadArt();
})();
