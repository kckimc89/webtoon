/* C4.5.35.5 · high-quality modular princess prototype.
 * Independent of app-core.js, drawing-workshop.js, and existing storage.
 * Layered sprite parts: hairstyle and dress rendered separately, without repainting other features.
 */
(()=>{'use strict';
 const root=document.getElementById('assemblyMaker');if(!root)return;
 const by=id=>root.querySelector('#'+id);
 const STORE='webtoon.princessAssembly.v1'; // compatible with C4.5.34.0 saved assembly records
 const defaults={name:'나의 꽃빛공주',hair:'long',dress:'pink',pose:'standing',expression:'happy'};
 const choices={hair:[['long','🌸 긴 웨이브 머리'],['bob','🌷 단발머리']],dress:[['pink','💗 꽃빛 드레스'],['lavender','💜 라벤더 드레스']]};
 const source={long:{sx:0,sy:0,sw:590,sh:540},bob:{sx:600,sy:0,sw:599,sh:450},pink:{sx:0,sy:530,sw:590,sh:782},lavender:{sx:600,sy:470,sw:599,sh:842}};
 const W=600,H=1052,OFFSET=260,HEAD_Y=315;
 let state={...defaults},recordId=null,ready=false,asset=null,sharedFace=null,loading=false;
 const canvas=document.createElement('canvas');canvas.width=W*2;canvas.height=H*2;
 canvas.setAttribute('role','img');canvas.setAttribute('aria-label','현재 조립된 꽃빛공주');
 canvas.style.cssText='display:block;width:100%;height:auto;max-height:790px;object-fit:contain;';
 const context=canvas.getContext('2d',{alpha:true});
 const safeName=s=>String(s||'나의 꽃빛공주').replace(/[\\/:*?"<>|]/g,'_').slice(0,50);
 function normalize(value){
   const s={...defaults,...(value||{})};
   s.hair=s.hair==='bob'?'bob':'long';
   s.dress=s.dress==='lavender'||s.dressColor==='lavender'||s.dress==='a-line'?'lavender':'pink';
   s.expression='happy';s.pose='standing';
   return s;
 }
 function getRecords(){try{const a=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(a)?a:[]}catch{return []}}
 function writeRecords(a){localStorage.setItem(STORE,JSON.stringify(a))}
 function message(s){const el=by('pmMessage');if(el)el.textContent=s}
 function drawPart(c,kind,key){const a=source[key];if(!a)return;let y=kind==='hair'?HEAD_Y:(key==='lavender'?470:530);c.drawImage(asset,a.sx,a.sy,a.sw,a.sh,0,y,a.sw,a.sh)}
 function paint(){
   if(!ready)return;
   context.setTransform(2,0,0,2,0,-OFFSET*2);
   context.clearRect(0,OFFSET,W,H);
   // Dress is drawn first; hair naturally overlaps the shoulders and neckline.
   drawPart(context,'dress',state.dress);
   drawPart(context,'hair',state.hair);
   // Canonical face and neck are one shared immutable part for every hair selection.
   // Its position, rotation, size and facial features never change with hairstyles.
   if(sharedFace)context.drawImage(sharedFace,200,HEAD_Y+105,190,180);
   context.setTransform(1,0,0,1,0,0);
 }
 function thumbnailFor(value){
   if(!ready)return '';
   // Never modify the active canvas: older saved princesses are rendered offscreen.
   const sc=document.createElement('canvas');sc.width=150;sc.height=263;
   const g=sc.getContext('2d',{alpha:true});
   const st=normalize(value);
   g.setTransform(.25,0,0,.25,0,-OFFSET*.25);
   const dress=source[st.dress],hair=source[st.hair];
   g.drawImage(asset,dress.sx,dress.sy,dress.sw,dress.sh,0,st.dress==='lavender'?470:530,dress.sw,dress.sh);
   g.drawImage(asset,hair.sx,hair.sy,hair.sw,hair.sh,0,HEAD_Y,hair.sw,hair.sh);
   if(sharedFace)g.drawImage(sharedFace,200,HEAD_Y+105,190,180);
   return sc.toDataURL('image/png');
 }
 function refresh(){
   by('pmName').value=state.name;
   for(const kind of Object.keys(choices)){
     const area=by('pm_'+kind);if(!area)continue;area.replaceChildren();
     for(const [key,label] of choices[kind]){
       const button=document.createElement('button');button.type='button';button.className='pm-choice'+(state[kind]===key?' on':'');
       button.setAttribute('aria-pressed',state[kind]===key?'true':'false');button.textContent=label;
       button.addEventListener('click',()=>{state[kind]=key;refresh();});area.appendChild(button);
     }
   }
   paint();
 }
 function showRecords(){
   const holder=by('pmSaved');holder.replaceChildren();const rows=getRecords();
   if(!rows.length){holder.textContent='아직 저장한 공주가 없어요.';return}
   const grid=document.createElement('div');grid.className='pm-gallery';
   rows.slice().reverse().forEach(row=>{
     const wrap=document.createElement('article');wrap.className='pm-saved-item';
     const photo=document.createElement('button');photo.type='button';photo.className='pm-thumb-button';
     photo.setAttribute('aria-label',(row.name||'꽃빛공주')+' 다시 꾸미기');
     const img=document.createElement('img');img.alt=(row.name||'꽃빛공주')+' 미리보기';
     img.loading='lazy';img.decoding='async';
     if(ready){try{img.src=thumbnailFor(row.state)}catch(err){console.warn('공주 미리보기',err)}}
     photo.append(img);
     const text=document.createElement('strong');text.className='pm-saved-name';text.textContent=row.name||'꽃빛공주';
     const actions=document.createElement('div');actions.className='pm-saved-actions';
     const open=document.createElement('button');open.type='button';open.textContent='다시 꾸미기';
     const openRow=()=>{state=normalize(row.state);recordId=row.id;refresh();root.scrollIntoView({behavior:'smooth',block:'start'});message('저장한 공주를 불러왔어요. 머리와 드레스를 다시 바꿀 수 있어요.')};
     photo.addEventListener('click',openRow);open.addEventListener('click',openRow);
     const rename=document.createElement('button');rename.type='button';rename.textContent='이름 변경';
     rename.addEventListener('click',()=>{
       const next=prompt('공주의 새 이름을 적어 주세요.',row.name||'꽃빛공주');if(next===null)return;
       const name=next.trim().slice(0,35);if(!name){message('공주 이름을 입력해 주세요.');return}
       const saved=getRecords(),found=saved.find(x=>x.id===row.id);if(!found)return;
       found.name=name;found.state={...found.state,name};found.updated=Date.now();
       try{writeRecords(saved);if(recordId===row.id){state.name=name;by('pmName').value=name}showRecords()}catch(e){message('이름을 바꾸지 못했어요.')}
     });
     const del=document.createElement('button');del.type='button';del.textContent='삭제';
     del.addEventListener('click',()=>{if(!confirm('이 조립식 공주 저장본만 삭제할까요? 기존 웹툰 작품은 그대로예요.'))return;try{writeRecords(getRecords().filter(x=>x.id!==row.id));if(recordId===row.id)recordId=null;showRecords()}catch(e){message('삭제 작업에 실패했어요.')}});
     actions.append(open,rename,del);wrap.append(photo,text,actions);grid.append(wrap);
   });
   holder.append(grid);
 }
 function loadArt(){if(loading||ready)return;loading=true;message('공주 원화를 불러오는 중이에요…');
   const load=(src)=>new Promise((ok,fail)=>{const im=new Image();im.decoding='async';im.onload=()=>ok(im);im.onerror=()=>fail(new Error(src));im.src=src});
   Promise.all([load('princess-hq-sheet.png?v=45355'),load('princess-shared-face.png?v=45355')])
     .then(([sheet,face])=>{asset=sheet;sharedFace=face;ready=true;loading=false;refresh();showRecords();message('머리 모양을 바꿔도 얼굴과 고개 위치는 그대로 유지돼요.')})
     .catch(e=>{loading=false;message('공주 원화를 불러올 수 없어요. 공주 그림 파일 2개가 함께 업로드되었는지 확인해 주세요.')});
 }
 by('pmPreview').replaceChildren(canvas);
 by('pmName').addEventListener('input',e=>state.name=e.target.value.slice(0,35));
 by('pmSave').onclick=()=>{
   state.name=by('pmName').value.trim()||'나의 꽃빛공주';
   const rows=getRecords();if(!recordId)recordId='assembly-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);
   const data={id:recordId,name:state.name,state:{...state},updated:Date.now(),schemaVersion:2,artPack:'flower-hq-1'};
   const i=rows.findIndex(r=>r.id===recordId);if(i>=0)rows[i]=data;else rows.push(data);
   try{writeRecords(rows);showRecords();message('공주를 저장했어요. 이전 웹툰 작품은 변경되지 않았어요.')}catch(e){message('기기 저장 공간이 부족해 저장하지 못했어요.')}
 };
 by('pmNew').onclick=()=>{state={...defaults};recordId=null;refresh();message('새 꽃빛공주를 꾸며 보세요.')};
 by('pmExport').onclick=()=>{if(!ready){message('공주 그림을 불러온 다음 PNG로 저장해 주세요.');return}try{
     // Transparent background; artwork can be used as a separate element in a comic.
     canvas.toBlob(blob=>{if(!blob){message('PNG 파일을 만들 수 없어요.');return}
       const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=safeName(state.name)+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
       message('공주 그림을 PNG로 저장했어요. 배경은 투명하게 유지돼요.');
     },'image/png');
   }catch(e){message('PNG 저장에 실패했어요.')}
 };
 refresh();showRecords();loadArt();
})();
