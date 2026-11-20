/* C4.5.9 layer management and save fix.  Reuses C4.5.7 IndexedDB records without migration. */
(()=>{
'use strict';
const $=id=>document.getElementById(id),W=640,H=640, canvas=$('dwCanvas');if(!canvas)return;
const ctx=canvas.getContext('2d',{willReadFrequently:true});
const paint=document.createElement('canvas'),under=document.createElement('canvas');paint.width=under.width=W;paint.height=under.height=H;
const pc=paint.getContext('2d',{willReadFrequently:true}),uc=under.getContext('2d',{willReadFrequently:true});
const stage=document.createElement('canvas');stage.width=W;stage.height=H;const sc=stage.getContext('2d',{willReadFrequently:true});
let elements=[],selection=null,images=new Map(),tool='pen',color='#d76eab',size=11,activePointer=null,last=null,dragStart=null,history=[],redo=[],currentId=null;
const swatches=['#303038','#ffffff','#e7659e','#ed9a58','#f2c455','#78ba8c','#65bdda','#678eda','#9a7bc7','#b16f58'];
function say(msg){if(typeof toast==='function')toast(msg);else alert(msg)}
function uid(){return 'layer-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)}
function copy(v){return JSON.parse(JSON.stringify(v))}
function image(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('그림을 열 수 없어요.'));im.src=src})}
const colors=$('dwColors');swatches.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='dw-swatch';b.style.background=c;b.title=c;b.setAttribute('aria-label','색상 '+c);b.onclick=()=>{$('dwColor').value=color=c;syncColors()};colors.append(b)});
function syncColors(){[...colors.children].forEach((b,i)=>b.classList.toggle('selected',swatches[i]===color))}syncColors();
function setTool(t){tool=t;document.querySelectorAll('[data-dw-tool]').forEach(b=>b.classList.toggle('active',b.dataset.dwTool===t));render()}
document.querySelectorAll('[data-dw-tool]').forEach(b=>b.onclick=()=>setTool(b.dataset.dwTool));
$('dwColor').oninput=e=>{color=e.target.value;syncColors()};$('dwSize').oninput=e=>{size=+e.target.value;$('dwSizeLabel').textContent=size};$('dwShowBackground').onchange=()=>render();
function selected(){return elements.find(e=>e.id===selection)}
function layerName(e){if(e.origin){const opt=[...$('dwHeroSource').options].find(o=>o.value===e.origin);return (opt?.textContent||'주인공')+' 밑그림'}if(e.kind==='shape'){const names={circle:'원',ellipse:'타원',rect:'네모',round:'둥근 네모',triangle:'세모',star:'별',heart:'하트',cloud:'구름',bubble:'말풍선'};return (names[e.shape]||'도형')+' 도형'}return e.template?'연습 밑그림':'가져온 그림'}
function layerList(){const target=$('dwLayerList');if(!target)return;target.replaceChildren();if(!elements.length){target.textContent='추가한 도형과 밑그림이 이곳에 표시됩니다.';return}for(const e of [...elements].reverse()){
 const line=document.createElement('div');line.className='dw-layer-row'+(e.id===selection?' selected':'');
 const name=document.createElement('button');name.type='button';name.className='dw-layer-name';name.textContent=(e.visible===false?'🙈 ':'🖼 ')+layerName(e);name.title='이 그림 층을 선택';name.onclick=()=>{selection=e.id;setTool('select')};line.append(name);
 const button=(label,title,fn)=>{const b=document.createElement('button');b.type='button';b.className='dw-layer-action';b.textContent=label;b.title=title;b.setAttribute('aria-label',layerName(e)+' '+title);b.onclick=fn;line.append(b)};
 button(e.visible===false?'👁‍🗨':'👁','표시·숨기기',()=>{remember();e.visible=e.visible===false?true:false;render()});
 button(e.locked?'🔒':'🔓','잠금 전환',()=>{remember();e.locked=!e.locked;render()});
 button('🗑','이 층 삭제',()=>removeLayer(e.id));target.append(line)
 }}
