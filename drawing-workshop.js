/* C4.5.36.4.3 | Protect iPad canvas selection, real front layer, focused zoom. */
(()=>{'use strict';
const $=id=>document.getElementById(id),W=640,H=640,C=$('dwCanvas');if(!C)return;
const X=C.getContext('2d',{willReadFrequently:true});C.width=1280;C.height=1280;X.setTransform(2,0,0,2,0,0);X.imageSmoothingEnabled=true;X.imageSmoothingQuality='high';
const cv=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c},paint=cv(),under=cv(),stage=cv();
// Lightweight live-ink surface. Pencil strokes are drawn at once, independently of
// the 1280px scene (which is repainted only when the stroke finishes).
const live=cv();live.id='dwLiveInk';live.setAttribute('aria-hidden','true');
Object.assign(live.style,{position:'absolute',left:'0',top:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'1'});
C.parentElement.appendChild(live);const L=live.getContext('2d');
function clearLive(){L.clearRect(0,0,W,H)}
const P=paint.getContext('2d',{willReadFrequently:true}),U=under.getContext('2d',{willReadFrequently:true}),S=stage.getContext('2d',{willReadFrequently:true});
// Cache the 2x-resolution scenery once per stroke; do not redraw every princess on every Pencil point.
const inkBackdrop=document.createElement('canvas');inkBackdrop.width=1280;inkBackdrop.height=1280;
const B=inkBackdrop.getContext('2d');B.setTransform(2,0,0,2,0,0);
let inkFrame=0,inkCacheReady=false;
function prepareInk(){B.clearRect(0,0,W,H);if($('dwShowBackground').checked){B.fillStyle='#fff';B.fillRect(0,0,W,H)}B.drawImage(under,0,0);els.forEach(e=>{if(e.visible!==false&&!e.aboveInk)drawEl(B,e)});inkCacheReady=true}
function drawInkFrame(){inkFrame=0;if(!inkCacheReady)return;X.save();X.setTransform(1,0,0,1,0,0);X.clearRect(0,0,C.width,C.height);X.drawImage(inkBackdrop,0,0);X.drawImage(paint,0,0,C.width,C.height);X.restore();X.save();X.setTransform(2,0,0,2,0,0);els.forEach(e=>{if(e.visible!==false&&e.aboveInk)drawEl(X,e)});X.restore()}
function scheduleInk(){if(tool==='eraser'&&!inkFrame)inkFrame=requestAnimationFrame(drawInkFrame)}
function stopInk(){if(inkFrame){cancelAnimationFrame(inkFrame);inkFrame=0}inkCacheReady=false;clearLive()}
let els=[],sel=null,cache=new Map(),tool='pen',ink='#d76eab',thick=11,drag=null,active=null,last=null,currentId=null,history=[],redo=[];
let cutoutEdit=null;
const touchPoints=new Map();let gesture=null;
// Character extraction is only enabled inside the comic editor, never in free drawing.
let comicSelectBox=null;const comicGuide=cv();comicGuide.id='dwComicSelectionGuide';comicGuide.setAttribute('aria-hidden','true');Object.assign(comicGuide.style,{position:'absolute',left:'0',top:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'2'});C.parentElement.appendChild(comicGuide);const CG=comicGuide.getContext('2d');
function clearComicGuide(){CG.clearRect(0,0,W,H)}
function showComicGuide(){
 clearComicGuide();if(!comicSelectBox)return;
 CG.strokeStyle='#7b39bc';CG.lineWidth=3;CG.setLineDash([9,5]);
 if(comicSelectBox.mode==='lasso'){
  const points=comicSelectBox.points;if(!points.length)return;
  CG.beginPath();CG.moveTo(points[0].x,points[0].y);
  points.slice(1).forEach(p=>CG.lineTo(p.x,p.y));
  if(points.length>2){CG.lineTo(points[0].x,points[0].y);CG.fillStyle='rgba(176,115,226,.13)';CG.fill()}
  CG.stroke();CG.setLineDash([]);
  CG.beginPath();CG.arc(points[0].x,points[0].y,5,0,Math.PI*2);CG.fillStyle='#7936ac';CG.fill();
 }else{
  const a=comicSelectBox.start,b=comicSelectBox.end;
  CG.strokeRect(Math.min(a.x,b.x),Math.min(a.y,b.y),Math.abs(a.x-b.x),Math.abs(a.y-b.y));CG.setLineDash([])
 }
}
let activePointerType=null,lastPencilAt=0,lastPointerActivity=0;
const emotions=['기뻐요','놀랐어요','슬퍼요','화났어요','생각해요','신나요'];
const names={'princess_strawberry':'🍓 딸기공주','princess_emerald':'💚 에메랄드공주','princess_starlight':'🌙 달빛요정','princess_pearl':'🤍 진주공주','princess_bob_story':'🌷 단발머리공주','princess_flower':'🌺 꽃공주','princess_moon':'🌙 달빛공주','princess_rainbow':'🌈 무지개공주','princess_fairy':'🧚 반짝이요정','princess_sea':'🌊 바다공주','princess_snow':'❄️ 눈꽃공주','dog':'🐶 몽이','cat':'🐱 루루','rabbit':'🐰 보송이','fairy':'🧚 요정'};
const shapeNames={circle:'원',ellipse:'타원',rect:'네모',round:'둥근네모',triangle:'세모',star:'별',heart:'하트',cloud:'구름',bubble:'말풍선'};
const HQ={'princess_fairy|신나요':'hq-princess-fairy-excited.png','princess_strawberry|기뻐요':'hq-princess-strawberry-happy.png','princess_flower|기뻐요':'hq-princess-flower-happy.png'};
const eId=()=>`layer-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,clone=o=>JSON.parse(JSON.stringify(o));
function msg(t){if(typeof toast==='function')toast(t);else alert(t)}
function imload(src){return new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(new Error('그림 파일을 열 수 없어요'));i.src=src})}
async function ensureDrawingHeroArt(id){if(!id||!window.webtoonEnsureArt)return; if(id==='fairy')await window.webtoonEnsureArt(['animal']);else if(id.startsWith('princess_')&&id!=='princess_bob_story')await window.webtoonEnsureArt(['princess']);}
function heroSrc(id,emotion){if(HQ[id+'|'+emotion])return HQ[id+'|'+emotion];try{if(['dog','cat','rabbit','fairy'].includes(id))return friendImageSource(id,emotion);if(id==='princess_bob_story')return 'bob-'+({기뻐요:'happy',놀랐어요:'surprised',슬퍼요:'sad',화났어요:'angry',생각해요:'thinking',신나요:'excited'}[emotion]||'happy')+'.png';if(typeof dedicatedFullBodyExpressions!=='undefined'&&dedicatedFullBodyExpressions[id]?.[emotion])return dedicatedFullBodyExpressions[id][emotion];
// For costume princesses, original base artwork is high resolution; never use its thumbnail.
// If there is no separate expression, use the existing full original (do not fabricate one).
if(typeof premiumPrincessImages!=='undefined'&&premiumPrincessImages[id]?.base)return premiumPrincessImages[id].base;
const hero=heroes.find(q=>q.id===id);return hero?princessThumb(hero):null}catch(e){console.warn(e);return null}}
function propSrc(key){try{return typeof premiumPropImages!=='undefined'?premiumPropImages[key]:null}catch(e){return null}}
function layerName(e){if(e.premiumKey)return '💎 '+e.premiumKey;if(e.origin)return (names[e.origin]||'주인공')+' · '+(e.expression||'기뻐요');if(e.kind==='shape')return (shapeNames[e.shape]||'도형')+' 도형';return e.comicCutout?'🎨 내가 그린 주인공':e.template?'연습 밑그림':'가져온 그림'}
function activeCutoutElement(){const e=selected();return e&&e.kind==='image'&&e.comicCutout?e:null}
function syncCutoutElement(){
 if(!cutoutEdit)return;
 const e=els.find(q=>q.id===cutoutEdit.id);
 if(!e)return;
 e.src=cutoutEdit.canvas.toDataURL('image/png');
 e.origin=null;e.premiumKey=null;e.template=null;
 cache.set(e.id,cutoutEdit.canvas);
}
function stopCutoutEdit(announce){
 if(!cutoutEdit)return;
 syncCutoutElement();cutoutEdit=null;
 comicEditUi();
 if(announce)msg('주인공 부분 수정을 마쳤어요. 이제 이동하거나 다음 컷으로 이어 갈 수 있어요.');
}
async function startCutoutEdit(){
 if(!comic){msg('먼저 내 그림으로 웹툰 만들기를 시작해 주세요.');return}
 const e=activeCutoutElement();
 if(!e){msg('먼저 오려낸 주인공을 하나 선택해 주세요.');return}
 const existing=cache.get(e.id)||await imload(e.src);
 const base=document.createElement('canvas');
 base.width=Math.max(1,Math.round(existing.naturalWidth||existing.width||e.w||1));
 base.height=Math.max(1,Math.round(existing.naturalHeight||existing.height||e.h||1));
 base.getContext('2d',{willReadFrequently:true}).drawImage(existing,0,0,base.width,base.height);
 cutoutEdit={id:e.id,canvas:base,ctx:base.getContext('2d',{willReadFrequently:true})};
 cache.set(e.id,base);syncCutoutElement();setMode('pen');comicEditUi();render();
 msg('선택한 주인공만 부분 수정할 수 있어요. 위쪽의 연필·붓·지우개를 골라서 고쳐 보세요.');
}
function editingCutout(){return !!(cutoutEdit&&['pen','brush','eraser'].includes(tool)&&els.some(q=>q.id===cutoutEdit.id))}
function drawOnCutout(a,b){
 if(!cutoutEdit)return false;
 const e=els.find(q=>q.id===cutoutEdit.id);
 if(!e)return false;
 const g=cutoutEdit.ctx,iw=cutoutEdit.canvas.width,ih=cutoutEdit.canvas.height;
 const la=localPt(e,a),lb=localPt(e,b);
 const ax=(la.x/Math.max(1,e.w)+0.5)*iw, ay=(la.y/Math.max(1,e.h)+0.5)*ih;
 const bx=(lb.x/Math.max(1,e.w)+0.5)*iw, by=(lb.y/Math.max(1,e.h)+0.5)*ih;
 const baseWidth=tool==='brush'?thick*1.8:thick;
 const scale=((iw/Math.max(1,e.w))+(ih/Math.max(1,e.h)))/2;
 const width=Math.max(1,baseWidth*scale);
 g.save();g.globalCompositeOperation=tool==='eraser'?'destination-out':'source-over';
 g.lineWidth=width;g.strokeStyle=ink;g.fillStyle=ink;g.lineCap='round';g.lineJoin='round';
 g.beginPath();g.moveTo(ax,ay);g.lineTo(bx,by);g.stroke();
 if(ax===bx&&ay===by){g.beginPath();g.arc(ax,ay,width/2,0,Math.PI*2);g.fill()}
 g.restore();
 cache.set(e.id,cutoutEdit.canvas);scheduleObjectRender();
 return true;
}
function comicEditUi(){
 if(cutoutEdit){const chosen=selected();if(!chosen||chosen.id!==cutoutEdit.id){syncCutoutElement();cutoutEdit=null;}}
 const editBtn=$('dwComicEditCharacter'),doneBtn=$('dwComicEditDone'),status=$('dwComicEditStatus');
 const chosen=activeCutoutElement();
 if(editBtn)editBtn.disabled=!chosen;
 if(doneBtn)doneBtn.hidden=!cutoutEdit;
 if(status)status.textContent=cutoutEdit?'선택한 주인공만 부분 수정 중이에요. 연필·붓·지우개로 일부를 고치고, 다 되면 수정 끝내기를 눌러 주세요.':(chosen?'선택한 주인공을 부분 수정할 수 있어요. 「주인공 부분 수정」을 눌러 보세요.':'오려낸 주인공을 먼저 선택하면 부분 수정할 수 있어요.');
}
function shapePath(c,e){c.beginPath();const w=e.w,h=e.h,t=e.shape;if(t==='circle'||t==='ellipse'){c.ellipse(0,0,w/2,h/2,0,0,Math.PI*2);return}if(t==='rect'){c.rect(-w/2,-h/2,w,h);return}if(t==='round'){c.roundRect(-w/2,-h/2,w,h,Math.min(24,w/5,h/5));return}let pts=[];if(t==='triangle')pts=[[0,-.55],[.55,.5],[-.55,.5]];else if(t==='star'){for(let i=0;i<10;i++){let a=i*Math.PI/5-Math.PI/2,r=i%2?.23:.52;pts.push([r*Math.cos(a),r*Math.sin(a)])}}else if(t==='heart'){for(let i=0;i<=90;i++){let a=i*Math.PI*2/90;pts.push([16*Math.sin(a)**3/38,-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))/38])}}else if(t==='cloud')pts=[[-.47,.3],[-.53,.06],[-.37,-.13],[-.18,-.13],[-.12,-.38],[.14,-.42],[.35,-.2],[.48,-.16],[.59,.08],[.47,.3]];else if(t==='bubble')pts=[[-.52,-.38],[.51,-.38],[.51,.25],[.05,.25],[-.2,.52],[-.18,.25],[-.52,.25]];if(pts.length){c.moveTo(pts[0][0]*w,pts[0][1]*h);pts.slice(1).forEach(p=>c.lineTo(p[0]*w,p[1]*h));c.closePath()}}
function drawBubbleLetters(c,e){
 const text=String(e.text||'').trim();if(!text)return;
 const maxW=Math.max(30,e.w*.77),maxH=Math.max(25,e.h*.59);
 let font=Math.min(34,Math.max(12,e.w/8)),lines=[];
 function wrap(){lines=[];for(const paragraph of text.split('\n')){let line='';for(const ch of paragraph){if(c.measureText(line+ch).width>maxW&&line){lines.push(line);line=ch}else line+=ch}lines.push(line)} }
 do{c.font=`bold ${Math.floor(font)}px sans-serif`;wrap();if(lines.length*font*1.23<=maxH)break;font-=2}while(font>11);
 c.save();c.beginPath();c.rect(-maxW/2,-e.h*.30,maxW,maxH);c.clip();c.fillStyle='#282235';c.textAlign='center';c.textBaseline='middle';c.font=`bold ${Math.floor(font)}px sans-serif`;
 const gap=font*1.22,top=-(lines.length-1)*gap/2-e.h*.055;lines.forEach((line,i)=>c.fillText(line,0,top+i*gap,maxW));c.restore();
}
function drawEl(c,e){c.save();c.globalAlpha=e.opacity??1;c.translate(e.x,e.y);c.rotate(e.rotation||0);c.scale(e.flip?-1:1,1);if(e.kind==='shape'){shapePath(c,e);if(e.fill!==null){c.fillStyle=e.fill||'#e6a5d5';c.fill()}if(e.stroke!==null){c.strokeStyle=e.stroke||'#805b96';c.lineWidth=5;c.stroke()}if(e.shape==='bubble'&&e.text){drawBubbleLetters(c,e)}}else{const im=cache.get(e.id);if(im){c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(im,-e.w/2,-e.h/2,e.w,e.h)}}c.restore()}
function compose(c,white=false){c.clearRect(0,0,W,H);if(white){c.fillStyle='white';c.fillRect(0,0,W,H)}c.drawImage(under,0,0);els.forEach(e=>{if(e.visible!==false&&!e.aboveInk)drawEl(c,e)});c.drawImage(paint,0,0);els.forEach(e=>{if(e.visible!==false&&e.aboveInk)drawEl(c,e)})}
function selected(){return els.find(e=>e.id===sel)}
function setMode(mode){resetPointerState();tool=mode;document.querySelectorAll('[data-dw-tool]').forEach(b=>b.classList.toggle('active',b.dataset.dwTool===mode));render()}
function listLayers(){const root=$('dwLayerList');root.replaceChildren();if(!els.length){root.textContent='그림을 추가하면 이곳에서 각각 선택할 수 있어요.';return}for(const e of [...els].reverse()){
 const row=document.createElement('div');row.className='dw-layer-row'+(sel===e.id?' selected':'');const nm=document.createElement('button');nm.type='button';nm.className='dw-layer-name';nm.textContent=layerName(e);nm.onclick=()=>{sel=e.id;setMode('select')};row.append(nm);
 const add=(label,act)=>{const b=document.createElement('button');b.type='button';b.className='dw-layer-action';b.textContent=label;b.onclick=act;row.append(b)};
 add(e.visible===false?'보기':'숨기기',()=>{remember();e.visible=e.visible===false;render()});add(e.locked?'풀기':'잠그기',()=>{remember();e.locked=!e.locked;render()});add('앞으로',()=>{sel=e.id;order(1)});add('뒤로',()=>{sel=e.id;order(-1)});add('지우기',()=>remove(e.id));root.append(row)
 }}
function showFloating(e){const f=$('dwFloating');if(!f)return;f.hidden=!(e&&tool==='select');if(!e||tool!=='select')return;$('dwFloatingName').textContent=layerName(e)}
function paintFinishedStroke(){
 // A Pencil lift must not synchronously rebuild the layer list / every editor control.
 // Use one 1280px composition for the artwork; only selection edits need full UI.
 if(!document.hidden)compose(X,$('dwShowBackground').checked);
}
function render(){stopInk();compose(X,$('dwShowBackground').checked);const e=selected();if(e&&tool==='select'){
 X.save();X.translate(e.x,e.y);X.rotate(e.rotation||0);X.strokeStyle='#7047ad';X.lineWidth=2;X.setLineDash([7,5]);X.strokeRect(-e.w/2-4,-e.h/2-4,e.w+8,e.h+8);X.setLineDash([]);
 const dots=[[-e.w/2,-e.h/2],[e.w/2,-e.h/2],[-e.w/2,e.h/2],[e.w/2,e.h/2]];dots.forEach(([x,y])=>{X.fillStyle='white';X.strokeStyle='#8052bb';X.lineWidth=3;X.beginPath();X.arc(x,y,9,0,2*Math.PI);X.fill();X.stroke()});X.beginPath();X.moveTo(0,-e.h/2);X.lineTo(0,-e.h/2-35);X.stroke();X.beginPath();X.arc(0,-e.h/2-35,11,0,2*Math.PI);X.fillStyle='#f7eafb';X.fill();X.stroke();X.restore();}
 showFloating(e);const detail=$('dwObjectDetails');detail.hidden=!(e&&tool==='select'&&(e.kind==='shape'||e.origin));$('dwObjectControls').hidden=detail.hidden;if(e){$('dwShapeStyling').hidden=e.kind!=='shape';$('dwHeroStyling').hidden=!e.origin;if(e.kind==='shape'){$('dwObjectColor').value=e.fill||'#d76eab';$('dwObjectStroke').value=e.stroke||'#765a91';$('dwNoFill').checked=e.fill===null;$('dwNoStroke').checked=e.stroke===null}if(e.origin)$('dwSelectedHeroMode').value=e.variant||'original'}
 // Keep the one-tap floating controls synchronized with the actual selected layer.
 const floatingActive=!!(e&&tool==='select');
 const floatShape=$('dwFloatingShape'),floatHero=$('dwFloatingHero');
 if(floatShape){floatShape.hidden=!(floatingActive&&e.kind==='shape');if(!floatShape.hidden){
   $('dwFloatFill').value=e.fill||'#d76eab';$('dwFloatNoFill').checked=e.fill===null;
   $('dwFloatStroke').value=e.stroke||'#765a91';$('dwFloatNoStroke').checked=e.stroke===null;
 }}
 const bubbleEditor=$('dwBubbleTextEditor');if(bubbleEditor){bubbleEditor.hidden=!(floatingActive&&e.kind==='shape'&&e.shape==='bubble');if(!bubbleEditor.hidden&&document.activeElement!==$('dwBubbleText'))$('dwBubbleText').value=e.text||''}
 if(floatHero){floatHero.hidden=!(floatingActive&&e.origin);if(!floatHero.hidden)$('dwFloatHeroMode').value=e.variant||'original'}
 comicEditUi();listLayers()}
// Raw pixels avoid blocking iPad Safari to PNG-encode the whole drawing at every new stroke.
function snap(){syncCutoutElement();return {a:U.getImageData(0,0,W,H),b:P.getImageData(0,0,W,H),els:clone(els),sel}}
function remember(){history.push(snap());if(history.length>15)history.shift();redo.length=0}
async function refreshImages(){cache.clear();await Promise.all(els.filter(e=>e.kind==='image').map(async e=>{try{if(e.origin)await ensureDrawingHeroArt(e.origin);let src=e.premiumKey?propSrc(e.premiumKey):e.origin?heroSrc(e.origin,e.expression||'기뻐요'):e.src;if(!src)return;let im=await imload(src);if(e.variant==='outline'&&e.origin){im=await imload(await outline(im))}cache.set(e.id,im)}catch(err){console.warn('그림 불러오기 실패',err)}}))}
async function restore(s){cutoutEdit=null;els=clone(s.els||[]);sel=s.sel||null;U.clearRect(0,0,W,H);P.clearRect(0,0,W,H);if(s.a instanceof ImageData&&s.b instanceof ImageData){U.putImageData(s.a,0,0);P.putImageData(s.b,0,0)}else{const [a,b]=await Promise.all([imload(s.a),imload(s.b)]);U.drawImage(a,0,0,W,H);P.drawImage(b,0,0,W,H)}await refreshImages();render()}
async function undo(a,b){if(!a.length)return;b.push(snap());if(b.length>15)b.shift();await restore(a.pop())}
$('dwUndo').onclick=()=>undo(history,redo).catch(err=>msg(err.message));$('dwRedo').onclick=()=>undo(redo,history).catch(err=>msg(err.message));
function pt(ev){const r=C.getBoundingClientRect();return {x:(ev.clientX-r.left)*W/r.width,y:(ev.clientY-r.top)*H/r.height}}
function localPt(e,p){const dx=p.x-e.x,dy=p.y-e.y,a=-(e.rotation||0);return {x:dx*Math.cos(a)-dy*Math.sin(a),y:dx*Math.sin(a)+dy*Math.cos(a)}}
function hit(e,p){const a=localPt(e,p);return Math.abs(a.x)<e.w/2+9&&Math.abs(a.y)<e.h/2+9}
function hitHandle(e,p){const a=localPt(e,p);if(Math.abs(a.x)<18&&Math.abs(a.y+e.h/2+35)<18)return'rotate';if(Math.abs(Math.abs(a.x)-e.w/2)<20&&Math.abs(Math.abs(a.y)-e.h/2)<20)return'resize';return null}
function pick(p){for(let i=els.length-1;i>=0;i--)if(els[i].visible!==false&&!els[i].locked&&hit(els[i],p))return els[i];return null}
function pen(a,b){
 const width=tool==='brush'?thick*1.8:thick,eraser=tool==='eraser';
 if(editingCutout()&&drawOnCutout(a,b))return;
 for(const ctx of (eraser?[P]:[P,L])){
  ctx.save();ctx.globalCompositeOperation=eraser?'destination-out':'source-over';
  ctx.lineWidth=width;ctx.strokeStyle=ink;ctx.fillStyle=ink;
  ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  if(a.x===b.x&&a.y===b.y){ctx.beginPath();ctx.arc(a.x,a.y,width/2,0,Math.PI*2);ctx.fill()}ctx.restore();
 }
}
// Smart fill: bridge small breaks in hand-drawn contours before filling.
// All work runs only on the user's bucket tap, never during Pencil movement.
function closeBarrier(mask,r){
 const n=W*H,tmp=new Uint8Array(n),wide=new Uint8Array(n),tmp2=new Uint8Array(n),closed=new Uint8Array(n);
 // Separable dilation followed by erosion: gently closes gaps no wider than 2r.
 for(let y=0;y<H;y++){const row=y*W;for(let x=0;x<W;x++){
  let v=0;for(let j=Math.max(0,x-r);j<=Math.min(W-1,x+r);j++){if(mask[row+j]){v=1;break}}tmp[row+x]=v;
 }}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  let v=0;for(let j=Math.max(0,y-r);j<=Math.min(H-1,y+r);j++){if(tmp[j*W+x]){v=1;break}}wide[y*W+x]=v;
 }
 for(let y=0;y<H;y++){const row=y*W;for(let x=0;x<W;x++){
  let v=1;for(let j=Math.max(0,x-r);j<=Math.min(W-1,x+r);j++){if(!wide[row+j]){v=0;break}}tmp2[row+x]=v;
 }}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  let v=1;for(let j=Math.max(0,y-r);j<=Math.min(H-1,y+r);j++){if(!tmp2[j*W+x]){v=0;break}}closed[y*W+x]=v;
 }
 return closed;
}
function flood(p){
 compose(S,false);
 const pixels=S.getImageData(0,0,W,H).data;
 const px=Math.floor(p.x),py=Math.floor(p.y);
 if(px<0||px>=W||py<0||py>=H)return;
 const pos=py*W+px,si=pos*4;
 const seed=[pixels[si],pixels[si+1],pixels[si+2],pixels[si+3]];
 const rgb=[1,3,5].map(j=>parseInt(ink.slice(j,j+2),16));
 const smart=$('dwSmartFill')?.checked!==false;
 if(!smart){
  // Original exact fill is available for large open areas and backgrounds.
  const result=U.getImageData(0,0,W,H),out=result.data;
  const q=new Int32Array(W*H),seen=new Uint8Array(W*H);let head=0,tail=1;q[0]=pos;seen[pos]=1;
  while(head<tail){const k=q[head++],i=k*4;
   if(Math.abs(pixels[i]-seed[0])+Math.abs(pixels[i+1]-seed[1])+Math.abs(pixels[i+2]-seed[2])>40||Math.abs(pixels[i+3]-seed[3])>90)continue;
   out[i]=rgb[0];out[i+1]=rgb[1];out[i+2]=rgb[2];out[i+3]=255;
   const x=k%W,y=(k/W)|0;
   if(x>0&&!seen[k-1]){seen[k-1]=1;q[tail++]=k-1}
   if(x<W-1&&!seen[k+1]){seen[k+1]=1;q[tail++]=k+1}
   if(y>0&&!seen[k-W]){seen[k-W]=1;q[tail++]=k-W}
   if(y<H-1&&!seen[k+W]){seen[k+W]=1;q[tail++]=k+W}
  }
  U.putImageData(result,0,0);return;
 }
 // Each pixel with a noticeably different colour is a possible boundary;
 // preserve the artist's own outlines and decorations rather than painting over them.
 const n=W*H,barrier=new Uint8Array(n);
 for(let k=0,i=0;k<n;k++,i+=4){
  const diff=Math.abs(pixels[i]-seed[0])+Math.abs(pixels[i+1]-seed[1])+Math.abs(pixels[i+2]-seed[2]);
  const light=(pixels[i]*3+pixels[i+1]*6+pixels[i+2])/10;
  barrier[k]=(pixels[i+3]>80&&(diff>105||light<120&&light<(seed[0]*3+seed[1]*6+seed[2])/10-28))?1:0;
 }
 // Work conservatively: try an 8px gap first, then at most ~16px.
 // Never write into the canvas if the candidate touches an edge or is too large.
 function enclosedRegion(wall){
  if(wall[pos])return null;
  const q=new Int32Array(n),seen=new Uint8Array(n);
  let head=0,tail=1,edge=false,minX=W,maxX=0,minY=H,maxY=0;
  q[0]=pos;seen[pos]=1;
  // Large closed faces can cover more than 42% of the drawing.
  // The open-to-canvas-edge check below, not a small area cap, protects the page.
  const limit=Math.floor(n*.94);
  while(head<tail){
   const k=q[head++],x=k%W,y=(k/W)|0;
   if(x===0||x===W-1||y===0||y===H-1){edge=true;break}
   minX=Math.min(minX,x);maxX=Math.max(maxX,x);
   minY=Math.min(minY,y);maxY=Math.max(maxY,y);
   if(tail>limit)return null;
   if(x>0&&!seen[k-1]&&!wall[k-1]){seen[k-1]=1;q[tail++]=k-1}
   if(x<W-1&&!seen[k+1]&&!wall[k+1]){seen[k+1]=1;q[tail++]=k+1}
   if(y>0&&!seen[k-W]&&!wall[k-W]){seen[k-W]=1;q[tail++]=k-W}
   if(y<H-1&&!seen[k+W]&&!wall[k+W]){seen[k+W]=1;q[tail++]=k+W}
  }
  if(edge||head<12)return null;
  // A narrow open line can make an implausibly huge paint region.
  if((maxX-minX+1)*(maxY-minY+1)>n*.97)return null;
  return {q,count:head};
 }
 let region=null;
 for(const radius of [2,4,8,12]){
  region=enclosedRegion(closeBarrier(barrier,radius));
  if(region)break;
 }
 if(!region){msg('이 영역의 선이 도화지 가장자리와 이어져 있거나 빈틈이 있을 수 있어요. 선을 확인한 뒤 안쪽을 눌러 주세요.');return}
 const result=U.getImageData(0,0,W,H),out=result.data;
 let changed=0;
 for(let j=0;j<region.count;j++){
  const k=region.q[j],i=k*4;
  // Do not recolor the child's existing lines or small decorations.
  if(barrier[k])continue;
  out[i]=rgb[0];out[i+1]=rgb[1];out[i+2]=rgb[2];out[i+3]=255;changed++;
 }
 if(changed)U.putImageData(result,0,0);
}

function resetPointerState(){
 comicSelectBox=null;clearComicGuide();
 if(objectFrame){cancelAnimationFrame(objectFrame);objectFrame=0}
 if(active!==null){try{if(C.hasPointerCapture(active))C.releasePointerCapture(active)}catch(_){}}
 stopInk();active=null;activePointerType=null;last=null;drag=null;gesture=null;touchPoints.clear();
}
function down(ev){
 if(panMode&&zoomRatio>1)return;
 if(tool==='comicCrop'||tool==='comicLasso'){
  if(!comic)return;ev.preventDefault();if(comicSelectBox)return;
  // Ignore a palm/finger while Apple Pencil is active in the cutout tool.
  if(ev.pointerType==='touch'&&Date.now()-lastPencilAt<650)return;
  if(ev.pointerType==='pen')lastPencilAt=Date.now();
  const p=pt(ev);comicSelectBox={mode:tool==='comicLasso'?'lasso':'rect',id:ev.pointerId,start:p,end:p,points:[p]};
  try{C.setPointerCapture(ev.pointerId)}catch(_){}showComicGuide();return
 }
 // Never allow a palm to replace an active Pencil stroke. Delay touch drawing
 // briefly after Pencil activity to avoid a stray finger mark when lifting it.
 if(tool!=='select'&&ev.pointerType==='touch'&&
    (activePointerType==='pen'||Date.now()-lastPencilAt<650))return;
 if(ev.pointerType==='pen')lastPencilAt=Date.now();
 // Palm rejection: a finger must never cancel or claim an active Pencil stroke.
 if(active!==null&&ev.pointerType==='touch'&&tool!=='select')return;
 if(active!==null){
   // iPadOS sometimes drops pointerup/capture while switching to palm rejection.
   // A new Pencil stroke must never be blocked by an orphaned pointer ID.
   if(tool!=='select' && ev.pointerId!==active && touchPoints.size<=1){resetPointerState()}
   else if(tool!=='select'||ev.pointerId===active)return;
 }
 if(active!==null){
   ev.preventDefault();const p=pt(ev);touchPoints.set(ev.pointerId,p);
   try{C.setPointerCapture(ev.pointerId)}catch(_){}
   const e=selected(),first=touchPoints.get(active);
   if(e&&!e.locked&&first){const center={x:(first.x+p.x)/2,y:(first.y+p.y)/2};
     gesture={id:e.id,baseDistance:Math.max(1,Math.hypot(first.x-p.x,first.y-p.y)),baseAngle:Math.atan2(p.y-first.y,p.x-first.x),center,ox:e.x,oy:e.y,ow:e.w,oh:e.h,rotation:e.rotation||0};drag=null;
   }return;
 }
 ev.preventDefault();const p=pt(ev);active=ev.pointerId;activePointerType=ev.pointerType;lastPointerActivity=Date.now();last=p;touchPoints.set(ev.pointerId,p);try{C.setPointerCapture(active)}catch(_){}
 if(tool==='select'){
  let e=selected();let action=e&&!e.locked?hitHandle(e,p):null;if(!action){e=pick(p);action=e?'move':null}sel=e?.id||null;drag=null;if(e&&!e.locked){remember();const a=localPt(e,p);drag={action,p,ox:e.x,oy:e.y,ow:e.w,oh:e.h,angle:e.rotation||0,startAngle:Math.atan2(p.y-e.y,p.x-e.x),dist:Math.hypot(a.x,a.y)}}
 }else{remember();if(tool==='bucket'){flood(p);active=null;render()}else{const cutoutNow=editingCutout();if(!cutoutNow&&tool==='eraser')prepareInk();clearLive();pen(p,p);if(!cutoutNow&&tool==='eraser')drawInkFrame()}}if(tool==='select')render()}
let objectFrame=0;function scheduleObjectRender(){if(!objectFrame)objectFrame=requestAnimationFrame(()=>{objectFrame=0;render()})}
function move(ev){if(panMode&&zoomRatio>1)return;if(tool==='comicCrop'||tool==='comicLasso'){
 if(comicSelectBox&&ev.pointerId===comicSelectBox.id){
  ev.preventDefault();const p=pt(ev);comicSelectBox.end=p;
  if(comicSelectBox.mode==='lasso'){
   const a=comicSelectBox.points.at(-1);
   if(Math.hypot(p.x-a.x,p.y-a.y)>=2 && comicSelectBox.points.length<1800)comicSelectBox.points.push(p);
  }
  showComicGuide()
 }return
}if(ev.pointerId!==active&&!touchPoints.has(ev.pointerId))return;
 if(ev.pointerId===active){lastPointerActivity=Date.now();if(activePointerType==='pen')lastPencilAt=Date.now()}
 ev.preventDefault();const p=pt(ev);
 if(touchPoints.has(ev.pointerId))touchPoints.set(ev.pointerId,p);
 if(gesture&&touchPoints.size>=2){const [a,b]=[...touchPoints.values()];const e=selected();if(e&&e.id===gesture.id){
   const distance=Math.hypot(a.x-b.x,a.y-b.y),ratio=Math.max(.15,Math.min(6,distance/gesture.baseDistance));
   const angle=Math.atan2(b.y-a.y,b.x-a.x);
   e.w=Math.max(18,Math.min(1200,gesture.ow*ratio));e.h=Math.max(18,Math.min(1200,gesture.oh*ratio));
   e.rotation=gesture.rotation+angle-gesture.baseAngle;
   e.x=gesture.ox+(a.x+b.x)/2-gesture.center.x;e.y=gesture.oy+(a.y+b.y)/2-gesture.center.y;
 }scheduleObjectRender();return}
 if(ev.pointerId!==active)return;if(tool==='select'){const e=selected();if(e&&!e.locked&&drag){const dx=p.x-drag.p.x,dy=p.y-drag.p.y;if(drag.action==='move'){e.x=drag.ox+dx;e.y=drag.oy+dy}else if(drag.action==='resize'){let rad=Math.hypot(p.x-e.x,p.y-e.y);let ratio=Math.max(.12,Math.min(8,rad/Math.max(1,drag.dist)));e.w=Math.max(18,Math.min(1200,drag.ow*ratio));e.h=Math.max(18,Math.min(1200,drag.oh*ratio))}else if(drag.action==='rotate'){e.rotation=drag.angle+Math.atan2(p.y-e.y,p.x-e.x)-drag.startAngle}}}else if(tool!=='bucket'){
  // Use predicted-independent coalesced Pencil samples to preserve fast, continuous strokes.
  const samples=typeof ev.getCoalescedEvents==='function'?ev.getCoalescedEvents():null;
  if(samples&&samples.length){const stride=Math.max(1,Math.ceil(samples.length/32));for(let i=0;i<samples.length;i+=stride){const q=pt(samples[i]);pen(last,q);last=q}}
  const cutoutNow=editingCutout();
  if(!last||last.x!==p.x||last.y!==p.y){pen(last||p,p);last=p}
  if(!cutoutNow)scheduleInk();return
 }
 // Object gestures need only paint once per animation frame, not rebuild all layer buttons on every move.
 scheduleObjectRender()}
function end(ev){
 if(panMode&&zoomRatio>1)return;
 if(tool==='comicCrop'||tool==='comicLasso'){
  if(!comicSelectBox||comicSelectBox.id!==ev.pointerId)return;
  ev.preventDefault();
  if(ev.type==='pointercancel'){comicSelectBox=null;clearComicGuide();msg('선택이 취소됐어요. 다시 둘러 그려 주세요.');return}
  const p=pt(ev),b=comicSelectBox;b.end=p;
  if(b.mode==='lasso'&&Math.hypot(p.x-b.points.at(-1).x,p.y-b.points.at(-1).y)>1)b.points.push(p);
  comicSelectBox=null;clearComicGuide();
  comicExtract(b).catch(err=>msg('주인공 선택 오류: '+err.message));return
 }
 touchPoints.delete(ev.pointerId);
 // A stray finger/palm pointer must not stop the active Pencil ink cache.
 if(ev.pointerId!==active){if(gesture&&touchPoints.size<2){gesture=null;drag=null}return}
 if(objectFrame){cancelAnimationFrame(objectFrame);objectFrame=0}
 const wasDrawing=tool==='pen'||tool==='brush'||tool==='eraser';
 // Capture the final tip coordinate on Apple Pencil lift (Safari may skip last move).
 if(wasDrawing&&ev.type==='pointerup'&&last){const finish=pt(ev);if(Math.hypot(finish.x-last.x,finish.y-last.y)<90)pen(last,finish)}
 stopInk();gesture=null;touchPoints.clear();active=null;activePointerType=null;drag=null;last=null;
 if(wasDrawing)paintFinishedStroke();else render();
}
// Prevent iPad Safari from selecting/highlighting the whole drawing surface
// during Pencil rests, long presses, double taps, or accidental drag gestures.
// Only the canvas and its noninteractive overlay are guarded. Inputs, menus,
// text fields, and the intentional comic lasso / object selection stay usable.
// View-only magnification; canvas pixels, pencil thickness and saved work do not change.
const zoomView=$('dwZoomViewport'),zoomWrap=$('dwCanvasWrap'),zoomLabel=$('dwZoomLevel');
let zoomRatio=1,panMode=false,panPointer=null;
const zoomBase=()=>zoomView?.clientWidth||zoomWrap?.clientWidth||640;
function zoomTo(value){
 if(!zoomView||!zoomWrap)return;
 const prev=zoomRatio,centerX=(zoomView.scrollLeft+zoomView.clientWidth/2)/(zoomBase()*prev),centerY=(zoomView.scrollTop+zoomView.clientHeight/2)/(zoomBase()*prev);
 zoomRatio=Math.max(1,Math.min(4,value));
 zoomWrap.style.width=(zoomBase()*zoomRatio)+'px';
 zoomWrap.style.maxWidth='none';zoomWrap.style.margin='0';
 zoomView.style.maxHeight=zoomRatio>1?'min(75vh,790px)':'none';
 if(zoomLabel)zoomLabel.textContent=Math.round(zoomRatio*100)+'%';
 requestAnimationFrame(()=>{zoomView.scrollLeft=Math.max(0,centerX*zoomBase()*zoomRatio-zoomView.clientWidth/2);zoomView.scrollTop=Math.max(0,centerY*zoomBase()*zoomRatio-zoomView.clientHeight/2)});
}
for(const b of document.querySelectorAll('[data-dw-zoom]'))b.addEventListener('click',()=>zoomTo(Number(b.dataset.dwZoom)));
const panButton=$('dwPanMode');
if(panButton)panButton.onclick=()=>{panMode=!panMode;panButton.setAttribute('aria-pressed',String(panMode));panButton.textContent=panMode?'✋ 화면 이동 중 · 그리기로 돌아가기':'✋ 확대 화면 이동';resetPointerState()};
if(zoomView){
 const panStart=ev=>{if(!panMode||zoomRatio<=1)return;ev.preventDefault();panPointer={id:ev.pointerId,x:ev.clientX,y:ev.clientY,left:zoomView.scrollLeft,top:zoomView.scrollTop};try{C.setPointerCapture(ev.pointerId)}catch(_){}};
 const panMove=ev=>{if(!panPointer||ev.pointerId!==panPointer.id)return;ev.preventDefault();zoomView.scrollLeft=panPointer.left-(ev.clientX-panPointer.x);zoomView.scrollTop=panPointer.top-(ev.clientY-panPointer.y)};
 C.addEventListener('pointerdown',panStart,true);C.addEventListener('pointermove',panMove,true);
 const panEnd=ev=>{if(panPointer?.id===ev.pointerId)panPointer=null};C.addEventListener('pointerup',panEnd,true);C.addEventListener('pointercancel',panEnd,true);
 const viewportObserver=new ResizeObserver(()=>{if(zoomRatio!==1)zoomWrap.style.width=(zoomBase()*zoomRatio)+'px'});viewportObserver.observe(zoomView);
}

const drawingSurface=$('dwCanvasWrap');
if(drawingSurface){
 const isDrawingSurface=node=>node===C||node===live||node===comicGuide||node===drawingSurface;
 for(const name of ['selectstart','dragstart','contextmenu']){
  drawingSurface.addEventListener(name,ev=>{if(isDrawingSurface(ev.target))ev.preventDefault()},{capture:true});
 }
 // iOS long-touch can trigger native image/canvas callouts even when the
 // PointerEvent stream is active. Disable native gesture defaults locally.
 for(const name of ['gesturestart','gesturechange']){
  drawingSurface.addEventListener(name,ev=>ev.preventDefault(),{passive:false});
 }
 // Native Safari selection menus should never activate on empty drawing UI.
 const drawRoot=$('draw');
 if(drawRoot){
  const editable='button,input,select,textarea,[contenteditable],label,summary,a,option';
  for(const name of ['selectstart','dragstart','contextmenu'])drawRoot.addEventListener(name,ev=>{if(!ev.target.closest?.(editable))ev.preventDefault()},{capture:true});
 }
 C.setAttribute('draggable','false');
 live.setAttribute('draggable','false');
 comicGuide.setAttribute('draggable','false');
}
C.addEventListener('pointerdown',down);C.addEventListener('pointermove',move);
C.addEventListener('pointerup',end);C.addEventListener('pointercancel',end);
// An iPad Safari pointerup may arrive outside the canvas after losing capture.
window.addEventListener('pointerup',ev=>{if(ev.pointerId===active)end(ev)},true);
window.addEventListener('pointercancel',ev=>{if(ev.pointerId===active)end(ev)},true);
// A stale active pointer must not block subsequent Pencil strokes indefinitely.
// The watchdog only releases the input state; it never removes painted strokes.
setInterval(()=>{if(active!==null&&tool!=='select'&&Date.now()-lastPointerActivity>8500){
 resetPointerState();if(document.getElementById('draw')?.classList.contains('active'))paintFinishedStroke();
}},1500);
C.addEventListener('lostpointercapture',ev=>{
 if(comicSelectBox&&comicSelectBox.id===ev.pointerId){comicSelectBox=null;clearComicGuide();return}
 if(ev.pointerId!==active)return;
 // Called by Safari if touch capture is lost without a matching pointerup.
 resetPointerState();render();
});
window.addEventListener('blur',()=>{if(active!==null){resetPointerState();render()}});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){if(active!==null)resetPointerState();return;}
 if(document.getElementById('draw')?.classList.contains('active')){
  resetPointerState();requestAnimationFrame(()=>paintFinishedStroke());
 }
});
// Tabs change while Safari still thinks Pencil is down: clear input capture only.
document.addEventListener('webtoon:beforeviewchange',()=>{
 if(active!==null||comicSelectBox)resetPointerState();
});
document.addEventListener('webtoon:viewchange',ev=>{
 if(ev.detail?.id!=='draw')return;
 resetPointerState();
 requestAnimationFrame(()=>paintFinishedStroke());
 ensureGalleryLoaded();
});
window.addEventListener('pageshow',()=>{
 if(document.getElementById('draw')?.classList.contains('active')){
  resetPointerState();requestAnimationFrame(()=>paintFinishedStroke());
 }
});
function add(o){remember();const e={id:eId(),kind:'image',x:320,y:320,w:220,h:220,visible:true,locked:false,rotation:0,opacity:1,flip:false,...o};els.push(e);sel=e.id;setMode('select');return e}
async function addIm(src,opts={}){const im=await imload(src);const max=opts.max||380,ratio=Math.min(max/im.width,max/im.height),w=Math.round(im.width*ratio),h=Math.round(im.height*ratio);const e=add({kind:'image',w,h,x:320+((els.length-1)%4)*30,y:310+((els.length-1)%3)*24,variant:opts.variant||'original',opacity:opts.variant==='pale'?.4:1,...opts,src:(opts.origin||opts.premiumKey)?null:src});cache.set(e.id,e.variant==='outline'&&e.origin?await imload(await outline(im)):im);render();return e}
async function outline(im){const c=cv(),g=c.getContext('2d',{willReadFrequently:true});let scale=Math.min(570/im.width,570/im.height);g.drawImage(im,(W-im.width*scale)/2,(H-im.height*scale)/2,im.width*scale,im.height*scale);const d=g.getImageData(0,0,W,H),a=d.data,out=g.createImageData(W,H),p=out.data;for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const i=(y*W+x)*4;if(a[i+3]<96)continue;let edge=false;for(const off of [-4,4,-W*4,W*4])if(a[i+off+3]<96)edge=true;if(edge)for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){const j=((y+oy)*W+x+ox)*4;p[j]=75;p[j+1]=52;p[j+2]=89;p[j+3]=255}}g.clearRect(0,0,W,H);g.putImageData(out,0,0);return c.toDataURL()}
// High-resolution image thumbnails and expression picker.
const heroSel=$('dwHeroSource');Object.entries(names).forEach(([id,name])=>{const o=document.createElement('option');o.value=id;o.textContent=name;heroSel.append(o)});
let heroPreviewTicket=0;
async function preview(){const ticket=++heroPreviewTicket,id=heroSel.value,emotion=$('dwExpression').value,img=$('dwHeroPreview');img.style.visibility='hidden';if(!id){img.removeAttribute('src');return;}try{await ensureDrawingHeroArt(id);if(ticket!==heroPreviewTicket)return;const src=heroSrc(id,emotion);if(src){img.src=src;img.style.visibility='visible';}else img.removeAttribute('src');}catch(err){if(ticket===heroPreviewTicket)msg('주인공 그림을 불러오지 못했어요. 다시 선택해 주세요.');}}heroSel.onchange=preview;$('dwExpression').onchange=preview;preview();
$('dwAddHero').onclick=async()=>{const id=heroSel.value,expr=$('dwExpression').value;if(!id)return msg('먼저 주인공을 선택해 주세요.');try{await ensureDrawingHeroArt(id);const src=heroSrc(id,expr);if(!src)return msg('해당 표정의 원화가 아직 준비되지 않았어요.');await addIm(src,{origin:id,expression:expr,variant:$('dwHeroMode').value,max:490});msg('주인공 그림을 추가했어요.')}catch(err){msg('주인공을 불러올 수 없어요: '+err.message)}};
// Simple practice templates remain available and editable.
const templates={rabbit:'🐰',dog:'🐶',cat:'🐱',princess:'👸',crown:'👑',flower:'🌸'};
function templateData(key){const c=cv(),g=c.getContext('2d');g.textAlign='center';g.textBaseline='middle';g.font='390px sans-serif';g.fillStyle='#eee';g.fillText(templates[key],320,320);return c.toDataURL()}
$('dwTemplate').onchange=async ev=>{const key=ev.target.value;if(key!=='blank')try{await addIm(templateData(key),{template:key,max:300})}catch(err){msg(err.message)}ev.target.value='blank'};
$('dwLoadImage').onchange=async ev=>{const file=ev.target.files?.[0];if(!file)return;if(file.size>12*1024*1024)return msg('12MB 이하 그림을 선택해 주세요.');const rdr=new FileReader();rdr.onload=async()=>{try{await addIm(rdr.result,{max:440})}catch(err){msg(err.message)}};rdr.readAsDataURL(file);ev.target.value=''};
const gallery=$('dwPremiumGallery');try{Object.entries(premiumPropImages).forEach(([key,src])=>{if(!src)return;const b=document.createElement('button');b.type='button';const img=new Image();img.src=src;img.alt='';img.loading='lazy';const label=document.createElement('span');label.textContent=key;b.append(img,label);b.onclick=async()=>{try{await addIm(src,{premiumKey:key,max:160});msg('「'+key+'」 추가! 그림에서 직접 움직여 주세요.')}catch(err){msg(err.message)}};gallery.append(b)})}catch(err){gallery.textContent='장식품 자료를 찾지 못했어요.'}
$('dwAddShape').onclick=()=>add({kind:'shape',shape:$('dwShape').value,fill:ink,stroke:'#765a91',w:210,h:180});
$('dwAddTextBubble').onclick=()=>{add({kind:'shape',shape:'bubble',fill:'#ffffff',stroke:'#765a91',w:270,h:190,text:''});$('dwBubbleText').focus()};
$('dwBubbleText').addEventListener('focus',()=>{if(selected()?.shape==='bubble')remember()});
$('dwBubbleText').addEventListener('input',ev=>{const e=selected();if(e?.shape==='bubble'){e.text=ev.target.value;render()}});
$('dwBubbleVoice').onclick=()=>{const t=$('dwBubbleText');t.focus();msg('아이패드 키보드의 🎤 마이크를 눌러 말해 주세요.')};
function order(dest){const i=els.findIndex(e=>e.id===sel);if(i<0)return;const current=els[i];let j=typeof dest==='number'?Math.max(0,Math.min(els.length-1,i+dest)):dest==='front'?els.length-1:0;if(i===j&&dest!=='front'&&dest!=='back')return;remember();els.splice(i,1);current.aboveInk=dest==='front'?true:dest==='back'?false:current.aboveInk;els.splice(Math.min(j,els.length),0,current);render();if(dest==='front')msg('장식품을 펜 그림보다도 앞에 놓았어요.');}
function remove(id){const e=els.find(q=>q.id===id);if(!e||!confirm('「'+layerName(e)+'」만 지울까요? 다른 그림은 남아요.'))return;remember();if(cutoutEdit&&cutoutEdit.id===id)cutoutEdit=null;els=els.filter(q=>q.id!==id);cache.delete(id);if(sel===id)sel=null;render()}
function modify(fn){const e=selected();if(!e)return;remember();fn(e);render()}
const act={back:()=>order('back'),front:()=>order('front'),flip:()=>modify(e=>e.flip=!e.flip),clone:()=>{const e=selected();if(!e)return;const ne=add({...clone(e),id:eId(),x:e.x+25,y:e.y+25});if(e.kind==='image')cache.set(ne.id,cache.get(e.id));render()},delete:()=>remove(sel),deselect:()=>{sel=null;render()}};
document.querySelectorAll('#dwFloating [data-dw-action]').forEach(b=>b.onclick=()=>act[b.dataset.dwAction]());
// Keep legacy controls bound, even though primary controls are a single floating panel.
const handlers={dwObjectSmaller:e=>{e.w*=.83;e.h*=.83},dwObjectBigger:e=>{e.w*=1.2;e.h*=1.2},dwObjectWide:e=>e.w*=1.2,dwObjectTall:e=>e.h*=1.2,dwObjectRotate:e=>e.rotation=(e.rotation||0)+Math.PI/12,dwObjectFlip:e=>e.flip=!e.flip,dwObjectLock:e=>e.locked=!e.locked};Object.entries(handlers).forEach(([id,fn])=>{if($(id))$(id).onclick=()=>modify(fn)});
$('dwObjectFront').onclick=()=>order('front');$('dwObjectBack').onclick=()=>order('back');$('dwObjectUp').onclick=()=>order(1);$('dwObjectDown').onclick=()=>order(-1);$('dwObjectClone').onclick=act.clone;$('dwObjectDelete').onclick=act.delete;
$('dwObjectOpacity').onchange=ev=>modify(e=>e.opacity=Number(ev.target.value)/100);
$('dwObjectColor').onchange=ev=>modify(e=>e.fill=ev.target.value);$('dwObjectStroke').onchange=ev=>modify(e=>e.stroke=ev.target.value);$('dwNoFill').onchange=ev=>modify(e=>e.fill=ev.target.checked?null:$('dwObjectColor').value);$('dwNoStroke').onchange=ev=>modify(e=>e.stroke=ev.target.checked?null:$('dwObjectStroke').value);
$('dwSelectedHeroMode').onchange=async ev=>{const e=selected();if(!e?.origin)return;remember();e.variant=ev.target.value;e.opacity=e.variant==='pale'?.4:1;await refreshImages();render()};
// Context-panel editors modify the underlying same shape/hero element, not a duplicate overlay.
$('dwFloatFill').onchange=ev=>modify(e=>{if(e.kind!=='shape')return;e.fill=ev.target.value});
$('dwFloatNoFill').onchange=ev=>modify(e=>{if(e.kind!=='shape')return;e.fill=ev.target.checked?null:$('dwFloatFill').value});
$('dwFloatStroke').onchange=ev=>modify(e=>{if(e.kind!=='shape')return;e.stroke=ev.target.value});
$('dwFloatNoStroke').onchange=ev=>modify(e=>{if(e.kind!=='shape')return;e.stroke=ev.target.checked?null:$('dwFloatStroke').value});
$('dwFloatHeroMode').onchange=async ev=>{
 const e=selected();if(!e?.origin)return;remember();e.variant=ev.target.value;
 e.opacity=e.variant==='pale'?.4:1;
 try{await refreshImages();render()}catch(err){msg('그림 모습 변경 실패: '+(err.message||err))}
};

const swatches=['#303038','#ffffff','#e7659e','#ed9a58','#f2c455','#78ba8c','#65bdda','#678eda','#9a7bc7','#b16f58'];swatches.forEach(hex=>{const b=document.createElement('button');b.type='button';b.className='dw-swatch';b.style.background=hex;b.title=hex;b.onclick=()=>{ink=hex;$('dwColor').value=hex;sync()};$('dwColors').append(b)});
function sync(){[...$('dwColors').children].forEach((b,i)=>b.classList.toggle('selected',swatches[i]===ink))}sync();$('dwColor').oninput=e=>{ink=e.target.value;sync()};$('dwSize').oninput=e=>{$('dwSizeLabel').textContent=thick=Number(e.target.value)};$('dwShowBackground').onchange=render;document.querySelectorAll('[data-dw-tool]').forEach(b=>b.onclick=()=>setMode(b.dataset.dwTool));
$('dwBlank').onclick=()=>{if(!confirm('새 도화지를 열까요? 저장하지 않은 그림은 사라집니다.'))return;els=[];sel=null;cache.clear();U.clearRect(0,0,W,H);P.clearRect(0,0,W,H);history=[];redo=[];currentId=null;$('dwName').value='새 그림';setMode('pen')};
function previewPng(){const c=document.createElement('canvas');c.width=1280;c.height=1280;const g=c.getContext('2d');g.fillStyle='white';g.fillRect(0,0,1280,1280);g.scale(2,2);compose(g,true);return c.toDataURL('image/png')}
$('dwExport').onclick=()=>{const a=document.createElement('a');a.href=previewPng();a.download=($('dwName').value.trim()||'내 그림').replace(/[\\/:*?"<>|]/g,'_')+'.png';a.click()};
// Retain the exact IndexedDB database/store/shape used by C4.5.17.
const DB='webtoon-child-drawing-workshop-v1',STORE='paintings';
function dbopen(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function tx(mode,fn){const db=await dbopen();try{return await new Promise((resolve,reject)=>{const tran=db.transaction(STORE,mode),req=fn(tran.objectStore(STORE));req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tran.onabort=()=>reject(tran.error)})}finally{db.close()}}
const all=()=>tx('readonly',s=>s.getAll());
async function save(silent=false){const entry={id:currentId||'drawing-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name:$('dwName').value.trim()||'내 그림',preview:previewPng(),under:under.toDataURL(),paint:paint.toDataURL(),outline:null,elements:clone(els),updated:Date.now()};const prev=currentId?await tx('readonly',s=>s.get(currentId)):null;if(prev?.registered)entry.registered=true;await tx('readwrite',s=>s.put(entry));currentId=entry.id;await galleryRefresh();if(!silent)msg('그림과 편집 상태를 보관함에 저장했어요!');return entry}
$('dwSave').onclick=()=>save().catch(e=>msg('저장 실패: '+e.message));
async function openSaved(item){if(!confirm('저장한 그림을 다시 열까요? 저장하지 않은 작업은 사라집니다.'))return;const [a,b]=await Promise.all([imload(item.under||cv().toDataURL()),imload(item.paint||cv().toDataURL())]);U.clearRect(0,0,W,H);P.clearRect(0,0,W,H);U.drawImage(a,0,0,W,H);P.drawImage(b,0,0,W,H);els=clone(item.elements||[]);await refreshImages();sel=null;currentId=item.id;history=[];redo=[];$('dwName').value=item.name;setMode('select');msg('저장한 그림을 다시 열었어요.')}
async function registry(){try{window.webtoonDrawingHeroes=(await all()).filter(q=>q.registered).sort((a,b)=>b.updated-a.updated).map(q=>({id:q.id,name:q.name,preview:q.preview}));if(typeof renderCharacterChoices==='function')renderCharacterChoices()}catch(e){console.warn(e)}}
window.webtoonDrawingUnregister=async function(id){if(!confirm('주인공 선택 목록에서 등록을 해제할까요? 원본과 웹툰은 남아요.'))return;const item=await tx('readonly',s=>s.get(id));if(!item)return;item.registered=false;await tx('readwrite',s=>s.put(item));await registry();await galleryRefresh()};
async function register(item){item.registered=true;await tx('readwrite',s=>s.put(item));await registry();await galleryRefresh();settings.custom=item.preview;settings.hero='custom';settings.studioPrincess=false;settings.studioRecipe=null;if(typeof renderCharacterChoices==='function')renderCharacterChoices();if(typeof switchView==='function')switchView('make');msg('내 그림을 웹툰 주인공으로 등록했어요!')}
$('dwWebtoon').onclick=async()=>{try{await register(await save(true))}catch(e){msg('주인공 등록 실패: '+e.message)}};
async function galleryRefresh(){const box=$('dwGallery');box.replaceChildren();let items=await all();items.sort((a,b)=>b.updated-a.updated);if(!items.length){box.textContent='아직 저장한 그림이 없어요.';return}for(const entry of items){const card=document.createElement('div');card.className='dw-card';const img=new Image();img.loading='lazy';img.decoding='async';img.src=entry.preview;img.alt=entry.name;card.append(img);const title=document.createElement('b');title.textContent=entry.name;card.append(title);const buttons=document.createElement('div');buttons.className='actions';const b=(label,fn)=>{let x=document.createElement('button');x.type='button';x.textContent=label;x.onclick=fn;buttons.append(x)};b('계속 그리기',()=>openSaved(entry).catch(err=>msg(err.message)));b(entry.registered?'등록됨':'주인공 등록',()=>register(entry).catch(err=>msg(err.message)));if(entry.registered)b('등록 해제',()=>window.webtoonDrawingUnregister(entry.id));b('삭제',async()=>{if(!confirm('「'+entry.name+'」을 보관함에서 삭제할까요?'))return;await tx('readwrite',s=>s.delete(entry.id));if(currentId===entry.id)currentId=null;await registry();await galleryRefresh()});card.append(buttons);box.append(card)}}

// Independently stored comics. Never migrate or overwrite existing painting / webtoon databases.
const COMIC_DB='webtoon-child-handdrawn-comics-v1',COMIC_STORE='comics';
let comic=null,comicIndex=0,viewComic=null,comicBusy=false;
function comicDb(){return new Promise((ok,fail)=>{const req=indexedDB.open(COMIC_DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(COMIC_STORE))req.result.createObjectStore(COMIC_STORE,{keyPath:'id'})};req.onsuccess=()=>ok(req.result);req.onerror=()=>fail(req.error)})}
async function comicTx(mode,op){const db=await comicDb();try{return await new Promise((resolve,reject)=>{const tr=db.transaction(COMIC_STORE,mode);const r=op(tr.objectStore(COMIC_STORE));r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);tr.onabort=()=>reject(tr.error)})}finally{db.close()}}
const comicAll=()=>comicTx('readonly',s=>s.getAll());
const comicCopy=o=>JSON.parse(JSON.stringify(o));
function comicSnapshot(){syncCutoutElement();return {under:under.toDataURL('image/png'),paint:paint.toDataURL('image/png'),elements:clone(els),preview:previewPng()}}
// Freehand (lasso) or rectangular selection within the COMIC editor only.
// Only move pixels from the Pencil ink layer. The child's drawing gallery and
// all other existing panels are not modified. The selected area is cut, not duplicated.
function comicSelectionPath(ctx,points,x=0,y=0){
 ctx.beginPath();ctx.moveTo(points[0].x-x,points[0].y-y);
 for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x-x,points[i].y-y);
 ctx.closePath();
}
async function comicExtract(box){
 if(!comic)return;
 let points;
 if(box.mode==='lasso'){
  points=box.points;
  if(points.length<8){msg('주인공 주위를 한 바퀴 둘러 그려 주세요.');return}
  let length=0;for(let i=1;i<points.length;i++)length+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);
  if(length<55){msg('조금 더 넓게 둘러 그려 주세요.');return}
 }else{
  points=[box.start,{x:box.end.x,y:box.start.y},box.end,{x:box.start.x,y:box.end.y}];
 }
 const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x));
 const minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));
 const x=Math.max(0,Math.floor(minX)),y=Math.max(0,Math.floor(minY));
 const right=Math.min(W,Math.ceil(maxX)),bottom=Math.min(H,Math.ceil(maxY));
 const w=right-x,h=bottom-y;
 if(w<18||h<18){msg('주인공 주변을 조금 더 크게 둘러 주세요.');return}
 // Construct a transparent object using the traced outline as an alpha mask.
 // Cropping paint (not composited scenery) avoids bringing the background with it.
 const region=document.createElement('canvas');region.width=w;region.height=h;
 const ctx=region.getContext('2d',{willReadFrequently:true});
 ctx.save();comicSelectionPath(ctx,points,x,y);ctx.clip();ctx.drawImage(paint,-x,-y);ctx.restore();
 const data=ctx.getImageData(0,0,w,h).data;let visible=false;
 for(let k=3;k<data.length;k+=4){if(data[k]>10){visible=true;break}}
 if(!visible){msg('선택 영역 안에서 연필 그림을 찾지 못했어요. 연필로 그린 주인공 주변을 둘러 주세요.');return}
 const src=region.toDataURL('image/png');
 const picture=await imload(src); // finish validation before changing current work
 remember();
 P.save();comicSelectionPath(P,points);P.clip();P.clearRect(0,0,W,H);P.restore();
 const element={id:eId(),kind:'image',src,x:x+w/2,y:y+h/2,w,h,visible:true,locked:false,rotation:0,opacity:1,flip:false,comicCutout:true};
 els.push(element);cache.set(element.id,picture);sel=element.id;setMode('select');
 msg('주인공을 오려냈어요! 끌어서 움직이고 손잡이로 크기를 바꿔 보세요.');
}
function comicClear(){stopCutoutEdit(false);resetPointerState();U.clearRect(0,0,W,H);P.clearRect(0,0,W,H);els=[];sel=null;cache.clear();history=[];redo=[];currentId=null;setMode('pen')}
async function comicLoadPanel(panel){stopCutoutEdit(false);resetPointerState();const [a,b]=await Promise.all([imload(panel.under),imload(panel.paint)]);U.clearRect(0,0,W,H);P.clearRect(0,0,W,H);U.drawImage(a,0,0,W,H);P.drawImage(b,0,0,W,H);els=clone(panel.elements||[]);sel=null;currentId=null;history=[];redo=[];await refreshImages();setMode('select')}
function comicSyncTitle(){if(comic)comic.title=$('dwComicTitle').value.trim()||'나의 그림 이야기'}
async function comicPersist(){if(!comic)return;comicSyncTitle();comic.updated=Date.now();await comicTx('readwrite',s=>s.put(comic));}
function comicUi(){const active=!!comic;$('dwComicEditor').hidden=!active;if(!active){if(tool==='comicCrop'||tool==='comicLasso')setMode('pen');comicEditUi();return;}$('dwComicTitle').value=comic.title;$('dwComicStatus').textContent=`${comicIndex+1}컷 편집 중 · 총 ${comic.panels.length}컷`;
 const strip=$('dwComicStrip');strip.replaceChildren();comic.panels.forEach((panel,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-current',String(comicIndex===i));const im=new Image();im.src=i===comicIndex?previewPng():panel.preview;im.alt=`${i+1}컷`;const title=document.createElement('div');title.textContent=`${i+1}컷 ${i===comicIndex?'✏️':''}`;b.append(im,title);b.onclick=()=>comicGuard(async()=>{await comicSavePanel();comicIndex=i;await comicLoadPanel(comic.panels[i]);comicUi()});strip.append(b)});comicEditUi()}
async function comicSavePanel(){if(!comic)return;comic.panels[comicIndex]=comicSnapshot();await comicPersist()}
async function comicGuard(fn){if(comicBusy)return;comicBusy=true;try{await fn()}catch(err){console.error(err);msg('웹툰 작업 오류: '+(err.message||err))}finally{comicBusy=false}}
async function comicStart(blank){if(comic&&!confirm('편집 중인 웹툰을 저장하고 새 웹툰을 시작할까요?'))return;if(comic)await comicSavePanel();if(blank)comicClear();const panel=comicSnapshot();comic={id:'hand-comic-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),title:$('dwName').value.trim()||'나의 그림 이야기',panels:[panel],created:Date.now(),updated:Date.now()};comicIndex=0;await comicPersist();comicUi();await comicGallery();msg('첫 번째 컷이 저장됐어요! 이제 그림을 수정하거나 다음 컷을 만들어 보세요.')}
$('dwComicNew').onclick=()=>comicGuard(()=>comicStart(false));$('dwComicBlankNew').onclick=()=>comicGuard(()=>comicStart(true));
$('dwComicLassoCharacter').onclick=()=>{if(!comic)return;setMode('comicLasso');msg('연필로 주인공 바깥을 따라 한 바퀴 둘러 주세요. 끝에서 손을 떼면 자동으로 연결돼요.')};
$('dwComicSelectCharacter').onclick=()=>{if(!comic)return;setMode('comicCrop');msg('그림판에서 주인공 주변을 네모로 둘러 주세요. 연필로 그린 선만 분리됩니다.')};
$('dwComicSelectCancel').onclick=()=>setMode('select');
$('dwComicEditCharacter').onclick=()=>comicGuard(()=>startCutoutEdit());
$('dwComicEditDone').onclick=()=>stopCutoutEdit(true);
$('dwComicSave').onclick=()=>comicGuard(async()=>{await comicSavePanel();comicUi();await comicGallery();msg(`${comicIndex+1}컷을 저장했어요!`) });
async function comicNext(blank){if(!comic)return;if(comic.panels.length>=20){msg('한 작품은 최대 20컷까지 만들 수 있어요.');return}await comicSavePanel();const next=blank?null:comicCopy(comic.panels[comicIndex]);if(blank)comicClear();comic.panels.push(blank?comicSnapshot():next);comicIndex=comic.panels.length-1;if(!blank)await comicLoadPanel(next);await comicPersist();comicUi();await comicGallery();msg(`${comicIndex+1}컷이 준비됐어요. 이전 컷은 그대로 남아 있어요!`)}
$('dwComicNext').onclick=()=>comicGuard(()=>comicNext(false));$('dwComicFresh').onclick=()=>comicGuard(()=>comicNext(true));
$('dwComicExit').onclick=()=>comicGuard(async()=>{if(!comic)return;await comicSavePanel();comic=null;comicUi();await comicGallery();msg('웹툰을 보관함에 저장했어요. 다시 이어 그릴 수 있어요.')});
async function comicView(item){viewComic=item;$('dwComicViewer').hidden=false;$('dwComicViewTitle').textContent=`📖 ${item.title} · ${item.panels.length}컷`;const root=$('dwComicPages');root.replaceChildren();item.panels.forEach((p,i)=>{const f=document.createElement('figure'),im=new Image(),caption=document.createElement('figcaption');im.src=p.preview;im.alt=`${i+1}컷`;caption.textContent=`${i+1}컷`;f.append(im,caption);root.append(f)});$('dwComicViewer').scrollIntoView({behavior:'smooth',block:'nearest'})}
$('dwComicFinish').onclick=()=>comicGuard(async()=>{await comicSavePanel();await comicView(comic);await comicGallery()});
$('dwComicViewClose').onclick=()=>{$('dwComicViewer').hidden=true;viewComic=null};
$('dwComicDownload').onclick=()=>comicGuard(async()=>{if(!viewComic)return;let start=0;if(viewComic.panels.length>12){const choice=prompt(`전체 ${viewComic.panels.length}컷입니다. PNG로 저장할 시작 컷 번호를 적어 주세요. (최대 12컷씩 저장)`, '1');if(choice===null)return;start=Number(choice)-1;if(!Number.isInteger(start)||start<0||start>=viewComic.panels.length){msg('올바른 컷 번호를 입력해 주세요.');return}}const count=Math.min(12,viewComic.panels.length-start);const sheet=document.createElement('canvas');sheet.width=1280;sheet.height=1280*count;const ctx=sheet.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,sheet.width,sheet.height);for(let i=0;i<count;i++){const pic=await imload(viewComic.panels[start+i].preview);ctx.drawImage(pic,0,i*1280,1280,1280)}const a=document.createElement('a');a.href=sheet.toDataURL('image/png');a.download=(viewComic.title||'내 그림 웹툰').replace(/[\/:*?"<>|]/g,'_')+(viewComic.panels.length>12?`_${start+1}-${start+count}컷`:'')+'.png';a.click()});
async function comicGallery(){const root=$('dwComicGallery');root.replaceChildren();let items=await comicAll();items.sort((a,b)=>b.updated-a.updated);if(!items.length){root.textContent='아직 저장한 웹툰이 없어요.';return}for(const item of items){const card=document.createElement('article'),img=new Image(),title=document.createElement('strong');img.loading='lazy';img.decoding='async';img.src=item.panels[0]?.preview||'';img.alt=item.title;title.textContent=`${item.title} · ${item.panels.length}컷`;card.append(img,title);function button(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>comicGuard(fn);card.append(b)}button('✏️ 이어 그리기',async()=>{if(comic&&!confirm('현재 웹툰을 저장하고 다른 작품을 열까요?'))return;if(comic)await comicSavePanel();comic=comicCopy(item);comicIndex=0;await comicLoadPanel(comic.panels[0]);comicUi();msg('1컷을 불러왔어요. 다른 컷도 아래 그림 목록에서 고를 수 있어요.')});button('📖 감상',()=>comicView(item));button('🗑 삭제',async()=>{if(!confirm(`「${item.title}」 웹툰 ${item.panels.length}컷을 삭제할까요? 이 작업은 되돌릴 수 없어요.`))return;await comicTx('readwrite',s=>s.delete(item.id));if(comic?.id===item.id){comic=null;comicUi()}if(viewComic?.id===item.id){$('dwComicViewer').hidden=true;viewComic=null}await comicGallery()});root.append(card)}}
let galleryLoaded=false,galleryLoading=false;
function ensureGalleryLoaded(){
 if(galleryLoaded||galleryLoading)return;
 galleryLoading=true;
 // Avoid building many image thumbnails inside a Pencil input event.
 setTimeout(async()=>{
  try{
   await galleryRefresh();
   galleryLoaded=true;
  }catch(err){console.warn('그림 보관함 읽기',err)}
  finally{galleryLoading=false}
 },550);
}
// Small drawing canvas is ready immediately; saved thumbnail libraries stay idle
// until the child actually opens this tab.
render();
if(document.getElementById('draw')?.classList.contains('active'))ensureGalleryLoaded();
let comicGalleryOpened=false;
$('dwComicFold')?.addEventListener('toggle',()=>{if($('dwComicFold').open&&!comicGalleryOpened){comicGalleryOpened=true;comicGallery().catch(err=>{comicGalleryOpened=false;console.warn(err)})}});
let registeredHeroesLoaded=false;
document.addEventListener('webtoon:viewchange',ev=>{if(ev.detail?.id==='make'&&!registeredHeroesLoaded){registeredHeroesLoaded=true;registry()}});
})();
