/* C4.5.7: Child-first Apple Pencil drawing workshop. Independent IndexedDB, no migration or deletion of webtoon data. */
(()=>{
 'use strict';
 const $d=id=>document.getElementById(id), W=640,H=640;
 const canvas=$d('dwCanvas');if(!canvas)return;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 const paint=document.createElement('canvas'), under=document.createElement('canvas');
 paint.width=under.width=W;paint.height=under.height=H;
 const pc=paint.getContext('2d',{willReadFrequently:true}),uc=under.getContext('2d',{willReadFrequently:true});
 let outline=null, tool='pen', color='#d76eab', size=11, activePointer=null, last=null, history=[], redo=[], currentId=null;
 const swatches=['#303038','#ffffff','#e7659e','#ed9a58','#f2c455','#78ba8c','#65bdda','#678eda','#9a7bc7','#b16f58'];
 const alertUser=msg=>{ if(typeof toast==='function')toast(msg);else alert(msg); };
 const $colors=$d('dwColors');
 swatches.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='dw-swatch';b.style.backgroundColor=c;b.title=c;b.setAttribute('aria-label','색상 '+c);b.onclick=()=>{$d('dwColor').value=c;color=c;updateSwatches()};$colors.appendChild(b)});
 function updateSwatches(){[...$colors.children].forEach((b,i)=>b.classList.toggle('selected',swatches[i]===color))}updateSwatches();
 function setTool(t){tool=t;document.querySelectorAll('[data-dw-tool]').forEach(b=>b.classList.toggle('active',b.dataset.dwTool===t));}
 document.querySelectorAll('[data-dw-tool]').forEach(b=>b.onclick=()=>setTool(b.dataset.dwTool));
 $d('dwColor').oninput=e=>{color=e.target.value;updateSwatches()};
 $d('dwSize').oninput=e=>{size=+e.target.value;$d('dwSizeLabel').textContent=size};
 const bgToggle=$d('dwShowBackground');bgToggle.onchange=()=>render();
 function render(){ctx.clearRect(0,0,W,H);if(bgToggle.checked){ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H)}ctx.drawImage(under,0,0);ctx.drawImage(paint,0,0);if(outline)ctx.drawImage(outline,0,0,W,H)}
 function imageDataURL(c){return c.toDataURL('image/png')}
 function remember(){history.push([uc.getImageData(0,0,W,H),pc.getImageData(0,0,W,H)]);if(history.length>16)history.shift();redo=[]}
 function step(from,to){if(!from.length)return;to.push([uc.getImageData(0,0,W,H),pc.getImageData(0,0,W,H)]);const [a,b]=from.pop();uc.putImageData(a,0,0);pc.putImageData(b,0,0);render()}
 $d('dwUndo').onclick=()=>step(history,redo);$d('dwRedo').onclick=()=>step(redo,history);
 function xy(e){const r=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(W-1,(e.clientX-r.left)*W/r.width)),y:Math.max(0,Math.min(H-1,(e.clientY-r.top)*H/r.height))}}
 function stroke(a,b){pc.save();pc.globalCompositeOperation=tool==='eraser'?'destination-out':'source-over';pc.lineCap='round';pc.lineJoin='round';pc.strokeStyle=color;pc.fillStyle=color;pc.lineWidth=(tool==='brush'?size*1.8:size)*(tool==='brush'?.95:1);pc.beginPath();pc.moveTo(a.x,a.y);pc.lineTo(b.x,b.y);pc.stroke();if(a.x===b.x&&a.y===b.y){pc.beginPath();pc.arc(a.x,a.y,pc.lineWidth/2,0,Math.PI*2);pc.fill()}pc.restore()}
 function fillAt(x,y){const source=document.createElement('canvas');source.width=W;source.height=H;const sc=source.getContext('2d',{willReadFrequently:true});sc.drawImage(under,0,0);sc.drawImage(paint,0,0);if(outline)sc.drawImage(outline,0,0,W,H);const data=sc.getImageData(0,0,W,H).data;
  const sx=Math.floor(x),sy=Math.floor(y),at=(sy*W+sx)*4,target=[data[at],data[at+1],data[at+2],data[at+3]];
  const rgb=[parseInt(color.slice(1,3),16),parseInt(color.slice(3,5),16),parseInt(color.slice(5,7),16)];
  if(target[3]>225&&Math.abs(target[0]-rgb[0])+Math.abs(target[1]-rgb[1])+Math.abs(target[2]-rgb[2])<18)return;
  const out=uc.getImageData(0,0,W,H);const px=out.data;const visited=new Uint8Array(W*H);const queue=new Int32Array(W*H);let head=0,tail=0;queue[tail++]=sy*W+sx;visited[sy*W+sx]=1;const tolerance=37;
  while(head<tail){const p=queue[head++],i=p*4;if(Math.abs(data[i]-target[0])+Math.abs(data[i+1]-target[1])+Math.abs(data[i+2]-target[2])>tolerance||Math.abs(data[i+3]-target[3])>90)continue;px[i]=rgb[0];px[i+1]=rgb[1];px[i+2]=rgb[2];px[i+3]=255;const x=p%W,y=(p/W)|0;
   if(x>0&&!visited[p-1]){visited[p-1]=1;queue[tail++]=p-1}if(x<W-1&&!visited[p+1]){visited[p+1]=1;queue[tail++]=p+1}if(y>0&&!visited[p-W]){visited[p-W]=1;queue[tail++]=p-W}if(y<H-1&&!visited[p+W]){visited[p+W]=1;queue[tail++]=p+W}
  }
  uc.putImageData(out,0,0);render();
 }
 canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&activePointer!==null)return;if(activePointer!==null)return;e.preventDefault();const a=xy(e);remember();if(tool==='bucket'){fillAt(a.x,a.y);return}activePointer=e.pointerId;last=a;try{canvas.setPointerCapture(e.pointerId)}catch(_){}stroke(a,a);render()});
 canvas.addEventListener('pointermove',e=>{if(e.pointerId!==activePointer)return;e.preventDefault();const pt=xy(e);stroke(last,pt);last=pt;render()});
 const end=e=>{if(e.pointerId!==activePointer)return;activePointer=null;last=null;render()};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
 function svgWrap(body){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640"><g fill="none" stroke="#4c3a4e" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`}
 const shape={
 rabbit:()=>svgWrap(`<path d="M230 255 Q181 82 217 56 Q252 33 284 231 M355 225 Q369 45 406 52 Q453 68 391 254"/><ellipse cx="310" cy="447" rx="144" ry="136"/><ellipse cx="309" cy="290" rx="148" ry="135"/><ellipse cx="212" cy="541" rx="54" ry="38"/><ellipse cx="412" cy="541" rx="54" ry="38"/><path d="M273 300q-15 -24 -30 0 M365 300q-15 -24 -30 0" fill="none"/><path d="M306 332l24 0 -12 13z M318 346q-12 21 -28 5 M318 346q13 21 28 5" fill="none"/><path d="M389 150q22 -35 43 0q-3 25 -28 33q-25 -5 -15 -33"/>`),
 dog:()=>svgWrap(`<ellipse cx="320" cy="457" rx="143" ry="134"/><path d="M218 232 Q117 143 118 257 Q121 364 217 352 M423 230 Q517 132 532 240 Q534 337 427 351"/><ellipse cx="320" cy="285" rx="139" ry="124"/><ellipse cx="231" cy="543" rx="57" ry="42"/><ellipse cx="407" cy="543" rx="57" ry="42"/><ellipse cx="269" cy="293" rx="11" ry="17"/><ellipse cx="373" cy="293" rx="11" ry="17"/><path d="M305 332q15 -11 30 0l-15 18z M320 350q-21 25 -38 2 M320 350q21 25 38 2" fill="none"/><path d="M214 402Q320 440 428 401" fill="none"/>`),
 cat:()=>svgWrap(`<path d="M197 269L193 105L289 180Q324 174 356 181L462 99L450 271"/><ellipse cx="320" cy="430" rx="139" ry="126"/><ellipse cx="320" cy="278" rx="149" ry="121"/><path d="M210 282l-48 -12 M212 306l-58 8 M433 281l54 -10 M432 304l57 12" fill="none"/><ellipse cx="269" cy="281" rx="11" ry="17"/><ellipse cx="374" cy="281" rx="11" ry="17"/><path d="M306 318l28 0 -14 14z M320 334q-12 16 -27 4 M320 334q12 16 27 4" fill="none"/><path d="M433 463Q526 405 502 337" fill="none"/><ellipse cx="252" cy="538" rx="40" ry="30"/><ellipse cx="388" cy="538" rx="40" ry="30"/>`),
 princess:()=>svgWrap(`<path d="M191 226 Q124 365 185 505 M446 225Q515 355 451 504"/><path d="M248 108Q257 29 323 46 Q386 35 408 108"/><path d="M256 97L272 57L307 83L325 37L350 84L389 54L403 100Z"/><ellipse cx="322" cy="190" rx="104" ry="119"/><path d="M250 284L235 344Q144 408 119 560Q316 621 520 560Q501 408 405 346L392 287Z"/><path d="M254 300Q194 312 173 373Q157 405 198 413L247 352 M391 300Q461 314 479 371Q485 400 448 413L401 354"/><path d="M282 184q-12 -17 -25 0 M374 184q-12 -17 -25 0 M305 236Q322 253 342 236" fill="none"/><path d="M224 453Q319 496 421 452 M186 517Q315 558 461 516" fill="none"/>`),
 crown:()=>svgWrap(`<path d="M112 446L83 189L217 283L323 120L430 285L561 185L532 447Z"/><rect x="112" y="439" width="421" height="84" rx="19"/><path d="M321 318L360 361L321 407L283 361Z"/><circle cx="210" cy="377" r="23"/><circle cx="434" cy="377" r="23"/>`),
 flower:()=>svgWrap(`<ellipse cx="317" cy="206" rx="68" ry="111"/><ellipse cx="316" cy="438" rx="68" ry="111"/><ellipse cx="200" cy="318" rx="113" ry="69"/><ellipse cx="432" cy="318" rx="113" ry="69"/><ellipse cx="235" cy="236" rx="91" ry="67" transform="rotate(45 235 236)"/><ellipse cx="400" cy="400" rx="91" ry="67" transform="rotate(45 400 400)"/><ellipse cx="400" cy="236" rx="91" ry="67" transform="rotate(-45 400 236)"/><ellipse cx="235" cy="400" rx="91" ry="67" transform="rotate(-45 235 400)"/><circle cx="317" cy="317" r="68"/>`)
 };
 function loadImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('그림을 열지 못했습니다.'));im.src=src})}
 async function setTemplate(id){remember();outline=null;uc.clearRect(0,0,W,H);pc.clearRect(0,0,W,H);if(id!=='blank')try{const src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(shape[id]());outline=await loadImage(src)}catch(e){alertUser(e.message)}currentId=null;render()}
 $d('dwTemplate').onchange=e=>setTemplate(e.target.value);
 $d('dwBlank').onclick=()=>{if(!confirm('새 도화지를 열까요? 저장하지 않은 그림은 사라집니다.'))return;$d('dwTemplate').value='blank';setTemplate('blank');$d('dwName').value='새 그림'};
 $d('dwLoadImage').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>12*1024*1024){alertUser('12MB 이하 그림을 선택해 주세요.');return}try{const src=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(Error('읽기에 실패했습니다.'));r.readAsDataURL(f)});const im=await loadImage(src);remember();uc.clearRect(0,0,W,H);pc.clearRect(0,0,W,H);const scale=Math.min(570/im.width,570/im.height);uc.drawImage(im,(W-im.width*scale)/2,(H-im.height*scale)/2,im.width*scale,im.height*scale);outline=null;currentId=null;$d('dwName').value=f.name.replace(/\.[^.]+$/,'').slice(0,40);$d('dwTemplate').value='blank';render();alertUser('그림을 가져왔어요. 위에 직접 그려 보세요!')}catch(err){alertUser(err.message)}e.target.value=''};
 function composed(){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(under,0,0);x.drawImage(paint,0,0);if(outline)x.drawImage(outline,0,0,W,H);return c}
 function exportPNG(){return imageDataURL(composed())}
 $d('dwExport').onclick=()=>{const a=document.createElement('a');a.href=exportPNG();a.download=($d('dwName').value.trim()||'내 그림').replace(/[\\/:*?"<>|]/g,'_')+'.png';document.body.appendChild(a);a.click();a.remove();alertUser('PNG 그림 파일을 저장했어요.')};
 const DBNAME='webtoon-child-drawing-workshop-v1',STORE='paintings';
 function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DBNAME,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:'id'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
 async function transaction(mode,action){const db=await openDB();try{return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,mode);const req=action(tx.objectStore(STORE));req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
 async function getAll(){return transaction('readonly',s=>s.getAll())}
 async function save(){const item={id:currentId||('drawing-'+Date.now()+'-'+Math.random().toString(36).slice(2,6)),name:$d('dwName').value.trim()||'내 그림',preview:exportPNG(),under:imageDataURL(under),paint:imageDataURL(paint),outline:outline?outline.src:null,updated:Date.now()};await transaction('readwrite',s=>s.put(item));currentId=item.id;await renderGallery();alertUser('그림을 보관함에 저장했어요!')}
 $d('dwSave').onclick=()=>save().catch(e=>alertUser('저장 실패: '+e.message+' · PNG로도 보관해 주세요.'));
 async function openItem(item){if(!confirm('이 그림을 다시 열까요? 저장하지 않은 작업은 사라집니다.'))return;const [a,b,c]=await Promise.all([loadImage(item.under),loadImage(item.paint),item.outline?loadImage(item.outline):Promise.resolve(null)]);uc.clearRect(0,0,W,H);pc.clearRect(0,0,W,H);uc.drawImage(a,0,0);pc.drawImage(b,0,0);outline=c;currentId=item.id;history=[];redo=[];$d('dwName').value=item.name;$d('dwTemplate').value='blank';render();alertUser('저장한 그림을 다시 열었어요.')}
 async function renderGallery(){const box=$d('dwGallery');box.replaceChildren();let all=[];try{all=(await getAll()).sort((a,b)=>b.updated-a.updated)}catch(e){box.textContent='보관함을 열지 못했습니다. Safari 일반 탭에서 사용해 주세요.';return}if(!all.length){box.textContent='아직 저장한 그림이 없어요. 첫 작품을 만들어 보세요!';return}all.forEach(item=>{const card=document.createElement('div');card.className='dw-card';const pic=new Image();pic.src=item.preview;pic.alt=item.name;card.appendChild(pic);const name=document.createElement('b');name.textContent=item.name;card.appendChild(name);const acts=document.createElement('div');acts.className='actions';const edit=document.createElement('button');edit.type='button';edit.textContent='✏️ 이어 그리기';edit.onclick=()=>openItem(item).catch(e=>alertUser('열기 실패: '+e.message));acts.append(edit);const web=document.createElement('button');web.type='button';web.textContent='🎬 웹툰';web.onclick=()=>sendToWebtoon(item.preview);acts.append(web);const del=document.createElement('button');del.type='button';del.textContent='🗑 삭제';del.onclick=async()=>{if(!confirm('이 그림만 보관함에서 삭제할까요?'))return;await transaction('readwrite',s=>s.delete(item.id));if(currentId===item.id)currentId=null;renderGallery()};acts.append(del);card.append(acts);box.append(card)})}
 function sendToWebtoon(data){try{settings.custom=data;settings.hero='custom';settings.studioPrincess=false;settings.studioRecipe=null;if(typeof renderCharacterChoices==='function')renderCharacterChoices();if(typeof switchView==='function')switchView('make');alertUser('내 그림을 웹툰 주인공으로 선택했어요!')}catch(e){alertUser('웹툰 연결에 실패했습니다: '+e.message)}}
 $d('dwWebtoon').onclick=()=>sendToWebtoon(exportPNG());
 render();renderGallery();
})();