function removeLayer(id){const e=elements.find(q=>q.id===id);if(!e||!confirm('「'+layerName(e)+'」만 삭제할까요? 펜으로 그린 선과 다른 도형은 그대로 남아요.'))return;remember();elements=elements.filter(q=>q.id!==id);images.delete(id);if(selection===id)selection=null;render()}

function boxOf(e){return {left:e.x-e.w/2,top:e.y-e.h/2,right:e.x+e.w/2,bottom:e.y+e.h/2}}
function polygon(type){const p=[];if(type==='triangle')return [[0,-.53],[.58,.49],[-.58,.49]];
 if(type==='star'){for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?.23:.52;p.push([Math.cos(a)*r,Math.sin(a)*r])}return p}
 if(type==='heart'){for(let i=0;i<=90;i++){let t=i*Math.PI*2/90; p.push([16*Math.sin(t)**3/38,-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/38])}return p}
 if(type==='cloud')return [[-.47,.3],[-.53,.06],[-.37,-.13],[-.18,-.13],[-.12,-.38],[.14,-.42],[.35,-.2],[.48,-.16],[.59,.08],[.47,.3]];
 if(type==='bubble')return [[-.52,-.38],[.51,-.38],[.51,.25],[.05,.25],[-.2,.52],[-.18,.25],[-.52,.25]];
 return []}
function shapePath(c,e){const t=e.shape;c.beginPath();if(t==='circle'||t==='ellipse'){c.ellipse(0,0,e.w/2,e.h/2,0,0,2*Math.PI);return}if(t==='rect'){c.rect(-e.w/2,-e.h/2,e.w,e.h);return}if(t==='round'){const r=Math.min(26,e.w/5,e.h/5);c.roundRect(-e.w/2,-e.h/2,e.w,e.h,r);return}const pts=polygon(t);if(pts.length){c.moveTo(pts[0][0]*e.w,pts[0][1]*e.h);pts.slice(1).forEach(([x,y])=>c.lineTo(x*e.w,y*e.h));c.closePath()}}
function drawElement(c,e){c.save();c.globalAlpha=e.opacity==null?1:e.opacity;c.translate(e.x,e.y);c.rotate(e.rotation||0);c.scale(e.flip?-1:1,1);
 if(e.kind==='shape'){shapePath(c,e);if(e.fill!==null){c.fillStyle=e.fill||'#f3c0de';c.fill()}if(e.stroke!==null){c.strokeStyle=e.stroke||'#845cab';c.lineWidth=5;c.stroke()}}else{const im=images.get(e.id);if(im){c.drawImage(im,-e.w/2,-e.h/2,e.w,e.h)}}c.restore()}
function compose(c,white=false){c.clearRect(0,0,W,H);if(white){c.fillStyle='#fff';c.fillRect(0,0,W,H)}c.drawImage(under,0,0);elements.forEach(e=>{if(e.visible!==false)drawElement(c,e)});c.drawImage(paint,0,0)}
function render(){compose(ctx,$('dwShowBackground').checked);const e=selected();layerList();const controls=$('dwObjectControls');controls.hidden=!(e&&tool==='select');if(e&&tool==='select'){
 ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.rotation||0);ctx.strokeStyle='#864ab4';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.strokeRect(-e.w/2-5,-e.h/2-5,e.w+10,e.h+10);ctx.setLineDash([]);ctx.fillStyle='#fff';ctx.strokeStyle='#864ab4';for(const [x,y] of [[-e.w/2,-e.h/2],[e.w/2,-e.h/2],[e.w/2,e.h/2],[-e.w/2,e.h/2]]){ctx.beginPath();ctx.rect(x-10,y-10,20,20);ctx.fill();ctx.stroke()}ctx.restore();
 $('dwObjectOpacity').value=Math.round((e.opacity??1)*100);
 $('dwShapeStyling').hidden=e.kind!=='shape';$('dwHeroStyling').hidden=!(e.kind==='image'&&e.origin);
 if(e.kind==='shape'){$('dwObjectColor').value=e.fill||'#d76eab';$('dwObjectStroke').value=e.stroke||'#765a91';$('dwNoFill').checked=e.fill===null;$('dwNoStroke').checked=e.stroke===null;}
 if(e.origin){$('dwSelectedHeroMode').value=e.variant||'original'}
 $('dwObjectLock').textContent=e.locked?'🔓 잠금 풀기':'🔒 잠그기';
 }}
