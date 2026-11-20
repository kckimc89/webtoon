/* C4.5.11 independent one-pose princess decorating workshop.
   Leaves legacy studio, heroes, and drawings untouched. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const canvas=$('fpCanvas'); if(!canvas)return;
const ctx=canvas.getContext('2d');const inkCanvas=document.createElement('canvas');inkCanvas.width=720;inkCanvas.height=840;const inkCtx=inkCanvas.getContext('2d');
const W=720,H=840, KEY='webtoon_fixed_princess_c4511'; // Preserve original IndexedDB and saved works
const clone=o=>JSON.parse(JSON.stringify(o));
const ID=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
let state={id:null,name:'나의 꽃빛공주',items:[],baseVisible:true,hair:'rose',dress:'pink',shoes:'classic',updated:0};
let activeTouches=new Map(),gesture=null,princessVariants={},selected=null,tool='select',color='#ed83ba',lineColor='#b46291',outline=true,penSize=7,pointer=null,history=[],future=[],image=null,loaded=false,db=null;
const validColor=s=>/^#[a-f\d]{6}$/i.test(s||'')?s:'#ed83ba';
function notice(t){$('fpStatus').textContent=t;}
function saveHistory(){history.push(clone(state));if(history.length>35)history.shift();future=[];}
function setTool(t){tool=t;document.querySelectorAll('[data-fp-tool]').forEach(b=>b.classList.toggle('isOn',b.dataset.fpTool===t));canvas.style.cursor=t==='select'?'grab':t==='erase'?'cell':'crosshair';render();}
function getPoint(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};}
function bounds(it){let w=it.w||95,h=it.h||85;return {l:it.x-w/2,t:it.y-h/2,r:it.x+w/2,b:it.y+h/2};}
function hit(it,p){if(it.type==='stroke'){const a=it.points;for(let j=1;j<a.length;j++){let x=a[j-1][0],y=a[j-1][1],dx=a[j][0]-x,dy=a[j][1]-y,t=Math.max(0,Math.min(1,((p.x-x)*dx+(p.y-y)*dy)/(dx*dx+dy*dy||1)));if(Math.hypot(p.x-x-dx*t,p.y-y-dy*t)<Math.max(13,(it.size||7)+7))return true;}return false;}
 const b=bounds(it);const angle=-(it.rotation||0)*Math.PI/180,dx=p.x-it.x,dy=p.y-it.y;const u=dx*Math.cos(angle)-dy*Math.sin(angle),v=dx*Math.sin(angle)+dy*Math.cos(angle);return Math.abs(u)<=(it.w||95)/2+13&&Math.abs(v)<=(it.h||85)/2+13;}
function pick(p){for(let i=state.items.length-1;i>=0;i--){const it=state.items[i];if(it.visible!==false&&!it.locked&&hit(it,p))return it;}return null;}
function itemLabel(it){return it.name||({star:'별',heart:'하트',flower:'꽃',ribbon:'리본',gem:'보석',circle:'원',ellipse:'타원',rect:'네모',bow:'리본',stroke:'손그림'}[it.shape||it.type]||'장식');}
function drawShape(it){const x=it.x,y=it.y,w=it.w||90,h=it.h||90,shape=it.shape;
 ctx.save();ctx.translate(x,y);ctx.rotate((it.rotation||0)*Math.PI/180);ctx.scale(it.flip?-1:1,1);ctx.beginPath();
 const X=-w/2,Y=-h/2;
 if(shape==='circle'||shape==='ellipse')ctx.ellipse(0,0,w/2,h/2,0,0,Math.PI*2);
 else if(shape==='rect')ctx.roundRect(X,Y,w,h,Math.min(15,w/5,h/5));
 else if(shape==='heart'){ctx.moveTo(0,h*.4);ctx.bezierCurveTo(-w*.6,0,-w*.58,-h*.5,-w*.18,-h*.37);ctx.bezierCurveTo(0,-h*.27,0,-h*.24,0,-h*.17);ctx.bezierCurveTo(0,-h*.38,w*.58,-h*.62,w*.49,-h*.06);ctx.bezierCurveTo(w*.45,h*.12,w*.18,h*.34,0,h*.4);}
 else if(shape==='star'){for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=(i%2===0?1:.45);const xx=Math.cos(a)*w*.5*r,yy=Math.sin(a)*h*.5*r;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.closePath();}
 else if(shape==='flower'){for(let i=0;i<7;i++){const a=i*Math.PI*2/7;ctx.moveTo(0,0);ctx.ellipse(Math.cos(a)*w*.24,Math.sin(a)*h*.24,w*.15,h*.25,a+Math.PI/2,0,Math.PI*2);} }
 else if(shape==='ribbon'){ctx.moveTo(-w*.1,-h*.04);ctx.bezierCurveTo(-w*.55,-h*.55,-w*.6,h*.5,-w*.06,h*.09);ctx.bezierCurveTo(-w*.1,h*.45,-w*.27,h*.49,-w*.21,h*.49);ctx.lineTo(0,h*.32);ctx.lineTo(w*.22,h*.49);ctx.lineTo(w*.08,h*.07);ctx.bezierCurveTo(w*.62,h*.49,w*.57,-h*.56,w*.1,-h*.04);ctx.closePath();}
 else if(shape==='gem'){ctx.moveTo(0,-h*.5);ctx.lineTo(w*.47,-h*.18);ctx.lineTo(w*.3,h*.35);ctx.lineTo(0,h*.5);ctx.lineTo(-w*.3,h*.35);ctx.lineTo(-w*.47,-h*.18);ctx.closePath();}
 else {ctx.rect(X,Y,w,h);}
 ctx.fillStyle=it.fill||color;ctx.fill();if(it.outline!==false){ctx.lineWidth=it.lineWidth||3;ctx.strokeStyle=it.stroke||'#b46291';ctx.stroke();}
 if(shape==='flower'){ctx.beginPath();ctx.arc(0,0,Math.min(w,h)*.11,0,Math.PI*2);ctx.fillStyle='#ffe8a1';ctx.fill();}
 if(shape==='gem'){ctx.beginPath();ctx.moveTo(-w*.3,-h*.15);ctx.lineTo(0,h*.33);ctx.lineTo(w*.3,-h*.15);ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=3;ctx.stroke();}
 ctx.restore();}
// Share high quality, embedded illustrated props from the existing webtoon decorator.
// Store stable keys only (not giant base64 images) in the IndexedDB work record.
const premiumNames=['화관','리본장식','장미','보석나비','황금열쇠','수정보석','별지팡이','요정날개','빛가루','무지개','문','책','하트','선물','구름','달','사탕','지도','물고기','풍선','축구공'];
const premiumCache=new Map();
function propSource(key){return typeof premiumPropImages!=='undefined'?premiumPropImages[key]:null;}
function premiumImage(key){
 if(premiumCache.has(key))return premiumCache.get(key);
 const src=propSource(key);if(!src)return null;
 const img=new Image();const entry={img,ready:false,error:false};premiumCache.set(key,entry);
 img.onload=()=>{entry.ready=true;paint();};img.onerror=()=>{entry.error=true;};img.src=src;return entry;
}
function drawPremium(it){
 const entry=premiumImage(it.premiumKey);if(!entry||!entry.ready)return;
 ctx.save();ctx.translate(it.x,it.y);ctx.rotate((it.rotation||0)*Math.PI/180);
 ctx.scale(it.flip?-1:1,1);ctx.globalAlpha=Math.max(0,Math.min(1,it.opacity??1));
 ctx.drawImage(entry.img,-(it.w||115)/2,-(it.h||115)/2,it.w||115,it.h||115);ctx.restore();
}
function setupPremiumGallery(){
 const gallery=$('fpPremiumGallery');if(!gallery)return;
 for(const key of premiumNames){const src=propSource(key);if(!src)continue;
  const btn=document.createElement('button');btn.className='fp-premium-btn';btn.type='button';btn.title=key+' 추가';
  const pic=document.createElement('img');pic.alt='';pic.loading='lazy';pic.src=src;
  const label=document.createElement('span');label.textContent=key;btn.append(pic,label);
  btn.addEventListener('click',()=>addPremium(key));gallery.append(btn);
 }
}
function addPremium(key){
 if(!propSource(key))return notice('이 장식 그림을 찾지 못했어요.');
 saveHistory();const locations={'화관':[360,162,190,115],'리본장식':[402,260,115,90],'장미':[360,510,115,125],'보석나비':[480,400,150,140],'황금열쇠':[460,550,100,155],'수정보석':[360,460,110,110],'별지팡이':[530,490,120,225],'요정날개':[360,390,260,210],'빛가루':[360,355,230,180]};
 const [x,y,w,h]=locations[key]||[W/2+((state.items.length%3)-1)*55,H*.54,135,135];
 const it={id:ID(),type:'premium',premiumKey:key,name:key,x,y,w,h,rotation:0,visible:true,locked:false,opacity:1};
 state.items.push(it);selected=it.id;premiumImage(key);setTool('select');
 notice('💎 '+key+' 장식을 추가했어요. 끌어서 위치를 맞추고 모서리 손잡이로 크기를 바꿔요.');render();
}
function drawStroke(it,c=ctx){if(it.points.length<1)return;c.save();c.globalCompositeOperation=it.erase?'destination-out':'source-over';c.lineCap='round';c.lineJoin='round';c.strokeStyle=it.color||'#d65d9a';c.lineWidth=it.size||7;c.beginPath();it.points.forEach((a,i)=>i?c.lineTo(a[0],a[1]):c.moveTo(a[0],a[1]));if(it.points.length===1){c.lineTo(it.points[0][0]+.01,it.points[0][1]+.01);}c.stroke();c.restore();}
function princessImage(){
 const hair=['rose','gold','violet'].includes(state.hair)?state.hair:'rose';
 const dress=['pink','blue','mint'].includes(state.dress)?state.dress:'pink';
 return princessVariants[hair+'|'+dress] || image;
}
// Coordinates below are native 543×482 of the one-pose artwork, converted by the same
// fit transform as the original. Only small accessory details are composited; the
// original face, pose, hands, dress silhouette and body proportions stay unchanged.
function outfitDetails(draw,x,y,w,h){
 const sx=w/543,sy=h/482;draw.save();draw.translate(x,y);draw.scale(sx,sy);
 const shoe=state.shoes||'classic';
 if(shoe==='ribbon'){
  for(const px of [252,283]){
   draw.fillStyle='#fff1fa';draw.strokeStyle='#b75e92';draw.lineWidth=1.6;
   draw.beginPath();draw.ellipse(px-5,451,7,4,-.35,0,Math.PI*2);draw.ellipse(px+5,451,7,4,.35,0,Math.PI*2);draw.fill();draw.stroke();
   draw.beginPath();draw.arc(px,451,3.5,0,Math.PI*2);draw.fillStyle='#d462ad';draw.fill();
  }
 }else if(shoe==='sparkle'){
  for(const px of [251,281]){
   draw.fillStyle='#fff3a8';draw.strokeStyle='#af7a56';draw.lineWidth=1;
   for(const [a,b] of [[px-4,452],[px+4,448]]){draw.beginPath();for(let k=0;k<8;k++){const ang=k*Math.PI/4-Math.PI/2,rr=k%2?2:5;k?draw.lineTo(a+Math.cos(ang)*rr,b+Math.sin(ang)*rr):draw.moveTo(a+Math.cos(ang)*rr,b+Math.sin(ang)*rr);}draw.closePath();draw.fill();draw.stroke();}
  }
 }
 draw.restore();
}
function syncLooks(){
 for(const b of document.querySelectorAll('[data-fp-look]')){
  const group=b.dataset.fpLook;const val=group==='hair'?(state.hair||'rose'):group==='dress'?(state.dress||'pink'):(state.shoes||'classic');
  b.classList.toggle('isOn',b.dataset.fpValue===val);
  b.setAttribute('aria-pressed',String(b.dataset.fpValue===val));
 }
 const t=$('fpLookNow');if(t)t.textContent='머리 '+({rose:'원래 분홍',gold:'금빛',violet:'보랏빛'}[state.hair]||'원래 분홍')+' · 드레스 '+({pink:'분홍',blue:'하늘',mint:'민트'}[state.dress]||'분홍')+' · 신발 '+({classic:'기본',ribbon:'리본',sparkle:'반짝이'}[state.shoes]||'기본');
}
function paint(forExport=false){ctx.clearRect(0,0,W,H);ctx.fillStyle='#fff9fc';ctx.fillRect(0,0,W,H);
 // Fixed original is always a locked, independent lowest layer.
 if(state.baseVisible&&image&&loaded){const use=princessImage();const capW=620,capH=790;const ratio=Math.min(capW/use.width,capH/use.height);const w=use.width*ratio,h=use.height*ratio;const px=(W-w)/2,py=(H-h)/2;ctx.drawImage(use,px,py,w,h);outfitDetails(ctx,px,py,w,h);}
 for(const it of state.items){if(it.visible===false||it.type==='stroke')continue;if(it.type==='premium')drawPremium(it);else drawShape(it);}
 // Ink stays independent of the original and decorations: the eraser cannot erase the princess.
 inkCtx.clearRect(0,0,W,H);for(const it of state.items){if(it.visible!==false&&it.type==='stroke')drawStroke(it,inkCtx);}ctx.drawImage(inkCanvas,0,0);
 if(!forExport&&tool==='select'&&selected){
  const it=state.items.find(i=>i.id===selected);
  if(it&&it.visible!==false){const b=it.type==='stroke'?strokeBounds(it):bounds(it);
   ctx.save();ctx.strokeStyle='#7950b5';ctx.lineWidth=2.5;ctx.setLineDash([8,5]);
   if(it.type!=='stroke'){
    ctx.translate(it.x,it.y);ctx.rotate((it.rotation||0)*Math.PI/180);
    const hw=(it.w||95)/2+7,hh=(it.h||85)/2+7;
    ctx.strokeRect(-hw,-hh,2*hw,2*hh);ctx.setLineDash([]);
    // Corner handles scale proportionally; diamond handle rotates. Gesture also works.
    for(const [x,y] of [[-hw,-hh],[hw,-hh],[-hw,hh],[hw,hh]]){
     ctx.fillStyle='#fff';ctx.strokeStyle='#7950b5';ctx.fillRect(x-9,y-9,18,18);ctx.strokeRect(x-9,y-9,18,18);
    }
    ctx.strokeStyle='#7950b5';ctx.beginPath();ctx.moveTo(0,-hh);ctx.lineTo(0,-hh-35);ctx.stroke();
    ctx.beginPath();ctx.arc(0,-hh-43,12,0,2*Math.PI);ctx.fillStyle='#fff3be';ctx.fill();ctx.stroke();
   }else{ctx.strokeRect(b.l-8,b.t-8,b.r-b.l+16,b.b-b.t+16);}
   ctx.restore();
  }
 }
}
function getItemHandle(it,p){
 if(!it||it.type==='stroke')return null;
 const a=(it.rotation||0)*Math.PI/180,dx=p.x-it.x,dy=p.y-it.y;
 const u=dx*Math.cos(a)+dy*Math.sin(a),v=-dx*Math.sin(a)+dy*Math.cos(a);
 const hw=(it.w||95)/2+7,hh=(it.h||85)/2+7;
 if(Math.hypot(u,v+hh+43)<25)return 'rotate';
 if(Math.abs(Math.abs(u)-hw)<24&&Math.abs(Math.abs(v)-hh)<24)return 'scale';
 return null;
}

function strokeBounds(it){const x=it.points.map(p=>p[0]),y=it.points.map(p=>p[1]);return {l:Math.min(...x),r:Math.max(...x),t:Math.min(...y),b:Math.max(...y)};}
function render(){paint();renderLayers();syncSelected();syncLooks();}
function renderLayers(){const node=$('fpLayers');node.replaceChildren();const base=document.createElement('div');base.className='fp-layer';base.innerHTML=`<strong>👑 꽃빛공주 원화</strong><span class="fp-sub">기본 잠금 · 한 가지 표정/자세</span>`;
 const bt=document.createElement('button');bt.textContent=state.baseVisible?'숨기기':'보기';bt.onclick=()=>{saveHistory();state.baseVisible=!state.baseVisible;render();};base.append(bt);node.append(base);
 for(const it of [...state.items].reverse()){const row=document.createElement('div');row.className='fp-layer'+(selected===it.id?' selected':'');let nm=document.createElement('strong');nm.textContent=(it.type==='stroke'?'✏️ ':'💎 ')+itemLabel(it);row.append(nm);
 for(const [caption,fn] of [[it.visible===false?'보기':'숨기기',()=>{saveHistory();it.visible=it.visible===false?true:false;}],[it.locked?'풀기':'잠그기',()=>{saveHistory();it.locked=!it.locked;}],['지우기',()=>{if(!confirm('이 그림 층만 지울까요? 다른 그림은 그대로예요.'))return;saveHistory();state.items=state.items.filter(a=>a.id!==it.id);if(selected===it.id)selected=null;}]]){const btn=document.createElement('button');btn.textContent=caption;btn.onclick=()=>{fn();render();};row.append(btn);}nm.onclick=()=>{selected=it.id;setTool('select');render();};node.append(row);}
}
function syncSelected(){const it=state.items.find(i=>i.id===selected);$('fpSelected').textContent=it?'선택: '+itemLabel(it):'장식을 선택하거나 그림 층에서 골라 주세요';$('fpEdit').hidden=!it;const isPremium=it?.type==='premium';const colorRow=document.querySelector('#fpEdit .fp-color-edit');if(colorRow)colorRow.hidden=!!isPremium;$('fpFill').value=it?.fill||color;$('fpLine').value=it?.stroke||lineColor;$('fpOutline').checked=it?.outline!==false;$('fpAngle').value=it?.rotation||0;const tools=$('fpQuickEdit');if(tools)tools.hidden=!it||it.type==='stroke';}
function addShape(shape){saveHistory();const names={star:'별',heart:'하트',flower:'꽃',ribbon:'리본',gem:'보석',circle:'원',ellipse:'타원',rect:'네모'};let it={id:ID(),type:'shape',shape,name:names[shape]||shape,x:W/2+((state.items.length%3)-1)*38,y:H*.54,w:shape==='ribbon'?130:100,h:shape==='ribbon'?85:100,fill:color,stroke:lineColor,outline,rotation:0,visible:true,locked:false};state.items.push(it);selected=it.id;setTool('select');notice('추가했어요. 그림을 끌어서 위치를 바꾸세요.');render();}
// Match webtoon decoration: drag to move, corner to resize, round handle to rotate,
// two fingers to resize / rotate / move together, with separate undo history.
canvas.addEventListener('pointerdown',e=>{
 e.preventDefault();canvas.setPointerCapture(e.pointerId);const p=getPoint(e);
 activeTouches.set(e.pointerId,p);
 if(tool==='draw'||tool==='erase'){
  if(activeTouches.size>1)return;
  saveHistory();const it={id:ID(),type:'stroke',name:'손그림',color,erase:tool==='erase',size:tool==='erase'?penSize*3:penSize,points:[[p.x,p.y]],visible:true,locked:false};
  state.items.push(it);pointer={kind:'stroke',id:it.id,pointerId:e.pointerId};paint();return;
 }
 if(activeTouches.size===2){
  const it=state.items.find(i=>i.id===selected&&!i.locked&&i.visible!==false);
  if(it&&it.type!=='stroke'){
   const [a,b]=[...activeTouches.values()],dist=Math.hypot(b.x-a.x,b.y-a.y);
   gesture={id:it.id,w:it.w,h:it.h,rotation:it.rotation||0,x:it.x,y:it.y,
    cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,dist:Math.max(1,dist),angle:Math.atan2(b.y-a.y,b.x-a.x)};
   pointer=null;
  }
  return;
 }
 const current=state.items.find(i=>i.id===selected&&!i.locked&&i.visible!==false);
 const handle=getItemHandle(current,p);
 const it=handle?current:pick(p);
 selected=it?.id||null;
 if(it){saveHistory();pointer={kind:handle||'move',id:it.id,pointerId:e.pointerId,start:p,
  x:it.x,y:it.y,w:it.w,h:it.h,rotation:it.rotation||0,
  radius:Math.max(1,Math.hypot(p.x-it.x,p.y-it.y)),
  angle:Math.atan2(p.y-it.y,p.x-it.x)};}
 else pointer=null;
 render();
});
canvas.addEventListener('pointermove',e=>{
 if(!activeTouches.has(e.pointerId))return;
 e.preventDefault();const p=getPoint(e);activeTouches.set(e.pointerId,p);
 if(gesture&&activeTouches.size>=2){
  const it=state.items.find(i=>i.id===gesture.id);if(!it)return;
  const [a,b]=[...activeTouches.values()],dist=Math.hypot(b.x-a.x,b.y-a.y);
  const ratio=Math.max(.1,Math.min(8,dist/gesture.dist));
  it.w=Math.max(20,Math.min(620,gesture.w*ratio));it.h=Math.max(20,Math.min(720,gesture.h*ratio));
  it.rotation=gesture.rotation+(Math.atan2(b.y-a.y,b.x-a.x)-gesture.angle)*180/Math.PI;
  it.x=Math.max(0,Math.min(W,gesture.x+(a.x+b.x)/2-gesture.cx));
  it.y=Math.max(0,Math.min(H,gesture.y+(a.y+b.y)/2-gesture.cy));
  paint();return;
 }
 if(!pointer||pointer.pointerId!==e.pointerId)return;
 const it=state.items.find(i=>i.id===pointer.id);if(!it)return;
 if(pointer.kind==='stroke')it.points.push([p.x,p.y]);
 else if(pointer.kind==='move'){
  if(it.type==='stroke'){
   const dx=p.x-pointer.start.x,dy=p.y-pointer.start.y;
   if(!pointer.original)pointer.original=clone(it.points);
   it.points=pointer.original.map(a=>[a[0]+dx,a[1]+dy]);
  }else{it.x=Math.max(0,Math.min(W,pointer.x+p.x-pointer.start.x));it.y=Math.max(0,Math.min(H,pointer.y+p.y-pointer.start.y));}
 }else if(pointer.kind==='scale'){
  const r=Math.max(.15,Math.min(7,Math.hypot(p.x-it.x,p.y-it.y)/pointer.radius));
  it.w=Math.max(20,Math.min(620,pointer.w*r));it.h=Math.max(20,Math.min(720,pointer.h*r));
 }else if(pointer.kind==='rotate'){
  it.rotation=pointer.rotation+(Math.atan2(p.y-it.y,p.x-it.x)-pointer.angle)*180/Math.PI;
 }
 paint();
});
function pointerEnd(e){activeTouches.delete(e.pointerId);if(activeTouches.size<2)gesture=null;
 if(pointer&&pointer.pointerId===e.pointerId)pointer=null;
 render();
}
canvas.addEventListener('pointerup',pointerEnd);canvas.addEventListener('pointercancel',pointerEnd);
function selectedEdit(fn){const it=state.items.find(i=>i.id===selected);if(!it)return;if(it.locked){notice('잠겨 있어요. 그림 층에서 풀어 주세요.');return;}saveHistory();fn(it);render();}
function selectedSize(mult){selectedEdit(it=>{
 if(it.type==='stroke')return;
 it.w=Math.max(20,Math.min(620,(it.w||100)*mult));it.h=Math.max(20,Math.min(720,(it.h||100)*mult));
});}
function selectedRotate(delta){selectedEdit(it=>{if(it.type!=='stroke')it.rotation=((it.rotation||0)+delta)%360;});}
$('fpGrow')?.addEventListener('click',()=>selectedSize(1.15));
$('fpShrink')?.addEventListener('click',()=>selectedSize(1/1.15));
$('fpTurnLeft')?.addEventListener('click',()=>selectedRotate(-15));
$('fpTurnRight')?.addEventListener('click',()=>selectedRotate(15));
$('fpDeselect')?.addEventListener('click',()=>{selected=null;render();});
function read(){return new Promise((resolve,reject)=>{try{const req=indexedDB.open(KEY,1);req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains('works'))d.createObjectStore('works',{keyPath:'id'});};req.onsuccess=()=>{db=req.result;resolve(db)};req.onerror=()=>reject(req.error);}catch(e){reject(e)}});}
function store(mode,obj){return new Promise((res,rej)=>{const tx=db.transaction('works',mode);const req=mode==='readonly'?tx.objectStore('works').getAll():obj===null?tx.objectStore('works').clear():tx.objectStore('works').put(obj);req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error);});}
async function refreshWorks(){const el=$('fpWorks');el.replaceChildren();try{const rows=(await store('readonly')).sort((a,b)=>(b.updated||0)-(a.updated||0));if(!rows.length){el.textContent='아직 저장한 공주가 없어요.';return;}for(const w of rows){const card=document.createElement('div');card.className='fp-work';const text=document.createElement('span');text.textContent='👑 '+w.name+' · '+new Date(w.updated).toLocaleDateString('ko-KR');card.append(text);const open=document.createElement('button');open.textContent='이어서 꾸미기';open.onclick=()=>{state=clone(w);selected=null;history=[];future=[];$('fpName').value=state.name;render();notice('저장한 공주를 다시 열었어요.');};card.append(open);const del=document.createElement('button');del.textContent='지우기';del.onclick=async()=>{if(!confirm('이 공주 작품을 보관함에서 지울까요?'))return;await new Promise((res,rej)=>{const t=db.transaction('works','readwrite');const req=t.objectStore('works').delete(w.id);req.onsuccess=res;req.onerror=rej});await refreshWorks();};card.append(del);el.append(card);}}catch(e){notice('보관함을 열지 못했어요: '+e.message);}}
async function save(){try{state.name=$('fpName').value.trim()||'나의 꽃빛공주';state.id=state.id||ID();state.updated=Date.now();await store('readwrite',clone(state));notice('💖 공주를 보관함에 저장했어요! PNG 다운로드는 필요하지 않아요.');await refreshWorks();}catch(e){notice('저장에 실패했어요: '+(e.message||e));}}
function exportPng(){paint(true);canvas.toBlob(blob=>{if(!blob){notice('PNG 생성 실패');return;}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=(state.name||'꽃빛공주').replace(/[\\/:*?"<>|]/g,'_')+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);paint();notice('PNG 파일로 내보냈어요.');},'image/png');}
function initImage(){try{let src=typeof studioRoseExpressionAssets!=='undefined'&&studioRoseExpressionAssets['기뻐요'];if(!src&&typeof roseAssetFor==='function')src=roseAssetFor({baseModel:'rose3d',hairColor:'rose',dress:'pink',roseHairShape:'normal',roseDressShape:'normal',roseStableHands:true},'기뻐요');if(!src){notice('꽃빛공주 원화를 불러올 수 없습니다.');return;}image=new Image();image.onload=()=>{loaded=true;render();notice('꽃빛공주 원화가 준비되었어요. 장식이나 펜으로 꾸며 보세요!');};image.onerror=()=>notice('꽃빛공주 원화 불러오기 오류');image.src=src;
 // Reuse the same original artist's pre-existing color-variant artwork. Do not
 // generate unrelated faces, and do not require new remote assets.
 const variants=typeof studioRoseColorAssets!=='undefined'?studioRoseColorAssets:{};
 for(const hair of ['rose','gold','violet'])for(const dress of ['pink','blue','mint']){
  const key=hair+'|'+dress;const url=variants['기뻐요|'+hair+'|'+dress]||(hair==='rose'&&dress==='pink'?src:null);
  if(!url)continue;const pic=new Image();pic.onload=()=>{princessVariants[key]=pic;render();};pic.src=url;
 }
 }catch(e){notice('공주 그림 오류: '+e.message);}}

// One fixed expression and pose. Outfit choice is not a movable drawing layer:
// it is independently stored in the same work record so ornaments and ink remain.
for(const b of document.querySelectorAll('[data-fp-look]')){
 b.onclick=()=>{
  const group=b.dataset.fpLook, value=b.dataset.fpValue;
  const allowed={hair:['rose','gold','violet'],dress:['pink','blue','mint'],shoes:['classic','ribbon','sparkle']};
  if(!allowed[group]?.includes(value))return;
  if((state[group]||allowed[group][0])===value)return;
  saveHistory();state[group]=value;render();notice('공주의 '+({hair:'머리',dress:'드레스',shoes:'신발'}[group])+' 스타일을 바꾸었어요!');
 };
}
$('fpResetLooks').onclick=()=>{saveHistory();state.hair='rose';state.dress='pink';state.shoes='classic';render();notice('기본 모습으로 돌아왔어요. 장식과 손그림은 그대로예요.');};
$('fpName').oninput=()=>{state.name=$('fpName').value;};$('fpColor').oninput=e=>{color=validColor(e.target.value);};$('fpPenSize').oninput=e=>{penSize=Number(e.target.value);$('fpPenLabel').textContent=penSize+'px';};
document.querySelectorAll('[data-fp-tool]').forEach(btn=>btn.onclick=()=>setTool(btn.dataset.fpTool));
document.querySelectorAll('[data-fp-shape]').forEach(btn=>btn.onclick=()=>addShape(btn.dataset.fpShape));setupPremiumGallery();
$('fpFill').oninput=e=>selectedEdit(it=>it.fill=e.target.value);$('fpLine').oninput=e=>selectedEdit(it=>it.stroke=e.target.value);$('fpOutline').onchange=e=>selectedEdit(it=>it.outline=e.target.checked);$('fpAngle').oninput=e=>selectedEdit(it=>it.rotation=Number(e.target.value));
$('fpFlip').onclick=()=>selectedEdit(it=>it.flip=!it.flip);$('fpCopy').onclick=()=>selectedEdit(it=>{const c=clone(it);c.id=ID();c.x=(c.x||W/2)+28;c.y=(c.y||H/2)+28;if(c.type==='stroke')c.points=c.points.map(p=>[p[0]+28,p[1]+28]);state.items.push(c);selected=c.id;});
$('fpForward').onclick=()=>selectedEdit(it=>{state.items=state.items.filter(a=>a.id!==it.id);state.items.push(it);});$('fpBack').onclick=()=>selectedEdit(it=>{state.items=state.items.filter(a=>a.id!==it.id);state.items.unshift(it);});
$('fpDelete').onclick=()=>{if(!selected||!confirm('선택한 장식만 지울까요?'))return;selectedEdit(it=>{state.items=state.items.filter(a=>a.id!==it.id);selected=null;});};
$('fpUndo').onclick=()=>{if(!history.length)return;future.push(clone(state));state=history.pop();selected=null;render();};$('fpRedo').onclick=()=>{if(!future.length)return;history.push(clone(state));state=future.pop();selected=null;render();};
$('fpSave').onclick=save;$('fpExport').onclick=exportPng;$('fpNew').onclick=()=>{if(!confirm('새 공주 꾸미기를 시작할까요? 지금 작업을 저장했다면 보관함에 남아 있어요.'))return;state={id:null,name:'나의 꽃빛공주',items:[],baseVisible:true,hair:'rose',dress:'pink',shoes:'classic',updated:0};$('fpName').value=state.name;selected=null;history=[];future=[];render();};
$('fpOriginal').onclick=()=>{saveHistory();state.baseVisible=!state.baseVisible;render();};
read().then(refreshWorks).catch(e=>notice('기기 보관함을 사용할 수 없어요: '+e.message));initImage();setTool('select');
})();