function snapshot(){return {a:under.toDataURL(),b:paint.toDataURL(),els:copy(elements),id:selection}}
function remember(){history.push(snapshot());if(history.length>12)history.shift();redo.length=0}
async function restore(s){const [a,b]=await Promise.all([image(s.a),image(s.b)]);uc.clearRect(0,0,W,H);pc.clearRect(0,0,W,H);uc.drawImage(a,0,0);pc.drawImage(b,0,0);elements=copy(s.els);selection=s.id;await refreshImages();render()}
async function step(from,to){if(!from.length)return;to.push(snapshot());await restore(from.pop())}
$('dwUndo').onclick=()=>step(history,redo).catch(e=>say(e.message));$('dwRedo').onclick=()=>step(redo,history).catch(e=>say(e.message));
function xy(evt){const r=canvas.getBoundingClientRect();return {x:(evt.clientX-r.left)*W/r.width,y:(evt.clientY-r.top)*H/r.height}}
function hit(e,p){const dx=p.x-e.x,dy=p.y-e.y,a=-(e.rotation||0),x=dx*Math.cos(a)-dy*Math.sin(a),y=dx*Math.sin(a)+dy*Math.cos(a);return Math.abs(x)<=e.w/2+11&&Math.abs(y)<=e.h/2+11}
function pick(p){for(let i=elements.length-1;i>=0;i--)if(elements[i].visible!==false&&!elements[i].locked&&hit(elements[i],p))return elements[i];return null}
function stroke(a,b){pc.save();pc.globalCompositeOperation=tool==='eraser'?'destination-out':'source-over';pc.lineCap='round';pc.lineJoin='round';pc.strokeStyle=color;pc.fillStyle=color;pc.lineWidth=tool==='brush'?size*1.8:size;pc.beginPath();pc.moveTo(a.x,a.y);pc.lineTo(b.x,b.y);pc.stroke();if(a.x===b.x&&a.y===b.y){pc.beginPath();pc.arc(a.x,a.y,pc.lineWidth/2,0,Math.PI*2);pc.fill()}pc.restore()}
function fillAt(p){compose(sc,false);const source=sc.getImageData(0,0,W,H).data,ix=(Math.floor(p.y)*W+Math.floor(p.x))*4;if(ix<0||ix>=source.length)return;const target=[...source.slice(ix,ix+4)],rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));const out=uc.getImageData(0,0,W,H),px=out.data,visited=new Uint8Array(W*H),queue=new Int32Array(W*H);let head=0,tail=0,start=Math.floor(p.y)*W+Math.floor(p.x);queue[tail++]=start;visited[start]=1;
 while(head<tail){const pos=queue[head++],i=pos*4;if(Math.abs(source[i]-target[0])+Math.abs(source[i+1]-target[1])+Math.abs(source[i+2]-target[2])>34||Math.abs(source[i+3]-target[3])>90)continue;px[i]=rgb[0];px[i+1]=rgb[1];px[i+2]=rgb[2];px[i+3]=255;const x=pos%W,y=(pos/W)|0;
 if(x>0&&!visited[pos-1]){visited[pos-1]=1;queue[tail++]=pos-1}if(x<W-1&&!visited[pos+1]){visited[pos+1]=1;queue[tail++]=pos+1}if(y>0&&!visited[pos-W]){visited[pos-W]=1;queue[tail++]=pos-W}if(y<H-1&&!visited[pos+W]){visited[pos+W]=1;queue[tail++]=pos+W}}
 uc.putImageData(out,0,0)}
function pointerDown(evt){if(activePointer!==null)return;if(evt.pointerType==='touch'&&evt.isPrimary===false)return;evt.preventDefault();const p=xy(evt);activePointer=evt.pointerId;last=p;try{canvas.setPointerCapture(evt.pointerId)}catch(_){}
 if(tool==='select'){
 const e=pick(p);selection=e?.id||null;dragStart=null;
 if(e&&!e.locked){const rot=e.rotation||0,dx=p.x-e.x,dy=p.y-e.y,a=-rot,rx=dx*Math.cos(a)-dy*Math.sin(a),ry=dx*Math.sin(a)+dy*Math.cos(a);const corner=Math.abs(Math.abs(rx)-e.w/2)<25&&Math.abs(Math.abs(ry)-e.h/2)<25;remember();dragStart={x:p.x,y:p.y,ox:e.x,oy:e.y,ow:e.w,oh:e.h,resize:corner}}
 }else{remember();if(tool==='bucket'){fillAt(p);activePointer=null}else stroke(p,p)}render()}
function pointerMove(evt){if(evt.pointerId!==activePointer)return;evt.preventDefault();const p=xy(evt);
 if(tool==='select'){const e=selected();if(e&&!e.locked&&dragStart){const dx=p.x-dragStart.x,dy=p.y-dragStart.y;if(dragStart.resize){const f=Math.max(.25,Math.min(4,1+(dx+dy)/Math.max(80,dragStart.ow)));e.w=Math.max(24,Math.min(1150,dragStart.ow*f));e.h=Math.max(24,Math.min(1150,dragStart.oh*f))}else{e.x=Math.max(-250,Math.min(890,dragStart.ox+dx));e.y=Math.max(-250,Math.min(890,dragStart.oy+dy))}}}
 else if(tool!=='bucket'){stroke(last,p);last=p}render()}
function pointerEnd(evt){if(evt.pointerId!==activePointer)return;activePointer=null;dragStart=null;last=null;render()}
canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerup',pointerEnd);canvas.addEventListener('pointercancel',pointerEnd);
function addElement(e){remember();elements.push({id:uid(),x:320,y:320,w:220,h:220,rotation:0,opacity:1,visible:true,flip:false,locked:false,...e});selection=elements.at(-1).id;setTool('select');render();return elements.at(-1)}
function svgWrap(body){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640"><g fill="none" stroke="#4c3a4e" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`}
const templates={
 rabbit:svgWrap(`<path d="M230 255 Q181 82 217 56 Q252 33 284 231 M355 225 Q369 45 406 52 Q453 68 391 254"/><ellipse cx="310" cy="447" rx="144" ry="136"/><ellipse cx="309" cy="290" rx="148" ry="135"/><ellipse cx="212" cy="541" rx="54" ry="38"/><ellipse cx="412" cy="541" rx="54" ry="38"/><path d="M273 300q-15 -24 -30 0 M365 300q-15 -24 -30 0"/><path d="M306 332l24 0 -12 13z M318 346q-12 21 -28 5 M318 346q13 21 28 5"/>`),
 dog:svgWrap(`<ellipse cx="320" cy="457" rx="143" ry="134"/><path d="M218 232 Q117 143 118 257 Q121 364 217 352 M423 230 Q517 132 532 240 Q534 337 427 351"/><ellipse cx="320" cy="285" rx="139" ry="124"/><ellipse cx="231" cy="543" rx="57" ry="42"/><ellipse cx="407" cy="543" rx="57" ry="42"/><ellipse cx="269" cy="293" rx="11" ry="17"/><ellipse cx="373" cy="293" rx="11" ry="17"/><path d="M305 332q15 -11 30 0l-15 18z M320 350q-21 25 -38 2 M320 350q21 25 38 2"/>`),
 cat:svgWrap(`<path d="M197 269L193 105L289 180Q324 174 356 181L462 99L450 271"/><ellipse cx="320" cy="430" rx="139" ry="126"/><ellipse cx="320" cy="278" rx="149" ry="121"/><path d="M210 282l-48 -12 M212 306l-58 8 M433 281l54 -10 M432 304l57 12"/><ellipse cx="269" cy="281" rx="11" ry="17"/><ellipse cx="374" cy="281" rx="11" ry="17"/><path d="M306 318l28 0 -14 14z M320 334q-12 16 -27 4 M320 334q12 16 27 4"/>`),
 princess:svgWrap(`<path d="M191 226 Q124 365 185 505 M446 225Q515 355 451 504"/><path d="M248 108Q257 29 323 46 Q386 35 408 108"/><path d="M256 97L272 57L307 83L325 37L350 84L389 54L403 100Z"/><ellipse cx="322" cy="190" rx="104" ry="119"/><path d="M250 284L235 344Q144 408 119 560Q316 621 520 560Q501 408 405 346L392 287Z"/><path d="M254 300Q194 312 173 373Q157 405 198 413L247 352 M391 300Q461 314 479 371Q485 400 448 413L401 354"/><path d="M282 184q-12 -17 -25 0 M374 184q-12 -17 -25 0 M305 236Q322 253 342 236"/>`),
 crown:svgWrap(`<path d="M112 446L83 189L217 283L323 120L430 285L561 185L532 447Z"/><rect x="112" y="439" width="421" height="84" rx="19"/><path d="M321 318L360 361L321 407L283 361Z"/>`),
 flower:svgWrap(`<ellipse cx="317" cy="206" rx="68" ry="111"/><ellipse cx="316" cy="438" rx="68" ry="111"/><ellipse cx="200" cy="318" rx="113" ry="69"/><ellipse cx="432" cy="318" rx="113" ry="69"/><ellipse cx="235" cy="236" rx="91" ry="67" transform="rotate(45 235 236)"/><ellipse cx="400" cy="400" rx="91" ry="67" transform="rotate(45 400 400)"/><circle cx="317" cy="317" r="68"/>`)};
function svgData(t){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(t)}
function canvasData(c){return c.toDataURL('image/png')}
function fileBase(src){return src.startsWith('data:')?src:src}
function imageForHero(id){try{if(['rabbit','dog','cat','fairy'].includes(id))return friendImageSource(id,'기뻐요');const h=heroes.find(q=>q.id===id);if(h){return princessThumb(h)}}catch(_){}return null}
function listHeroes(){const drop=$('dwHeroSource');const kinds=[['princess_strawberry','🍓 딸기공주'],['princess_emerald','💚 에메랄드공주'],['princess_starlight','🌙 달빛요정'],['princess_pearl','🤍 진주공주'],['princess_bob_story','🌷 단발머리공주'],['princess_flower','🌺 꽃공주'],['princess_moon','🌙 달빛공주'],['princess_rainbow','🌈 무지개공주'],['princess_fairy','🧚 반짝이요정'],['princess_sea','🌊 바다공주'],['princess_snow','❄️ 눈꽃공주'],['dog','🐶 강아지 몽이'],['cat','🐱 고양이 루루'],['rabbit','🐰 토끼 보송이'],['fairy','🧚 요정']];kinds.forEach(([id,name])=>{const o=document.createElement('option');o.value=id;o.textContent=name;drop.append(o)})}
listHeroes();
async function contourImage(im){const a=document.createElement('canvas'),edge=document.createElement('canvas');a.width=edge.width=384;a.height=edge.height=384;const ac=a.getContext('2d',{willReadFrequently:true}),ec=edge.getContext('2d');ac.clearRect(0,0,384,384);const r=Math.min(344/im.width,344/im.height),w=im.width*r,h=im.height*r;ac.drawImage(im,(384-w)/2,(384-h)/2,w,h);const d=ac.getImageData(0,0,384,384).data,out=ec.createImageData(384,384),px=out.data;
 for(let y=1;y<383;y++)for(let x=1;x<383;x++){const i=(y*384+x)*4,aa=d[i+3];if(aa<90)continue;let boundary=false;for(const q of [-4,4,-1536,1536])if(d[i+q+3]<90){boundary=true;break}if(boundary){for(let yy=-2;yy<=2;yy++)for(let xx=-2;xx<=2;xx++){const j=((y+yy)*384+x+xx)*4;if(j>=0&&j<px.length){px[j]=70;px[j+1]=48;px[j+2]=86;px[j+3]=255}}}}
 ec.putImageData(out,0,0);return canvasData(edge)}
async function refreshImages(){images.clear();await Promise.all(elements.filter(e=>e.kind==='image').map(async e=>{try{const src=e.origin?imageForHero(e.origin):e.src;if(!src)return;let im=await image(src);if(e.variant==='outline'&&e.origin){const cacheKey=e.origin+'-outline';if(!window.dwContourCache)window.dwContourCache=new Map();let cached=window.dwContourCache.get(cacheKey);if(!cached){cached=await contourImage(im);window.dwContourCache.set(cacheKey,cached)}im=await image(cached)}images.set(e.id,im)}catch(err){console.warn('그림 레이어 열기 실패',err)}}))}
function addImageReady(src,opts){return image(src).then(async im=>{let actual=im,variant=opts.variant||'original';if(variant==='outline'){const data=await contourImage(im);actual=await image(data)}const ratio=Math.min(1,im.width/im.height),tall=Math.min(1,im.height/im.width);const e=addElement({kind:'image',src:opts.origin?null:src,origin:opts.origin||null,variant,opacity:opts.opacity??(variant==='pale'?.4:1),template:opts.template||null,w:opts.w||Math.round(330*ratio),h:opts.h||Math.round(330*tall)});images.set(e.id,actual);render();return e})}
$('dwAddHero').onclick=async()=>{const id=$('dwHeroSource').value;if(!id){say('먼저 주인공을 골라 주세요.');return}const src=imageForHero(id);if(!src){say('이 주인공 그림은 아직 준비되지 않았어요.');return}try{await addImageReady(src,{origin:id,variant:$('dwHeroMode').value});say('주인공 밑그림을 도화지에 추가했어요.')}catch(e){say(e.message)}};
$('dwAddShape').onclick=()=>addElement({kind:'shape',shape:$('dwShape').value,fill:color,stroke:'#765a91',w:210,h:180});
$('dwTemplate').onchange=async evt=>{const id=evt.target.value;if(id==='blank')return;try{await addImageReady(svgData(templates[id]),{w:270,h:270,template:id});say('연습 밑그림을 추가했어요.')}catch(e){say(e.message)}evt.target.value='blank'};
$('dwLoadImage').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>12*1024*1024){say('12MB 이하 그림을 골라 주세요.');return}try{const data=await new Promise((res,rej)=>{const reader=new FileReader();reader.onload=()=>res(reader.result);reader.onerror=()=>rej(Error('읽기 실패'));reader.readAsDataURL(file)});await addImageReady(data,{});say('기존 도화지는 그대로 두고 그림을 추가했어요.')}catch(err){say(err.message)}e.target.value=''};
$('dwBlank').onclick=()=>{if(!confirm('새 도화지를 열까요? 저장하지 않은 그림은 사라집니다.'))return;elements=[];selection=null;images.clear();uc.clearRect(0,0,W,H);pc.clearRect(0,0,W,H);history=[];redo=[];currentId=null;$('dwName').value='새 그림';$('dwTemplate').value='blank';setTool('pen')};
function changeElement(fn){const e=selected();if(!e)return;remember();fn(e);render()}
const controls={dwObjectSmaller:e=>{e.w*=.83;e.h*=.83},dwObjectBigger:e=>{e.w*=1.2;e.h*=1.2},dwObjectWide:e=>{e.w*=1.2},dwObjectTall:e=>{e.h*=1.2},dwObjectRotate:e=>{e.rotation=(e.rotation||0)+Math.PI/12},dwObjectFlip:e=>{e.flip=!e.flip},dwObjectLock:e=>{e.locked=!e.locked}};
Object.entries(controls).forEach(([id,fn])=>$(id).onclick=()=>changeElement(fn));
$('dwObjectOpacity').onchange=e=>changeElement(obj=>obj.opacity=Number(e.target.value)/100);
$('dwObjectColor').onchange=e=>changeElement(obj=>{if(obj.kind==='shape'){obj.fill=e.target.value;$('dwNoFill').checked=false}});
$('dwObjectStroke').onchange=e=>changeElement(obj=>{if(obj.kind==='shape'){obj.stroke=e.target.value;$('dwNoStroke').checked=false}});
$('dwNoFill').onchange=e=>changeElement(obj=>{if(obj.kind==='shape')obj.fill=e.target.checked?null:$('dwObjectColor').value});
$('dwNoStroke').onchange=e=>changeElement(obj=>{if(obj.kind==='shape')obj.stroke=e.target.checked?null:$('dwObjectStroke').value});
$('dwSelectedHeroMode').onchange=async ev=>{const target=selected();if(!target||!target.origin)return;const id=target.id;const variant=ev.target.value;remember();target.variant=variant;target.opacity=variant==='pale'?0.4:1;
 try{await refreshImages();selection=id;render();say('밑그림 모습을 바꿨어요. 그린 선과 위치는 그대로예요.')}catch(err){say('밑그림 전환 실패: '+err.message)}};

$('dwObjectDelete').onclick=()=>{if(selection)removeLayer(selection)};
$('dwObjectClone').onclick=()=>{const e=selected();if(!e)return;const cloned=copy(e);delete cloned.id;const ne=addElement({...cloned,x:e.x+32,y:e.y+32});if(e.kind==='image')images.set(ne.id,images.get(e.id));render()};
$('dwObjectFront').onclick=()=>{const i=elements.findIndex(e=>e.id===selection);if(i<0||i===elements.length-1)return;remember();elements.push(elements.splice(i,1)[0]);render()};
$('dwObjectBack').onclick=()=>{const i=elements.findIndex(e=>e.id===selection);if(i<1)return;remember();elements.unshift(elements.splice(i,1)[0]);render()};
function exported(){compose(sc,false);return canvasData(stage)}
function blankCanvas(){const cv=document.createElement('canvas');cv.width=W;cv.height=H;return canvasData(cv)}
$('dwExport').onclick=()=>{const a=document.createElement('a');a.href=exported();a.download=($('dwName').value.trim()||'내 그림').replace(/[\\/:*?"<>|]/g,'_')+'.png';document.body.append(a);a.click();a.remove();say('PNG 파일을 저장했어요.')};
const DB='webtoon-child-drawing-workshop-v1',STORE='paintings';
function openDB(){return new Promise((res,rej)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:'id'})};req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error)})}
async function transact(mode,run){const db=await openDB();try{return await new Promise((res,rej)=>{const tx=db.transaction(STORE,mode),req=run(tx.objectStore(STORE));req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error);tx.onabort=()=>rej(tx.error)})}finally{db.close()}}
const all=()=>transact('readonly',s=>s.getAll());
async function save(silent=false){const entry={id:currentId||('drawing-'+Date.now()+'-'+Math.random().toString(36).slice(2,6)),name:$('dwName').value.trim()||'내 그림',preview:exported(),under:canvasData(under),paint:canvasData(paint),outline:null,elements:copy(elements),updated:Date.now()};const prior=currentId?await transact('readonly',s=>s.get(currentId)):null;if(prior?.registered)entry.registered=true;await transact('readwrite',s=>s.put(entry));currentId=entry.id;try{await refreshGallery()}catch(err){console.warn('보관함 화면 갱신 지연',err)}if(!silent)say('그림과 도형의 편집 상태를 저장했어요!');return entry}
$('dwSave').onclick=()=>save().catch(e=>say('보관함 저장 실패: '+(e?.message||e)+' · 저장 공간을 확인해 주세요'));
async function openItem(item){if(!confirm('이 그림을 다시 열까요? 저장하지 않은 작업은 사라집니다.'))return;const [u,p,o]=await Promise.all([image(item.under||blankCanvas()),image(item.paint||blankCanvas()),item.outline?image(item.outline):Promise.resolve(null)]);uc.clearRect(0,0,W,H);pc.clearRect(0,0,W,H);uc.drawImage(u,0,0);pc.drawImage(p,0,0);elements=copy(item.elements||[]);if(o&&!item.elements){const old=addElement({kind:'image',src:item.outline,w:640,h:640,opacity:1});images.set(old.id,o)}await refreshImages();currentId=item.id;selection=null;history=[];redo=[];$('dwName').value=item.name;$('dwTemplate').value='blank';setTool('select');say('저장한 그림을 편집할 수 있어요.')}
function chooseHero(preview){settings.custom=preview;settings.hero='custom';settings.studioPrincess=false;settings.studioRecipe=null;if(typeof renderCharacterChoices==='function')renderCharacterChoices();if(typeof switchView==='function')switchView('make')}
async function registry(){try{window.webtoonDrawingHeroes=(await all()).filter(x=>x.registered).sort((a,b)=>b.updated-a.updated).map(x=>({id:x.id,name:x.name,preview:x.preview}));if(typeof renderCharacterChoices==='function')renderCharacterChoices()}catch(err){console.warn('내 그림 주인공 불러오기 실패',err)}}
window.webtoonDrawingUnregister=async function(id){if(!confirm('주인공 선택 목록에서만 해제할까요? 그림 보관함과 기존 웹툰은 그대로 남아요.'))return;const item=await transact('readonly',s=>s.get(id));if(!item)return;item.registered=false;await transact('readwrite',s=>s.put(item));await registry();await refreshGallery();say('주인공 등록을 해제했어요. 원본은 그대로예요.')};
async function register(item){item.registered=true;await transact('readwrite',s=>s.put(item));await registry();await refreshGallery();chooseHero(item.preview);say('내가 만든 주인공으로 등록했어요!')}
$('dwWebtoon').onclick=async()=>{try{const item=await save(true);await register(item)}catch(e){say('등록 실패: '+e.message)}};
async function refreshGallery(){const box=$('dwGallery');box.replaceChildren();let records=[];try{records=(await all()).sort((a,b)=>b.updated-a.updated)}catch(e){box.textContent='보관함을 열 수 없습니다. Safari 일반 탭을 확인해 주세요.';return}if(!records.length){box.textContent='첫 작품을 만들어 보세요!';return}records.forEach(item=>{const card=document.createElement('div');card.className='dw-card';const pic=new Image();pic.src=item.preview;pic.alt=item.name;const title=document.createElement('b');title.textContent=item.name;card.append(pic,title);const acts=document.createElement('div');acts.className='actions';function b(text,fn){const el=document.createElement('button');el.type='button';el.textContent=text;el.onclick=fn;acts.append(el)}
 b('✏️ 이어 그리기',()=>openItem(item).catch(e=>say(e.message)));
 b(item.registered?'🎬 주인공 사용':'🎬 주인공 등록',()=>register(item).catch(e=>say(e.message)));
 if(item.registered)b('↩ 등록 해제',()=>window.webtoonDrawingUnregister(item.id));
 b('🗑 그림 삭제',async()=>{if(!confirm('이 그림을 보관함에서 삭제할까요? 기존 웹툰 컷에는 저장된 그림이 남아 있어요.'))return;await transact('readwrite',s=>s.delete(item.id));if(currentId===item.id)currentId=null;await registry();await refreshGallery()});card.append(acts);box.append(card)})}
render();refreshGallery();registry();
})();
