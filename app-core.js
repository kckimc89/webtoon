const embeddedCharacters={"bear-standing.webp":"webtoon-art/cd3299bf26226b8440965c46.webp","cat-standing.webp":"webtoon-art/e6f4fe63e000a248b10c1b37.webp","fairy-standing.webp":"webtoon-art/bdbc653b0f47c56314997117.webp","fox-standing.webp":"webtoon-art/20dbff14a42a213bdd34d70b.webp","rabbit-jumping.webp":"webtoon-art/a698ba7e8bce83a962e8c306.webp","rabbit-key.webp":"webtoon-art/5131956a6c7b6a661884fc67.webp","rabbit-running.webp":"webtoon-art/d287d38087e8181af4b9c132.webp","rabbit-standing.webp":"webtoon-art/f3576e93b9e777b07f643e54.webp","rabbit-surprised.webp":"webtoon-art/9dfbb58832aeb25e10f63274.webp","rabbit-walking.webp":"webtoon-art/dac33dbd58bc972b6cbba8e9.webp","robot-standing.webp":"webtoon-art/c15ce969906998cf722ac16f.webp","cat-walking.webp":"webtoon-art/9dde8070fcdcaa0c75ef4442.webp","cat-surprised.webp":"webtoon-art/cb108820422c8e974177aafa.webp","cat-key.webp":"webtoon-art/b1f922ddffe82e866a196c91.webp","cat-jumping.webp":"webtoon-art/027ff02042af94ca5150f7d9.webp","fox-walking.webp":"webtoon-art/c93e9b7d2927f4c56bbb5db5.webp","fox-surprised.webp":"webtoon-art/c81496a18fdb79bbde4ad64e.webp","fox-key.webp":"webtoon-art/cd4d13ce83d977067d35c482.webp","fox-jumping.webp":"webtoon-art/5cbbf687f5ef520e8f1add99.webp","fairy-walking.webp":"webtoon-art/e12b6bb734829eb59c4775e7.webp","fairy-surprised.webp":"webtoon-art/b834b992744ec2dc75900712.webp","fairy-key.webp":"webtoon-art/fc461c2a56081aeaa867258f.webp","fairy-jumping.webp":"webtoon-art/0b4f6735199aee4d0b92739d.webp"};
// C3.2.1: Data URLs can be extremely long (>90,000 chars) when injected as
// HTML/SVG attributes. Convert each embedded image into a short blob URL once.
// The images remain within this single HTML file; no assets folder or network calls.
const characterImageUrls={...embeddedCharacters};


const $=id=>document.getElementById(id), $$=s=>document.querySelectorAll(s);
const storageKey='family-webtoon-theater-c31';
const settings={
  hero:'rabbit', heroName:'루루', heroTrait:'호기심 많고 용감함', custom:null,
  title:'반짝이는 비밀 열쇠', idea:'토끼가 숲에서 반짝이는 열쇠를 발견해요', story:'key', count:4, baseBackground:'forest'
};
let state={title:'', panels:[], hero:'rabbit', heroName:'루루', heroTrait:'', custom:null, story:'key'};
let selected=0;
const heroes=[
  {id:'dog', emoji:'🐶', name:'몽이 (강아지)', colors:{body:'#fff0d8', ear:'#f4b97e', accent:'#75bfee'}},
  {id:'rabbit', emoji:'🐰', name:'토끼', colors:{body:'#fffdfd', ear:'#f6b6cf', accent:'#7b5bf1'}},
  {id:'cat', emoji:'🐱', name:'고양이', colors:{body:'#ffd66e', ear:'#f7c370', accent:'#ef7a9f'}},
  {id:'fox', emoji:'🦊', name:'여우', colors:{body:'#ffb060', ear:'#ffddbf', accent:'#7b6dff'}},
  {id:'fairy', emoji:'🧚', name:'요정', colors:{body:'#ffe0ea', ear:'#ffe0ea', accent:'#7cd9c7'}},
  {id:'robot', emoji:'🤖', name:'로봇', colors:{body:'#d9eaf8', ear:'#d9eaf8', accent:'#68b3ff'}},
  {id:'bear', emoji:'🐻', name:'곰', colors:{body:'#c89a72', ear:'#e6be9f', accent:'#ef84aa'}},
  {id:'princess_flower',emoji:'🌸',name:'꽃 공주',colors:{body:'#ffe2d7',ear:'#ffccd0',accent:'#f5a9d3'}},
  {id:'princess_moon',emoji:'🌙',name:'달빛 공주',colors:{body:'#ffe2d7',ear:'#e4d6ff',accent:'#b5a0e8'}},
  {id:'princess_rainbow',emoji:'🌈',name:'무지개 공주',colors:{body:'#ffe2d7',ear:'#d1e9ff',accent:'#93c8fc'}},
  {id:'princess_fairy',emoji:'🧚',name:'반짝이 요정',colors:{body:'#ffe2d7',ear:'#ffbfde',accent:'#fcaee2'}},
  {id:'princess_sea',emoji:'🫧',name:'바다 공주',colors:{body:'#ffe2d7',ear:'#a8e7e3',accent:'#a6d7e9'}},
  {id:'princess_snow',emoji:'❄️',name:'눈꽃 공주',colors:{body:'#ffe2d7',ear:'#cceaff',accent:'#c9ddfa'}},
  {id:'princess_bob_story',emoji:'🌹',name:'단발머리 공주',colors:{body:'#ffe2d7',ear:'#ffc2d5',accent:'#fa8ab4'}},
  {id:'princess_strawberry',emoji:'🍓',name:'딸기 공주',colors:{body:'#ffe0e5',ear:'#ffc2d5',accent:'#fa7e94'}},
  {id:'princess_emerald',emoji:'🌿',name:'에메랄드 공주',colors:{body:'#e8d5ae',ear:'#a9dbb9',accent:'#2fbd88'}},
  {id:'princess_starlight',emoji:'🌟',name:'별빛 요정',colors:{body:'#f1e5ff',ear:'#b8a7f9',accent:'#9875ed'}},
  {id:'princess_pearl',emoji:'🐚',name:'진주 공주',colors:{body:'#d8f5f2',ear:'#b1e9ff',accent:'#4edbd0'}}
];
const stories=[
  {id:'key', icon:'🗝️', title:'비밀 열쇠', titleValue:'반짝이는 비밀 열쇠', idea:'토끼가 숲에서 반짝이는 열쇠를 발견해요'},
  {id:'friend', icon:'🦋', title:'새 친구', titleValue:'숲에서 만난 새 친구', idea:'주인공이 길을 잃은 친구를 도와줘요'},
  {id:'treasure', icon:'💎', title:'보물 찾기', titleValue:'별빛 보물 찾기', idea:'빛나는 보물을 찾아 모험을 떠나요'},
  {id:'door', icon:'🚪', title:'비밀 문', titleValue:'열리면 안 되는 문?', idea:'이상한 문을 발견하고 열어 볼지 고민해요'}
];
const bgMeta={
  forest:{name:'숲', sky:'#b8e7ff', ground:'#bde3a4', deco1:'🌲', deco2:'🍄'},
  garden:{name:'꽃정원', sky:'#ffd7ee', ground:'#b9e39a', deco1:'🌷', deco2:'🦋'},
  sea:{name:'바닷속', sky:'#92dcff', ground:'#53b6cf', deco1:'🐠', deco2:'🪸'},
  castle:{name:'성', sky:'#d8c2ff', ground:'#b4d3a5', deco1:'🏰', deco2:'⭐'},
  school:{name:'학교', sky:'#d7eafd', ground:'#efc5a3', deco1:'🏫', deco2:'✏️'},
  space:{name:'우주', sky:'#161d4d', ground:'#3b3673', deco1:'🪐', deco2:'✨'}
};
// C3.9.6 simple scenery preserves the existing princess/props layers.
const simpleBgSettings={
 plain_white:['흰색','#ffffff'],plain_pink:['연분홍','#ffe0ed'],plain_sky:['연하늘','#d9f0ff'],
 plain_lavender:['연보라','#efe0ff'],plain_yellow:['연노랑','#fff2c7'],plain_mint:['연민트','#e1fff2'],
 plain_sparkles:['반짝 배경','#f4e8ff'],plain_stage:['무대','#ffe6f5']
};
for(const [id,[name,color]] of Object.entries(simpleBgSettings)){
 bgMeta[id]={name,sky:color,ground:color,deco1:'✨',deco2:'🌸'};
}

const emotions=['기뻐요','놀랐어요','궁금해요','용감해요','자랑스러워요','슬퍼요','화났어요','생각해요','신나요'];
const poses=['서 있기','걷기','뛰기','점프하기','앉기','손 흔들기'];
const actions=['발견하기','줍기','열기','바라보기','친구 만나기','축하하기'];
const props=['없음','열쇠','별','무지개','보석','나비','문','책','꽃','왕관','풍선','선물','마법봉','하트','달','구름','사탕','축구공','지도','물고기','고양이','강아지'];
const storyTemplates={
  key:[
    {caption:'숲길을 걷다가 반짝이는 것을 발견했어요.',speech:'어? 저게 뭐지?',emotion:'궁금해요',pose:'걷기',action:'발견하기',prop:'없음'},
    {caption:'가까이 가 보니 신비한 열쇠였어요!',speech:'와! 열쇠다!',emotion:'놀랐어요',pose:'서 있기',action:'발견하기',prop:'열쇠'},
    {caption:'열쇠로 비밀의 문을 열었어요.',speech:'열려라, 비밀문!',emotion:'용감해요',pose:'걷기',action:'열기',prop:'문'},
    {caption:'문 너머 아름다운 세상이 펼쳐졌어요!',speech:'정말 멋진 곳이야!',emotion:'기뻐요',pose:'점프하기',action:'축하하기',prop:'무지개'}
  ],
  friend:[
    {caption:'울고 있는 작은 친구를 만났어요.',speech:'왜 울고 있니?',emotion:'궁금해요',pose:'걷기',action:'친구 만나기',prop:'없음'},
    {caption:'길을 함께 찾아 주기로 했어요.',speech:'내가 도와줄게!',emotion:'용감해요',pose:'서 있기',action:'바라보기',prop:'별'},
    {caption:'드디어 친구의 집을 찾았어요.',speech:'여기가 맞나 봐!',emotion:'자랑스러워요',pose:'뛰기',action:'발견하기',prop:'문'},
    {caption:'두 친구는 함께 웃으며 인사했어요.',speech:'이제 친구야!',emotion:'기뻐요',pose:'손 흔들기',action:'축하하기',prop:'나비'}
  ],
  treasure:[
    {caption:'지도를 보고 보물을 찾으러 떠났어요.',speech:'모험을 시작하자!',emotion:'용감해요',pose:'서 있기',action:'바라보기',prop:'책'},
    {caption:'반짝이는 보석을 발견했어요.',speech:'보물이다!',emotion:'놀랐어요',pose:'점프하기',action:'발견하기',prop:'보석'},
    {caption:'보물을 조심히 집었어요.',speech:'소중히 가져가야지!',emotion:'자랑스러워요',pose:'앉기',action:'줍기',prop:'보석'},
    {caption:'보물을 지키는 별빛이 하늘에 퍼졌어요.',speech:'성공했어!',emotion:'기뻐요',pose:'손 흔들기',action:'축하하기',prop:'별'}
  ],
  door:[
    {caption:'이상한 문을 발견했어요.',speech:'여긴 뭐지?',emotion:'궁금해요',pose:'걷기',action:'발견하기',prop:'문'},
    {caption:'문을 열까 말까 고민했어요.',speech:'열어 봐도 될까?',emotion:'놀랐어요',pose:'서 있기',action:'바라보기',prop:'문'},
    {caption:'용기를 내어 문을 열었어요.',speech:'에라, 모르겠다!',emotion:'용감해요',pose:'뛰기',action:'열기',prop:'문'},
    {caption:'문 너머에 멋진 풍경이 나타났어요!',speech:'우와아!',emotion:'기뻐요',pose:'점프하기',action:'축하하기',prop:'무지개'}
  ]
};

function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2400)}
let makeViewReady=false;
function switchView(id){
 const ticket=++webtoonNavTicket;
 if(['make','edit','library'].includes(id)&&!webtoonStoryArtReady()){
  webtoonNavNotice('🎨 웹툰 그림 자료를 처음 불러오는 중이에요. 내 그림 만들기는 바로 이용할 수 있어요.');
  webtoonEnsureArt(['princess','animal','background']).then(()=>{if(ticket===webtoonNavTicket){webtoonNavNotice('');switchViewNow(id);}}).catch(err=>{if(ticket===webtoonNavTicket){webtoonNavNotice('그림 자료를 불러오지 못했어요. 파일 업로드를 확인하고 해당 메뉴를 다시 눌러 주세요.');console.warn(err);}});
  return;
 }
 webtoonNavNotice('');switchViewNow(id);
}
function switchViewNow(id){
 // The drawing workshop releases stale iPad Pencil capture on view changes,
 // while preserving all actual pixels and unfinished comic contents.
 document.dispatchEvent(new CustomEvent('webtoon:beforeviewchange',{detail:{id}}));
 $$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
 $$('.view').forEach(v=>v.classList.toggle('active',v.id===id));
 if(id==='library')renderLibrary();
 if(id==='make'&&!makeViewReady){makeViewReady=true;renderCharacterChoices();renderStoryChoices();preparePrincessStore();}
 if(id==='edit')preparePrincessStore();
 document.dispatchEvent(new CustomEvent('webtoon:viewchange',{detail:{id}}));
}
$$('.tab').forEach(btn=>btn.onclick=()=>switchView(btn.dataset.view));
function safe(s=''){return String(s).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}

// C3.9.6 editable vector princesses: outfit pieces are SVG paths, not regenerated character faces.
const princessDefaults={
 princess_flower:{hairStyle:'long',hairColor:'rose',dress:'pink',crown:'flower',wings:'none',staff:'flower',shoes:'pink',sparkles:'yes'},
 princess_moon:{hairStyle:'curl',hairColor:'violet',dress:'lavender',crown:'tiara',wings:'none',staff:'star',shoes:'purple',sparkles:'yes'},
 princess_rainbow:{hairStyle:'twintail',hairColor:'gold',dress:'blue',crown:'crown',wings:'none',staff:'star',shoes:'gold',sparkles:'yes'},
 princess_fairy:{hairStyle:'bob',hairColor:'rose',dress:'pink',crown:'bow',wings:'butterfly',staff:'heart',shoes:'pink',sparkles:'yes'},
 princess_sea:{hairStyle:'long',hairColor:'blue',dress:'mint',crown:'tiara',wings:'none',staff:'star',shoes:'white',sparkles:'yes'},
 princess_snow:{hairStyle:'long',hairColor:'silver',dress:'blue',crown:'crown',wings:'angel',staff:'star',shoes:'white',sparkles:'yes'},
 princess_bob_story:{hairStyle:'bob',hairColor:'rose',dress:'pink',crown:'tiara',wings:'none',staff:'none',shoes:'pink',sparkles:'yes'},
 princess_strawberry:{hairStyle:'bob',hairColor:'rose',dress:'pink',crown:'flower',wings:'none',staff:'heart',shoes:'pink',sparkles:'yes'},
 princess_emerald:{hairStyle:'long',hairColor:'brown',dress:'mint',crown:'tiara',wings:'none',staff:'flower',shoes:'gold',sparkles:'yes'},
 princess_starlight:{hairStyle:'bob',hairColor:'violet',dress:'lavender',crown:'flower',wings:'butterfly',staff:'star',shoes:'purple',sparkles:'yes'},
 princess_pearl:{hairStyle:'twintail',hairColor:'blue',dress:'blue',crown:'tiara',wings:'none',staff:'star',shoes:'white',sparkles:'yes'}
};
const princessColors={
 hair:{rose:'#ee83bc',gold:'#e9b847',brown:'#845b48',violet:'#a38ae2',blue:'#76c9e9',silver:'#d8e6f3'},
 dress:{pink:'#f6a8d2',lavender:'#cbb7f5',blue:'#9fd4f5',mint:'#9de1ca',yellow:'#f3da90',peach:'#f8bfa7'},
 shoes:{pink:'#ed7eaf',white:'#e9e7f6',gold:'#cfa44e',purple:'#9f82d8'}
};
const princessStyleKeys=['hairStyle','hairColor','dress','crown','wings','staff','shoes','sparkles','wearAccessory'];
const princessWearSlots={crown:['none','tiara'],hair:['none','ribbon','rose','flower','gem'],neck:['none','heart','pearl'],ears:['none','crystal','pink'],back:['none','butterfly'],hand:['none','star']};

function isPrincess(id){return Boolean(princessDefaults[id])}
function validPrincessStyle(st,id){
 const src=st||{}, base=princessDefaults[id]||princessDefaults.princess_flower;
 const choices={hairStyle:['long','twintail','bob','curl'],hairColor:Object.keys(princessColors.hair),dress:Object.keys(princessColors.dress),crown:['crown','tiara','bow','flower','none'],wings:['none','butterfly','angel'],staff:['none','star','heart','flower'],shoes:Object.keys(princessColors.shoes),sparkles:['yes','no'],wearAccessory:['none','ribbon','rose','flower','gem']};
 const next={};for(const k of princessStyleKeys)next[k]=choices[k].includes(src[k])?src[k]:(k==='wearAccessory'?'none':base[k]);
 // Migrate C3.9.9's single hair ornament into a separate hair slot, without changing older saved records.
 const old=next.wearAccessory;
 const incoming=src.wearSlots&&typeof src.wearSlots==='object'?src.wearSlots:{};
 next.wearSlots={};
 for(const slot of Object.keys(princessWearSlots)){
  const value=incoming[slot]??(slot==='hair'?old:'none');
  next.wearSlots[slot]=princessWearSlots[slot].includes(value)?value:'none';
 }
 return next;
}
function princessSvg(panel,heroId){
 const p=validPrincessStyle(panel.princessLook,heroId),hair=princessColors.hair[p.hairColor],dress=princessColors.dress[p.dress],shoe=princessColors.shoes[p.shoes];
 const pose=panel.pose||'서 있기',emotion=panel.emotion||'기뻐요';
 const jump=pose==='점프하기',run=pose==='뛰기',wave=pose==='손 흔들기';
 const deltaY=jump?-12:pose==='앉기'?8:0,tilt=run?-7:wave?-3:0;
 const backHair=p.hairStyle==='twintail'
   ? `<path d="M91 120 Q52 136 54 193 Q52 223 78 221 Q97 200 99 152Z" fill="${hair}" stroke="#7b627a" stroke-width="2"/><path d="M148 120 Q187 136 187 191 Q191 223 164 221 Q145 198 143 150Z" fill="${hair}" stroke="#7b627a" stroke-width="2"/>`
   :p.hairStyle==='bob'?`<path d="M76 128 Q65 170 82 189 Q101 193 106 162 L135 162 Q146 196 170 187 Q182 153 165 125Z" fill="${hair}"/>`
   :p.hairStyle==='curl'?`<path d="M78 115 Q52 152 77 181 Q51 203 82 212 Q99 203 105 181 L145 181 Q164 216 178 202 Q189 187 168 171 Q185 139 158 111Z" fill="${hair}"/>`
   :`<path d="M79 112 Q55 132 65 198 Q70 225 89 236 Q110 219 105 169 L140 169 Q145 224 169 235 Q191 206 173 132 Q167 95 127 94Z" fill="${hair}" stroke="#8b6784" stroke-width="2"/>`;
 const wings=p.wings==='none'?'':p.wings==='angel'
  ?`<g opacity=".85" stroke="#fff" stroke-width="2"><path d="M109 167 Q55 89 54 165 Q48 209 113 202Z" fill="#e1fbff"/><path d="M132 167 Q184 89 189 165 Q195 209 131 202Z" fill="#e8efff"/></g>`
  :`<g opacity=".83" stroke="#fff" stroke-width="2"><path d="M109 171 Q69 91 47 134 Q47 158 105 185 Q54 187 68 218 Q99 232 110 189Z" fill="#ffc5ed"/><path d="M131 171 Q174 91 197 134 Q193 159 134 185 Q191 187 176 218 Q145 232 131 189Z" fill="#aee4fb"/></g>`;
 const skirt=`<path d="M103 183 Q85 201 67 260 Q120 276 173 260 Q153 199 137 183 Z" fill="${dress}" stroke="#b98cae" stroke-width="2.5"/><path d="M100 187 Q94 228 78 257 M139 189 Q151 230 163 257" stroke="#fff" stroke-width="3" opacity=".5" fill="none"/><path d="M77 255 Q118 270 163 255" stroke="#fff9f8" stroke-width="8" opacity=".65" fill="none"/><path d="M100 188 Q120 205 140 188 L133 169 L107 169Z" fill="${dress}" stroke="#ad839d" stroke-width="2"/><path d="M110 182 Q121 194 131 182" stroke="#fff" stroke-width="3" fill="none"/><circle cx="120" cy="188" r="5" fill="#fff4be" stroke="#e1b65f" stroke-width="1.5"/>`;
 const arms=wave?`<path d="M103 182 Q80 164 79 148 M137 182 Q166 158 175 131" stroke="#ffddce" stroke-width="12" fill="none" stroke-linecap="round"/>`:
   jump?`<path d="M104 182 Q72 150 69 139 M138 182 Q173 153 177 138" stroke="#ffddce" stroke-width="12" fill="none" stroke-linecap="round"/>`:
   `<path d="M105 185 Q82 202 88 225 M137 185 Q159 200 155 225" stroke="#ffddce" stroke-width="12" fill="none" stroke-linecap="round"/>`;
 const feet=`<path d="M102 255 L99 272 M137 255 L141 272" stroke="#f5c4ba" stroke-width="10" stroke-linecap="round"/><ellipse cx="95" cy="275" rx="13" ry="7" fill="${shoe}"/><ellipse cx="145" cy="275" rx="13" ry="7" fill="${shoe}"/>`;
 const hairFront=p.hairStyle==='twintail'?`<path d="M82 115 Q120 72 160 116 Q144 101 130 121 Q99 104 82 125Z" fill="${hair}"/>`:
   p.hairStyle==='bob'?`<path d="M80 116 Q97 87 157 109 Q145 121 133 124 Q99 112 81 127Z" fill="${hair}"/>`:
   `<path d="M78 116 Q89 83 128 87 Q160 86 164 118 Q150 105 141 124 Q125 105 111 120 Q94 111 80 130Z" fill="${hair}"/>`;
 const ornament=p.crown==='none'?'':p.crown==='bow'?`<g transform="translate(156 99)"><path d="M0 0 Q-28 -25 -25 4 Q-23 17 0 6 Q26 -25 26 2 Q24 19 0 6Z" fill="#ff77af" stroke="#d75291" stroke-width="2"/><circle cx="0" cy="5" r="6" fill="#fff4bf"/></g>`:
  p.crown==='flower'?`<g transform="translate(154 94)">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-9" rx="7" ry="11" transform="rotate(${a})" fill="#ffb6d8"/>`).join('')}<circle r="7" fill="#fff0a0"/></g>`:
  p.crown==='tiara'?`<path d="M97 103 L105 87 L116 96 L121 81 L133 96 L143 86 L149 105" stroke="#e6c879" stroke-width="5" fill="none" stroke-linejoin="round"/><circle cx="121" cy="84" r="5" fill="#c4eeff"/>`:
   `<path d="M94 100 L99 81 L110 91 L121 71 L133 91 L145 81 L151 100Z" fill="#ffe095" stroke="#bd8c45" stroke-width="2"/><circle cx="121" cy="86" r="5" fill="#a9e8ff"/><circle cx="101" cy="93" r="3" fill="#ff9ca6"/><circle cx="142" cy="93" r="3" fill="#c8aeff"/>`;
 const mouth=emotion==='놀랐어요'?`<ellipse cx="121" cy="156" rx="5" ry="7" fill="#934c63"/>`:
  emotion==='슬퍼요'?`<path d="M113 161 Q121 153 129 161" stroke="#a6576d" stroke-width="2.6" fill="none" stroke-linecap="round"/>`:
  `<path d="M111 153 Q121 166 132 153" stroke="#a6576d" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
 const staff=p.staff==='none'?'':`<g transform="translate(170 159) rotate(-18)"><path d="M0 0 L0 85" stroke="#c59d52" stroke-width="5" stroke-linecap="round"/><path d="M0 -8 ${p.staff==='heart'?'C-21 -28 -28 -8 0 12 C28 -8 21 -28 0 -8':'L5 0 L16 0 L7 9 L11 22 L0 15 L-11 22 L-7 9 L-16 0 L-5 0 Z'}" fill="${p.staff==='flower'?'#ffb7d7':p.staff==='heart'?'#ff8fb6':'#ffec9c'}" stroke="#ffffff" stroke-width="2"/><circle cx="0" cy="5" r="5" fill="#fff"/></g>`;
 const twinkles=p.sparkles==='yes'?`<g fill="#fff7b6" stroke="#fff" stroke-width="1"><path d="M65 152l4 -10 4 10 10 4-10 4-4 10-4-10-10-4Z"/><path d="M179 114l3 -8 3 8 8 3-8 3-3 8-3-8-8-3Z"/><circle cx="59" cy="219" r="3"/><circle cx="190" cy="226" r="4"/></g>`:'';
 return `<g transform="translate(0 ${deltaY}) rotate(${tilt} 120 190)">
 ${backHair}${wings}${feet}${arms}${skirt}<ellipse cx="120" cy="130" rx="44" ry="46" fill="#ffddcc" stroke="#e8b5b1" stroke-width="2"/>${hairFront}
 <ellipse cx="105" cy="142" rx="6" ry="8" fill="#3e354b"/><ellipse cx="138" cy="142" rx="6" ry="8" fill="#3e354b"/><circle cx="107" cy="140" r="2.5" fill="#fff"/><circle cx="140" cy="140" r="2.5" fill="#fff"/>
 <ellipse cx="88" cy="153" rx="9" ry="5" fill="#f49db0" opacity=".55"/><ellipse cx="152" cy="153" rx="9" ry="5" fill="#f49db0" opacity=".55"/>
 <path d="M120 146 l-2 3 3 2" stroke="#cf8b93" stroke-width="1.5" fill="none"/>${mouth}${ornament}${staff}${twinkles}</g>`;
}

// Premium princess images, original faces kept unchanged between panels.
// Main layer is a transparent 3D illustrated character. Color adjustments are
// confined to pre-masked hair/dress regions, not a regeneration of the face.
const premiumPrincessImages = {"princess_flower":{"base":"webtoon-art/4defb16058731ccaff139949.webp","hair":"webtoon-art/bc1bba5384d24911741f9857.webp","dress":"webtoon-art/9f1bef727a3b96ea88ef455a.webp","width":503,"height":755,"thumb":"webtoon-art/1b6459fa1cafc02b7f295bc0.webp"},"princess_moon":{"base":"webtoon-art/d0bc4514cf832ff2045590bc.webp","hair":"webtoon-art/e27c028c399ef223b1861244.webp","dress":"webtoon-art/94a38a29d97f9ae24ab225c4.webp","width":503,"height":755,"thumb":"webtoon-art/3fbd40952d8ae1295f94302a.webp"},"princess_rainbow":{"base":"webtoon-art/343e7b740c8de765444f7f9a.webp","hair":"webtoon-art/aba70c0619ad89ef8976ee86.webp","dress":"webtoon-art/bd2a2c23f4555bab5e3b001c.webp","width":535,"height":667,"thumb":"webtoon-art/f425bd0fdaf6bf74898ad810.webp"},"princess_fairy":{"base":"webtoon-art/5aa8e30e0bded764c321d49a.webp","hair":"webtoon-art/ae8dbe542c538f1f65ba86dd.webp","dress":"webtoon-art/372d4277f308ef262b241cdf.webp","width":535,"height":610,"thumb":"webtoon-art/e495192ad7daecf954e266a1.webp"},"princess_sea":{"base":"webtoon-art/bc3529cec4090b58587a8f0d.webp","hair":"webtoon-art/2438c04731c89722981ffec8.webp","dress":"webtoon-art/673f1bda0b75170ebada3e71.webp","width":535,"height":713,"thumb":"webtoon-art/979c0e0823d7b640faa7737c.webp"},"princess_snow":{"base":"webtoon-art/6b45831ec2eee533ddc2b163.webp","hair":"webtoon-art/1bb36fd1ced663225e8cda9e.webp","dress":"webtoon-art/a7186fcca5c574c68255922d.webp","width":535,"height":713,"thumb":"webtoon-art/a9e43eef2c6effcc9879f6d2.webp"}};
const premiumHue={rose:'hue-rotate(0deg) saturate(1.25)',gold:'sepia(.35) saturate(1.65) hue-rotate(325deg)',brown:'sepia(.4) saturate(1.2) hue-rotate(335deg)',violet:'hue-rotate(78deg) saturate(1.45)',blue:'hue-rotate(175deg) saturate(1.45)',silver:'saturate(.36) brightness(1.15)'};
const premiumDressHue={pink:'hue-rotate(0deg) saturate(1.25)',lavender:'hue-rotate(58deg) saturate(1.15)',blue:'hue-rotate(175deg) saturate(1.25)',mint:'hue-rotate(125deg) saturate(1.2)',yellow:'hue-rotate(290deg) saturate(1.3)',peach:'hue-rotate(322deg) saturate(1.25)'};
Object.assign(premiumPrincessImages,{"princess_strawberry":{"base":"webtoon-art/4cb4b5e27fd388d112bf40f1.webp","thumb":"webtoon-art/11c20e031ce1d8148269911d.webp","hair":"webtoon-art/4cb4b5e27fd388d112bf40f1.webp","dress":"webtoon-art/4cb4b5e27fd388d112bf40f1.webp"},"princess_emerald":{"base":"webtoon-art/71a716a1de91def8220078be.webp","thumb":"webtoon-art/993208036e440d4aa1b3c998.webp","hair":"webtoon-art/44b704388486ac37b1fb6441.webp","dress":"webtoon-art/44b704388486ac37b1fb6441.webp"},"princess_starlight":{"base":"webtoon-art/a0db960c3c4b711c0ee8cf6c.webp","thumb":"webtoon-art/0c11150d19f424cba252b68a.webp","hair":"webtoon-art/a0db960c3c4b711c0ee8cf6c.webp","dress":"webtoon-art/a0db960c3c4b711c0ee8cf6c.webp"},"princess_pearl":{"base":"webtoon-art/8c79fbd3ea3150fbae10002e.webp","thumb":"webtoon-art/9e08f0448ea7ae86d0452a61.webp","hair":"webtoon-art/c57f97328d3c4a97a74d7afa.webp","dress":"webtoon-art/c57f97328d3c4a97a74d7afa.webp"}});
// C3.9.6: Non-destructive expressive SVG marks layered over the existing 3D face.
// They do not regenerate/swap the face or outfit. The same character stays intact.
const fairyFacePositions={
 princess_flower:[121,123],princess_moon:[121,123],princess_rainbow:[121,123],
 princess_fairy:[121,123],princess_sea:[121,123],princess_snow:[121,123],
 princess_strawberry:[119,122],princess_emerald:[120,118],
 princess_starlight:[119,121],princess_pearl:[120,119]
};
function premiumFaceExpression(emotion,heroId){
 if(!['놀랐어요','슬퍼요','화났어요','생각해요','신나요','기뻐요'].includes(emotion) || emotion==='기뻐요')return '';
 const [cx,cy]=fairyFacePositions[heroId]||[120,122];
 const outline='#803e52';
 const skin=heroId==='princess_emerald'?'#edcbb0':'#ffe4d5';
 const mask=`<ellipse cx="${cx}" cy="${cy+1}" rx="9.8" ry="7.5" fill="${skin}" opacity=".94"/>`;
 let marks='';
 if(emotion==='놀랐어요')marks=`${mask}<ellipse cx="${cx}" cy="${cy+1}" rx="4.3" ry="6.1" fill="#803b47" stroke="#fff3e8" stroke-width=".5"/><path d="M${cx-15} ${cy-16} q-4 -4 -9 -2 M${cx+8} ${cy-16} q5 -4 9 -2" fill="none" stroke="${outline}" stroke-width="1.3"/>`;
 else if(emotion==='슬퍼요')marks=`${mask}<path d="M${cx-5} ${cy+4} Q${cx} ${cy-2} ${cx+5} ${cy+4}" fill="none" stroke="${outline}" stroke-width="2.2" stroke-linecap="round"/><path d="M${cx-13} ${cy-10} q2 6 0 12 M${cx+15} ${cy-10} q-2 6 0 12" fill="none" stroke="#69c8ff" stroke-width="3.2" stroke-linecap="round"/><path d="M${cx-19} ${cy-19} q5 -3 10 1 M${cx+7} ${cy-18} q5 -5 10 -1" fill="none" stroke="${outline}" stroke-width="1.2"/>`;
 else if(emotion==='화났어요')marks=`${mask}<path d="M${cx-6} ${cy+3} Q${cx} ${cy+1} ${cx+6} ${cy+3}" fill="none" stroke="${outline}" stroke-width="2.3" stroke-linecap="round"/><path d="M${cx-19} ${cy-23} l11 8 M${cx+9} ${cy-15} l11 -8" fill="none" stroke="${outline}" stroke-width="3" stroke-linecap="round"/>`;
 else if(emotion==='생각해요')marks=`${mask}<circle cx="${cx}" cy="${cy+1}" r="2.7" fill="${outline}"/><path d="M${cx-17} ${cy-18} q6 -4 11 -1 M${cx+8} ${cy-20} q6 0 8 3" fill="none" stroke="${outline}" stroke-width="1.5"/><g fill="#fff" stroke="#9a73a9" stroke-width=".7"><circle cx="${cx+24}" cy="${cy-21}" r="3"/><circle cx="${cx+32}" cy="${cy-30}" r="5"/><circle cx="${cx+43}" cy="${cy-40}" r="8"/></g><text x="${cx+43}" y="${cy-37}" text-anchor="middle" font-size="9" fill="#9262a6">?</text>`;
 else if(emotion==='신나요')marks=`${mask}<path d="M${cx-9} ${cy-2} Q${cx} ${cy+15} ${cx+9} ${cy-2} Q${cx} ${cy+1} ${cx-9} ${cy-2}" fill="#943b59" stroke="#fff2e8" stroke-width="1.3"/><path d="M${cx-18} ${cy-13} q7 -8 13 0 M${cx+5} ${cy-13} q7 -8 13 0" fill="none" stroke="${outline}" stroke-width="2.5" stroke-linecap="round"/><path d="M${cx+24} ${cy-14}l3 -8 3 8 8 3-8 3-3 8-3-8-8-3Z" fill="#ffe78c" stroke="#fff" stroke-width="1"/>`;
 return `<g pointer-events="none">${marks}</g>`;
}
// C3.9.6: Six complete, illustrated facial-expression portraits per hero.
// NOT emoji overlays: switching faces swaps the entire illustrated portrait.
const dedicatedPrincessExpressions={"princess_flower":{"기뻐요":"webtoon-art/556bacbe377988bd248b83d7.webp","신나요":"webtoon-art/035177b4e810729424896f4b.webp","놀랐어요":"webtoon-art/7c32fafa6556b53337bc1d0f.webp","슬퍼요":"webtoon-art/ebb84cf81be7481e48e45d26.webp","화났어요":"webtoon-art/deb6dc9dab06bc16d417e96b.webp","생각해요":"webtoon-art/3a45fd8cd776d7035014de62.webp"},"princess_strawberry":{"기뻐요":"webtoon-art/d535c40f51bf6364b4580a2e.webp","신나요":"webtoon-art/4235fed383a986cb1c9740b8.webp","놀랐어요":"webtoon-art/b5e0886834ffc3c4b45e6bf1.webp","슬퍼요":"webtoon-art/7b87e27c7543a2a5485be23f.webp","화났어요":"webtoon-art/840a34fa9417f37ef6aad96a.webp","생각해요":"webtoon-art/4f8b17bd48f52cdb72d80432.webp"},"princess_emerald":{"기뻐요":"webtoon-art/840c913c78ffcabc8483ae0e.webp","신나요":"webtoon-art/7b62ce116ea0d54f3df152bd.webp","놀랐어요":"webtoon-art/1cf315b9dc791ec5401eb428.webp","슬퍼요":"webtoon-art/d1888046bf1e66f3ec6181ae.webp","화났어요":"webtoon-art/1f98f2b28051a4f06869ba0d.webp","생각해요":"webtoon-art/7111457543196ecc414a05d3.webp"},"princess_starlight":{"기뻐요":"webtoon-art/c77765136571bbaf1d553427.webp","신나요":"webtoon-art/d98b8c83bb9c9d3ac6d03662.webp","놀랐어요":"webtoon-art/88f7d00f49b625c3ef75b203.webp","슬퍼요":"webtoon-art/7019762522cb3a102fecffc7.webp","화났어요":"webtoon-art/fc6d8b6a9c8bebb5f7dffe40.webp","생각해요":"webtoon-art/e33bfdd19a40251262d168b4.webp"},"princess_pearl":{"기뻐요":"webtoon-art/48364d26e4d53052cbb96677.webp","신나요":"webtoon-art/00dc4bbeed66bec45a0af2e3.webp","놀랐어요":"webtoon-art/f7756933846272852c64effa.webp","슬퍼요":"webtoon-art/710ca0edbe9447629d5f81a3.webp","화났어요":"webtoon-art/861c16c190469676394bb470.webp","생각해요":"webtoon-art/93ec31345c2d4db2dc3e39f7.webp"}};
function princessExpressionArt(panel,heroId){
 if(!panel.useExpressionArt)return null;
 const choices=dedicatedPrincessExpressions[heroId];
 return choices&&(choices[panel.emotion]||choices['기뻐요'])||null;
}
// C3.9.6: Real six-frame full-body expression illustrations (no face stickers).
// Other princesses retain their original full-body artwork or optional portraits
// until equivalent dedicated sets are available.
const dedicatedFullBodyExpressions={"princess_strawberry":{"기뻐요":"webtoon-art/368e8ff2f821e3eb96105285.webp","놀랐어요":"webtoon-art/843f668aaf9c0391715423fd.webp","슬퍼요":"webtoon-art/3edb9550fa651bb7623bded1.webp","화났어요":"webtoon-art/f17158e4e0aa22b950f66acd.webp","생각해요":"webtoon-art/1ff990b9ad94491c8404e4f9.webp","신나요":"webtoon-art/1e758876b33b5e50e4a719de.webp"}};
// C3.9.6: independently illustrated full-body poses for the four remaining princesses.
// Expressions are complete figures, not eyes/mouth stickers pasted over original art.
Object.assign(dedicatedFullBodyExpressions,{"princess_flower":{"기뻐요":"webtoon-art/b3dd2951a5aa35bb112df045.webp","놀랐어요":"webtoon-art/c0c12abcc0bb5682c8c9ff69.webp","슬퍼요":"webtoon-art/f82a39bf5d3dfd98d6d123b4.webp","화났어요":"webtoon-art/2442dcb525956b68b422d622.webp","생각해요":"webtoon-art/f8611726383d6f1baf5047b3.webp","신나요":"webtoon-art/e3d72a7b27001bde54e555b5.webp"},"princess_emerald":{"기뻐요":"webtoon-art/2389255800bb89ff17222115.webp","놀랐어요":"webtoon-art/93fc934947387e25d2f8fe90.webp","슬퍼요":"webtoon-art/57d4ce9c76c1dfc2b50259fa.webp","화났어요":"webtoon-art/7762f3d846e104b23641005e.webp","생각해요":"webtoon-art/39faf038fcb0252bbf12c3a6.webp","신나요":"webtoon-art/d861c4cd6306eb1ecfe2b92f.webp"},"princess_starlight":{"기뻐요":"webtoon-art/c714f8f46d0a6fd9d59befd6.webp","놀랐어요":"webtoon-art/326d750ce1b0020b1546326c.webp","슬퍼요":"webtoon-art/fab26c2cc94533d92c2fa20a.webp","화났어요":"webtoon-art/35796a78f2c8f070c4730aef.webp","생각해요":"webtoon-art/6f69370b0cc389a8af4fc692.webp","신나요":"webtoon-art/1edde9d8c24d2debe5cf4f47.webp"},"princess_pearl":{"기뻐요":"webtoon-art/882862a9dd87b6f7e75c9bed.webp","놀랐어요":"webtoon-art/99ac4da8246ac5e3a4713d4e.webp","슬퍼요":"webtoon-art/2ce4593102493431f928759c.webp","화났어요":"webtoon-art/95828797c9d40252d6da78d3.webp","생각해요":"webtoon-art/2f6378d7555ebabdaee36054.webp","신나요":"webtoon-art/0fa83eb1e17410d32699c0a0.webp"}});
function premiumPrincessAdornment(style,heroId,view){
 // Turn off only *extra* studio sparkle stickers; original dress sparkles are part of the picture.
 if(!style||style.sparkles!=='yes')return '';
 const star=(x,y,r,alpha=1)=>`<g transform="translate(${x} ${y})" opacity="${alpha}"><path d="M0 ${-r} Q${r*.12} ${-r*.12} ${r} 0 Q${r*.12} ${r*.12} 0 ${r} Q${-r*.12} ${r*.12} ${-r} 0 Q${-r*.12} ${-r*.12} 0 ${-r}Z" fill="#fffde4" stroke="#ffd4ed" stroke-width=".8"/><circle r="${r*.22}" fill="white"/></g>`;
 return `<g pointer-events="none" class="princessOrnaments">${star(24,112,7)}${star(211,109,7)}${star(34,197,5)}${star(203,216,6)}${star(65,45,4)}${star(190,166,5)}${star(92,243,5)}</g>`;
}

// C4.5.9: multi-slot studio wardrobe. Coordinates live within the hero SVG,
// so they follow the hero's drag and foot-anchored scaling (and render in exported PNG).
const princessWearProfiles={
 princess_flower:{hair:[86,96],neck:[125,151],ears:[105,121,149,121],back:[123,162],hand:[189,139],builtIn:{crown:true,wings:false,staff:true}},
 princess_strawberry:{hair:[88,93],neck:[125,149],ears:[105,119,151,119],back:[125,164],hand:[189,135],builtIn:{crown:true,wings:false,staff:true}},
 princess_emerald:{hair:[89,95],neck:[125,152],ears:[106,121,149,121],back:[124,165],hand:[188,137],builtIn:{crown:true,wings:false,staff:true}},
 princess_starlight:{hair:[87,97],neck:[125,148],ears:[106,120,151,120],back:[125,161],hand:[187,138],builtIn:{crown:true,wings:true,staff:true}},
 princess_pearl:{hair:[87,96],neck:[125,151],ears:[107,121,150,121],back:[124,165],hand:[188,139],builtIn:{crown:true,wings:false,staff:true}}
};
function profileForPrincess(heroId){return princessWearProfiles[heroId]||null}
function princessWornImage(key,x,y,w,h,rotate=0,opacity=1){
 const source=premiumPropImages[key];if(!source)return '';
 return `<image href="${source}" x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" opacity="${opacity}" transform="rotate(${rotate} ${x} ${y})"/>`;
}
function premiumPrincessWearable(style,heroId,view,layer='front'){
 const profile=profileForPrincess(heroId);if(!profile)return '';
 const worn=style.wearSlots||{};
 // Face closeups vary substantially; only conservatively placed side hair jewelry is supported.
 const portrait=view==='face';
 if(layer==='back'){
  if(portrait||profile.builtIn.wings||worn.back!=='butterfly')return '';
  const [x,y]=profile.back;
  return `<g pointer-events="none" class="princessWornBack">${princessWornImage('요정날개',x,y,162,151,0,.92)}</g>`;
 }
 let out='';
 const [hx,hy]=profile.hair;
 if(worn.hair!=='none'){
  const keys={ribbon:'리본장식',rose:'장미',flower:'화관',gem:'보석'};
  const widths={ribbon:37,rose:35,flower:42,gem:31};
  out+=princessWornImage(keys[worn.hair],portrait?83:hx,portrait?99:hy,widths[worn.hair]*(portrait?1.07:1),38);
 }
 if(!portrait){
  const [nx,ny]=profile.neck;
  if(worn.neck!=='none'){
   // Jewelry follows the neckline rather than covering the face or dress.
   out+=`<path d="M${nx-22} ${ny-13} Q${nx} ${ny+17} ${nx+22} ${ny-13}" fill="none" stroke="#fff6c6" stroke-width="4.6" opacity=".96"/>`;
   out+=`<path d="M${nx-22} ${ny-13} Q${nx} ${ny+17} ${nx+22} ${ny-13}" fill="none" stroke="#c79337" stroke-width="2.1"/>`;
   out+=princessWornImage(worn.neck==='heart'?'하트':'수정보석',nx,ny+9,19,22);
  }
  if(worn.ears!=='none'){
   const [lx,ly,rx,ry]=profile.ears;
   const jewel=worn.ears==='pink'?'하트':'수정보석';
   out+=princessWornImage(jewel,lx,ly,12,16)+princessWornImage(jewel,rx,ry,12,16);
  }
  // All 5 source princesses already hold a painted wand. Never draw a second floating one.
  if(worn.hand==='star'&&!profile.builtIn.staff){
   const [x,y]=profile.hand;out+=princessWornImage('별지팡이',x,y,42,100,-14);
  }
 }
 return `<g pointer-events="none" class="princessWornAdornment">${out}</g>`;
}
// C4.5.9 — dedicated six-panel single-character artwork; no clipping of hands or dresses.
const bobStoryArt={"기뻐요":"webtoon-art/4653c119641ecbf012da979d.png","놀랐어요":"webtoon-art/8a215ce48e76b49986702c7a.png","슬퍼요":"webtoon-art/ffb94ee310c1278f45c6cb34.png","화났어요":"webtoon-art/5358bacffdaf3fc1e8d8b63c.png","생각해요":"webtoon-art/73059ecaccbfd983be813566.png","신나요":"webtoon-art/1814230d89b828d17e04419f.png"};
function bobStoryEmotion(emotion){
 if(emotion==='궁금해요')return '생각해요';
 if(emotion==='용감해요')return '화났어요';
 if(emotion==='자랑스러워요')return '신나요';
 return bobStoryArt[emotion]?emotion:'기뻐요';
}
function bobStorySvg(panel){
 const image=bobStoryArt[bobStoryEmotion(panel.emotion||'기뻐요')];
 // All artwork shares an identical canvas; the entire pose and costume change together.
 return `<g><image href="${image}" x="5" y="22" width="237" height="254" preserveAspectRatio="xMidYMid meet" pointer-events="none"/></g>`;
}
function premiumPrincessSvg(panel,heroId){
 if(heroId==='princess_bob_story')return bobStorySvg(panel);
 const p=validPrincessStyle(panel.princessLook,heroId);
 const a=premiumPrincessImages[heroId];if(!a)return princessSvg(panel,heroId);
 const chosenFullBody = panel.useExpressionArt && (panel.expressionView||'full')!=='face' && dedicatedFullBodyExpressions[heroId]
   && dedicatedFullBodyExpressions[heroId][panel.emotion||'기뻐요'];
 if(chosenFullBody){
   // The entire person, outfit and actual expression are changed as one image.
   return `<g>${premiumPrincessWearable(p,heroId,'full','back')}<image href="${chosenFullBody}" x="6" y="23" width="231" height="253" preserveAspectRatio="xMidYMid meet"/>${premiumPrincessWearable(p,heroId,'full')}${premiumPrincessAdornment(p,heroId,'full')}</g>`;
 }
 const chosenPortrait=princessExpressionArt(panel,heroId);
 if(chosenPortrait){
   // Whole illustration swap (portrait scene). Never paste pupils, eyebrows or
   // emoji onto the original face. This is a genuine close-up shot, not a full-body pose.
   return `<g>${premiumPrincessWearable(p,heroId,'face','back')}<defs><radialGradient id="portraitFade"><stop offset="57%" stop-color="white"/><stop offset="79%" stop-color="white" stop-opacity=".98"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient><mask id="portraitSoft"><ellipse cx="125" cy="159" rx="102" ry="120" fill="url(#portraitFade)"/></mask></defs><image href="${chosenPortrait}" x="23" y="42" width="204" height="234" preserveAspectRatio="xMidYMid meet" mask="url(#portraitSoft)"/>${premiumPrincessWearable(p,heroId,'face')}${premiumPrincessAdornment(p,heroId,'face')}</g>`;
 }

 const d=princessDefaults[heroId];
 const pose=panel.pose||'서 있기';
 const jump=pose==='점프하기'||panel.action==='축하하기';
 const tilt=pose==='뛰기'?-5:pose==='손 흔들기'?-3:0;
 const yy=jump?-9:pose==='앉기'?7:0;
 // Note that these photos are full rendered illustrations, not new 3D models:
 // face, garment details and original wand stay the same in each panel.
 const image=(url,filter='')=>`<image href="${url}" x="22" y="54" width="196" height="222" preserveAspectRatio="xMidYMid meet" ${filter?`style="filter:${filter}"`:''}/>`;
 const isNewCharacter=heroId==='princess_strawberry'||heroId==='princess_emerald'||heroId==='princess_starlight'||heroId==='princess_pearl';
 const hair=(!isNewCharacter&&p.hairColor!==d.hairColor)?image(a.hair,premiumHue[p.hairColor]||'none'):'';
 const dress=(!isNewCharacter&&p.dress!==d.dress)?image(a.dress,premiumDressHue[p.dress]||'none'):'';
 const wings=p.wings==='none'?'':p.wings==='butterfly'
   ?`<g fill="#f9c6ff" stroke="#fff" stroke-width="3" opacity=".86"><path d="M94 144 Q18 60 18 160 Q34 190 97 186 Q15 182 45 235 Q88 250 106 188Z"/><path d="M147 144 Q228 65 225 160 Q213 190 142 186 Q232 190 206 238 Q159 250 139 188Z"/></g>`
   :`<g fill="#e3faff" stroke="#fff" stroke-width="3" opacity=".86"><path d="M91 148 Q12 68 25 188 Q42 208 103 195Z"/><path d="M150 148 Q228 68 218 188 Q198 208 136 195Z"/></g>`;
 // Extra hair decorations do not replace original 3D hair, tiara or wand.
 const outfitTrim=isNewCharacter&&p.dress!==d.dress?`<g opacity=".86"><path d="M55 253 Q122 273 189 253" fill="none" stroke="${princessColors.dress[p.dress]}" stroke-width="7" stroke-linecap="round"/><path d="M65 249 Q122 269 179 249" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></g>`:'';
 const hairRibbon=isNewCharacter&&p.hairColor!==d.hairColor?`<path d="M107 95 Q124 77 141 95" fill="none" stroke="${princessColors.hair[p.hairColor]}" stroke-width="8" stroke-linecap="round"/>`:'';
 const hairDecor=p.hairStyle==='twintail'?`<text x="68" y="124" font-size="20">🎀</text><text x="155" y="124" font-size="20">🎀</text>`:p.hairStyle==='curl'?`<text x="61" y="119" font-size="22">💫</text><text x="169" y="134" font-size="18">💫</text>`:p.hairStyle==='bob'?`<text x="124" y="71" text-anchor="middle" font-size="22">🌼</text>`:'';
 const jewel=p.crown==='none'?'':p.crown==='flower'?`<text x="131" y="76" font-size="25">🌺</text>`:p.crown==='bow'?`<text x="125" y="76" font-size="27">🎀</text>`:p.crown==='tiara'?`<text x="119" y="71" font-size="23">💎</text>`:`<text x="121" y="74" font-size="24">👑</text>`;
 const sparkles=p.sparkles==='no'?'':`<g fill="#fff3b0" stroke="#fff" stroke-width="1.5"><path d="M37 120l5 -14 5 14 14 5-14 5-5 14-5-14-14-5Z"/><path d="M200 131l4 -11 4 11 11 4-11 4-4 11-4-11-11-4Z"/><path d="M173 242l3 -8 3 8 8 3-8 3-3 8-3-8-8-3Z"/></g>`;
 const staffDecor=p.staff==='none'?'':p.staff==='star'?`<text x="195" y="94" font-size="20">🌟</text>`:p.staff==='heart'?`<text x="195" y="94" font-size="20">💖</text>`:`<text x="195" y="94" font-size="20">🌸</text>`;
 return `<g transform="translate(0 ${yy}) rotate(${tilt} 122 200)">${premiumPrincessWearable(p,heroId,'original','back')}${image(a.base)}${premiumPrincessWearable(p,heroId,'original')}${premiumPrincessAdornment(p,heroId,'original')}</g>`;
}
function princessThumb(h){
 if(h.id==='princess_bob_story')return 'bob-happy.png?v=4493';
 if(premiumPrincessImages[h.id])return premiumPrincessImages[h.id].thumb;
 const art=princessSvg({princessLook:princessDefaults[h.id],pose:'서 있기',emotion:'기뻐요'},h.id);
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="45 65 150 220"><rect x="48" y="65" width="145" height="215" rx="28" fill="#fff4fb"/>${art}</svg>`);
}
// C3.9.6: Keep the old wardrobe key untouched, but save new entries to IndexedDB.
// Premium character art is bundled in this HTML; wardrobe entries store only tiny
// names, hero IDs and outfit choices, NEVER image data or copies of the artwork.
const PRINCESS_STORE='webtoon-princess-wardrobe-v1';
const princessDbName='family-webtoon-princess-wardrobe';
const princessDbStore='wardrobe';
function legacyPrincesses(){
 try{const a=JSON.parse(localStorage.getItem(PRINCESS_STORE)||'[]');return Array.isArray(a)?a.filter(x=>x&&isPrincess(x.hero)&&x.look&&typeof x.name==='string').slice(0,40):[]}
 catch(_){return []}
}
let princessCache=legacyPrincesses();
let princessReady=null;
function validPrincesses(a){return Array.isArray(a)?a.filter(x=>x&&isPrincess(x.hero)&&x.look&&typeof x.name==='string').slice(0,40):[]}
function getSavedPrincesses(){return princessCache.slice()}
function openPrincessDB(){return new Promise((resolve,reject)=>{
 if(!window.indexedDB)return reject(Error('이 브라우저가 보관함 데이터베이스를 지원하지 않습니다.'));
 const req=indexedDB.open(princessDbName,1);
 req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(princessDbStore))req.result.createObjectStore(princessDbStore)};
 req.onsuccess=()=>resolve(req.result);
 req.onerror=()=>reject(req.error||Error('보관함 데이터베이스를 열 수 없습니다.'));
})}
async function readPrincessDB(){const db=await openPrincessDB();try{return await new Promise((resolve,reject)=>{
 const tx=db.transaction(princessDbStore,'readonly');const req=tx.objectStore(princessDbStore).get('saved');
 req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||Error('보관함을 읽지 못했습니다.'));
})}finally{db.close()}}
async function persistPrincesses(list){const db=await openPrincessDB();try{await new Promise((resolve,reject)=>{
 const tx=db.transaction(princessDbStore,'readwrite');tx.objectStore(princessDbStore).put(validPrincesses(list),'saved');
 tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('보관함 저장에 실패했습니다.'));
 tx.onabort=()=>reject(tx.error||Error('보관함 저장이 중단되었습니다.'));
})}finally{db.close()}}
async function preparePrincessStore(){
 if(princessReady)return princessReady;
 princessReady=(async()=>{
  try{
   const current=await readPrincessDB();const legacy=legacyPrincesses();
   if(!Array.isArray(current)){
    // Copy data into the new store, but never delete the original data.
    if(legacy.length)await persistPrincesses(legacy);
    princessCache=legacy;
   }else{
    const dbSaved=validPrincesses(current);
    const ids=new Set(dbSaved.map(x=>x.id));
    const merged=[...dbSaved,...legacy.filter(x=>!ids.has(x.id))].slice(0,40);
    if(merged.length!==dbSaved.length)await persistPrincesses(merged);
    princessCache=merged;
   }
  }catch(err){console.warn('공주 보관함: 기존 데이터만 표시합니다.',err);princessCache=legacyPrincesses()}
  renderPrincessSaved();
 })();
 return princessReady;
}
async function writePrincesses(list){
 try{
  await persistPrincesses(list);
  princessCache=validPrincesses(list);
  return true;
 }catch(e){
  console.error('공주 보관함 저장 오류',e);
  toast('보관함 저장에 실패했어요. Safari 개인 정보 보호 모드와 저장 공간을 확인해 주세요.');
  return false;
 }
}
function currentPrincessLook(){const p=state.panels[selected];return p?validPrincessStyle(p.princessLook,state.hero):null}
function princessControls(){
 const block=$('princessStudio'),on=isPrincess(state.hero);
 block.hidden=true;
 if(!on||!state.panels.length)return;
 const p=state.panels[selected];const st=validPrincessStyle(p.princessLook,state.hero);
 const fixedBob=state.hero==='princess_bob_story';
 const artStyleGrid=block.querySelector('.princessGrid');if(artStyleGrid)artStyleGrid.hidden=fixedBob;
 const wearStudio=block.querySelector('#princessWearStudio');if(wearStudio)wearStudio.hidden=fixedBob;
 const fixedTip=$('fixedPrincessAccessories');if(fixedTip){fixedTip.textContent=fixedBob?'🌹 단발머리 공주는 표정·자세 6종을 갖춘 완성 원화입니다. 옷과 머리를 이 화면에서 변형하지 않아요. 장면 소품과 말풍선은 기존 웹툰 편집에서 꾸밀 수 있습니다.':'💡 원본에 그려진 왕관·날개·지팡이는 떼거나 교체할 수 없습니다. 추가 장식은 머리에 붙여 꾸밀 수 있어요.';}
 for(const k of princessStyleKeys){const el=$('p'+k[0].toUpperCase()+k.slice(1));if(el)el.value=k==='hairStyle'?'long':st[k]}
 for(const btn of document.querySelectorAll('[data-wear]')){
  const active=btn.dataset.wear===(st.wearAccessory||'none');
  btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));
 }
 // Keep slots independent: new selections do not replace other body parts.
 const profile=profileForPrincess(state.hero);
 const portrait=p.expressionView==='face'&&p.useExpressionArt;
 const missing=[];
 document.querySelectorAll('[data-wear-slot]').forEach(el=>{
  const slot=el.dataset.wearSlot;
  let reason='';
  if(!profile)reason='이 주인공은 착용 위치를 준비 중입니다.';
  else if(slot==='crown'&&profile.builtIn.crown)reason='원본에 왕관·티아라가 이미 포함되어 있어요.';
  else if(slot==='back'&&profile.builtIn.wings)reason='원본에 날개가 이미 포함되어 있어요.';
  else if(slot==='hand'&&profile.builtIn.staff)reason='원본 그림에 지팡이가 이미 포함되어 있어요.';
  else if(portrait&&slot!=='hair')reason='얼굴 크게 보기에서는 머리장식만 보입니다. 전신 보기를 선택해 주세요.';
  const active=st.wearSlots?.[slot]||'none';
  el.value=active;
  el.disabled=!!reason;
  el.title=reason||'공주가 착용하는 장식이에요.';
  if(reason)missing.push(reason);
 });
 const tip=$('wearCapability');if(tip)tip.textContent=missing.length?[...new Set(missing)].join(' · '):'각 부위의 장식을 함께 착용할 수 있어요.';
 renderPrincessSaved();
}
function renderPrincessSaved(){
 const wrap=$('pSavedCards');if(!wrap)return;
 wrap.replaceChildren();const list=getSavedPrincesses();
 if(!list.length){const tip=document.createElement('p');tip.className='hint';tip.textContent='아직 저장한 주인공이 없어요. 예쁘게 꾸민 뒤 저장해 보세요!';wrap.appendChild(tip);return}
 list.forEach((saved,idx)=>{
  const card=document.createElement('div');card.className='savedHeroCard';
  const label=document.createElement('b');label.textContent='👑 '+saved.name;card.appendChild(label);
  const buttons=document.createElement('div');buttons.className='btns';
  const load=document.createElement('button');load.type='button';load.className='secondary';load.textContent='불러오기';load.onclick=()=>{
   if(!state.panels.length)return;
   rememberAction('load-princess');
   state.hero=saved.hero;state.heroName=saved.name;
   const style=validPrincessStyle(saved.look,saved.hero);
   state.panels.forEach(p=>{if(!p.aiImage)p.princessLook=clone(style)});
   renderComic();toast('「'+saved.name+'」을 모든 기본 그림 컷에 불러왔어요!');
  };
  const del=document.createElement('button');del.type='button';del.className='ghost';del.textContent='삭제';del.onclick=async()=>{
   await preparePrincessStore();
   if(!confirm('「'+saved.name+'」을 보관함에서 삭제할까요? 현재 작품은 그대로 남습니다.'))return;
   const arr=getSavedPrincesses();arr.splice(idx,1);if(await writePrincesses(arr))renderPrincessSaved();
  };
  const photo=document.createElement('button');photo.type='button';photo.className='secondary';photo.textContent='📷 사진으로 저장';photo.onclick=()=>saveSavedHeroAsPhoto(saved);
  buttons.append(load,photo,del);card.appendChild(buttons);wrap.appendChild(card);
 });
}
function initPrincessEditor(){
 for(const k of princessStyleKeys){const el=$('p'+k[0].toUpperCase()+k.slice(1));if(!el)continue;
  el.addEventListener('change',()=>{
   if(!isPrincess(state.hero)||!state.panels.length)return;
   const p=state.panels[selected];if(p.aiImage)return toast('GPT 완성 그림은 꾸밀 수 없어요. 기본 그림으로 돌아가 주세요.');
   // Premium hair choices are real attachments, not stickers or color effects.
   if(k==='hairStyle' && premiumPrincessImages[state.hero]){
    const wear={twintail:'ribbon',bob:'rose',curl:'flower',long:'none'}[el.value]||'none';
    rememberAction('princess-wear-hair');
    p.princessLook={...validPrincessStyle(p.princessLook,state.hero),wearAccessory:wear};
    renderComic();return;
   }
   rememberAction('princess-'+k);
   p.princessLook={...validPrincessStyle(p.princessLook,state.hero),[k]:el.value};renderComic();
  });
 }
 $('pCopyAll').onclick=()=>{
  if(!isPrincess(state.hero))return;const st=currentPrincessLook();if(!st)return;
  rememberAction('princess-to-all');let n=0;
  for(let i=0;i<state.panels.length;i++){if(i===selected||state.panels[i].aiImage)continue;state.panels[i].princessLook=clone(st);n++}
  renderComic();toast(n+'개 컷에 같은 주인공 옷과 장식을 적용했어요! 표정·자세는 그대로예요.');
 };
 $('pSave').onclick=async()=>{
  await preparePrincessStore();
  if(!isPrincess(state.hero)||!state.panels.length)return;
  const name=$('pSaveName').value.trim()||state.heroName||'나의 공주';
  const arr=getSavedPrincesses();if(arr.length>=40)return toast('주인공 보관함은 최대 40명까지 저장할 수 있어요.');
  const look=currentPrincessLook();
  arr.unshift({id:'hero-'+Date.now(),name:name.slice(0,28),hero:state.hero,look,created:Date.now()});
  if(await writePrincesses(arr)){renderPrincessSaved();toast('💖 「'+name.slice(0,28)+'」을(를) 보관함에 저장했어요!')}
 };
}
// C4.5.9 - illustrated friend assets. Fairy deliberately reuses the existing original fairy drawings.
const FRIEND_EMOTIONS=['기뻐요','놀랐어요','슬퍼요','화났어요','생각해요','신나요'];
const FRIEND_FILE_MOODS={'기뻐요':'happy','놀랐어요':'surprised','슬퍼요':'sad','화났어요':'angry','생각해요':'thinking','신나요':'excited'};
const FRIEND_NAMES={dog:'몽이',cat:'루루',rabbit:'보송이',fairy:'요정'};
const FAIRY_EXISTING_MOODS={'기뻐요':'fairy-walking.webp','놀랐어요':'fairy-surprised.webp','슬퍼요':'fairy-standing.webp','화났어요':'fairy-key.webp','생각해요':'fairy-standing.webp','신나요':'fairy-jumping.webp'};
function friendImageSource(id,emotion){
 if(id==='fairy'){
   const special={'슬퍼요':'friend-fairy-sad.png','화났어요':'friend-fairy-angry.png','생각해요':'friend-fairy-thinking.png'};
   if(special[emotion])return special[emotion]+'?v=456';
   return characterImageUrls[FAIRY_EXISTING_MOODS[emotion]||'fairy-walking.webp']||characterImageUrls['fairy-walking.webp']||'';
 }
 if(!['dog','cat','rabbit'].includes(id))return '';
 return 'friend-'+id+'-'+(FRIEND_FILE_MOODS[emotion]||'happy')+'.png?v=456';
}
function renderCharacterChoices(){
 if(!webtoonStoryArtReady())return;
 const webtoon=$('webtoonCharacterChoices'),looks=$('princessLookChoices'),other=$('otherCharacterChoices');
 for(const root of [webtoon,looks,other,$('myCreatedHeroChoices')])root.replaceChildren();
 const legacyLooks=['princess_flower','princess_moon','princess_rainbow','princess_fairy','princess_sea','princess_snow'];
 const webtoonIds=['princess_strawberry','princess_emerald','princess_starlight','princess_pearl','princess_bob_story'];
 function addCard(root,h,label,sub,isActive,action,imageSrc){
  const b=document.createElement('button');b.type='button';b.className='choice'+(isActive?' selected':'');b.setAttribute('aria-pressed',String(!!isActive));
  const img=document.createElement('img');img.className='avatar-thumb'+(isPrincess(h.id)?' princessThumb':'');img.src=imageSrc||(isPrincess(h.id)?princessThumb(h):characterImageUrls[h.id+'-standing.webp']||'');img.alt=label+' 그림';img.loading='lazy';
  img.onerror=()=>{if(h.id==='princess_bob_story'&&img.dataset.fallback!=='yes'){img.dataset.fallback='yes';img.src=bobStoryArt['기뻐요'];}else if(['dog','cat','rabbit'].includes(h.id)&&img.dataset.fallback!=='yes'){img.dataset.fallback='yes';img.src=characterImageUrls[h.id==='dog'?'fox-walking.webp':h.id+'-standing.webp']||'';}else img.style.display='none'};
  const title=document.createElement('div');title.textContent=h.emoji+' '+label;
  const caption=document.createElement('div');caption.className='hint';caption.textContent=sub;
  b.append(img,title,caption);b.addEventListener('click',action);root.append(b);
 }
 function choose(id){settings.hero=id;settings.custom=null;settings.studioRecipe=null;settings.studioPrincess=false;renderCharacterChoices();}
 for(const id of webtoonIds){const h=heroes.find(v=>v.id===id);if(!h)continue;
  addCard(webtoon,h,id==='princess_starlight'?'달빛 요정':h.name,'표정·자세 6종',settings.hero===id,()=>choose(id));}
 for(const id of legacyLooks){const h=heroes.find(x=>x.id===id);if(!h)continue;
  addCard(looks,h,h.name,'변신 공주 · 같은 주인공의 다른 모습',settings.hero===id,()=>choose(id));}
 looks.hidden=false;
 for(const id of ['dog','cat','rabbit','fairy']){
  const h=heroes.find(v=>v.id===id);if(!h)continue;
  addCard(other,h,FRIEND_NAMES[id],id==='fairy'?'기존 원화 활용 · 요정':'표정·자세 6종',settings.hero===id,()=>choose(id),friendImageSource(id,'기뻐요'));
 }
 if(window.webtoonDrawingHeroes && window.webtoonDrawingHeroes.length){
  const root=$('myCreatedHeroChoices');
  window.webtoonDrawingHeroes.forEach(item=>{
   const h={id:'custom',emoji:'🖍',name:item.name||'내 그림'};
   const card=document.createElement('div');card.className='dw-hero-item';
   addCard(card,h,item.name||'내 그림','내가 만든 주인공',settings.hero==='custom'&&settings.custom===item.preview,()=>{settings.hero='custom';settings.custom=item.preview;settings.studioPrincess=false;settings.studioRecipe=null;renderCharacterChoices()},item.preview);
   const remove=document.createElement('button');remove.type='button';remove.className='dw-remove-hero';remove.textContent='등록 해제';remove.onclick=()=>window.webtoonDrawingUnregister?.(item.id);card.append(remove);root.append(card);
  });
 }else if(settings.custom){
  const h={id:'custom',emoji:'🖍',name:'내 그림'};
  addCard($('myCreatedHeroChoices'),h,'이전에 고른 내 그림','현재 웹툰 주인공',true,()=>{settings.hero='custom';renderCharacterChoices()},settings.custom);
 }
}

function renderStoryChoices(){const wrap=$('storyChoices');wrap.innerHTML='';stories.forEach(s=>{const b=document.createElement('button');b.type='button';b.className='story'+(settings.story===s.id?' selected':'');b.innerHTML=`<div class="big">${s.icon}</div><div>${s.title}</div>`;b.onclick=()=>{settings.story=s.id;settings.title=s.titleValue;settings.idea=s.idea;$('storyTitle').value=settings.title;$('storyIdea').value=settings.idea;renderStoryChoices()};wrap.appendChild(b)})}
function renderCounts(){ $$('#countChoices .countBtn').forEach(b=>{b.classList.toggle('selected',Number(b.dataset.count)===settings.count);b.onclick=()=>{settings.count=Number(b.dataset.count);renderCounts()}})}
function initSelectors(){['panelEmotion','panelPose','panelAction','panelBg','panelProp'].forEach(id=>{const el=$(id);el.innerHTML=''});emotions.forEach(v=>$('panelEmotion').insertAdjacentHTML('beforeend',`<option>${v}</option>`));poses.forEach(v=>$('panelPose').insertAdjacentHTML('beforeend',`<option>${v}</option>`));actions.forEach(v=>$('panelAction').insertAdjacentHTML('beforeend',`<option>${v}</option>`));populateBackgroundSelect($('panelBg'));populateBackgroundSelect($('baseBackground'),settings.baseBackground||'forest');renderCustomBgManager();props.forEach(v=>$('panelProp').insertAdjacentHTML('beforeend',`<option>${v}</option>`))}
function clone(obj){return JSON.parse(JSON.stringify(obj))}
function buildPanels(){const seed=storyTemplates[settings.story]||storyTemplates.key;const count=settings.count;const base=seed.slice(0,count).map((p,i)=>({...clone(p), background:i===0?settings.baseBackground:(p.background||settings.baseBackground), mood:'bright',...(isPrincess(settings.hero)?{princessLook:clone(princessDefaults[settings.hero])}:{})})); if(count===2){base[1].caption=base[base.length-1].caption;base[1].speech=base[base.length-1].speech;base[1].emotion=base[base.length-1].emotion;base[1].pose=base[base.length-1].pose;base[1].action=base[base.length-1].action;base[1].prop=base[base.length-1].prop;} return base;}
function makeComic(){settings.heroName=$('heroName').value.trim()||'루루';settings.heroTrait=$('heroTrait').value.trim()||'용감한 친구';settings.title=$('storyTitle').value.trim()||'나의 웹툰';settings.idea=$('storyIdea').value.trim()||'신나는 모험';settings.baseBackground=$('baseBackground').value;state={title:settings.title,hero:settings.hero,heroName:settings.heroName,heroTrait:settings.heroTrait,custom:settings.custom,studioPrincess:Boolean(settings.studioPrincess),studioRecipe:settings.studioRecipe?clone(settings.studioRecipe):null,story:settings.story,panels:buildPanels()};selected=0;renderComic();switchView('edit');toast('컷 초안을 만들었어요! 이제 표정과 자세를 바꿔 보세요.')}
function currentHero(){return heroes.find(h=>h.id===state.hero) || heroes[0]}
function hairFor(hero){return hero.id==='fairy'?`<ellipse cx="120" cy="112" rx="54" ry="32" fill="#ffb7d1"/>` : hero.id==='robot'?`<rect x="72" y="86" width="96" height="58" rx="24" fill="#d8e9f5" stroke="#577596" stroke-width="6"/><line x1="120" y1="66" x2="120" y2="88" stroke="#577596" stroke-width="6"/><circle cx="120" cy="60" r="8" fill="#ef7fb7"/>` : ''}
// C3.2: use individually generated full-body character art, not simplified geometric faces.
function characterAsset(panel){
 if(state.hero==='custom'||isPrincess(state.hero)||!state.hero)return null;
 const name=state.hero;
 if(name==='rabbit'){
   if(panel.pose==='점프하기'||panel.action==='축하하기')return 'rabbit-jumping.webp';
   if(panel.pose==='뛰기')return 'rabbit-running.webp';
   if(panel.emotion==='놀랐어요')return 'rabbit-surprised.webp';
   if(panel.action==='줍기'||panel.prop==='열쇠')return 'rabbit-key.webp';
   if(panel.pose==='걷기')return 'rabbit-walking.webp';
   return 'rabbit-standing.webp';
 }
 if(['cat','fox','fairy'].includes(name)){
   if(panel.pose==='점프하기'||panel.action==='축하하기')return name+'-jumping.webp';
   if(panel.emotion==='놀랐어요')return name+'-surprised.webp';
   if(panel.action==='줍기'||panel.prop==='열쇠'||panel.action==='열기')return name+'-key.webp';
   if(panel.pose==='걷기'||panel.pose==='뛰기')return name+'-walking.webp';
   return name+'-walking.webp';
 }
 return name+'-standing.webp';
}
// C3.9.6 — Character colours are applied to sprite PIXELS on a transparent
// canvas. CSS hue-rotate alone leaves white bunny fur white in Safari, so it
// cannot implement actual body colour selection.
const heroColors={red:[235,98,142],orange:[250,178,68],blue:[92,163,245],green:[89,197,142],purple:[165,120,222]};
const heroColorCache=Object.create(null);
const heroColorPending=Object.create(null);
function colorizedHeroImage(sprite,panel){
 const original=characterImageUrls[sprite]||'';
 const body=panel.heroTint||'normal',outfit=panel.heroOutfit||'normal';
 if((body==='normal'&&outfit==='normal')||!original)return original;
 const key=sprite+'|'+body+'|'+outfit;
 if(heroColorCache[key])return heroColorCache[key];
 if(heroColorPending[key])return original;
 heroColorPending[key]=true;
 const photo=new Image();
 photo.onload=()=>{
  try{
   const canvas=document.createElement('canvas');
   canvas.width=photo.naturalWidth; canvas.height=photo.naturalHeight;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});
   ctx.drawImage(photo,0,0);
   const im=ctx.getImageData(0,0,canvas.width,canvas.height);
   const d=im.data, targetBody=heroColors[body],targetOutfit=heroColors[outfit];
   for(let i=0;i<d.length;i+=4){
    if(d[i+3]<5)continue;
    const r=d[i],g=d[i+1],b=d[i+2],hi=Math.max(r,g,b),lo=Math.min(r,g,b);
    const saturation=hi?((hi-lo)/hi):0;
    const light=(r+g+b)/3;
    // Preserve pupils, line art and very deep shadows.
    if(light<37)continue;
    // For clothing: colour the saturated material while preserving neutral fur.
    // For overall body: tint all sufficiently visible pixels, including white fur.
    let target=null, strength=0;
    if(targetBody){target=targetBody;strength=.65;}
    if(targetOutfit && saturation>.19 && light>55){target=targetOutfit;strength=.78;}
    if(!target)continue;
    // Retain the underlying pixel's lights/darks and character linework.
    const shade=Math.max(.30,Math.min(1.21,light/190));
    for(let j=0;j<3;j++){
     const toned=Math.min(255,target[j]*shade);
     d[i+j]=Math.round(d[i+j]*(1-strength)+toned*strength);
    }
   }
   ctx.putImageData(im,0,0);
   // Use a short blob URL rather than an enormous inline SVG image attribute.
   const finish=(blob)=>{
    if(blob){heroColorCache[key]=URL.createObjectURL(blob);}
    else {heroColorCache[key]=canvas.toDataURL('image/png');}
    delete heroColorPending[key];
    if(state&&state.panels&&state.panels.length)renderComic();
   };
   if(canvas.toBlob)canvas.toBlob(finish,'image/webp',.90);
   else finish(null);
  }catch(e){console.warn('주인공 색 변경 실패',e);delete heroColorPending[key];}
 };
 photo.onerror=()=>{delete heroColorPending[key];};
 photo.src=original;
 return original;
}

function heroSvg(panel){
 if(state.hero==='custom'&&state.studioRecipe){return studioCharacterSvg(state.studioRecipe,{emotion:studioEmotionNormalize(panel.emotion),pose:panel.pose},false);}
 if(isPrincess(state.hero))return premiumPrincessSvg(panel,state.hero);
 if(['dog','cat','rabbit','fairy'].includes(state.hero)){
   const url=friendImageSource(state.hero,panel.emotion||'기뻐요');
   if(url)return `<image href="${url}" x="33" y="59" width="202" height="215" preserveAspectRatio="xMidYMid meet" pointer-events="none"/>`;
 }
 const sprite=characterAsset(panel);
 if(sprite){
   const name=state.hero;
   const hasPoseArt=['rabbit','cat','fox','fairy'].includes(name);
   const jump=panel.pose==='점프하기'||panel.action==='축하하기';
   const run=panel.pose==='뛰기';
   const surprise=panel.emotion==='놀랐어요';
   const key=panel.action==='줍기'||panel.prop==='열쇠';
   // Dedicated pose art has its own body and limbs; robot/bear use a conservative
   // illustrated gesture rather than pretending to have newly generated poses.
   const tilt=hasPoseArt?0:jump?-9:run?-13:surprise?5:0;
   const dx=hasPoseArt?0:run?8:jump?3:0;
   const dy=hasPoseArt?0:jump?-21:run?-7:0;
   const poseFx=!hasPoseArt && jump?'<path d="M70 258 Q110 248 150 258" stroke="#fff" stroke-width="5" fill="none" opacity=".7"/><text x="206" y="138" font-size="27">✨</text>':
          !hasPoseArt && run?'<path d="M32 221 l30 -5 M32 237 l24 -5" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>':
          !hasPoseArt && surprise?'<text x="189" y="104" font-size="30">❗</text>':'';
   const extra=!hasPoseArt && key?'<text x="195" y="218" font-size="33">🗝️</text>':'';
   // Portraits once filled 165×206 at (50,70) and clipped prominent ears,
   // wings and tails after scene transforms. Use a smaller centered safe box.
   const bounds= name==='fairy'?{x:50,y:86,w:186,h:184}: {x:62,y:88,w:174,h:183};
   const img=colorizedHeroImage(sprite,panel);
   return `<g transform="translate(${dx} ${dy}) rotate(${tilt} 150 200)"><image href="${img}" x="${bounds.x}" y="${bounds.y}" width="${bounds.w}" height="${bounds.h}" preserveAspectRatio="xMidYMid meet"/></g>${poseFx}${extra}`;
 }
 const hero=currentHero();const c=hero.colors;const pose=panel.pose, emo=panel.emotion; const y=pose==='점프하기'?28:pose==='앉기'?58:pose==='뛰기'?38:46; const x=pose==='뛰기'?110:120; const bodyTilt=pose==='뛰기'?-14:pose==='점프하기'?-4:pose==='손 흔들기'?-7:0; const eye=emo==='놀랐어요'?'7':'3'; const mouth=emo==='슬퍼요'?'M110 142 Q120 134 130 142':emo==='기뻐요'||emo==='자랑스러워요'?'M104 138 Q120 152 136 138':'M106 140 Q120 146 134 140'; const eyebrow=emo==='용감해요'||emo==='자랑스러워요'?`<path d="M96 112 l16 -4" stroke="#3b3247" stroke-width="4" stroke-linecap="round"/><path d="M128 108 l16 4" stroke="#3b3247" stroke-width="4" stroke-linecap="round"/>`:'';
 const armL= pose==='손 흔들기'?`M90 190 Q72 158 78 130`: pose==='점프하기'?`M88 188 Q74 165 64 145`: pose==='뛰기'?`M90 190 Q72 170 70 152`: pose==='앉기'?`M88 190 Q78 198 72 196`:`M90 190 Q72 170 72 150`;
 const armR= pose==='손 흔들기'?`M150 190 Q180 162 178 118`: pose==='점프하기'?`M152 188 Q172 162 182 145`: pose==='뛰기'?`M150 190 Q171 178 178 162`: pose==='앉기'?`M152 190 Q160 198 168 196`:`M150 190 Q168 170 168 150`;
 const legL= pose==='뛰기'?`M104 228 Q92 250 80 264`: pose==='점프하기'?`M106 228 Q92 258 92 278`: pose==='앉기'?`M106 228 Q96 236 88 234`:`M106 228 Q100 252 98 276`;
 const legR= pose==='뛰기'?`M134 228 Q150 236 166 224`: pose==='점프하기'?`M134 228 Q148 258 148 278`: pose==='앉기'?`M134 228 Q146 236 156 234`:`M134 228 Q140 252 142 276`;
 const actionProp = panel.action==='줍기' ? `<g transform="translate(188 216) rotate(-18)">${propSvg(panel.prop)}</g>` : '';
 let accessory=''; if(hero.id==='fairy') accessory='<path d="M80 170 C48 138 48 112 78 126 C82 104 110 112 108 136 Z" fill="#c2fff1" opacity=".8"/><path d="M160 170 C192 138 192 112 162 126 C158 104 130 112 132 136 Z" fill="#c2fff1" opacity=".8"/>';
 if(hero.id==='robot') accessory='<rect x="95" y="170" width="50" height="44" rx="12" fill="#b8d6ef" stroke="#577596" stroke-width="5"/><circle cx="106" cy="191" r="6" fill="#ef7fb7"/><circle cx="120" cy="191" r="6" fill="#78c7ff"/><circle cx="134" cy="191" r="6" fill="#90e3a0"/>';
 const uploaded=state.hero==='custom'&&state.custom ? `<image href="${state.custom}" x="${state.studioPrincess?5:70}" y="${state.studioPrincess?24:90}" width="${state.studioPrincess?235:100}" height="${state.studioPrincess?248:150}" preserveAspectRatio="xMidYMid meet"/>` : `
   <ellipse cx="120" cy="126" rx="50" ry="44" fill="${c.body}" stroke="#3f3648" stroke-width="6"/>
   ${hero.id!=='robot'?`<ellipse cx="90" cy="76" rx="18" ry="44" fill="${c.body}" stroke="#3f3648" stroke-width="6" transform="rotate(-18 90 76)"/><ellipse cx="150" cy="76" rx="18" ry="44" fill="${c.body}" stroke="#3f3648" stroke-width="6" transform="rotate(18 150 76)"/><ellipse cx="92" cy="84" rx="8" ry="24" fill="${c.ear}" transform="rotate(-18 92 84)"/><ellipse cx="148" cy="84" rx="8" ry="24" fill="${c.ear}" transform="rotate(18 148 84)"/>`:''}
   ${hairFor(hero)}${accessory}
   <circle cx="102" cy="122" r="${eye}" fill="#2d2435"/><circle cx="138" cy="122" r="${eye}" fill="#2d2435"/>
   ${eyebrow}
   <path d="M120 126 l-7 8 h14 z" fill="#f3b49b"/><path d="${mouth}" fill="none" stroke="#2d2435" stroke-width="4" stroke-linecap="round"/>
   <path d="${armL}" fill="none" stroke="#3f3648" stroke-width="12" stroke-linecap="round"/>
   <path d="${armR}" fill="none" stroke="#3f3648" stroke-width="12" stroke-linecap="round"/>
   <path d="${legL}" fill="none" stroke="#3f3648" stroke-width="12" stroke-linecap="round"/>
   <path d="${legR}" fill="none" stroke="#3f3648" stroke-width="12" stroke-linecap="round"/>
   <ellipse cx="120" cy="198" rx="34" ry="34" fill="${c.accent}" opacity=".18"/>
 `;
 return `<g transform="translate(${x-120},${y-46}) rotate(${bodyTilt} 120 190)">${uploaded}${actionProp}</g>`;
}
function propSvg(name){switch(name){case '열쇠': return '<text x="0" y="0" font-size="38">🗝️</text>';case '별': return '<text x="0" y="0" font-size="40">⭐</text>';case '무지개': return '<text x="0" y="0" font-size="40">🌈</text>';case '보석': return '<text x="0" y="0" font-size="40">💎</text>';case '나비': return '<text x="0" y="0" font-size="40">🦋</text>';case '문': return '<text x="0" y="0" font-size="40">🚪</text>';case '책': return '<text x="0" y="0" font-size="40">📘</text>';default:return ''}}
function moodFilter(mood){if(mood==='night')return 'brightness(.86) saturate(.92)'; if(mood==='mystery') return 'saturate(1.08) hue-rotate(-8deg)'; if(mood==='soft')return 'brightness(1.03) saturate(.92)'; return 'none'}
function sceneLayout(panel, idx){
 const base=[
   {hx:-3, hy:8, sc:.94, bubbleX:18, bubbleW:154, bubbleY:18, deco:'path-left'},
   {hx:3, hy:8, sc:.94, bubbleX:12, bubbleW:146, bubbleY:18, deco:'focus-center'},
   {hx:0, hy:8, sc:.94, bubbleX:18, bubbleW:156, bubbleY:18, deco:'door-left'},
   {hx:4, hy:3, sc:.94, bubbleX:24, bubbleW:162, bubbleY:18, deco:'rainbow-right'}
 ][idx%4] || {hx:0, hy:12, sc:1, bubbleX:18, bubbleW:154, bubbleY:18, deco:'default'};
 if(panel.action==='열기') base.deco='door-left';
 if(panel.action==='줍기') base.deco='focus-center';
 if(panel.action==='축하하기' || panel.pose==='점프하기') base.deco='rainbow-right';
 return base;
}
function scenicLayers(panel, idx, layout){
 const bg=bgMeta[panel.background]||bgMeta.forest;
 const night=panel.mood==='night';
 const mystery=panel.mood==='mystery';
 const top=night?'#8ea8d9':bg.sky;
 const bottom=night?'#d9e6ff':bg.sky;
 const ground=bg.ground;
 const mid= panel.background==='sea' ? '#7bd6ef' : panel.background==='castle' ? '#d7ebc7' : '#cce8af';
 const path = panel.background==='sea' ? `<path d="M0 214 C58 204 92 194 130 196 C186 198 235 188 300 182 L300 300 L0 300 Z" fill="#6cc3d7" opacity=".55"/>` : `<path d="M0 212 C56 200 96 194 142 198 C196 202 244 191 300 182 L300 300 L0 300 Z" fill="${mid}" opacity=".9"/>`;
 const path2 = panel.background==='garden' ? `<path d="M112 300 C120 246 144 224 170 206 C190 193 213 186 242 182 L300 182 L300 300 Z" fill="#f4d2bd" opacity=".85"/>` : panel.background==='forest' ? `<path d="M102 300 C116 258 134 232 164 214 C182 203 202 192 222 184 L300 184 L300 300 Z" fill="#eecb97" opacity=".82"/>` : '';
 const clouds = night ? '' : `<g opacity=".7"><ellipse cx="62" cy="42" rx="23" ry="11" fill="#fff"/><ellipse cx="80" cy="46" rx="19" ry="10" fill="#fff"/><ellipse cx="218" cy="38" rx="21" ry="10" fill="#fff"/><ellipse cx="236" cy="42" rx="16" ry="9" fill="#fff"/></g>`;
 const stars = night||mystery ? `<g opacity=".9"><circle cx="48" cy="48" r="2.3" fill="#fff8d2"/><circle cx="86" cy="62" r="2" fill="#fff8d2"/><circle cx="250" cy="56" r="2.2" fill="#fff8d2"/><circle cx="214" cy="30" r="1.8" fill="#fff8d2"/></g>` : '';
 const trees = panel.background==='forest' ? `<g><circle cx="34" cy="182" r="18" fill="#6fbf56"/><rect x="30" y="182" width="8" height="26" fill="#886036"/><circle cx="270" cy="176" r="14" fill="#78c861"/><rect x="266" y="176" width="7" height="22" fill="#886036"/></g>` : '';
 const flowers = panel.background==='garden' ? `<g><circle cx="32" cy="232" r="8" fill="#ff7eb7"/><circle cx="48" cy="244" r="7" fill="#f3c45d"/><circle cx="258" cy="234" r="8" fill="#ff7eb7"/><circle cx="274" cy="246" r="7" fill="#8e87ff"/></g>` : '';
 const castle = panel.background==='castle' ? `<g opacity=".8"><rect x="210" y="104" width="46" height="48" fill="#f6d8d1" stroke="#7a6470" stroke-width="2"/><polygon points="210,104 223,90 236,104" fill="#d47d92"/><polygon points="233,104 246,90 259,104" fill="#d47d92"/></g>` : '';
 const sea = panel.background==='sea' ? `<g><path d="M0 168 C40 162 70 173 108 168 C150 162 182 173 220 168 C255 163 282 172 300 168 L300 192 L0 192 Z" fill="#8ce4f7" opacity=".55"/><text x="26" y="226" font-size="24">🐠</text><text x="254" y="208" font-size="22">🪸</text></g>` : '';
 const school = panel.background==='school' ? `<g opacity=".85"><rect x="214" y="112" width="52" height="42" fill="#ffe0c0" stroke="#7c6962" stroke-width="2"/><rect x="232" y="126" width="14" height="28" fill="#b88563"/><text x="224" y="112" font-size="16">🔔</text></g>` : '';
 const space = panel.background==='space' ? `<g><circle cx="236" cy="58" r="17" fill="#ffd29b" opacity=".85"/><ellipse cx="232" cy="58" rx="27" ry="8" fill="none" stroke="#e3e0ff" stroke-width="2" opacity=".75"/><circle cx="48" cy="90" r="6" fill="#89d5ff"/></g>` : '';
 const door = layout.deco==='door-left' ? `<g><rect x="28" y="150" width="54" height="84" rx="3" fill="#8d5f39" stroke="#34231b" stroke-width="3"/><rect x="35" y="158" width="40" height="68" fill="#b57f4f" opacity=".75"/><circle cx="67" cy="192" r="3" fill="#ffd35d"/><path d="M82 190 C116 164 138 150 174 144" fill="none" stroke="#fff8c2" stroke-width="8" opacity=".35"/></g>` : '';
 const rainbow = layout.deco==='rainbow-right' ? `<path d="M244 236 A52 52 0 0 1 292 188" fill="none" stroke="#ff6767" stroke-width="7"/><path d="M249 236 A47 47 0 0 1 292 193" fill="none" stroke="#f8b43f" stroke-width="7"/><path d="M254 236 A42 42 0 0 1 292 198" fill="none" stroke="#f6e05e" stroke-width="7"/><path d="M259 236 A37 37 0 0 1 292 203" fill="none" stroke="#7fd071" stroke-width="7"/><path d="M264 236 A32 32 0 0 1 292 208" fill="none" stroke="#63b7ff" stroke-width="7"/>` : '';
 const sparkles = panel.action==='발견하기' || panel.action==='줍기' ? `<g><circle cx="235" cy="184" r="4" fill="#ffe37b"/><path d="M235 168 L239 180 L251 184 L239 188 L235 200 L231 188 L219 184 L231 180 Z" fill="#ffe37b" opacity=".9"/></g>` : '';
 return `
 <defs>
   <linearGradient id="skyGrad${idx}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${top}"/><stop offset="100%" stop-color="${bottom}"/></linearGradient>
   <linearGradient id="groundGrad${idx}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${ground}"/><stop offset="100%" stop-color="#9ece80"/></linearGradient>
 </defs>
 <rect width="300" height="172" fill="url(#skyGrad${idx})"/>
 <rect y="172" width="300" height="128" fill="url(#groundGrad${idx})"/>
 ${clouds}${stars}
 <circle cx="255" cy="44" r="18" fill="${night?'#fff2b8':'#fff0a0'}" opacity="${night?'.88':'.55'}"/>
 ${path}${path2}
 ${trees}${flowers}${castle}${sea}${school}${space}${door}${rainbow}${sparkles}
 `;
}
function propGraphic(panel, layout){
 const map={열쇠:'🗝️',별:'⭐',무지개:'🌈',보석:'💎',나비:'🦋',문:'🚪',책:'📘'};
 if(panel.prop==='없음') return '';
 if(panel.action==='줍기') return `<text x="238" y="220" font-size="34">${map[panel.prop]||''}</text>`;
 if(panel.action==='열기' || panel.prop==='문') return '';
 if(panel.action==='축하하기' && panel.prop==='무지개') return '';
 return `<text x="252" y="226" font-size="34">${map[panel.prop]||''}</text>`;
}
function bubbleTextParts(speech,maxChars=18){
  const txt=String(speech||'').trim();
  if(!txt)return [];
  const chars=Array.from(txt);
  if(chars.length<=maxChars)return [txt];
  if(chars.length<=maxChars*2)return [chars.slice(0,maxChars).join(''),chars.slice(maxChars,maxChars*2).join('')];
  return [chars.slice(0,maxChars).join(''),chars.slice(maxChars,maxChars*2-1).join('')+'…'];
}
function fittedBubble(speech,opts={}){
 const p=opts.panel||{};
 const mode=p.bubbleMode||'bubble';
 if(mode==='none')return '';
 const textVisible=mode!=='blank';
 const lines=bubbleTextParts(speech,opts.maxChars||16);
 if(textVisible&&!lines.length)return '';
 const displayLines=lines.length?lines:[' '];
 const fs=(opts.fontSize||13.5)*Math.max(.7,Math.min(1.45,Number(p.bubbleFontSize||100)/100));
 const textLen=Math.max(2,...displayLines.map(l=>Array.from(l).length));
 const paddingFactor=Math.max(.4,Math.min(2,Number(p.bubblePadding??100)/100));
 const horizontalPad=16*paddingFactor,verticalPad=10*paddingFactor;
 const width=Math.min(opts.maxWidth||212,Math.max(40,Math.round(textLen*fs*.92+horizontalPad*2)));
 const lineStep=fs*1.32;
 const textHeight=displayLines.length*lineStep;
 const height=Math.max(24,Math.round(textHeight+verticalPad*2));
 const right=opts.right||286,top=opts.top||9,left=right-width,center=left+width/2,bottom=top+height;
 const tailX=left+Math.min(44,width*.38);
 const path=`M${left+17} ${top} H${right-17} Q${right} ${top} ${right} ${top+17} V${bottom-15} Q${right} ${bottom} ${right-17} ${bottom} H${tailX+10} L${tailX} ${bottom+11} L${tailX-11} ${bottom} H${left+17} Q${left} ${bottom} ${left} ${bottom-16} V${top+17} Q${left} ${top} ${left+17} ${top} Z`;
 const fillColors={white:'#fff',cream:'#fff3db',pink:'#ffe6f0',blue:'#e6f5ff',none:'#fff'};
 const opacity=p.bubbleFill==='none'?0:Math.max(0,Math.min(1,Number(p.bubbleOpacity??70)/100));
 const fill=fillColors[p.bubbleFill]||'#fff';
 const txtColors={dark:'#231b31',black:'#101010',white:'#ffffff',purple:'#662f99',blue:'#1253ab',red:'#ae2347'};
 const color=txtColors[p.bubbleTextColor]||txtColors.dark;
 const halo=color==='#ffffff'?'#171024':'#fff';
 const background=mode==='text'?'':`<path d="${path}" fill="${fill}" fill-opacity="${opacity}" stroke="#34243b" stroke-width="2.1" stroke-linejoin="round"/>`;
 const firstTextY=top+(height-textHeight)/2+fs*.97;
 const txt=textVisible?displayLines.map((ln,i)=>`<text x="${center}" y="${firstTextY+i*lineStep}" text-anchor="middle" font-size="${fs}" font-weight="900" fill="${color}" stroke="${halo}" stroke-opacity=".85" stroke-width="1.55" paint-order="stroke fill">${safe(ln)}</text>`).join(''):'';
 return `<g class="speechBubble">${background}${txt}</g>`;
}
function speechBubble(speech,layout){return fittedBubble(speech,{right:layout.bubbleX+layout.bubbleW,top:layout.bubbleY,fontSize:13.5,maxWidth:layout.bubbleW,maxChars:13});}

// C3.5: scene art is locally embedded, no network request or separate assets folder.
const richStoryArt = {"rabbit":["webtoon-art/0beaeebcbbbc39a72f09129e.webp","webtoon-art/446d91c04a823e30bd35d648.webp","webtoon-art/d4afdbf4ad5d8a26d0e6d80b.webp","webtoon-art/fb20cdd21b2f2c46aa77b3eb.webp"],"cat":["webtoon-art/39fae946d2781560428c69bb.webp","webtoon-art/d7442adf3b5e6c062208f4d4.webp","webtoon-art/d9fae2db72c44c50590a8783.webp","webtoon-art/f6491916377f886d994c74c3.webp"],"fox":["webtoon-art/eddafce52ce4b5677400a507.webp","webtoon-art/8dea8f0b2bd61f77fe313216.webp","webtoon-art/8a46a69bef97115a15156f9c.webp","webtoon-art/1fcd81d8b3e8d16bb7f920af.webp"],"fairy":["webtoon-art/16fd7894d4a30a29998dd0b7.webp","webtoon-art/aeff53597ca1962063608414.webp","webtoon-art/1e69e712d4227139402fdc9e.webp","webtoon-art/1827bd8508e9da79fda96b9d.webp"],"bear":["webtoon-art/0c3398bcfb5a0ae650085469.webp","webtoon-art/dc4a3686baf0d68263ec473b.webp","webtoon-art/beaa4a32ffdea6d18e686d78.webp","webtoon-art/15f3ff7691a56b417a8b0878.webp"],"robot":["webtoon-art/d573ea82d064d4967faaa36e.webp","webtoon-art/c8fa6f8c31e7d272f7b65186.webp","webtoon-art/84d3aff0c2d82a9ceadffdf0.webp","webtoon-art/f07162bd9f2a979f08d2b847.webp"]};
const richBackgroundArt = ["webtoon-art/774b466708c8be92f5b48e66.webp","webtoon-art/ed7eeef4486504283b940b66.webp","webtoon-art/51fc4e0e588a925dbf621894.webp","webtoon-art/21dbab48c7be2f5de1a9f48d.webp"];
function richFrameFor(panel, idx){
  if(panel.pose==='점프하기' || panel.action==='축하하기')return 3;
  if(panel.action==='열기' || panel.prop==='문')return 2;
  if(panel.action==='줍기' || panel.emotion==='놀랐어요' || panel.prop==='열쇠')return 1;
  return idx===3 ? 3 : idx===2 ? 2 : 0;
}
// C3.9.6: six scene backgrounds embedded in one offline HTML document.
// Selecting a background always uses its own distinct landscape.
const selectableBackgrounds = {"forest":"webtoon-art/ec6b0502d8964eebba7efa6d.webp","garden":"webtoon-art/cb7b03b9a7d06ee2a24e824e.webp","castle":"webtoon-art/b2295bfab6fcba75109b40ce.webp","sea":"webtoon-art/23caa5f7d0d5c8020378cbf8.webp","school":"webtoon-art/f9b5f05e367ea107287d91c7.webp","space":"webtoon-art/c1d8fbff89c3f60a18621774.webp"};
const storybookBackgrounds={storybook_autumn:{name:'🍁 가을 숲의 색깔 편지',src:'./storybook-autumn-forest.jpg'}};
for(const [id,item] of Object.entries(storybookBackgrounds)){selectableBackgrounds[id]=item.src;bgMeta[id]={name:item.name,sky:'#ffdfaa',ground:'#d8a76f',deco1:'🍁',deco2:'🍂'};}
const customBackgroundStorageKey='webtoon-custom-backgrounds-v1';
function readCustomBackgrounds(){
  try{
    const raw=localStorage.getItem(customBackgroundStorageKey);
    const list=raw?JSON.parse(raw):[];
    return Array.isArray(list)?list.filter(item=>item&&item.id&&item.src):[];
  }catch(e){console.warn('사용자 배경 읽기 실패',e);return []}
}
function writeCustomBackgrounds(list){
  try{localStorage.setItem(customBackgroundStorageKey,JSON.stringify(list||[]))}
  catch(e){throw new Error('배경 저장 공간이 부족해요. 기존 자료는 그대로 남아 있어요.')} 
}
function injectCustomBackground(item){
  if(!item||!item.id||!item.src)return;
  selectableBackgrounds[item.id]=item.src;
  bgMeta[item.id]={name:item.name||'내 배경',sky:'#ffffff',ground:'#ffffff',deco1:'🖼️',deco2:'✨',custom:true};
}
function applyStoredCustomBackgrounds(){readCustomBackgrounds().forEach(injectCustomBackground)}
applyStoredCustomBackgrounds();
function populateBackgroundSelect(el,selectedValue){
  if(!el)return;
  const current=(selectedValue!==undefined&&selectedValue!==null)?selectedValue:el.value;
  el.innerHTML='';
  const defaults=['forest','garden','castle','sea','school','space'];
  defaults.forEach(k=>{if(bgMeta[k])el.insertAdjacentHTML('beforeend',`<option value="${k}">${bgMeta[k].name}</option>`)});
  const simple=['plain_white','plain_pink','plain_sky','plain_lavender','plain_yellow','plain_mint','plain_sparkles','plain_stage'];
  const simpleItems=simple.filter(k=>bgMeta[k]);
  if(simpleItems.length){
    const group=document.createElement('optgroup');group.label='🩷 단순 꾸미기 배경';
    simpleItems.forEach(k=>{const opt=document.createElement('option');opt.value=k;opt.textContent=bgMeta[k].name;group.append(opt)});
    el.append(group);
  }
  const storyGroup=document.createElement('optgroup');storyGroup.label='📖 창작동화 배경';
  for(const [id,item] of Object.entries(storybookBackgrounds)){const opt=document.createElement('option');opt.value=id;opt.textContent=item.name;storyGroup.append(opt);}
  el.append(storyGroup);
  const custom=readCustomBackgrounds().filter(item=>!item.hidden||item.id===current);
  if(custom.length){
    const group=document.createElement('optgroup');group.label='🖼 내가 넣은 배경';
    custom.forEach(item=>{injectCustomBackground(item);const opt=document.createElement('option');opt.value=item.id;opt.textContent=item.name||'내 배경';group.append(opt)});
    el.append(group);
  }
  if(current && [...el.options].some(o=>o.value===current))el.value=current;
}
function refreshBackgroundSelectors(){
  populateBackgroundSelect(document.getElementById('baseBackground'),settings.baseBackground||'forest');
  populateBackgroundSelect(document.getElementById('panelBg'));
}
window.webtoonRegisterBackground=function(payload){
  if(!payload||!payload.src)return false;
  const id=payload.id||('userbg-'+Date.now()+'-'+Math.random().toString(36).slice(2,7));
  const item={id,name:(payload.name||'내 배경').slice(0,40),src:payload.src};
  const list=readCustomBackgrounds().filter(v=>v.id!==id);
  list.unshift(item);writeCustomBackgrounds(list);injectCustomBackground(item);refreshBackgroundSelectors();renderCustomBgManager();
  return item;
};
function renderCustomBgManager(){
 const root=document.getElementById('customBgManager');if(!root)return;root.replaceChildren();const list=readCustomBackgrounds();if(!list.length){root.textContent='아직 등록한 배경이 없어요.';return;}
 for(const item of list){const card=document.createElement('div');card.className='dw-card';const img=new Image();img.src=item.src;img.alt=item.name;img.style.cssText='width:100%;max-height:110px;object-fit:contain';const title=document.createElement('b');title.textContent=item.name+(item.hidden?' (숨김)':'');card.append(img,title);for(const [label,action] of [['이름 바꾸기',()=>{const n=prompt('배경 이름',item.name);if(n===null||!n.trim())return;item.name=n.trim().slice(0,40)}],[item.hidden?'다시 표시':'목록에서 숨기기',()=>{item.hidden=!item.hidden}]]){const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent=label;button.onclick=()=>{try{action();writeCustomBackgrounds(list);injectCustomBackground(item);refreshBackgroundSelectors();renderCustomBgManager()}catch(e){toast(e.message)}};card.append(button)}root.append(card)}
}
window.webtoonUnregisterBackground=function(id){const list=readCustomBackgrounds();const item=list.find(x=>x.id===id);if(!item)return;item.hidden=true;writeCustomBackgrounds(list);refreshBackgroundSelectors();renderCustomBgManager()};
window.webtoonListCustomBackgrounds=readCustomBackgrounds;
for(const [id,[name,color]] of Object.entries(simpleBgSettings)){
 const decor=id==='plain_sparkles'?`<g fill="#fff" opacity=".86"><path d="M47 42l6 16 16 6-16 6-6 16-6-16-16-6 16-6Z"/><path d="M255 32l4 11 11 4-11 4-4 11-4-11-11-4 11-4Z"/><path d="M217 140l5 13 13 5-13 5-5 13-5-13-13-5 13-5Z"/></g>`:
 id==='plain_stage'?`<path d="M0 0 Q60 90 26 192 L0 192Z M300 0 Q240 90 274 192 L300 192Z" fill="#d792c3" opacity=".33"/>`:'';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="384" viewBox="0 0 300 192"><rect width="300" height="192" fill="${color}"/>${decor}</svg>`;
 selectableBackgrounds[id]='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

// C3.9.6 Each prop is an independent object. Old work with p.prop is migrated lazily.
const propIcons={열쇠:'🗝️',별:'⭐',무지개:'🌈',보석:'💎',나비:'🦋',문:'🚪',책:'📘',꽃:'🌺',왕관:'👑',풍선:'🎈',선물:'🎁',마법봉:'🪄',하트:'💖',달:'🌙',구름:'☁️',사탕:'🍭',축구공:'⚽',지도:'🗺️',물고기:'🐠',고양이:'🐱',강아지:'🐶'};
// C3.9.6: native emoji glyphs have fixed platform-dependent multicolor pixels.
// Recolorable vector props use actual SVG fills instead of a CSS filter on emoji.
const editablePropColors={
 normal:['#6ac8ee','#398cdd'],red:['#ff8baf','#e94472'],orange:['#ffe07b','#ff9c35'],
 blue:['#88d8ff','#336fe6'],green:['#94e9a0','#34ae7b'],purple:['#d4a5ff','#8955da']
};
// C3.9.6: premium illustrated transparent ornaments embedded in the single HTML.
// Existing legacy props automatically pick up the illustrated version without changing saved data.
const premiumPropImages = {"화관":"webtoon-art/b72678388080ccfd30964571.webp","리본장식":"webtoon-art/e143c8cce9935548fbf7d6be.webp","장미":"webtoon-art/e5dbd56f66b615240bc55182.webp","보석나비":"webtoon-art/a82d4fd74a54526a146a4eb1.webp","황금열쇠":"webtoon-art/7f5d50be9d5f5dbb0a3f2eca.webp","수정보석":"webtoon-art/25a6456dd4e2a59c76d5ff97.webp","별지팡이":"webtoon-art/95492c72a55433e455329aa8.webp","요정날개":"webtoon-art/ca110f678d1d47fa174061e9.webp","빛가루":"webtoon-art/78746f7b99e481a070364e0e.webp","꽃":"webtoon-art/e5dbd56f66b615240bc55182.webp","나비":"webtoon-art/a82d4fd74a54526a146a4eb1.webp","왕관":"webtoon-art/b72678388080ccfd30964571.webp","열쇠":"webtoon-art/7f5d50be9d5f5dbb0a3f2eca.webp","보석":"webtoon-art/25a6456dd4e2a59c76d5ff97.webp","마법봉":"webtoon-art/95492c72a55433e455329aa8.webp","무지개":"webtoon-art/6c1b0a07bd23f74f1eda288e.webp","문":"webtoon-art/ce63817e074bcc0e65b000a4.webp","책":"webtoon-art/3ea8df86ad6090d6008213ba.webp","하트":"webtoon-art/6f6abc1b7bdcf65b29453ec7.webp","선물":"webtoon-art/b14ad0b7aeb093943752fd22.webp","구름":"webtoon-art/da3ce10ef80e7469a659e5b9.webp","달":"webtoon-art/591da4949b780f243a07c81f.webp","사탕":"webtoon-art/fa9beff6ebdc0b96af948e5d.webp","지도":"webtoon-art/3ea159a7878892ad6a297276.webp","물고기":"webtoon-art/d5e140fe5f7d5c6ba6ed528e.webp","풍선":"webtoon-art/9df9d54c1ef9a7432f3240f9.webp","축구공":"webtoon-art/d0de2ddaea227c1d66990dac.webp","별":"webtoon-art/fa27a09b8cd67be7cf93f8ce.webp","강아지":"webtoon-art/7a4da6cb4722e74d3246b91b.webp","고양이":"webtoon-art/08aba6468e754de49ac6922a.webp"};
function recolorableProp(it){
 // Every menu prop has a real editable vector. Custom imported files and emoji
 // remain independent raster/emoji sources (not falsely advertised as recolorable).
 if(it.source||it.emoji || !propIcons[it.name]) return null;
 const [a,b]=editablePropColors[it.tint]||editablePropColors.normal;
 const line='#59465a',light='#ffffff';
 const outline=`stroke="${line}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
 const r=(x,y,w,h,rx=2,fill=a)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${outline}/>`;
 const c=(x,y,rad,fill=a)=>`<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}" ${outline}/>`;
 const e=(x,y,rx,ry,fill=a)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${outline}/>`;
 const poly=(points,fill=a)=>`<polygon points="${points}" fill="${fill}" ${outline}/>`;
 const path=(d,fill=a)=>`<path d="${d}" fill="${fill}" ${outline}/>`;
 const stroke=(d,color=line,w=3)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const n=it.name;
 let g='';
 if(n==='나비')g=path('M-2 -2 C-22 -30 -33 -20 -27 -4 C-20 5 -8 10 -1 7Z',a)+path('M2 -2 C22 -30 33 -20 27 -4 C20 5 8 10 1 7Z',a)+path('M-2 5 C-28 0 -24 26 -11 24 C-5 24 -1 13 -1 8Z',b)+path('M2 5 C28 0 24 26 11 24 C5 24 1 13 1 8Z',b)+e(0,6,4,18,'#65466c')+stroke('M0 -9 Q-8 -27 -14 -24 M0 -9 Q8 -27 14 -24');
 else if(n==='열쇠')g=c(-12,-12,12,a)+c(-12,-12,5,light)+r(-9,0,11,27,3,b)+r(0,17,14,6,1,b)+r(0,9,9,6,1,b);
 else if(n==='별')g=poly('0,-29 8,-10 28,-9 13,5 17,26 0,15 -17,26 -13,5 -28,-9 -8,-10',a);
 else if(n==='무지개')g=stroke('M-30 24 A30 30 0 0 1 30 24',a,10)+stroke('M-22 24 A22 22 0 0 1 22 24',b,10)+stroke('M-14 24 A14 14 0 0 1 14 24','#ffe892',7);
 else if(n==='보석')g=poly('-24,-6 -13,-23 14,-23 25,-6 0,27',a)+poly('-24,-6 25,-6 0,27',b)+poly('-13,-23 14,-23 25,-6 -24,-6','#fff6ed');
 else if(n==='문')g=r(-21,-29,42,58,5,b)+r(-15,-22,30,48,3,a)+c(10,5,3,'#ffe17b');
 else if(n==='책')g=path('M0 -19 Q-12 -25 -28 -19 L-28 22 Q-12 14 0 24Z',a)+path('M0 -19 Q12 -25 28 -19 L28 22 Q12 14 0 24Z',b)+stroke('M0 -19 V24');
 else if(n==='꽃')g=[[-14,-8],[-14,8],[0,-17],[14,-8],[14,8],[0,17]].map(([x,y])=>e(x,y,9,12,a)).join('')+c(0,2,10,b)+stroke('M0 13 V29','#54835a',4);
 else if(n==='왕관')g=poly('-28,-18 -17,-6 -6,-25 4,-4 19,-25 27,-18 23,19 -22,19',a)+r(-22,15,45,9,2,b)+c(-18,-15,3,b)+c(18,-15,3,b);
 else if(n==='풍선')g=e(0,-9,19,25,a)+poly('-4,17 4,17 0,23',b)+stroke('M0 23 Q9 29 2 34',line,2);
 else if(n==='선물')g=r(-24,-10,48,37,2,a)+r(-28,-16,56,11,2,b)+r(-5,-16,10,43,1,'#ffe9b6')+path('M0 -16 C-31 -18 -23 -34 -7 -29 Q0 -24 0 -16 C31 -18 23 -34 7 -29 Q0 -24 0 -16',b);
 else if(n==='마법봉')g=stroke('M-19 25 L15 -13',b,8)+poly('15,-31 21,-17 34,-14 22,-6 20,8 10,-4 -4,-4 8,-13',a);
 else if(n==='하트')g=path('M0 26 C-37 0 -27 -25 -10 -24 Q0 -24 0 -13 Q5 -28 19 -24 C42 -13 24 10 0 26Z',a);
 else if(n==='달')g=path('M10 -29 A27 27 0 1 0 20 26 A22 22 0 0 1 10 -29Z',a);
 else if(n==='구름')g=c(-17,8,12,a)+c(0,-4,18,a)+c(18,9,13,a)+r(-28,7,58,17,9,a);
 else if(n==='사탕')g=poly('-13,-12 -30,-21 -27,15 -13,10',b)+poly('13,-12 30,-21 27,15 13,10',b)+c(0,-1,17,a)+stroke('M-11 -10 Q0 -1 11 8',light,3);
 else if(n==='축구공')g=c(0,0,27,a)+poly('0,-13 14,-4 9,12 -9,12 -14,-4',b)+stroke('M0 -13 V-25 M14 -4 L25 -10 M9 12 L14 23 M-9 12 L-14 23 M-14 -4 L-25 -10');
 else if(n==='지도')g=poly('-27,-22 -7,-28 8,-19 27,-27 27,20 7,26 -7,18 -27,24',a)+stroke('M-7 -28 V18 M8 -19 V26',b,3)+stroke('M-19 -11 Q-4 2 19 -9',b,2);
 else if(n==='물고기')g=e(0,0,19,14,a)+poly('13,0 31,-17 31,17',b)+c(-9,-3,3,line)+stroke('M-8 11 Q3 15 11 11',b,2);
 else if(n==='고양이')g=poly('-22,-12 -22,-28 -8,-18 8,-18 22,-28 22,-12',b)+c(0,1,24,a)+c(-8,-2,3,line)+c(8,-2,3,line)+poly('-3,7 3,7 0,11',b)+stroke('M-7 12 Q0 18 7 12 M-11 9 L-27 6 M11 9 L27 6');
 else if(n==='강아지')g=e(-22,-8,10,20,b)+e(22,-8,10,20,b)+c(0,2,23,a)+c(-9,-3,3,line)+c(9,-3,3,line)+e(0,9,5,4,b)+stroke('M0 14 Q-7 22 -13 16 M0 14 Q7 22 13 16');
 return g?`<g>${g}</g>`:null;
}
const propFilters={normal:'none',red:'sepia(.65) saturate(2.2) hue-rotate(305deg)',orange:'sepia(.8) saturate(2.2) hue-rotate(345deg)',blue:'sepia(.6) saturate(2) hue-rotate(165deg)',green:'sepia(.55) saturate(1.8) hue-rotate(70deg)',purple:'sepia(.55) saturate(2) hue-rotate(235deg)'};
let activeItemId=null;
// Per-action undo/redo. State snapshots include per-cut scenery, characters and props.
const undoHistory=[],redoHistory=[];
let lastHistoryAt=0,lastHistoryKey='';
function rememberAction(key){
 if(!state||!state.panels||!state.panels.length)return;
 const now=Date.now();
 // One snapshot per continuous slider movement or typing burst.
 if(key===lastHistoryKey && now-lastHistoryAt<850){lastHistoryAt=now;return}
 undoHistory.push(JSON.stringify(state));if(undoHistory.length>35)undoHistory.shift();
 redoHistory.length=0;lastHistoryAt=now;lastHistoryKey=key;
 syncHistoryButtons();
}
function syncHistoryButtons(){if($('undoEdit'))$('undoEdit').disabled=!undoHistory.length;if($('redoEdit'))$('redoEdit').disabled=!redoHistory.length}
function applyHistory(which,other){if(!which.length)return toast('더 이상 되돌릴 내용이 없어요.');other.push(JSON.stringify(state));if(other.length>35)other.shift();state=JSON.parse(which.pop());activeItemId=null;lastHistoryKey='';renderComic();syncHistoryButtons();toast('이전 편집 상태로 돌아왔어요.')}
// Capture user gestures before existing change/input/click listeners mutate state.
document.addEventListener('input',e=>{
 const id=e.target?.id;if(['heroSize','itemSize','itemRotation','panelCaption','panelSpeech'].includes(id))rememberAction('input-'+id)
},true);
document.addEventListener('change',e=>{
 const id=e.target?.id;if(['panelEmotion','panelPose','panelAction','panelMood','panelBg','itemTint','heroTint','heroOutfit','panelProp'].includes(id))rememberAction('change-'+id+'-'+Date.now())
},true);
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(['duplicateItem','removeItem','flipItem','centerHero','centerItem','resetStage','addCustomEmoji','applyIdea','copyBg','copyProps'].includes(b.id))rememberAction('click-'+b.id+'-'+Date.now())
},true);

function ensureItems(panel){
 if(!Array.isArray(panel.items)){
  panel.items=[];
  if(panel.prop && panel.prop!=='없음')panel.items.push({id:'legacy-'+Date.now(),name:panel.prop,x:Number(panel.itemX)||0,y:Number(panel.itemY)||0,size:Number(panel.itemSize)||100,rotation:0,flip:false,tint:'normal'});
 }
 return panel.items;
}
function currentItem(){const p=state.panels[selected];if(!p||!activeItemId)return null;return ensureItems(p).find(i=>i.id===activeItemId)||null}
// C4.5.9: illustration's complete transparent canvas must stay within the scene.
// These limits apply to animal props only; all other existing props stay unchanged.
function isFriendItem(item){
 return !!item && ((typeof item.source==='string' && /^friend-(dog|cat|rabbit)-/.test(item.source)) || /^(몽이|루루|보송이|요정) · /.test(item.name||''));
}
function fitFriendInStage(item){
 if(!isFriendItem(item))return;
 const sx=Math.max(.25,Math.min(3,Number(item.stretchX)||1));
 const sy=Math.max(.25,Math.min(3,Number(item.stretchY)||1));
 const rotation=(Number(item.rotation)||0)*Math.PI/180;
 const spread=(Math.abs(Math.cos(rotation))*sx+Math.abs(Math.sin(rotation))*sy);
 const rise=(Math.abs(Math.sin(rotation))*sx+Math.abs(Math.cos(rotation))*sy);
 // Each replacement illustration is a complete, square transparent image.
 const maxScale=Math.min(141/(29*spread),88/(29*rise));
 item.size=Math.max(20,Math.min(Number(item.size)||100,Math.floor(100*maxScale)));
 const scale=(Number(item.size)||100)/100;
 const rx=29*scale*spread,ry=29*scale*rise;
 item.x=+Math.max(5+rx-155,Math.min(295-rx-155,Number(item.x)||0)).toFixed(2);
 item.y=+Math.max(5+ry-122,Math.min(187-ry-122,Number(item.y)||0)).toFixed(2);
}
function addProp(name,source,emoji){const p=state.panels[selected];if(!p)return;if(p.aiImage){toast('먼저 기본 그림으로 돌아가 주세요.');return}if(name==='없음')return;
 const items=ensureItems(p);const offset=(items.length%5)*14;
 const isFriend=!!(source&&/^friend-(dog|cat|rabbit)-/.test(source)) || /^((몽이|루루|보송이|요정) · )/.test(name);
 const friendIndex=items.filter(v=>isFriendItem(v)).length;
 const friendSpots=[[-44,-15],[45,-15],[-40,31],[42,31],[0,0],[0,-36]];
 const spot=friendSpots[friendIndex%friendSpots.length];
 const item={id:'prop-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),name,x:isFriend?spot[0]:offset-18,y:isFriend?spot[1]:offset-12,size:isFriend?155:100,rotation:0,flip:false,tint:'normal',source:source||null,emoji:emoji||null};
 if(isFriend)fitFriendInStage(item);items.push(item);activeItemId=item.id;renderComic();toast(name+' 소품을 추가했어요!')}
function panelSvg(panel, idx,showControls=false){
 const caption=safe(panel.caption||'');
 const bg=panel.background||'forest';
 const bubble=fittedBubble(panel.speech||'',{right:288,top:10,maxWidth:198,fontSize:13.2,maxChars:14,panel});
 const background=selectableBackgrounds[bg]||selectableBackgrounds.forest;
 const hero=heroSvg(panel);
 const hx=Number.isFinite(panel.heroX)?panel.heroX:0;
 const hy=Number.isFinite(panel.heroY)?panel.heroY:0;
 const hs=Math.max(.45,Math.min(1.75,(Number(panel.heroSize)||100)/100));
 // Resize the hero around the center of the shoes instead of the SVG origin.
 // The original stage places the feet at 7,-22 + 0.73 * (pivotX,pivotY).
 // A counter-translation makes this point invariant for every heroSize.
 // Both the counter-translation and the scale are inside the dragged hero group;
 // heroX/heroY remain exactly as the child positioned them.
 const heroFootX = isPrincess(state.hero) ? 121 : state.hero==='custom' ? 120 : ['dog','cat','rabbit','fairy'].includes(state.hero) ? 132 : 150;
 const heroFootY = state.hero==='custom' ? (state.studioRecipe?278:240) : isPrincess(state.hero) ? 276 : ['dog','cat','rabbit'].includes(state.hero) ? 277 : 271;
 const footShiftX = +(0.73*heroFootX*(1-hs)).toFixed(3);
 const footShiftY = +(0.73*heroFootY*(1-hs)).toFixed(3);
 const heroMirror=panel.heroFlip?'translate('+heroFootX+' 0) scale(-1 1) translate('+(-heroFootX)+' 0)':'';
 const items=ensureItems(panel);
 const renderItem=(it)=>{
  const x=Number(it.x)||0,y=Number(it.y)||0;
  const scale=Math.max(.15,Math.min(5,(Number(it.size)||100)/100));
  const stretchX=Math.max(.25,Math.min(3,Number(it.stretchX)||1));
  const stretchY=Math.max(.25,Math.min(3,Number(it.stretchY)||1));
  const rotation=Number(it.rotation)||0, flip=it.flip?-1:1;
  const filter=propFilters[it.tint]||'none';
  const icon=safe(it.emoji||propIcons[it.name]||'⭐');
  const premiumSource=it.source||(it.emoji?null:premiumPropImages[it.name]);
  const vector=!premiumSource?recolorableProp(it):null;
  const body=premiumSource
    ? `<image href="${premiumSource}" x="-29" y="-29" width="58" height="58" preserveAspectRatio="xMidYMid meet" style="filter:${filter}"/>`
    : (vector || `<text x="0" y="13" font-size="43" text-anchor="middle" style="filter:${filter}">${icon}</text>`);
  
  return `<g class="stageHandle" data-piece="item" data-item-id="${it.id}" transform="translate(${x} ${y}) translate(155 122) rotate(${rotation}) scale(${scale*flip*stretchX} ${scale*stretchY})"><rect x="-31" y="-31" width="62" height="62" fill="transparent" pointer-events="all" stroke="none"/>${body}</g>`;
 };
 const propsBack=items.filter(it=>it.layer==='back').map(renderItem).join('');
 const propsFront=items.filter(it=>it.layer!=='back').map(renderItem).join('');
 const backHitZones=items.filter(it=>it.layer==='back').map(it=>{
  const sc=Math.max(.15,Math.min(5,(Number(it.size)||100)/100));
  const sx=sc*(it.flip?-1:1)*Math.max(.25,Math.min(3,Number(it.stretchX)||1));
  const sy=sc*Math.max(.25,Math.min(3,Number(it.stretchY)||1));
  return `<g class="stageHandle" data-piece="item" data-item-id="${it.id}" transform="translate(${Number(it.x)||0} ${Number(it.y)||0}) translate(155 122) rotate(${Number(it.rotation)||0}) scale(${sx} ${sy})"><rect x="-28" y="-28" width="56" height="56" fill="transparent" pointer-events="all" /></g>`;
 }).join('');
 const selectedProp=items.find(it=>it.id===activeItemId);

 const gizmo=showControls&&state.panels[selected]===panel&&selectedProp ? (()=>{
   const it=selectedProp,scale=Math.max(.15,Math.min(5,(Number(it.size)||100)/100));
   const w=29*scale*Math.max(.25,Math.min(3,Number(it.stretchX)||1));
   const h=29*scale*Math.max(.25,Math.min(3,Number(it.stretchY)||1));
   const cx=155+(Number(it.x)||0),cy=122+(Number(it.y)||0),rot=(Number(it.rotation)||0)*Math.PI/180;
   const point=(x,y)=>({x:cx+x*Math.cos(rot)-y*Math.sin(rot),y:cy+x*Math.sin(rot)+y*Math.cos(rot)});
   const grip=(name,p)=>{
     // Keep the grabbing surface inside the actual scene, even when the
     // drawing itself extends outside it. Do not shrink the drawing.
     const x=Math.max(11,Math.min(289,p.x)),y=Math.max(11,Math.min(181,p.y));
     return `<g data-transform-handle="${name}" data-item-id="${it.id}"><circle cx="${x}" cy="${y}" r="9" fill="#fff" fill-opacity=".88" stroke="#8151c6" stroke-width="1.4" pointer-events="all"/><circle cx="${x}" cy="${y}" r="2.7" fill="#8151c6" pointer-events="none"/></g>`;
   };
   const out=13;
   return `<g class="editGizmo"><g transform="translate(${cx} ${cy}) rotate(${rot*180/Math.PI})"><rect x="${-w}" y="${-h}" width="${2*w}" height="${2*h}" rx="2" fill="none" stroke="#8151c6" stroke-width=".85" stroke-dasharray="2 3" pointer-events="none"/></g>${grip('corner',point(w+out,h+out))}${grip('horizontal',point(w+out,0))}${grip('vertical',point(0,h+out))}${grip('rotation',point(0,-h-out))}</g>`;
 })():'';
 return `<svg viewBox="0 0 300 192" role="img" aria-label="${caption}" style="filter:${moodFilter(panel.mood)}">
   <image href="${background}" x="0" y="0" width="300" height="192" preserveAspectRatio="xMidYMid slice" pointer-events="none"/>
   ${propsBack}
   <g class="stageHandle editableHero" data-piece="hero" transform="translate(${hx} ${hy}) translate(7 -22) translate(${footShiftX} ${footShiftY}) scale(${.73*hs})"><g transform="${heroMirror}" pointer-events="none">${hero}</g><rect x="60" y="70" width="195" height="215" fill="transparent" pointer-events="all"/></g>
   ${propsFront}
   ${backHitZones}
   ${gizmo}
   ${showControls&&state.panels[selected]===panel&&activeHeroSelected&&!selectedProp ? `<g class="heroQuickControls" aria-label="주인공 바로 조절 · 컷 왼쪽 아래">
     <rect x="4" y="160" width="109" height="25" rx="8" fill="#fffafc" fill-opacity=".97" stroke="#8f69c2" stroke-width="1.1" pointer-events="none"/>
     <g data-hero-control="smaller"><rect x="7" y="162" width="31" height="21" rx="6" fill="transparent" pointer-events="all"/><text x="22" y="178" font-size="18" text-anchor="middle" fill="#67428f" pointer-events="none">−</text></g>
     <g data-hero-control="bigger"><rect x="40" y="162" width="32" height="21" rx="6" fill="transparent" pointer-events="all"/><text x="56" y="178" font-size="18" text-anchor="middle" fill="#67428f" pointer-events="none">+</text></g>
     <g data-hero-control="flip"><rect x="74" y="162" width="36" height="21" rx="6" fill="transparent" pointer-events="all"/><text x="92" y="177" font-size="13" text-anchor="middle" fill="#67428f" pointer-events="none">↔</text></g>
   </g>`:''}
   ${isPrincess(state.hero) && validPrincessStyle(panel.princessLook,state.hero).sparkles==='yes' ? `<g class="heroGlitter" pointer-events="none" transform="translate(${hx} ${hy})" opacity=".92">
     <g fill="#fffdf5" stroke="#f9ce78" stroke-width=".8">
      <path d="M54 47 l3.4 -11 3.4 11 11 3.4 -11 3.4 -3.4 11 -3.4 -11 -11 -3.4Z"/>
      <path d="M182 39 l3.5 -12 3.5 12 12 3.5 -12 3.5 -3.5 12 -3.5 -12 -12 -3.5Z"/>
      <path d="M218 129 l3.8 -13 3.8 13 13 3.8 -13 3.8 -3.8 13 -3.8 -13 -13 -3.8Z"/>
      <path d="M66 151 l3 -10 3 10 10 3 -10 3 -3 10 -3 -10 -10 -3Z"/>
     </g><g fill="#ffedab"><circle cx="98" cy="38" r="1.9"/><circle cx="236" cy="83" r="2.2"/><circle cx="90" cy="130" r="1.8"/><circle cx="201" cy="159" r="2"/></g></g>` : ''}
   <g pointer-events="none">${bubble}</g>
 </svg>`;
}
let panelDisplayMode='all';
function renderComic(){
 $('comicTitle').textContent=state.title||'나의 웹툰';
 const area=$('comicArea');
 const all=panelDisplayMode==='all';
 area.className='comic '+(all?(state.panels.length===1?'one':state.panels.length===2?'two':''):'focusPanel');
 area.innerHTML='';
 state.panels.forEach((p,i)=>{
   if(!all&&i!==selected)return;
   const el=document.createElement('button');el.type='button';
   el.dataset.panelIndex=String(i);
   el.className='panel'+(i===selected?' active':'');
   el.innerHTML=`<div class="scene${!p.aiImage?' rich':''}">${p.aiImage?`<img class="aiPanelImage" src="${p.aiImage}" alt="${safe(p.caption)}">`:panelSvg(p,i,true)}</div><div class="caption"><span class="panelNo">${i+1}컷</span>${safe(p.caption)}</div>`;
   el.onclick=e=>{
    if(performance.now()-lastPropGestureEnded<320)return;
    if(e.target.closest('[data-piece="item"], [data-transform-handle]'))return;
    if(selected!==i){selected=i;activeItemId=null;renderComic();return;}
    if(activeItemId!==null||activeHeroSelected){activeItemId=null;activeHeroSelected=false;renderComic();}
   };
   area.appendChild(el);
 });
 $('modeAll').setAttribute('aria-pressed',String(all));
 $('modeSingle').setAttribute('aria-pressed',String(!all));
 $('modePrev').disabled=selected===0;
 $('modeNext').disabled=selected>=state.panels.length-1;
 $('modePage').textContent=(selected+1)+' / '+state.panels.length;
 syncEditor();
 renderPropContextMenu();
}
const directShapeNames=['리본장식','화관','장미','보석나비','요정날개','수정보석','별지팡이','황금열쇠','별','꽃','나비','하트','선물','풍선','보석','열쇠','달','구름','책'];
function renderPropContextMenu(){
 const area=$('comicArea');area.querySelectorAll('.propContext').forEach(n=>n.remove());
 const it=currentItem();if(!it||!state.panels.length||state.panels[selected]?.aiImage)return;
 const panel=area.querySelector(`.panel[data-panel-index="${selected}"]`);
 const scene=panel?.querySelector('.scene');if(!scene)return;
 const menu=document.createElement('div');menu.className='propContext';menu.setAttribute('role','group');menu.setAttribute('aria-label','선택한 소품 바로 꾸미기');
 const opts=directShapeNames.map(n=>`<option value="${safe(n)}" ${n===it.name?'selected':''}>${safe(n)}</option>`).join('');
 menu.innerHTML=`<div class="propContextTitle">🎨 ${safe(it.name)} 꾸미기</div>
  <div class="propContextRow"><button type="button" data-ctx="front">공주 앞</button><button type="button" data-ctx="back">공주 뒤</button><button type="button" data-ctx="bring">맨앞</button></div>
  <div class="propContextRow"><select data-ctx-select="shape" aria-label="모양 바꾸기">${opts}</select><select data-ctx-select="color" aria-label="색감 바꾸기"><option value="normal">원래 색</option><option value="red">분홍</option><option value="orange">금색</option><option value="blue">하늘</option><option value="green">초록</option><option value="purple">보라</option></select></div>
  <div class="propContextRow"><button type="button" data-ctx="fit">🖼 전체 보이기</button><button type="button" data-ctx="flip">↔ 반전</button><button type="button" data-ctx="duplicate">📋 복제</button><button type="button" data-ctx="delete">🗑 삭제</button></div>
  <p class="propContextTip">이동·확대·회전은 소품을 직접 만져 보세요.</p>`;
 menu.querySelector('[data-ctx-select="color"]').value=it.tint||'normal';
 // The menu is a sibling of panel buttons: no nested buttons and no accidental panel selection.
 menu.addEventListener('pointerdown',e=>e.stopPropagation());
 menu.addEventListener('click',e=>{
   e.stopPropagation();const btn=e.target.closest('button[data-ctx]');if(!btn)return;
   const action=btn.dataset.ctx;
   const chosen=currentItem();if(!chosen)return;
   rememberAction('prop-near-'+Date.now());
   const items=ensureItems(state.panels[selected]);
   if(action==='front'){chosen.layer='front';}
   else if(action==='back'){chosen.layer='back';}
   else if(action==='bring'){chosen.layer='front';const pos=items.indexOf(chosen);if(pos>=0){items.splice(pos,1);items.push(chosen);}}
   else if(action==='fit'){if(isFriendItem(chosen)){chosen.rotation=0;chosen.stretchX=1;chosen.stretchY=1;chosen.x=0;chosen.y=0;chosen.size=165;fitFriendInStage(chosen);}else {chosen.x=0;chosen.y=0;chosen.size=Math.min(Number(chosen.size)||100,175);}}
   else if(action==='flip'){chosen.flip=!chosen.flip;}
   else if(action==='duplicate'){const copy={...chosen,id:'prop-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),x:(Number(chosen.x)||0)+13,y:(Number(chosen.y)||0)+11};items.push(copy);activeItemId=copy.id;}
   else if(action==='delete'){state.panels[selected].items=items.filter(i=>i.id!==chosen.id);activeItemId=null;}
   renderComic();
 });
 menu.addEventListener('change',e=>{
   e.stopPropagation();const kind=e.target.dataset.ctxSelect;
   const chosen=currentItem();if(!chosen)return;
   rememberAction('prop-near-choice-'+Date.now());
   if(kind==='shape'){chosen.name=e.target.value;chosen.source=null;chosen.emoji=null;}
   if(kind==='color')chosen.tint=e.target.value;
   renderComic();
 });
 area.appendChild(menu);
 const ar=area.getBoundingClientRect(),sr=scene.getBoundingClientRect();
 // Convert SVG viewBox point to CSS pixels, respecting xMidYMid meet letterboxing.
 const scale=Math.min(sr.width/300,sr.height/192);
 const originX=sr.left-ar.left+(sr.width-300*scale)/2;
 const originY=sr.top-ar.top+(sr.height-192*scale)/2;
 const cx=originX+(155+(Number(it.x)||0))*scale;
 const cy=originY+(122+(Number(it.y)||0))*scale;
 const itemRadius=(48*(Number(it.size)||100)/100*Math.max(Number(it.stretchX)||1,Number(it.stretchY)||1)+15)*scale;
 const w=menu.offsetWidth,h=menu.offsetHeight;
 const bx=sr.left-ar.left,by=sr.top-ar.top,bw=sr.width,bh=sr.height;
 // Prefer side or vertical empty space, keeping most of the artwork unobscured.
 const roomRight=bx+bw-(cx+itemRadius),roomLeft=cx-itemRadius-bx;
 const roomBottom=by+bh-(cy+itemRadius),roomTop=cy-itemRadius-by;
 let left,top;
 if(roomRight>=w+24){left=cx+itemRadius+22;top=cy-h/2;}
 else if(roomLeft>=w+24){left=cx-itemRadius-w-22;top=cy-h/2;}
 else if(roomBottom>=h+24){left=cx-w/2;top=cy+itemRadius+22;}
 else if(roomTop>=h+24){left=cx-w/2;top=cy-itemRadius-h-22;}
 else { // Stage is narrow: place menu below the current panel where it won't cover the gizmo.
   left=bx+bw/2-w/2;
   top=by+bh+12;
 }
 left=Math.max(2,Math.min(ar.width-w-2,left));
 top=Math.max(0,Math.min(Math.max(0,ar.height-h-2),top));
 menu.style.left=Math.round(left)+'px';menu.style.top=Math.round(top)+'px';
}
function syncItemControls(){
 const p=state.panels[selected];if(!p)return;
 const items=ensureItems(p),sel=$('selectedItem');
 if(!items.some(it=>it.id===activeItemId))activeItemId=null;
 sel.innerHTML='';
 if(!items.length)sel.add(new Option('소품이 없어요',''));
 items.forEach((it,n)=>sel.add(new Option(`${n+1}. ${it.name}`,it.id)));
 const it=currentItem();sel.value=it?it.id:'';
 $('itemSize').value=it?.size??100;$('itemSizeValue').textContent=(it?.size??100)+'%';
 $('itemRotation').value=it?.rotation||0;$('itemRotationValue').textContent=(it?.rotation||0)+'°';
 $('itemTint').value=it?.tint||'normal';
 for(const id of ['itemSize','itemRotation','itemTint','flipItem','duplicateItem','removeItem','centerItem'])$(id).disabled=!it;
 // A detailed 3D picture is a single colored illustration; do not present a fake color-edit control.
 const isPremium=!!(it && (it.source||(!it.emoji && premiumPropImages[it.name])));
 $('itemTint').disabled=!it;
 $('itemTint').title=isPremium?'고화질 그림은 색감 필터로 바꿉니다. 원래 색과 다를 수 있습니다.':'소품 색상 선택';
}
// C3.9.6: Capability-based choices. No button promises an unprovided artwork.
const expressionHeroes=['princess_bob_story','princess_flower','princess_strawberry','princess_emerald','princess_starlight','princess_pearl'];
const illustratedAnimalEmotions=['기뻐요','놀랐어요'];
const supportedPoseMap={
 dog:['서 있기'], rabbit:['서 있기'],
 cat:['서 있기'], fox:['걷기','점프하기'],fairy:['서 있기'],
 robot:['서 있기'],bear:['서 있기'],custom:['서 있기']
};
function refreshArtControls(){
 const hero=state.hero, p=state.panels[selected];if(!p)return;
 const availablePrincess=expressionHeroes.includes(hero);
 const isNewStudio=hero==='custom'&&Boolean(state.studioRecipe);
 const otherPrincess=isPrincess(hero)&&!availablePrincess;
 const animal=!isPrincess(hero);
 const availableEmotions=(availablePrincess||isNewStudio)?['기뻐요','놀랐어요','슬퍼요','화났어요','생각해요','신나요']
   :animal?(['dog','cat','rabbit','fairy'].includes(hero)?FRIEND_EMOTIONS:illustratedAnimalEmotions):['기뻐요'];
 document.querySelectorAll('[data-quick-emotion]').forEach(btn=>{
   const yes=availableEmotions.includes(btn.dataset.quickEmotion);
   btn.disabled=!yes;btn.title=yes?'이 표정은 선택할 수 있어요':'이 주인공은 아직 해당 전용 표정 그림이 없어요';
   btn.style.opacity=yes?'1':'.35';
 });
 const emotionSelect=$('panelEmotion'),savedEmotion=p.emotion||'기뻐요';
 emotionSelect.replaceChildren();availableEmotions.forEach(v=>emotionSelect.add(new Option(v,v)));
 if(!availableEmotions.includes(savedEmotion))emotionSelect.add(new Option(savedEmotion+' (이전 설정 · 전용 그림 없음)',savedEmotion));
 emotionSelect.value=savedEmotion;
 const pose=$('panelPose'),savedPose=p.pose||'서 있기';
 const poseChoices=isNewStudio?studioPanelPoseChoices(savedEmotion):(availablePrincess?[]:(supportedPoseMap[hero]||['서 있기']));
 const choices=poseChoices.length?poseChoices:['서 있기'];
 pose.replaceChildren();choices.forEach(v=>pose.add(new Option(studioPanelPoseLabel(v),v)));
 if(!choices.includes(savedPose))pose.add(new Option(studioPanelPoseLabel(savedPose)+' (이전 설정 · 전용 그림 없음)',savedPose));
 pose.value=savedPose; pose.disabled=otherPrincess||availablePrincess||choices.length===1;
 const poseWrapper=pose.parentElement;
 poseWrapper.style.display=isPrincess(hero)&&!isNewStudio?'none':'';
 const action=$('panelAction');action.parentElement.style.display='none';
 $('advancedArtTip').textContent=hero==='princess_bob_story'?'단발머리 공주는 표정 6개마다 표정과 팔 자세가 함께 바뀌는 고화질 전신 그림입니다. 그림을 조립하지 않아 손·드레스 연결이 자연스러워요.':isNewStudio?'내가 만든 공주는 같은 머리·드레스·장식으로 표정 6가지와 자세 3가지를 조합해요. 생각하기·슬프기는 서 있기만, 신나기는 서 있기·뛰어오르기만 지원해요.':availablePrincess
   ?'공주는 위에서 표정을 선택하고 전신·얼굴을 바꿔요. 동작은 표정별 전신 그림에 포함됩니다. 더 꾸미려면 소품을 움직여 보세요.'
   :otherPrincess?'이 공주는 아직 표정별 전용 그림이 없어요. 원래 전신 그림과 소품·배경으로 꾸밀 수 있어요.'
   :hero==='bear'||hero==='robot'?'이 주인공은 전신 서 있기 그림만 준비되어 있어요. 놀람은 효과로 표시되며, 다른 동작은 아직 없어요.'
   :'표정은 웃기·놀라기, 자세는 실제 준비된 동작 그림만 선택할 수 있어요. 나머지 표정은 제작 후 추가됩니다.';
 $('artCapability').textContent=hero==='princess_bob_story'?'🌹 단발머리 공주 · 표정·자세 6종 완성 전신 원화 · 컷마다 선택 가능':isNewStudio?`👑 내가 만든 공주 · 표정 6가지 · 지금 표정의 자세 ${choices.length}종 선택 가능`:availablePrincess?'👑 표정 6가지 · 전신/얼굴 전환 가능 · 한 컷씩 다르게 꾸미기':
 otherPrincess?'👑 이 공주는 기본 그림·배경·소품 꾸미기 지원 (표정 전용 그림 준비 중)':
 hero==='bear'||hero==='robot'?'🐾 기본 자세 1종 · 놀람 효과 · 배경과 소품 꾸미기':
 '🐾 웃기·놀라기 · 준비된 동작 '+choices.length+'종 · 배경과 소품 꾸미기 (일부 자세와 표정은 조합 불가)';
 const views=$('quickCharacterView');views.style.display=availablePrincess&&hero!=='princess_bob_story'?'flex':'none';
 $('characterColorControls').style.display=(isPrincess(hero)||isNewStudio)?'none':'';
 $('princessColorInfo').hidden=!isPrincess(hero);
 const paintedPremium=isPrincess(hero)&&(!!premiumPrincessImages[hero]||hero==='princess_bob_story');
 const expressionPainting=paintedPremium && (p.useExpressionArt!==false);
 for(const id of ['premiumHairColorSetting','premiumDressColorSetting']){
  const el=$(id);if(el)el.style.display=paintedPremium?'none':'';
 }
 if($('premiumShoesSetting'))$('premiumShoesSetting').style.display=paintedPremium?'none':'';
 if($('premiumCrownSetting'))$('premiumCrownSetting').style.display=paintedPremium?'none':'';
 if($('premiumStaffSetting'))$('premiumStaffSetting').style.display=paintedPremium?'none':'';
 if($('premiumWingsSetting'))$('premiumWingsSetting').style.display=paintedPremium?'none':'';

 // Pre-existing princess variants should not misleadingly show flower princess on click.
}
function syncEditor(){ if(!state.panels.length)return; const p=state.panels[selected]; $('editTitle').textContent=(selected+1)+'컷 꾸미기'; $('editProgress').textContent=(selected+1)+' / '+state.panels.length; $('panelCaption').value=p.caption||''; $('panelSpeech').value=p.speech||''; $('panelEmotion').value=p.emotion||emotions[0]; $('panelPose').value=p.pose||poses[0]; $('panelAction').value=p.action||actions[0]; $('panelBg').value=p.background||'forest'; $('panelProp').value='없음'; syncItemControls(); $('panelMood').value=p.mood||'bright'; $('heroTint').value=p.heroTint||'normal'; $('heroOutfit').value=p.heroOutfit||'normal'; $('heroSize').value=p.heroSize||100; /* itemSize is controlled by syncItemControls() for the selected prop */ $('heroSizeValue').textContent=(p.heroSize||100)+'%'; /* selected prop size label is managed by syncItemControls() */ $('composerHint').textContent=p.aiImage?'GPT 완성 그림은 한 장으로 합쳐져 있어 움직일 수 없어요. 기본 그림으로 돌아가면 꾸미기가 가능합니다.':'주인공을 터치하면 + · − · ↔ 버튼이 나타나요. 손가락으로 옮기고 두 손가락으로 크기를 조절해 보세요.'; $('editBubbleMode').value=p.bubbleMode||'bubble';
 $('editBubbleFill').value=p.bubbleFill||'white';
 $('editBubbleOpacity').value=p.bubbleOpacity??70;
 $('editOpacityValue').textContent=(p.bubbleOpacity??70)+'%';
 $('editTextColor').value=p.bubbleTextColor||'dark';
 $('editFontSize').value=p.bubbleFontSize||100;
 $('editFontValue').textContent=(p.bubbleFontSize||100)+'%';
 $('editBubblePadding').value=p.bubblePadding??100;
 $('editPaddingValue').textContent=(p.bubblePadding??100)+'%';
 $('prevPanel').disabled=selected===0; $('nextPanel').disabled=selected===state.panels.length-1;
 $('panelEmotion').parentElement.style.display=isPrincess(state.hero)?'none':'';
 refreshArtControls();princessControls(); }
function updatePanel(field,value){ if(!state.panels.length)return; state.panels[selected][field]=value; renderComic() }
['panelCaption','panelSpeech'].forEach(id=>$(id).addEventListener('input',e=>updatePanel(id==='panelCaption'?'caption':'speech',e.target.value)));
[['panelEmotion','emotion'],['panelPose','pose'],['panelAction','action'],['panelMood','mood']].forEach(([id,field])=>$(id).addEventListener('change',e=>{
 if(field==='emotion'&&isPrincess(state.hero)){rememberAction('emotion-select-'+Date.now());state.panels[selected].useExpressionArt=true;}
 if(field==='emotion'&&state.hero==='custom'&&state.studioRecipe){
  state.panels[selected].emotion=e.target.value;
  syncStudioPanelPose(state.panels[selected],true);
  return renderComic();
 }
 if(field==='pose'&&state.hero==='custom'&&state.studioRecipe){
  state.panels[selected].pose=e.target.value;
  syncStudioPanelPose(state.panels[selected],true);
  return renderComic();
 }
 if(field==='pose' && ['rabbit','cat','fox','fairy'].includes(state.hero) && ['점프하기','뛰기'].includes(e.target.value) && state.panels[selected].emotion==='놀랐어요'){
  state.panels[selected].emotion='기뻐요';
  toast('이 자세의 놀란 표정 그림은 아직 없어서 웃는 동작 그림으로 바꿨어요.');
 }
 updatePanel(field,e.target.value);
 if(field==='action'&&!isPrincess(state.hero)){
   const prop={발견하기:'별',줍기:'열쇠',열기:'문',바라보기:'별','친구 만나기':'고양이',축하하기:'하트'}[e.target.value];
   if(prop && !ensureItems(state.panels[selected]).some(it=>it.name===prop))addProp(prop);
   toast('행동을 표현할 수 있도록 '+prop+' 소품을 추가했어요. 손가락으로 옮겨 주세요.');
 }
}));
$('panelProp').addEventListener('change',e=>{const name=e.target.value;e.target.value='없음';if(name!=='없음')addProp(name)});
$('selectedItem').addEventListener('change',e=>{activeItemId=e.target.value||null;renderComic()});
$('itemRotation').addEventListener('input',e=>{const it=currentItem();if(!it)return;it.rotation=Number(e.target.value);renderComic()});
$('itemTint').addEventListener('change',e=>{const it=currentItem();if(!it)return;it.tint=e.target.value;renderComic();toast(recolorableProp(it)?'소품 그림 자체의 색을 바꿨어요!':'직접 추가한 이모지·사진은 색 변경이 제한됩니다.');});
$('flipItem').onclick=()=>{const it=currentItem();if(!it)return;it.flip=!it.flip;renderComic();toast(it.flip?'소품을 좌우로 뒤집었어요.':'소품 뒤집기를 되돌렸어요.');};
$('duplicateItem').onclick=()=>{const it=currentItem();if(!it)return;rememberAction('duplicate-item-'+Date.now());const copy={...it,id:'prop-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),x:(Number(it.x)||0)+12,y:(Number(it.y)||0)+10};ensureItems(state.panels[selected]).push(copy);activeItemId=copy.id;renderComic()};
$('removeItem').onclick=()=>{const p=state.panels[selected],it=currentItem();if(!it)return;p.items=ensureItems(p).filter(x=>x.id!==it.id);activeItemId=null;renderComic()};
$('addCustomEmoji').onclick=()=>{const e=$('customPropEmoji'),v=e.value.trim();if(!v)return toast('원하는 이모지를 적어 주세요.');addProp(v,null,v.slice(0,8));e.value=''};
$('customPropFile').onchange=async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;if(!f.type.startsWith('image/'))return toast('이미지 파일을 선택해 주세요.');if(f.size>8*1024*1024)return toast('8MB 이하 그림을 사용해 주세요.');try{const url=await new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(f)});const im=await new Promise((ok,no)=>{const a=new Image();a.onload=()=>ok(a);a.onerror=no;a.src=url});const cv=document.createElement('canvas'),scale=Math.min(1,200/Math.max(im.naturalWidth,im.naturalHeight));cv.width=Math.round(im.naturalWidth*scale);cv.height=Math.round(im.naturalHeight*scale);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);addProp(f.name.slice(0,16),cv.toDataURL('image/png'));}catch(err){toast('소품 파일을 읽지 못했어요.')}};
$('panelBg').addEventListener('change',e=>{
 const p=state.panels[selected];
 if(p.aiImage){
   e.target.value=p.background||'forest';
   toast('이 컷은 GPT가 만든 완성 그림이에요. 배경을 바꾸려면 먼저 「기본 그림으로」를 선택해 주세요.');
   return;
 }
 updatePanel('background',e.target.value);
});
// C4.5.9 — direct-touch multi-pointer editor restored from C3.12.4.
let stageGesture=null;
let lastPropGestureEnded=-10000;
let activeHeroSelected=false;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function stagePoint(svg,e){
 const m=svg.getScreenCTM();if(!m)return null;
 const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;
 return p.matrixTransform(m.inverse());
}
function stagePointerDown(e){
 const quick=e.target.closest('[data-hero-control]');
 if(quick){
   const svg=quick.ownerSVGElement,idx=Number(svg?.closest('.panel')?.dataset.panelIndex);
   if(!Number.isInteger(idx)||idx<0||idx>=state.panels.length)return;
   selected=idx;const panel=state.panels[idx];rememberAction('hero-quick-'+Date.now());
   if(quick.dataset.heroControl==='smaller')panel.heroSize=Math.max(45,(Number(panel.heroSize)||100)-10);
   if(quick.dataset.heroControl==='bigger')panel.heroSize=Math.min(175,(Number(panel.heroSize)||100)+10);
   if(quick.dataset.heroControl==='flip')panel.heroFlip=!panel.heroFlip;
   activeHeroSelected=true;activeItemId=null;renderComic();e.preventDefault();e.stopPropagation();return;
 }
 const knob=e.target.closest('[data-transform-handle]');
 const handle=e.target.closest('.stageHandle');
 if(!knob&&!handle){
   // Touching empty stage clears selected accessory, never moves the princess.
   if(!stageGesture && e.target.closest('svg') && activeItemId!==null){
     activeItemId=null;renderComic();
   }
   return;
 }
 const svg=(knob||handle).ownerSVGElement;
 const panelButton=svg?.closest('.panel');if(!svg||!panelButton)return;
 const idx=Number(panelButton.dataset.panelIndex);
 if(!Number.isInteger(idx)||idx<0||idx>=state.panels.length)return;
 const piece=knob?'item':handle.dataset.piece;
 if(piece==='hero'&&activeItemId){activeItemId=null;} // Directly switch from an accessory to the hero on this tap.
 const id=knob?.dataset.itemId||handle?.dataset.itemId;
 const panel=state.panels[idx];const it=piece==='item'?ensureItems(panel).find(v=>v.id===id):null;
 if(piece==='item'&&!it)return;
 if(stageGesture && stageGesture.svg!==svg)return;
 if(stageGesture && stageGesture.item!==it && stageGesture.pointers.size===1){const p=stagePoint(svg,e);if(p){stageGesture.pointers.set(e.pointerId,p);const g=stageGesture,ps=[...g.pointers.values()];g.start={points:ps,x:Number((g.item||g.panel)[g.item?'x':'heroX'])||0,y:Number((g.item||g.panel)[g.item?'y':'heroY'])||0,size:Number(g.item?.size||g.panel.heroSize)||100,rotation:Number(g.item?.rotation)||0,stretchX:Number(g.item?.stretchX)||1,stretchY:Number(g.item?.stretchY)||1};try{svg.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();e.stopPropagation();}return;}
 const point=stagePoint(svg,e);if(!point)return;
 if(!stageGesture){
   if(idx!==selected){selected=idx;}
   if(it){activeItemId=it.id;activeHeroSelected=false;}
   else if(piece==='hero'){activeHeroSelected=true;activeItemId=null;}
   rememberAction('direct-gesture-'+Date.now());
   stageGesture={svg,panel,item:it,kind:piece,handle:knob?.dataset.transformHandle||'move',pointers:new Map(),start:null,changed:false};
   // render gizmo only once, before drag; SVG replaced only after gesture.
   // The drag target is the previously captured SVG, which remains mounted.
 }
 const g=stageGesture;
 g.pointers.set(e.pointerId,point);
 if(g.pointers.size===1)g.start={points:[point],x:Number((it||panel)[it?'x':'heroX'])||0,y:Number((it||panel)[it?'y':'heroY'])||0,size:Number(it?.size||panel.heroSize)||100,rotation:Number(it?.rotation)||0,stretchX:Number(it?.stretchX)||1,stretchY:Number(it?.stretchY)||1};
 if(g.pointers.size===2){const ps=[...g.pointers.values()];g.start={points:ps,x:Number((it||panel)[it?'x':'heroX'])||0,y:Number((it||panel)[it?'y':'heroY'])||0,size:Number(it?.size||panel.heroSize)||100,rotation:Number(it?.rotation)||0,stretchX:Number(it?.stretchX)||1,stretchY:Number(it?.stretchY)||1};}
 try{svg.setPointerCapture(e.pointerId)}catch(_){}
 e.preventDefault();e.stopPropagation();
}
function stagePointerMove(e){
 const g=stageGesture;if(!g||!g.pointers.has(e.pointerId))return;
 const pt=stagePoint(g.svg,e);if(!pt)return;
 g.pointers.set(e.pointerId,pt);const t=g.item||g.panel,s=g.start;
 const ps=[...g.pointers.values()];if(!s)return;
 if(ps.length>=2){
  const [a,b]=ps,[p,q]=s.points;
  if(!q)return;
  const oldDist=Math.hypot(q.x-p.x,q.y-p.y),newDist=Math.hypot(b.x-a.x,b.y-a.y);
  const oldAngle=Math.atan2(q.y-p.y,q.x-p.x),newAngle=Math.atan2(b.y-a.y,b.x-a.x);
  t.size=Math.round(clamp(s.size*(newDist/Math.max(1,oldDist)),20,450));
  t.rotation=Math.round(clamp(s.rotation+(newAngle-oldAngle)*180/Math.PI,-360,360));
  t.x=clamp(s.x+(a.x+b.x-p.x-q.x)/2,-200,200);
  t.y=clamp(s.y+(a.y+b.y-p.y-q.y)/2,-175,175);
 }else{
  const p=s.points[0],a=ps[0],dx=a.x-p.x,dy=a.y-p.y;
  if(g.handle==='rotation'&&g.item){
   const cx=155+s.x,cy=122+s.y;
   const old=Math.atan2(p.y-cy,p.x-cx),now=Math.atan2(a.y-cy,a.x-cx);
   t.rotation=Math.round(clamp(s.rotation+(now-old)*180/Math.PI,-360,360));
  }else if(['corner','horizontal','vertical'].includes(g.handle)&&g.item){
   const radians=s.rotation*Math.PI/180;
   const localX=dx*Math.cos(radians)+dy*Math.sin(radians);
   const localY=-dx*Math.sin(radians)+dy*Math.cos(radians);
   const baseW=Math.max(5,29*s.size/100*s.stretchX),baseH=Math.max(5,29*s.size/100*s.stretchY);
   if(g.handle==='corner')t.size=Math.round(clamp(s.size*Math.max(.1,1+(localX/baseW+localY/baseH)/2),20,450));
   if(g.handle==='horizontal')t.stretchX=+clamp(s.stretchX*(1+localX/baseW),.25,3).toFixed(3);
   if(g.handle==='vertical')t.stretchY=+clamp(s.stretchY*(1+localY/baseH),.25,3).toFixed(3);
  }else{
   const xkey=g.item?'x':'heroX',ykey=g.item?'y':'heroY';
   t[xkey]=+clamp(s.x+dx,-200,200).toFixed(2);
   t[ykey]=+clamp(s.y+dy,-175,175).toFixed(2);
  }
 }
 if(g.item&&isFriendItem(g.item))fitFriendInStage(g.item);
 g.changed=true;
 // Update only transform nodes. Never rerender while pointers are active.
 if(g.item){
  const it=g.item,elem=[...g.svg.querySelectorAll('.stageHandle[data-piece="item"]')].find(v=>v.dataset.itemId===it.id);
  if(elem){const z=clamp((Number(it.size)||100)/100,.15,5);elem.setAttribute('transform',`translate(${Number(it.x)||0} ${Number(it.y)||0}) translate(155 122) rotate(${Number(it.rotation)||0}) scale(${z*(it.flip?-1:1)*(Number(it.stretchX)||1)} ${z*(Number(it.stretchY)||1)})`)}
  // Old gizmo may remain until gesture ends; interaction remains on actual art.
 }else{
  const elem=g.svg.querySelector('.stageHandle[data-piece="hero"]');
  if(elem){
    const hs=Math.max(.45,Math.min(1.75,(Number(t.heroSize)||100)/100));
    const fx=isPrincess(state.hero)?121:state.hero==='custom'?120:['dog','cat','rabbit','fairy'].includes(state.hero)?132:150;
    const fy=state.hero==='custom'?(state.studioRecipe?278:240):isPrincess(state.hero)?276:['dog','cat','rabbit'].includes(state.hero)?275:271;
    elem.setAttribute('transform',`translate(${Number(t.heroX)||0} ${Number(t.heroY)||0}) translate(7 -22) translate(${.73*fx*(1-hs)} ${.73*fy*(1-hs)}) scale(${.73*hs})`);
   }
 }
 e.preventDefault();
}
function stagePointerEnd(e){
 const g=stageGesture;if(!g||!g.pointers.has(e.pointerId))return;
 g.pointers.delete(e.pointerId);
 try{g.svg.releasePointerCapture(e.pointerId)}catch(_){}
 if(!g.pointers.size){lastPropGestureEnded=performance.now();stageGesture=null;renderComic();return;}
 // When one finger remains after pinch, start a new one-finger drag baseline.
 const p=[...g.pointers.values()][0],t=g.item||g.panel;
 g.start={points:[p],x:Number(t[g.item?'x':'heroX'])||0,y:Number(t[g.item?'y':'heroY'])||0,size:Number(g.item?.size||g.panel.heroSize)||100,rotation:Number(g.item?.rotation)||0,stretchX:Number(g.item?.stretchX)||1,stretchY:Number(g.item?.stretchY)||1};
}
$('comicArea').addEventListener('pointerdown',stagePointerDown);
$('comicArea').addEventListener('pointermove',stagePointerMove);
$('comicArea').addEventListener('pointerup',stagePointerEnd);
$('comicArea').addEventListener('pointercancel',stagePointerEnd);


$('undoEdit').onclick=()=>applyHistory(undoHistory,redoHistory);
$('redoEdit').onclick=()=>applyHistory(redoHistory,undoHistory);
syncHistoryButtons();
$('copyBg').onclick=()=>{
 const source=state.panels[selected];if(!source)return;
 const targets=state.panels.filter((p,i)=>i!==selected&&!p.aiImage);
 for(const p of targets){p.background=source.background;p.mood=source.mood}
 renderComic();toast(`${targets.length}개 컷에 같은 배경을 적용했어요!`)
};
$('copyProps').onclick=()=>{
 const source=state.panels[selected];if(!source)return;
 const sourceItems=JSON.parse(JSON.stringify(ensureItems(source)));
 const targets=state.panels.filter((p,i)=>i!==selected&&!p.aiImage);
 targets.forEach((p,idx)=>{
   p.items=sourceItems.map((it,n)=>({...it,id:'copied-'+Date.now()+'-'+idx+'-'+n}));
   p.prop='없음';
 });
 renderComic();toast(`${targets.length}개 컷에 소품 배치를 복사했어요!`)
};
$('copyHero').onclick=()=>{
 const source=state.panels[selected];if(!source)return;
 const targets=state.panels.filter((p,i)=>i!==selected&&!p.aiImage);
 if(!targets.length)return toast('주인공 설정을 적용할 다른 기본 그림 컷이 없어요.');
 rememberAction('copy-hero');
 const keys=['heroTint','heroOutfit','heroSize','heroX','heroY','heroFlip','princessLook'];
 for(const p of targets){for(const k of keys){if(source[k]===undefined)delete p[k];else p[k]=clone(source[k])}}
 renderComic();toast('주인공의 색·옷·크기·위치를 '+targets.length+'개 컷에 적용했어요. 표정과 동작은 유지했어요.');
};
$('heroTint').addEventListener('change',e=>{const p=state.panels[selected];p.heroTint=e.target.value;renderComic()});
$('heroOutfit').addEventListener('change',e=>{const p=state.panels[selected];p.heroOutfit=e.target.value;renderComic();toast('옷 부분에 해당하는 색을 바꾸고 있어요. 소재에 따라 일부 색이 함께 달라질 수 있어요.')});

function updateStageField(key,value){const p=state.panels[selected];if(!p||p.aiImage)return toast('먼저 기본 그림으로 돌아가 주세요.');p[key]=value;renderComic()}
$('heroSize').addEventListener('input',e=>updateStageField('heroSize',Number(e.target.value)));
$('itemSize').addEventListener('input',e=>{const it=currentItem();if(!it)return;it.size=Number(e.target.value);renderComic()});
$('centerHero').onclick=()=>{updateStageField('heroX',0);updateStageField('heroY',0)};
$('centerItem').onclick=()=>{const it=currentItem();if(!it)return;it.x=0;it.y=0;renderComic()};
$('resetStage').onclick=()=>{const p=state.panels[selected];if(!p||p.aiImage)return toast('먼저 기본 그림으로 돌아가 주세요.');Object.assign(p,{heroX:0,heroY:0,heroSize:100});ensureItems(p).forEach(it=>Object.assign(it,{x:0,y:0,size:100,rotation:0,flip:false,tint:'normal'}));renderComic()};
$('prevPanel').onclick=()=>{selected=Math.max(0,selected-1); renderComic()}; $('nextPanel').onclick=()=>{selected=Math.min(state.panels.length-1,selected+1); renderComic()};
$('applyIdea').onclick=()=>{
 const idea=$('panelIdea').value.trim();if(!idea)return toast('먼저 아이디어를 말하거나 적어 주세요.');
 const p=state.panels[selected],done=[],notDone=[];
 const simplified=idea.replace(/\s+/g,' ');
 if(p.aiImage){$('ideaResult').textContent='GPT에서 가져온 완성 그림은 한 장짜리여서 앱에서 일부만 수정할 수 없습니다. 기본 그림으로 돌아간 뒤 사용해 주세요.';return;}
 // This is an explicitly limited, deterministic Korean command parser, NOT an AI model.
 const backgrounds=[['바닷속|바다|해저','sea','바닷속'],['꽃정원|정원|꽃밭','garden','꽃정원'],['우주|별나라|은하','space','우주'],['학교|교실|운동장','school','학교'],['성|궁전|왕궁','castle','성'],['숲|산속|숲속','forest','숲']];
 for(const [words,value,label] of backgrounds){if(new RegExp(words).test(idea)){p.background=value;done.push('배경: '+label);break}}
 if(/깜짝|놀랐|놀란/.test(idea)){p.emotion='놀랐어요';done.push('표정: 놀람')}
 else if(/웃|기쁘|행복/.test(idea)){p.emotion='기뻐요';done.push('표정: 기쁨')}
 else if(/슬프|울고|눈물/.test(idea)){p.emotion='슬퍼요';done.push('표정: 슬픔')}
 if(/점프|뛰어오르|펄쩍/.test(idea)){p.pose='점프하기';done.push('자세: 점프')}
 else if(/달리|뛰어가|뛰는/.test(idea)){p.pose='뛰기';done.push('자세: 뛰기')}
 else if(/앉|쉬고/.test(idea)){p.pose='앉기';done.push('자세: 앉기')}
 else if(/걷|걸어/.test(idea)){p.pose='걷기';done.push('자세: 걷기')}
 const names=Object.keys(propIcons).sort((a,b)=>b.length-a.length);
 const countWords={'한':1,'하나':1,'두':2,'둘':2,'세':3,'셋':3,'네':4,'넷':4,'다섯':5};
 for(const name of names){
  if(!idea.includes(name))continue;
  const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const match=idea.match(new RegExp(escaped+'(?:을|를|이|가|은|는)?\\s*(\\d+|한|하나|두|둘|세|셋|네|넷|다섯)\\s*(?:개|마리|송이|개씩)?'));
  const before=idea.match(new RegExp('(\\d+|한|하나|두|둘|세|셋|네|넷|다섯)\\s*(?:개|마리|송이)?\\s*'+escaped));
  const word=(match&&match[1])||(before&&before[1]);
  const count=Math.min(8,Math.max(1,Number(word)||countWords[word]||1));
  const items=ensureItems(p);
  for(let i=0;i<count;i++){const off=(items.length%5)*14;items.push({id:'idea-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name,x:off-18,y:off-12,size:100,rotation:0,flip:false,tint:'normal'});activeItemId=items[items.length-1].id}
  done.push(name+' '+count+'개 추가');
 }
 // Natural-language directions for the hero and the selected prop. Commands can be combined.
 const propMention=/소품|별|풍선|열쇠|보석|꽃|왕관|나비|구름|하트|선물|이모지/.test(simplified);
 const chosenItem=currentItem();
 const sizeNum=simplified.match(/(?:크기|사이즈)(?:를|는|가)?\s*(\d{2,3})\s*%/);
 if(sizeNum){
   const percent=Math.min(200,Math.max(45,Number(sizeNum[1])));
   if(propMention && chosenItem){chosenItem.size=Math.max(50,percent);done.push('소품 크기 '+chosenItem.size+'%')}
   else{p.heroSize=Math.min(175,percent);done.push('주인공 크기 '+p.heroSize+'%')}
 }else if(/작게|작아지|줄여|줄이/.test(simplified)){
   if(propMention && chosenItem){chosenItem.size=Math.max(50,(Number(chosenItem.size)||100)-25);done.push('소품 작게')}
   else{p.heroSize=Math.max(45,(Number(p.heroSize)||100)-25);done.push('주인공 작게')}
 }else if(/크게|커지|키워|키우/.test(simplified)){
   if(propMention && chosenItem){chosenItem.size=Math.min(200,(Number(chosenItem.size)||100)+25);done.push('소품 크게')}
   else{p.heroSize=Math.min(175,(Number(p.heroSize)||100)+25);done.push('주인공 크게')}
 }
 const tintMatch=simplified.match(/(빨강|빨간|분홍|주황|노랑|파랑|파란|초록|녹색|보라)(?:색)?/);
 if(tintMatch && propMention && chosenItem){
  const map={빨강:'red',빨간:'red',분홍:'red',주황:'orange',노랑:'orange',파랑:'blue',파란:'blue',초록:'green',녹색:'green',보라:'purple'};
  chosenItem.tint=map[tintMatch[1]];done.push('소품 색감: '+tintMatch[1]);
 }
 if(/뒤집|반대 방향|좌우 반전/.test(simplified) && chosenItem){chosenItem.flip=!chosenItem.flip;done.push('소품 좌우 뒤집기')}
 const moveTarget=propMention&&chosenItem?chosenItem:p;
 const dx=/(오른쪽|우측)/.test(simplified)?1:/(왼쪽|좌측)/.test(simplified)?-1:0;
 const dy=/위쪽|위로/.test(simplified)?-1:/아래쪽|아래로/.test(simplified)?1:0;
 if(dx||dy){const kx=moveTarget===p?'heroX':'x', ky=moveTarget===p?'heroY':'y';
  if(dx)moveTarget[kx]=Math.max(-100,Math.min(100,(Number(moveTarget[kx])||0)+dx*22));
  if(dy)moveTarget[ky]=Math.max(-100,Math.min(100,(Number(moveTarget[ky])||0)+dy*18));
  done.push((moveTarget===p?'주인공':'소품')+' 위치 조절');
 }
 const line=idea.match(/(?:말풍선|대사|말은)\s*[:：]?\s*["“「]?([^"”」]{2,35})["”」]?/);
 if(line){p.speech=line[1].trim();done.push('말풍선 내용')}
 // The user's narration is meaningful even if an option is unavailable.
 if(!done.length || /(?:어느 날|그런데|그러자|발견|만났|갔|보았|했어|있었|이야기)/.test(idea)){
   p.caption=idea.slice(0,100);
   done.push('장면 설명');
 }
 if(done.length===0)notDone.push('그림 요소를 자동 변경하지 못했어요. 장면 설명에는 적었지만 새 캐릭터·동작·소품은 별도로 선택해 주세요.');
 if(/친구|옆에|같이|함께|새로운|추가해|변신|색깔|머리|의상|옷/.test(idea))notDone.push('등장인물 추가나 의상·신체를 새로 그리기는 아직 지원하지 않아요. 소품 메뉴 또는 내 그림 추가를 이용해 주세요.');
 $('ideaResult').textContent='✅ 반영: '+(done.join(' · ')||'장면 설명만 반영')+(notDone.length?'\n⚠️ 제한: '+notDone.join(' '):'')+'\n※ 준비된 그림을 조합하기 때문에 표정·자세 선택이 그림에 똑같이 드러나지 않을 수 있어요.';
 $('panelIdea').value='';renderComic();toast(done.length?'알아들은 선택을 적용했어요!':'장면 설명만 적었어요. 아래 안내를 확인해 주세요.');
};
function promptText(){const p=state.panels[selected]; const heroName=state.heroName||'주인공'; const heroDesc=state.hero==='custom'?'첨부한 어린이의 직접 그린 캐릭터':'귀여운 '+(heroes.find(h=>h.id===state.hero)?.name||'캐릭터'); return `[나만의 웹툰 창작극장 C4.5.10 · 웹툰 한 컷 그림 요청]\n작품 제목: ${state.title}\n주인공 이름: ${heroName}\n주인공 특징: ${state.heroTrait||'밝고 사랑스러움'}\n주인공 종류: ${heroDesc}\n전체 이야기 시작: ${settings.idea}\n현재 그릴 컷: ${selected+1}컷\n장면 설명: ${p.caption}\n말풍선: ${p.speech || '없음'}\n표정: ${p.emotion}\n자세: ${p.pose}\n행동: ${p.action}\n배경: ${bgMeta[p.background].name}\n소품: ${p.prop}\n분위기: ${p.mood}\n요청: 어린이 웹툰 한 컷처럼, 같은 주인공으로 알아볼 수 있게 그리고, 이 컷의 표정·자세·행동이 분명히 보이게 그려 주세요. 색감은 밝고 선명하게, 한국 어린이용 웹툰처럼 친근하고 또렷하게 표현해 주세요. 실제 사람의 얼굴이나 가족사진은 사용하지 않습니다. 주인공이 직접 그린 캐릭터라면 첨부된 그림의 특징을 유지해 주세요.`}
// C3.9.6: IndexedDB supports works containing embedded photos; localStorage may hit its ~5MB quota.
// Keep the old key intact and migrate by reading it when no IndexedDB data exists.
const worksDbName='family-webtoon-theater-gallery';
const worksStore='works';
function openWorksDB(){
 return new Promise((resolve,reject)=>{
  if(!window.indexedDB)return reject(Error('이 브라우저는 작품 저장소를 지원하지 않아요.'));
  const req=indexedDB.open(worksDbName,1);
  req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(worksStore))db.createObjectStore(worksStore)};
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error||Error('저장소를 열지 못했습니다.'));
 });
}
function legacyWorks(){
 try{const v=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(v)?v:[]}catch(_){return []}
}
async function loadDB(){
 const legacy=legacyWorks();
 try{
  const db=await openWorksDB();
  const saved=await new Promise((resolve,reject)=>{
   const tx=db.transaction(worksStore,'readonly'),r=tx.objectStore(worksStore).get('gallery');
   r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
  });db.close();
  if(!Array.isArray(saved))return legacy;
  // An initialized gallery is authoritative; historical localStorage remains untouched.
  return saved;
 }catch(err){if(legacy.length)return legacy;throw err}
}
async function saveDB(list){
 const db=await openWorksDB();
 try{
  await new Promise((resolve,reject)=>{
   const tx=db.transaction(worksStore,'readwrite');
   tx.objectStore(worksStore).put(list,'gallery');
   tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('저장 실패'));tx.onabort=()=>reject(tx.error||Error('저장 취소'));
  });
 }finally{db.close()}
}
let saveWorkBusy=false;
async function saveWork(){
 if(!state.panels.length||saveWorkBusy)return;
 saveWorkBusy=true;
 try{
  const list=await loadDB();
  const item={id:state.id || ('toon-'+Date.now()), title:state.title, hero:state.hero, heroName:state.heroName, heroTrait:state.heroTrait, custom:state.custom, studioPrincess:Boolean(state.studioPrincess), studioRecipe:state.studioRecipe?clone(state.studioRecipe):null, story:state.story, panels:clone(state.panels), updated:Date.now()};
  const idx=list.findIndex(x=>x.id===item.id);
  if(idx>=0)list[idx]=item;else list.unshift(item);
  await saveDB(list);
  state.id=item.id;
  toast('✅ 작품을 전시관에 저장했어요!');
  switchView('library');
 }catch(err){
  alert('전시관 저장에 실패했습니다. 작품은 아직 저장되지 않았습니다.\n사유: '+(err.message||err)+'\n\n「작품 파일 저장」으로 먼저 백업해 주세요.');
 }finally{saveWorkBusy=false}
}
async function renderLibrary(){
 const wrap=$('works');wrap.innerHTML='<div class="work">전시관을 불러오는 중이에요…</div>';
 try{
  const list=(await loadDB()).sort((a,b)=>b.updated-a.updated);
  wrap.innerHTML='';
  if(!list.length){wrap.innerHTML='<div class="work"><h3>아직 저장된 작품이 없어요</h3><p class="sub">먼저 웹툰을 하나 만들어 전시관에 저장해 보세요.</p></div>';return}
  list.forEach(w=>{
   const div=document.createElement('div');div.className='work';
   const heroEmoji=w.hero==='custom'?'🖍':(heroes.find(h=>h.id===w.hero)?.emoji||'⭐');
   div.innerHTML=`<h3>${heroEmoji} ${safe(w.title)}</h3><div class="meta">${w.panels.length}컷 · ${new Date(w.updated).toLocaleDateString('ko-KR')}</div><div class="btns"><button class="secondary" type="button">다시 열기</button><button class="danger" type="button">삭제</button></div>`;
   const [openBtn,delBtn]=div.querySelectorAll('button');
   openBtn.onclick=()=>{state=clone(w);selected=0;renderComic();switchView('edit')};
   delBtn.onclick=async()=>{
    if(!confirm('이 작품을 삭제할까요?'))return;
    try{await saveDB((await loadDB()).filter(x=>x.id!==w.id));await renderLibrary();toast('삭제했어요.')}catch(err){alert('삭제하지 못했습니다: '+err.message)}
   };
   wrap.appendChild(div);
  });
 }catch(err){wrap.innerHTML='<div class="work"><h3>작품을 불러오지 못했어요.</h3><p class="sub">'+safe(err.message)+'</p></div>'}
}
function downloadJSON(){ if(!state.panels.length) return; const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=(state.title||'웹툰')+'.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),12000); toast('작품 파일을 저장했어요.') }
$('saveWork').onclick=saveWork; $('downloadJson').onclick=downloadJSON; $('refreshLibrary').onclick=renderLibrary; $('backupWorks').onclick=async()=>{await preparePrincessStore();const works=await loadDB();const blob=new Blob([JSON.stringify({app:'family-webtoon-theater-c31',works,princessWardrobe:getSavedPrincesses()},null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='나만의웹툰창작극장_C31_백업.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),12000); toast('전체 백업을 저장했어요.')}; $('restoreWorks').onclick=()=>$('restoreFile').click(); $('restoreFile').onchange=async e=>{const f=e.target.files?.[0]; e.target.value=''; if(!f)return; try{const data=JSON.parse(await f.text()); if(data.app!=='family-webtoon-theater-c31'||!Array.isArray(data.works)) throw Error('이 앱의 백업 파일이 아닙니다.'); if(!confirm(data.works.length+'개 작품을 불러올까요?')) return; await saveDB(data.works); if(Array.isArray(data.princessWardrobe)){await preparePrincessStore();const existing=getSavedPrincesses();const names=new Set(existing.map(x=>x.id));const extra=data.princessWardrobe.filter(x=>x&&isPrincess(x.hero)&&x.look&&typeof x.name==='string'&&!names.has(x.id));if(!(await writePrincesses([...existing,...extra].slice(0,40))))throw Error('작품은 복원했지만 공주 보관함 저장에 실패했습니다.');renderPrincessSaved();} await renderLibrary(); toast('백업을 불러왔어요!')}catch(err){toast('복원 실패: '+err.message)}};
$('customUpload').onchange=()=>{const f=$('customUpload').files?.[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{settings.custom=r.result; settings.studioPrincess=false;settings.studioRecipe=null; settings.hero='custom'; renderCharacterChoices();const preview=$('myDrawingPreview');if(preview){preview.replaceChildren();const pic=document.createElement('img');pic.alt='가져온 내 그림';pic.src=settings.custom;preview.append(pic)}toast('내 그림을 주인공으로 준비했어요!')}; r.readAsDataURL(f)};
$('useMyDrawing').onclick=()=>{if(!settings.custom){toast('먼저 그림을 가져와 주세요.');return;}settings.hero='custom';renderCharacterChoices();switchView('make');toast('내 그림을 주인공으로 선택했어요!');};
$('customUpload').addEventListener('change',()=>{setTimeout(()=>{const preview=$('myDrawingPreview');if(settings.custom)preview.innerHTML='<img alt="가져온 내 그림" src="'+settings.custom+'">';},100)},false);
$('addFriendProp').onclick=()=>{
 const id=$('friendPropKind').value; const emotion=$('friendPropEmotion').value;
 const url=friendImageSource(id,emotion); if(!url){toast('그림을 불러오지 못했어요.');return;}
 addProp(FRIEND_NAMES[id]+' · '+emotion,url);
};
$('makeComic').onclick=makeComic; $('gotoEdit').onclick=()=>{if(!state.panels.length){toast('먼저 컷 초안을 만들어 주세요.'); return;} switchView('edit')}; $('backToMake').onclick=()=>switchView('make');

// Export SVG as real PNG. Share as a file on iPadOS when supported, else download.
function normalizeSvgForExport(svgText){
 return svgText.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ');
}
async function embedSvgArtwork(svg){
 const refs=[...new Set([...svg.matchAll(/(?:xlink:)?href="([^"<>]+)"/g)].map(m=>m[1]).filter(v=>!v.startsWith('data:')&&!v.startsWith('#')))];
 const pairs=await Promise.all(refs.map(async src=>{
  if(src.startsWith('webtoon-art/')){await webtoonEnsureArt(webtoonPackNames);if(webtoonResolvedArt[src])return [src,webtoonResolvedArt[src]];}
  const url=new URL(src,document.baseURI);if(url.origin!==location.origin&&url.protocol!=='blob:')throw Error('외부 그림은 PNG로 변환할 수 없어요.');
  const res=await fetch(url);if(!res.ok)throw Error('그림 파일을 열 수 없어요: '+src);
  const blob=await res.blob();const data=await new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(blob)});
  return [src,data];
 }));
 const map=new Map(pairs);return svg.replace(/((?:xlink:)?href=")([^"<>]+)(")/g,(m,a,b,c)=>map.has(b)?a+map.get(b)+c:m);
}
async function svgArtToPng(svgString,w=1200,h=768){
 const text=await embedSvgArtwork(normalizeSvgForExport(svgString));
 const url=URL.createObjectURL(new Blob([text],{type:'image/svg+xml;charset=utf-8'}));
 try{
  const img=new Image();
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('그림을 PNG로 만들 수 없습니다.'));img.src=url;});
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const cx=canvas.getContext('2d');if(!cx)throw Error('그림 저장을 지원하지 않습니다.');
  cx.fillStyle='#ffffff';cx.fillRect(0,0,w,h);cx.drawImage(img,0,0,w,h);
  return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNG 생성에 실패했습니다.')),'image/png'));
 }finally{URL.revokeObjectURL(url)}
}
async function shareOrDownloadPng(blob,filename){
 const file=new File([blob],filename,{type:'image/png'});
 if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})){
  try{await navigator.share({files:[file],title:'나만의 웹툰 창작극장'});return;}
  catch(e){if(e.name==='AbortError')return;}
 }
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),25000);
 toast('PNG 그림을 저장했어요. 아이패드에서는 공유 메뉴의 「이미지 저장」으로 사진 앱에 넣을 수 있어요.');
}
function imageSafeName(v){return String(v||'webtoon').replace(/[\\/:*?"<>|]/g,'').replace(/\s+/g,'_').slice(0,45)||'webtoon'}
async function saveCurrentPanelPhoto(){
 const p=state?.panels?.[selected];if(!p)return toast('저장할 컷을 먼저 만드세요.');
 const btn=$('saveSelectedPhoto');btn.disabled=true;const before=btn.textContent;btn.textContent='그림을 준비하는 중…';
 try{
  let blob;
  if(p.aiImage){const res=await fetch(p.aiImage);blob=await res.blob();}
  else{blob=await svgArtToPng(panelSvg(p,selected));}
  await shareOrDownloadPng(blob,imageSafeName(state.title)+'_'+(selected+1)+'컷.png');
 }catch(e){alert('사진 저장을 완료하지 못했습니다: '+(e.message||e)+'\n이 컷에 추가한 외부 사진이 있으면 먼저 확인해 주세요.');}
 finally{btn.disabled=false;btn.textContent=before}
}
async function saveSavedHeroAsPhoto(saved){
 try{
  if(!isPrincess(saved.hero))return toast('이 주인공의 사진 저장은 준비되지 않았어요.');
  // Use original full-body illustration and saved styling. Background remains neutral.
  const artPanel={emotion:'기뻐요',pose:'서 있기',action:'걷기',princessLook:validPrincessStyle(saved.look,saved.hero),useExpressionArt:false};
  const art=premiumPrincessSvg(artPanel,saved.hero);
  const svg=`<svg viewBox="0 0 260 300"><rect width="260" height="300" fill="#fff9ff"/>${art}</svg>`;
  const blob=await svgArtToPng(svg,1040,1200);
  await shareOrDownloadPng(blob,imageSafeName(saved.name)+'_주인공.png');
 }catch(e){alert('주인공 사진을 저장하지 못했어요: '+(e.message||e))}
}
function init(){$('saveSelectedPhoto').onclick=saveCurrentPanelPhoto;initPrincessEditor(); renderCounts(); initSelectors(); $('heroName').value=settings.heroName; $('heroTrait').value=settings.heroTrait; $('storyTitle').value=settings.title; $('storyIdea').value=settings.idea; $('baseBackground').value=settings.baseBackground; }

// C3.5.2 speech input: browser speech recognition where supported; iPad keyboard dictation fallback.
let voiceSession=null;
function voiceEnd(){
 if(!voiceSession)return;
 voiceSession.button.classList.remove('listening');
 voiceSession.button.textContent=voiceSession.label;
 voiceSession=null;
}
function startVoiceInput(btn){
 const id=btn.dataset.voiceTarget,field=$(id);
 if(!field)return;
 if(voiceSession){const old=voiceSession;old.recognition.stop();voiceEnd();if(old.button===btn)return;}
 const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SpeechRecognition){
   field.focus();
   toast('아이패드 키보드의 🎤 받아쓰기를 눌러 말해 주세요.');
   return;
 }
 try{
   const rec=new SpeechRecognition();
   rec.lang='ko-KR';rec.interimResults=false;rec.maxAlternatives=1;rec.continuous=false;
   const label=btn.textContent;
   voiceSession={recognition:rec,button:btn,label};
   btn.classList.add('listening');btn.textContent='⏹ 듣는 중 · 끝내기';
   rec.onresult=event=>{
     const phrase=Array.from(event.results).map(r=>r[0]?.transcript||'').join(' ').trim();
     if(!phrase)return;
     const before=field.value.trim();
     field.value=before?(before+' '+phrase):phrase;
     field.dispatchEvent(new Event('input',{bubbles:true}));
     toast('말한 내용이 입력됐어요. 확인하고 고칠 수 있어요!');
   };
   rec.onerror=event=>{
     const error=event.error||'';
     if(error==='not-allowed')toast('마이크 권한을 확인해 주세요. 또는 키보드의 🎤 받아쓰기를 사용하세요.');
     else if(error==='no-speech')toast('말소리가 들리지 않았어요. 다시 해 보세요.');
     else toast('음성 입력을 사용할 수 없어요. 아이패드 키보드의 🎤 받아쓰기를 이용해 주세요.');
     voiceEnd();
   };
   rec.onend=voiceEnd;
   rec.start();
 }catch(err){voiceEnd();field.focus();toast('아이패드 키보드의 🎤 받아쓰기를 사용해 주세요.');}
}
document.querySelectorAll('[data-voice-target]').forEach(btn=>btn.addEventListener('click',()=>startVoiceInput(btn)));

// C3.9.6 – bridge to an existing user-pinned ChatGPT conversation. No API keys or automatic cloud upload.
let aiPending=null, aiImportedData=null;
function gptOpen(){
 toast('고정된 「나만의 웹툰 AI 친구」 대화방을 선택하세요. 새 대화가 자동으로 지정되지는 않습니다.');
 window.open('https://chatgpt.com/','_blank','noopener,noreferrer');
}
document.querySelectorAll('[data-open-gpt]').forEach(btn=>btn.addEventListener('click',gptOpen));
async function copyForGpt(payload){
 try{await navigator.clipboard.writeText(payload);toast('GPT 요청문을 복사했어요! 고정 대화방에 붙여넣으세요.');}
 catch(_){window.prompt('아래 요청문을 길게 눌러 복사하세요:',payload)}
}
function heroIdentity(){
 return '주인공: '+(state.heroName||$('heroName').value||'루루')+' / 성격·특징: '+(state.heroTrait||$('heroTrait').value||'호기심 많음')+' / 종류: '+(heroes.find(h=>h.id===(state.hero||settings.hero))?.name||'아이가 직접 그린 캐릭터')+'\n주인공의 기존 디자인과 의상은 함부로 바꾸지 말아 주세요.';
}
function existingPanels(){return state.panels.map((p,i)=>(i+1)+'컷: '+p.caption+' / 대사: '+(p.speech||'없음')).join('\n')}
function requestStory(){
 const startText=($('storyIdea').value||'').trim();
 if(!startText){toast('아이의 이야기를 먼저 말하거나 적어 주세요.');return;}
 const prompt=`[C3.9.6 나만의 웹툰 AI 친구 — 이야기 함께 시작]
너는 초등학교 1학년 아이의 창작 친구야. 아이의 원래 상상을 마음대로 바꾸지 말고, 반복만 줄여 자연스럽게 정리해 줘. 아이가 결정하지 않은 부분은 한 번에 질문 하나만 해 줘.

아이의 첫 이야기(원문): ${startText}
원하는 컷 수: ${settings.count}컷
선택한 주인공: ${$('heroName').value||'루루'}

먼저 아이에게 친절하게 이야기해 줘. 아이가 "좋아"라고 승인한 뒤에만 각 컷을 확정해 줘. 확정되면 아래 형식으로 결과를 작성해 줘.
[웹툰 이야기 정리]
1컷: 내용 | 대사: 대사
2컷: 내용 | 대사: 대사
${settings.count===4?'3컷: 내용 | 대사: 대사\n4컷: 내용 | 대사: 대사\n':''}[/웹툰 이야기 정리]
가상 캐릭터만 사용하고 실제 가족의 얼굴이나 개인정보는 사용하지 마.`;
 copyForGpt(prompt);
}

function unifiedPrompt(){
 const childIdea=($('aiChildIdea').value||'').trim();
 const storySeed=($('storyIdea').value||'').trim();
 const sourceText=childIdea||storySeed;
 if(!sourceText){toast('아이가 하고 싶은 말을 먼저 말하거나 적어 주세요.');return null;}
 const hasPanels=!!(state && state.panels && state.panels.length);
 const title=(state && state.title)||$('storyTitle').value.trim()||'나의 웹툰';
 const hero=(state && state.heroName)||$('heroName').value.trim()||'루루';
 const trait=(state && state.heroTrait)||$('heroTrait').value.trim()||'호기심 많음';
 let prompt=`[C3.9.6 나만의 웹툰 AI 친구 — 하나의 「AI 친구에게 말하기」 창구]
너는 초등학교 1학년 아이의 다정한 웹툰 창작 친구야. 아이의 말을 존중하고, 짧고 쉬운 말로 대답해 줘. 한 번에 질문은 하나만 하고, 아이가 결정하지 않은 내용은 먼저 물어봐.

중요한 역할
1) 아이의 말이 이야기 만들기인지, 기존 컷 수정인지, 그림 수정인지 먼저 이해한다.
2) 필요한 경우 한 가지 질문만 하며 아이와 짧게 대화한다.
3) 아이가 "좋아"라고 승인한 뒤에만 정리 결과를 확정한다.
4) 첨부하는 [현재 컷의 기준 그림]을 반드시 편집 원본으로 사용한다. 새로운 캐릭터를 처음부터 그리지 않는다. 얼굴, 귀, 눈, 털색, 체형, 의상, 소품, 그림체, 카메라 구도, 조명과 원래 배경은 요청하지 않는 한 최대한 유지한다. 아이가 요청한 표정·손동작·사물·배경 일부만 국소 수정하며, 큰 변화가 필요하면 먼저 아이에게 확인한다. 그림에 글씨나 말풍선은 생성하지 않는다.
5) 실제 사람 얼굴과 개인정보는 사용하지 않고, 가상의 캐릭터만 사용한다.

주인공: ${hero}
성격·특징: ${trait}
`;
 if(hasPanels){
   const p=state.panels[selected];
   prompt+=`${heroIdentity()}
현재 웹툰 제목: ${title}
현재 전체 이야기:
${existingPanels()}
현재 선택한 컷: ${selected+1}컷
현재 선택한 컷 설명: ${p.caption}
현재 선택한 컷 대사: ${p.speech||'없음'}
`;
 } else {
   prompt+=`현재는 아직 컷 초안이 확정되지 않았다. 아이의 말에서 웹툰의 흐름을 함께 정리해 주면 된다.
희망 컷 수: ${settings.count}컷
기본 이야기 아이디어: ${storySeed||'없음'}
`;
 }
 prompt+=`
아이가 말한 내용(원문): ${sourceText}

대화 방법
- 먼저 아이의 말을 짧게 이해해 주고, 꼭 필요할 때만 질문 하나를 해 줘.
- 아이가 승인하면 그때만 아래 형식 중 맞는 것을 출력해 줘.

1) 전체 이야기를 새로 정리하거나 여러 컷을 함께 바꾸는 경우
[웹툰 이야기 정리]
1컷: 내용 | 대사: 대사
2컷: 내용 | 대사: 대사
${settings.count===4?'3컷: 내용 | 대사: 대사\n4컷: 내용 | 대사: 대사\n':''}[/웹툰 이야기 정리]

2) 특정 컷 하나만 바꾸는 경우
[웹툰 컷 수정안]
컷: ${hasPanels ? '${selected+1}' : '번호'}
설명: (확정된 문장)
대사: (확정된 말풍선 문장)
[/웹툰 컷 수정안]

3) 아이가 그림도 바꾸고 싶어 하면
- 첨부한 기준 그림을 원본으로 이용해 변경이 필요한 영역만 편집해 줘. 원본 전체를 새로운 그림으로 재창작하지 말고, 가능하면 픽셀을 그대로 보존해 줘. 완전히 동일하게 보존할 수 없다면 솔직히 말하고 아이에게 확인해 줘.
- 먼저 짧게 확인한 뒤, 가능하면 같은 대화에서 그림 생성도 도와줘.
- 그림이 완성되면 사용자가 저장해서 웹툰 앱의 "GPT가 만든 그림 가져오기"로 넣을 수 있게 해 줘.
- 컷의 설명이나 대사가 함께 달라졌다면 [웹툰 컷 수정안] 또는 [웹툰 이야기 정리]도 같이 써 줘.

아이의 결정을 대신하지 말고, 언제나 아이가 작가이자 감독이라는 점을 지켜 줘.`;
 return prompt;
}
// A picture cannot be packed into plain text. Prepare it locally as a PNG
// alongside the copied instruction so the parent can attach it in ChatGPT.
let referencePngBlob=null;
let referencePngUrl=null;
let referenceFileName='webtoon-request.png';
function currentReferenceSource(){
 if(!state || !Array.isArray(state.panels) || !state.panels[selected])return null;
 const p=state.panels[selected];
 if(p.aiImage)return {kind:'url',src:p.aiImage};
 const rich=richStoryArt[state.hero];
 if(rich && state.story==='key' && p.background==='forest'){
   const f=richFrameFor(p,selected);
   return {kind:'url',src:rich[f]||rich[0]};
 }
 return {kind:'svg',src:panelSvg(p,selected)};
}
async function imageForReference(){
 const item=currentReferenceSource();
 if(!item)return null;
 let src=item.src;
 if(item.kind==='svg')src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(await embedSvgArtwork(item.src.replace(/<svg\s/,'<svg xmlns="http://www.w3.org/2000/svg" ')));
 return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('기준 그림을 열지 못했습니다.'));im.src=src});
}
function packetLines(ctx,txt,maxWidth){
 const words=Array.from(txt||'');let line='',lines=[];
 for(const ch of words){
   if(ch==='\n'){lines.push(line);line='';continue;}
   if(ctx.measureText(line+ch).width>maxWidth&&line){lines.push(line);line='';}
   line+=ch;
 }
 if(line)lines.push(line);return lines;
}
async function createRequestPacket(){
 const idea=($('aiChildIdea').value||'').trim();
 if(!idea)throw Error('먼저 하고 싶은 말을 말하거나 적어 주세요.');
 const im=await imageForReference();
 const selectedPanel=state&&state.panels?state.panels[selected]:null;
 const name=(state&&state.heroName)||$('heroName').value.trim()||'주인공';
 const title=(state&&state.title)||$('storyTitle').value.trim()||'나의 웹툰';
 const lines=[];
 const canvas=document.createElement('canvas'),c=canvas.getContext('2d');
 canvas.width=960;
 c.font='bold 32px sans-serif';
 lines.push(...packetLines(c,'[아이의 수정 요청] '+idea,882));
 const instruction=['기준 그림의 주인공 '+name+'(와)과 그림체, 얼굴, 옷, 색감,','배경, 구도를 최대한 보존해 주세요.','아이의 요청과 직접 관련된 부분만 바꿔 주세요.','주인공을 새로 디자인하지 마세요. 말풍선과 글씨는 넣지 마세요.'];
 let bottomLines=[];
 instruction.forEach(x=>bottomLines.push(...packetLines(c,x,882)));
 const titleHeight=100;
 const pictureHeight=im ? 630 : 0;
 const lineHeight=48;
 const textHeight=120+(lines.length+bottomLines.length)*lineHeight;
 canvas.height=titleHeight+pictureHeight+textHeight;
 c.fillStyle='#ffffff';c.fillRect(0,0,canvas.width,canvas.height);
 c.fillStyle='#56337e';c.fillRect(0,0,960,100);
 c.fillStyle='#fff';c.font='bold 37px sans-serif';c.fillText('웹툰 수정 부탁 · '+(selectedPanel?(selected+1)+'컷':'이야기'),34,65);
 if(im){
   const w=im.naturalWidth||im.width,h=im.naturalHeight||im.height;
   c.fillStyle='#f4f1f6';c.fillRect(0,100,960,630);
   const scale=Math.min(960/w,630/h);
   c.drawImage(im,(960-w*scale)/2,100+(630-h*scale)/2,w*scale,h*scale);
 }
 let y=titleHeight+pictureHeight+53;
 c.fillStyle='#442760';c.font='bold 28px sans-serif';c.fillText(title.slice(0,36)+' · '+name,36,y);y+=58;
 c.fillStyle='#201828';c.font='bold 32px sans-serif';
 for(const line of lines){c.fillText(line,36,y);y+=lineHeight;}
 y+=27;c.fillStyle='#60566b';c.font='bold 30px sans-serif';
 for(const line of bottomLines){c.fillText(line,36,y);y+=lineHeight;}
 c.fillStyle='#86738c';c.font='24px sans-serif';c.fillText('위 그림은 수정의 기준입니다. 아이에게 확인한 다음 수정해 주세요.',36,canvas.height-27);
 return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('그림을 만들 수 없습니다.')),'image/png'));
}
function showRequestPacket(blob){
 if(referencePngUrl)URL.revokeObjectURL(referencePngUrl);
 referencePngBlob=blob;referencePngUrl=URL.createObjectURL(blob);
 referenceFileName='webtoon-'+(selected+1)+'-request.png';
 $('referenceFrame').classList.remove('aiHide');
 $('referencePreview').src=referencePngUrl;
}
$('saveReference').onclick=()=>{
 if(!referencePngUrl)return toast('먼저 그림과 부탁을 준비해 주세요.');
 const a=document.createElement('a');a.href=referencePngUrl;a.download=referenceFileName;document.body.appendChild(a);a.click();a.remove();
 toast('그림과 요청이 담긴 이미지 한 장을 저장했습니다.');
};
$('aiUnifiedRequest').onclick=async()=>{
 if(!$('aiChildIdea').value.trim())return toast('먼저 하고 싶은 말을 말하거나 적어 주세요.');
 const btn=$('aiUnifiedRequest');btn.disabled=true;
 $('referenceFrame').classList.remove('aiHide');
 $('referenceMessage').textContent='기준 그림과 부탁을 한 장으로 만들고 있어요.';
 try{
   const packetPromise=createRequestPacket();
   // Promise payload keeps clipboard writing tied to a user gesture in Safari when supported.
   let clipPromise=null;
   if(navigator.clipboard&&navigator.clipboard.write&&window.ClipboardItem){
      try{clipPromise=navigator.clipboard.write([new ClipboardItem({'image/png':packetPromise})]);}catch(_){clipPromise=null;}
   }
   const blob=await packetPromise;
   showRequestPacket(blob);
   let copied=false;
   if(clipPromise){try{await clipPromise;copied=true;}catch(_){copied=false;}}
   if(copied){
     $('referenceMessage').textContent='✅ 그림과 아이의 부탁을 함께 복사했습니다! GPT 대화방에서 붙여넣으세요.';
     toast('그림과 부탁 한 장 복사 완료! GPT에서 붙여넣으세요.');
   }else{
     $('referenceMessage').textContent='그림과 부탁을 한 장으로 만들었습니다. 아이패드가 복사를 허용하지 않으면 그림을 길게 눌러 복사하거나 저장해 주세요.';
     toast('그림 한 장을 준비했어요. 이미지를 길게 눌러 복사해 보세요.');
   }
 }catch(e){$('referenceMessage').textContent='그림 준비 실패: '+e.message;toast(e.message)}
 finally{btn.disabled=false;}
};
function parseApproved(s){
 const whole=s.match(/\[웹툰 이야기 정리\]([\s\S]*?)\[\/웹툰 이야기 정리\]/);
 if(whole){
   const rows=whole[1].split('\n').map(x=>x.trim()).filter(Boolean);
   const changes=[];
   for(const row of rows){
     const match=row.match(/^(\d+)컷\s*[:：]\s*(.+?)\s*\|\s*대사\s*[:：]\s*(.+)$/);
     if(!match)continue;
     const i=Number(match[1])-1;
     if(i<0||i>=state.panels.length || match[2].length>220||match[3].length>120)return {error:'컷 수 또는 문장 길이를 확인해 주세요.'};
     changes.push({index:i,caption:match[2].trim(),speech:match[3].trim()});
   }
   if(changes.length!==state.panels.length || new Set(changes.map(x=>x.index)).size!==changes.length)return {error:'전체 이야기 정리에는 웹툰의 모든 컷이 하나씩 필요합니다.'};
   return {changes};
 }
 let body=s;
 const block=s.match(/\[웹툰 컷 수정안\]([\s\S]*?)\[\/웹툰 컷 수정안\]/);
 if(block)body=block[1];
 const n=body.match(/(?:^|\n)\s*컷\s*[:：]\s*(\d+)/);
 const cap=body.match(/(?:^|\n)\s*설명\s*[:：]\s*([^\n]+)/);
 const speech=body.match(/(?:^|\n)\s*대사\s*[:：]\s*([^\n]+)/);
 if(!cap||!speech)return null;
 const target=n?Number(n[1])-1:selected;
 if(target!==selected)return {error:'GPT의 수정안은 '+(target+1)+'컷입니다. 먼저 그 컷을 선택해 주세요.'};
 if(cap[1].trim().length>220||speech[1].trim().length>120)return {error:'문장이 너무 깁니다. GPT에게 조금 짧게 정리해 달라고 해 주세요.'};
 return {changes:[{index:target,caption:cap[1].trim(),speech:speech[1].trim()}]};
}
$('aiReview').onclick=()=>{
 if(!state.panels.length)return toast('먼저 컷을 만들어 주세요.');
 const val=$('aiAnswer').value.trim();
 const parsed=parseApproved(val);
 if(!parsed){toast('GPT의 [웹툰 컷 수정안] 또는 [웹툰 이야기 정리] 부분을 붙여넣어 주세요.');return;}
 if(parsed.error){toast(parsed.error);return;}
 aiPending=parsed;
 $('aiPreviewBox').textContent='변경 미리보기 (아직 적용되지 않았습니다)\n\n'+parsed.changes.map(c=>(c.index+1)+'컷\n기존: '+state.panels[c.index].caption+'\n새 설명: '+c.caption+'\n새 대사: '+c.speech).join('\n\n');
 $('aiPreviewBox').classList.remove('aiHide');$('aiApproveRow').classList.remove('aiHide');
};
$('aiApprove').onclick=()=>{
 if(!aiPending)return toast('먼저 수정안을 미리보기로 확인해 주세요.');
 for(const change of aiPending.changes){Object.assign(state.panels[change.index],{caption:change.caption,speech:change.speech})}
 aiPending=null;$('aiPreviewBox').classList.add('aiHide');$('aiApproveRow').classList.add('aiHide');
 renderComic();toast('아이가 확인한 수정안을 웹툰에 적용했어요!');
};
$('aiCancel').onclick=()=>{aiPending=null;$('aiPreviewBox').classList.add('aiHide');$('aiApproveRow').classList.add('aiHide');};
// Preserve crisp rich story art until the user explicitly approves an image replacement.
async function prepareAiImageFile(f){
 if(!f)return;
 if(!f.type.startsWith('image/'))return toast('이미지 파일을 선택하거나 복사해 주세요.');
 if(f.size>14*1024*1024)return toast('그림이 너무 커요. 14MB 이하의 이미지를 선택해 주세요.');
 try{
  const sourceUrl=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(Error('읽기 실패'));r.readAsDataURL(f)});
  const im=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('이미지를 열 수 없어요.'));i.src=sourceUrl});
  const limit=1000,scale=Math.min(1,limit/Math.max(im.naturalWidth,im.naturalHeight));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(im.naturalWidth*scale));canvas.height=Math.max(1,Math.round(im.naturalHeight*scale));
  const context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(im,0,0,canvas.width,canvas.height);
  aiImportedData=canvas.toDataURL('image/jpeg',.83);
  $('aiImportedPreview').src=aiImportedData;$('aiImportedPreview').classList.remove('aiHide');
  $('aiImagePaste').textContent='✅ 그림 준비 완료! 아래 미리보기 확인 후 적용하세요.';
  $('aiImageInfo').textContent='✅ 새 그림을 가져왔어요. 「선택한 컷에 그림 적용」을 누르면 현재 선택한 컷만 바뀝니다.';
  toast('그림을 가져왔어요! 아래 미리보기를 확인하세요.');
 }catch(err){toast('그림을 열 수 없습니다: '+err.message)}
}
$('aiImageFile').onchange=async e=>{await prepareAiImageFile(e.target.files?.[0]);};
$('aiChooseImage').onclick=()=>$('aiImageFile').click();
$('aiImagePaste').addEventListener('paste', e=>{
 const items=Array.from(e.clipboardData?.items||[]);
 const img=items.find(item=>item.kind==='file'&&item.type.startsWith('image/'));
 if(img){e.preventDefault();prepareAiImageFile(img.getAsFile());return;}
 // Clipboard may contain HTML with a remote image URL. Avoid fetching arbitrary
 // URLs or embedding images from the clipboard; use file import instead.
 e.preventDefault();toast('복사한 내용에 그림 파일이 없어요. ChatGPT에서 그림을 사진에 저장한 후 가져오기를 사용해 주세요.');
});
$('aiImagePaste').addEventListener('input',()=>{if($('aiImagePaste').querySelector('img')){$('aiImagePaste').textContent='복사된 그림을 인식할 수 없어요. 위의 붙여넣기 버튼이나 사진 선택을 사용하세요.';}});
$('aiPasteButton').onclick=async()=>{
 try{
  if(!navigator.clipboard?.read){
    $('aiImagePaste').focus();toast('상자를 길게 누르고 「붙여넣기」를 선택하세요. 안 되면 사진에서 가져오기를 이용하세요.');return;
  }
  const items=await navigator.clipboard.read();
  for(const item of items){
   const type=item.types.find(t=>t.startsWith('image/'));
   if(type){await prepareAiImageFile(await item.getType(type));return;}
  }
  toast('복사한 내용에 이미지가 없습니다. 그림을 사진에 저장한 뒤 가져와 주세요.');
 }catch(err){
   $('aiImagePaste').focus();
   toast('아이패드에서 클립보드 접근이 제한될 수 있어요. 상자를 길게 눌러 붙여넣거나 사진에서 가져오세요.');
 }
};
$('aiUseImage').onclick=()=>{
 if(!state.panels.length)return toast('먼저 컷을 만들어 주세요.');
 if(!aiImportedData)return toast('GPT에서 복사한 그림을 붙여넣거나 사진에서 가져와 주세요.');
 state.panels[selected].aiImage=aiImportedData;
 aiImportedData=null;$('aiImageFile').value='';$('aiImportedPreview').classList.add('aiHide');$('aiImagePaste').textContent='';
 $('aiImageInfo').textContent=(selected+1)+'컷에 새 그림을 적용했습니다. 전시관에 저장하면 함께 보관됩니다.';
 renderComic();toast((selected+1)+'컷에 새 그림을 넣었어요!');
};
$('aiResetImage').onclick=()=>{if(!state.panels.length)return;delete state.panels[selected].aiImage;renderComic();toast('이 컷을 기본 그림으로 돌렸어요.');};


// C3.9.6: The canvas stays in the normal edit page; only its layout changes.
$('modeAll').onclick=()=>{panelDisplayMode='all';renderComic()};
$('modeSingle').onclick=()=>{panelDisplayMode='single';renderComic()};
$('modePrev').onclick=()=>{if(selected>0){selected--;renderComic()}};
$('modeNext').onclick=()=>{if(selected<state.panels.length-1){selected++;renderComic()}};
const bubbleControls=[
 ['editBubbleMode','bubbleMode'],['editBubbleFill','bubbleFill'],
 ['editBubbleOpacity','bubbleOpacity'],['editTextColor','bubbleTextColor'],
 ['editFontSize','bubbleFontSize'],['editBubblePadding','bubblePadding']
];
for(const [id,key] of bubbleControls){
 const control=$(id),isSlider=control.type==='range';
 // Record history once per gesture, not every pixel of slider movement.
 if(isSlider)control.addEventListener('pointerdown',()=>rememberAction('bubble-slider-'+Date.now()));
 control.addEventListener(isSlider?'input':'change',()=>{
   const p=state.panels[selected];if(!p)return;
   if(!isSlider)rememberAction('bubble-'+Date.now());
   p[key]=isSlider?Number(control.value):control.value;
   renderComic();
 });
}


// C3.9.6 quick controls use existing state, undo history and editor without changing storage keys.
function updateQuickControls(){
 const p=state && state.panels ? state.panels[selected] : null;
 for(const btn of document.querySelectorAll('[data-quick-bubble]')){
  const current=p?(p.bubbleMode||'bubble'):'bubble';btn.classList.toggle('active',btn.dataset.quickBubble===current);
  btn.setAttribute('aria-pressed',String(btn.dataset.quickBubble===current));
 }
 for(const btn of document.querySelectorAll('[data-quick-emotion]')){
  const current=p?(p.emotion||'기뻐요'):'기뻐요';btn.classList.toggle('active',btn.dataset.quickEmotion===current);
  btn.setAttribute('aria-pressed',String(btn.dataset.quickEmotion===current));
 }
 const premium=!!(state && expressionHeroes.includes(state.hero));
 $('quickCharacterView').style.display=premium&&state.hero!=='princess_bob_story'?'flex':'none';
 const view=premium?(p?.useExpressionArt===false?'original':(p?.expressionView||'full')):'original';
 for(const [id,val] of [['quickFullBody','full'],['quickFacePortrait','face'],['quickOriginalBody','original']]){
  $(id).classList.toggle('active',premium&&view===val);
  $(id).setAttribute('aria-pressed',String(premium&&view===val));
 }
 const sparkBtn=$('quickSparkleToggle');
 if(sparkBtn){
   const show=!!(p&&isPrincess(state.hero));
   sparkBtn.hidden=!show;
   if(show){
     const active=validPrincessStyle(p.princessLook,state.hero).sparkles==='yes';
     sparkBtn.textContent=active?'✨ 반짝이 숨기기':'✨ 반짝이 추가';
     sparkBtn.setAttribute('aria-pressed',String(active));
   }
 }
 // The original crown/wand are painted into the character artwork.
 // Do not offer an inactive control that appears to remove them.
 if($('premiumCrownSetting'))$('premiumCrownSetting').style.display=premium?'none':'';
 if($('premiumStaffSetting'))$('premiumStaffSetting').style.display=premium?'none':'';
 if($('premiumWingsSetting'))$('premiumWingsSetting').style.display=premium?'none':'';
for(const btn of document.querySelectorAll('[data-quick-bg]')){
  const current=p?(p.background||'forest'):'forest';btn.classList.toggle('active',btn.dataset.quickBg===current);
  btn.setAttribute('aria-pressed',String(btn.dataset.quickBg===current));
 }
}
const sparkleQuick=$('quickSparkleToggle');
if(sparkleQuick)sparkleQuick.addEventListener('click',()=>{
 const p=state?.panels?.[selected];if(!p||!isPrincess(state.hero))return;
 rememberAction('sparkles-toggle-'+Date.now());
 const look=validPrincessStyle(p.princessLook,state.hero);
 p.princessLook={...look,sparkles:look.sparkles==='yes'?'no':'yes'};
 renderComic();
});
for(const btn of document.querySelectorAll('[data-premium-prop]'))btn.addEventListener('click',()=>{
 if(!state?.panels?.[selected])return;
 rememberAction('premium-prop-'+Date.now());addProp(btn.dataset.premiumProp);
});
$('quickPropMore').onclick=()=>{const area=$('propToolbox');if(!area)return; area.scrollIntoView({behavior:'smooth',block:'center'});};
for(const btn of document.querySelectorAll('[data-quick-prop]'))btn.addEventListener('click',()=>{
 if(!state?.panels?.[selected])return;
 rememberAction('quick-prop-'+Date.now());addProp(btn.dataset.quickProp);
});
const actionPropMap={'발견하기':'별','줍기':'열쇠','열기':'문','친구 만나기':'고양이','축하하기':'하트'};
for(const btn of document.querySelectorAll('[data-quick-action]'))btn.addEventListener('click',()=>{
 const p=state?.panels?.[selected];if(!p)return;
 if(p.aiImage)return toast('완성 그림에서는 소품을 따로 편집할 수 없어요.');
 rememberAction('quick-action-'+Date.now());
 p.action=btn.dataset.quickAction;
 const item=actionPropMap[p.action];if(item)addProp(item);
 toast('이야기를 꾸밀 '+item+' 소품을 추가했어요. 손가락으로 옮겨 보세요.');
});
$('quickNextPanel').onclick=()=>{if(!state.panels.length)return;selected=(selected+1)%state.panels.length;renderComic()};
$('quickUndoEdit').onclick=()=>{const btn=$('undoEdit');if(btn)btn.click();else toast('아래 실행 취소 버튼을 사용해 주세요.')};
for(const [id,view] of [['quickFullBody','full'],['quickFacePortrait','face'],['quickOriginalBody','original']]){
 $(id).addEventListener('click',()=>{
  const p=state?.panels?.[selected];if(!p||!isPrincess(state.hero))return;
  rememberAction('character-view-'+Date.now());
  if(state.hero==='princess_bob_story'){p.useExpressionArt=true;p.expressionView='full';}else{p.useExpressionArt=view!=='original';p.expressionView=view==='original'?'full':view;}
  renderComic();
 });
}
// C3.10 independently editable accessory slots.
for(const el of document.querySelectorAll('[data-wear-slot]'))el.addEventListener('change',()=>{
 const p=state?.panels?.[selected];if(!p||!isPrincess(state.hero)||p.aiImage)return;
 const slot=el.dataset.wearSlot;
 const profile=profileForPrincess(state.hero);
 if(!profile||el.disabled)return;
 rememberAction('wear-slot-'+slot+'-'+Date.now());
 const st=validPrincessStyle(p.princessLook,state.hero);
 st.wearSlots={...st.wearSlots,[slot]:el.value};
 if(slot==='hair')st.wearAccessory=el.value; // for backwards compatibility with C3.9.9 saved styles.
 p.princessLook=st;
 renderComic();
});
$('wearClearAll')?.addEventListener('click',()=>{
 const p=state?.panels?.[selected];if(!p||!isPrincess(state.hero)||p.aiImage)return;
 rememberAction('clear-wear-'+Date.now());
 const st=validPrincessStyle(p.princessLook,state.hero);
 for(const slot of Object.keys(princessWearSlots))st.wearSlots[slot]='none';
 st.wearAccessory='none';p.princessLook=st;renderComic();toast('내가 추가한 장식만 벗었어요. 원본 장식은 그대로예요.');
});
for(const btn of document.querySelectorAll('[data-quick-bubble]'))btn.addEventListener('click',()=>{
 const p=state?.panels?.[selected];if(!p)return;
 rememberAction('quick-bubble-'+Date.now());p.bubbleMode=btn.dataset.quickBubble;renderComic();
});
for(const btn of document.querySelectorAll('[data-quick-emotion]'))btn.addEventListener('click',()=>{
 const p=state?.panels?.[selected];if(!p||btn.disabled)return;
 rememberAction('quick-emotion-'+Date.now());
 p.emotion=btn.dataset.quickEmotion;
 if(state.hero==='custom'&&state.studioRecipe)syncStudioPanelPose(p,true);
 if(['rabbit','cat','fox','fairy'].includes(state.hero)&&p.emotion==='놀랐어요'&&['뛰기','점프하기'].includes(p.pose)){
   p.pose=state.hero==='rabbit'?'서 있기':'걷기';
   toast('놀란 표정 전용 달리기·점프 그림은 아직 없어요. 놀란 얼굴이 보이는 자세로 바꿨어요.');
 }
 if(expressionHeroes.includes(state.hero)){p.useExpressionArt=true;p.expressionView=p.expressionView||'full';}
 renderComic();
 if(p.aiImage)toast('이 컷은 합쳐진 완성 그림입니다. 기본 그림으로 돌아가면 표정을 바꿀 수 있어요.');
});
for(const btn of document.querySelectorAll('[data-quick-bg]'))btn.addEventListener('click',()=>{
 const p=state?.panels?.[selected];if(!p)return;
 if(p.aiImage)return toast('완성 그림은 배경을 따로 바꿀 수 없어요. 기본 그림으로 돌아가 주세요.');
 rememberAction('quick-bg-'+Date.now());p.background=btn.dataset.quickBg;renderComic();
});
$('quickBubbleMore').addEventListener('click',()=>{
 const details=$('bubbleEditor');details.open=true;details.scrollIntoView({behavior:'smooth',block:'center'});
});
// Sync quick button selection on the same redraw cycle as existing controls.
const previousSyncEditor=syncEditor;
syncEditor=function(){previousSyncEditor();updateQuickControls();};

// C4.5.9: One source of truth for installed version; manifest supplied with each ZIP.
// A GitHub Pages deployment must publish BOTH index.html and version.json in the same folder.
const WEBTOON_APP_VERSION='4.5.36.4.7';
let latestPublishedVersion=null;
let initialVersionCheck=true;
let versionCheckInFlight=false;
let versionLastChecked=0;
const VERSION_RELOAD_KEY='webtoon-version-reload-attempt-v1';
function versionNumbers(v){
 const match=String(v||'').trim().match(/^C?(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?$/i);
 return match?match.slice(1).map(x=>Number(x||0)):null;
}
function compareVersions(a,b){
 const x=versionNumbers(a),y=versionNumbers(b);
 if(!x||!y)return null;
 for(let k=0;k<4;k++)if(x[k]!==y[k])return x[k]>y[k]?1:-1;
 return 0;
}
function freshAppUrl(version){
 const dest=new URL(window.location.href);
 dest.searchParams.set('v',version.replaceAll('.',''));
 dest.searchParams.set('updated',String(Date.now()));
 return dest.toString();
}
function updateVersionLabels(){
 const version='C'+WEBTOON_APP_VERSION;
 document.title='나만의 웹툰 창작극장 '+version;
 const label=document.querySelector('#versionPanel summary span');
 if(label)label.textContent='(현재 '+version+')';
 const st=document.getElementById('versionStatus');
 if(st)st.textContent='설치된 버전 '+version+' · 최신 버전 확인 중';
}
function proceedToPublishedVersion(remote,automatic=false){
 if(compareVersions(remote,WEBTOON_APP_VERSION)!==1)return;
 if(automatic){
  // Avoid an endless reload loop if a new manifest becomes visible before the HTML itself.
  // The marker applies to this tab only and is NOT a work-data storage key.
  const now=Date.now();
  try{
   const marker=JSON.parse(sessionStorage.getItem(VERSION_RELOAD_KEY)||'null');
   if(marker?.version===remote&&now-marker.at<120000)return false;
   sessionStorage.setItem(VERSION_RELOAD_KEY,JSON.stringify({version:remote,at:now}));
  }catch(e){/* Private browsing/storage denial: proceed without tracking. */}
 }
 window.location.replace(freshAppUrl(remote));
 return true;
}
async function checkWebtoonVersion(quiet=false,autoOnOpen=false){
 if(versionCheckInFlight)return;
 versionCheckInFlight=true;
 const st=document.getElementById('versionStatus');
 const install=document.getElementById('installLatestVersion');
 const panel=document.getElementById('versionPanel');
 if(!st||!install){versionCheckInFlight=false;return}
 if(!quiet)st.textContent='게시된 버전을 확인하고 있어요…';
 try{
  const res=await fetch(new URL('./version.json?check='+Date.now(),location.href),{cache:'no-store'});
  if(!res.ok)throw new Error('version.json 없음');
  const manifest=await res.json();
  const remote=String(manifest.version||'').replace(/^C/i,'');
  if(!versionNumbers(remote))throw new Error('버전 형식 오류');
  latestPublishedVersion=remote;
  versionLastChecked=Date.now();
  const cmp=compareVersions(remote,WEBTOON_APP_VERSION);
  if(cmp>0){
   install.hidden=false;
   st.textContent='✨ 최신 게시 버전 C'+remote+' / 현재 실행 버전 C'+WEBTOON_APP_VERSION+'. 업데이트가 준비되었습니다.';
   if(autoOnOpen && proceedToPublishedVersion(remote,true))return;
   if(panel)panel.open=true;
  }else if(cmp===0){
   install.hidden=true;
   st.textContent='✅ 현재 C'+WEBTOON_APP_VERSION+' · 게시 버전과 일치합니다.';
   try{sessionStorage.removeItem(VERSION_RELOAD_KEY)}catch(e){}
  }else{
   install.hidden=true;
   st.textContent='현재 C'+WEBTOON_APP_VERSION+' · 게시 정보 C'+remote+' (index.html보다 오래된 version.json입니다. 두 파일을 함께 게시하세요.)';
  }
 }catch(e){
  st.textContent='현재 C'+WEBTOON_APP_VERSION+' · 게시 버전 확인 불가. index.html과 version.json이 같은 폴더에 있는지 확인하세요.';
 }finally{versionCheckInFlight=false;initialVersionCheck=false}
}
document.getElementById('checkVersionNow')?.addEventListener('click',()=>checkWebtoonVersion(false,false));
document.getElementById('installLatestVersion')?.addEventListener('click',()=>{
 if(!latestPublishedVersion||compareVersions(latestPublishedVersion,WEBTOON_APP_VERSION)<=0)return;
 // On-demand refresh never clears any app storage. Warn about unsaved edits.
 if(!confirm('새 버전 C'+latestPublishedVersion+'을 열까요? 저장하지 않은 현재 편집 내용은 사라질 수 있습니다. 작품을 먼저 저장했다면 확인을 눌러 주세요.'))return;
 proceedToPublishedVersion(latestPublishedVersion,false);
});
// When the user RETURNS to an already-open iPad home-screen app, only show the
// update button: don't abruptly discard a work that is being edited.
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='visible'&&Date.now()-versionLastChecked>60000)checkWebtoonVersion(true,false);
});
window.addEventListener('pageshow',e=>{
 if(e.persisted&&Date.now()-versionLastChecked>60000)checkWebtoonVersion(true,false);
});
updateVersionLabels();

init();

// C4.0 New independent princess construction studio. Never touch legacy gallery and wardrobe databases.
const STUDIO_STORAGE_KEY='family-webtoon-princess-studio-v1';
const STUDIO_FIELDS=['studioBaseModel','studioName','studioBackground','studioPremiumHero','studioHair','studioHairColor','studioDress','studioCrown','studioWings','studioStaff','studioShoes','studioEmotion','studioFace','studioEyes'];
const studioColors={rose:['#fff2f9','#e9c7ed'],lavender:['#f6edff','#d7cbff'],mint:['#f0fff6','#c9f0e8'],sky:['#f1fbff','#d3eafb'],white:['#ffffff','#f6f0ff']};
const studioDefaults={roseArtworkId:'',roseStableHands:true,roseHairFinish:'none',roseHairShape:'normal',roseDressShape:'normal',mode:'modular',baseModel:'rose3d',name:'나의 꽃빛 공주',background:'rose',hero:'princess_flower',hairStyle:'long',hairColor:'rose',dress:'pink',crown:'crown',wings:'none',staff:'none',shoes:'pink',face:'round',eyes:'jewel',emotion:'기뻐요',pose:'서 있기',sparkles:true,roseAccessories:[]};
const studioPoseCatalog=[{id:'서 있기',label:'서 있기',icon:'🧍'},{id:'걷기',label:'걷기',icon:'🚶'},{id:'뛰어오르기',label:'뛰어오르기',icon:'✨'}];
const studioEmotionPoseMap={
 '기뻐요':['서 있기','걷기'],
 '놀랐어요':['서 있기','걷기'],
 '슬퍼요':['서 있기'],
 '화났어요':['서 있기','걷기'],
 '생각해요':['서 있기'],
 '신나요':['서 있기','뛰어오르기']
};
function studioPoseNormalize(v){
 const pose=String(v||'').trim();
 if(['점프하기','뛰기','뛰어 오르기','뛰어오르기'].includes(pose))return '뛰어오르기';
 if(pose==='걷기')return '걷기';
 return '서 있기';
}
function studioAllowedPoses(emotion){
 if(studio.baseModel==='rose3d')return ['서 있기'];
 return (studioEmotionPoseMap[studioEmotionNormalize(emotion)]||['서 있기']).slice();
}
function studioEnsurePose(emotion,pose){
 const allowed=studioAllowedPoses(emotion);
 const current=studioPoseNormalize(pose);
 return allowed.includes(current)?current:allowed[0];
}
function studioPoseToPanelPose(pose){return studioPoseNormalize(pose)==='뛰어오르기'?'점프하기':studioPoseNormalize(pose);}
function studioPanelPoseChoices(emotion){return studioAllowedPoses(emotion).map(studioPoseToPanelPose);}
function studioPanelPoseLabel(value){return value==='점프하기'?'뛰어오르기':value;}
function syncStudioPanelPose(panel,shouldToast=false){
 if(!panel)return;
 const before=panel.pose||'서 있기';
 const choices=studioPanelPoseChoices(panel.emotion);
 if(!choices.includes(before)){
  panel.pose=choices[0];
  if(shouldToast)toast('이 표정에서 고를 수 있는 자세로 바꿨어요.');
 }
}
let studio={...studioDefaults};
function studioSafeName(){return (document.getElementById('studioName').value.trim()||'나의 공주').slice(0,28)}
function studioRecipe(){return {...studio,name:studioSafeName()}}
function studioLook(){return {hairStyle:studio.hairStyle,hairColor:studio.hairColor,dress:studio.dress,crown:studio.crown,wings:studio.wings,staff:studio.staff,shoes:studio.shoes,sparkles:studio.sparkles?'yes':'no'}}
const studioRoseExpressionAssets={"기뻐요":"webtoon-art/b423daeb861d76f77a88d221.webp","놀랐어요":"webtoon-art/891b05874dc90b0e6aba7aa3.webp","슬퍼요":"webtoon-art/7b71f1950f21b218fef34a7c.webp","화났어요":"webtoon-art/46e42efba163e43fced560fe.webp","생각해요":"webtoon-art/f9c4739e3727d78e42d3bf32.webp","신나요":"webtoon-art/44d8df69c97a00cc1d176a82.webp"};
// Studio C4.5.9: quality-preserving recolor of the existing six high-resolution Rose expressions.
const studioRoseColorAssets={"기뻐요|rose|blue":"webtoon-art/28b1d144b62fdcb688a07c97.webp","기뻐요|rose|mint":"webtoon-art/b81f625676aead8c021e1eff.webp","기뻐요|gold|pink":"webtoon-art/b0537604414088140255adae.webp","기뻐요|gold|blue":"webtoon-art/7c0935682b6207b1ee39df27.webp","기뻐요|gold|mint":"webtoon-art/50aeef322ddc7961a00ac31a.webp","기뻐요|violet|pink":"webtoon-art/a6010d0977c79a1d53979495.webp","기뻐요|violet|blue":"webtoon-art/b88360315db3fcd2109b154c.webp","기뻐요|violet|mint":"webtoon-art/6030fcc0dc496100f0f711cb.webp","놀랐어요|rose|blue":"webtoon-art/1fe0895aee9a4d14102f72d4.webp","놀랐어요|rose|mint":"webtoon-art/22d9931bd60a944289cba1f9.webp","놀랐어요|gold|pink":"webtoon-art/efdb3ff71c3bffe8a454e6aa.webp","놀랐어요|gold|blue":"webtoon-art/56e312dbd86d9bdd1c64f76e.webp","놀랐어요|gold|mint":"webtoon-art/92e44edfb71b17e91cd9be43.webp","놀랐어요|violet|pink":"webtoon-art/5b134a8ba65bbac31746d698.webp","놀랐어요|violet|blue":"webtoon-art/63f251d29d94e45f1f295201.webp","놀랐어요|violet|mint":"webtoon-art/61763120a28c846d4ae676ef.webp","슬퍼요|rose|blue":"webtoon-art/fb352fae1ed3ac7d196f4fca.webp","슬퍼요|rose|mint":"webtoon-art/8dedcfe9b00094bd1938d485.webp","슬퍼요|gold|pink":"webtoon-art/1d13b67431b0129988c17c40.webp","슬퍼요|gold|blue":"webtoon-art/627b6d23e3b5c79f41e2675b.webp","슬퍼요|gold|mint":"webtoon-art/c2becaf0056e8a10012d07cc.webp","슬퍼요|violet|pink":"webtoon-art/2d60c0f04560a8eec29428e0.webp","슬퍼요|violet|blue":"webtoon-art/8811b2a7bb65007b14de9aa9.webp","슬퍼요|violet|mint":"webtoon-art/193ac02b593bf7eadfeeaa41.webp","화났어요|rose|blue":"webtoon-art/860ff8b84986100d37068caf.webp","화났어요|rose|mint":"webtoon-art/176bc0c76d58cf5219cbc253.webp","화났어요|gold|pink":"webtoon-art/f961c1f7dff1de5a3ab828fa.webp","화났어요|gold|blue":"webtoon-art/17ebc40575c87e196e12b177.webp","화났어요|gold|mint":"webtoon-art/81b4ac82e8119a42c7e62da2.webp","화났어요|violet|pink":"webtoon-art/86d1c0a4b21cd541948e3734.webp","화났어요|violet|blue":"webtoon-art/0e5c18171e46e6d75ecaaba8.webp","화났어요|violet|mint":"webtoon-art/3cf884f4823aed4ed74d1c3f.webp","생각해요|rose|blue":"webtoon-art/706356acfb68e17909b2219d.webp","생각해요|rose|mint":"webtoon-art/f19161499c2cf4423b6390e6.webp","생각해요|gold|pink":"webtoon-art/f17826ee480732f5c3992da8.webp","생각해요|gold|blue":"webtoon-art/4e987107dfc9b164a52ae736.webp","생각해요|gold|mint":"webtoon-art/c78dd87af30db8a0becf4677.webp","생각해요|violet|pink":"webtoon-art/4e39df49fd8f56de3c765605.webp","생각해요|violet|blue":"webtoon-art/0ad7c67d4a5f60dce20e6e60.webp","생각해요|violet|mint":"webtoon-art/b265a6bac9f7219bf0e86393.webp","신나요|rose|blue":"webtoon-art/326aab681aee9fe81abaed35.webp","신나요|rose|mint":"webtoon-art/2b16d1b58f26774f485846ed.webp","신나요|gold|pink":"webtoon-art/9015552148da92d4375a92b9.webp","신나요|gold|blue":"webtoon-art/e0b559cd033cd443327424d8.webp","신나요|gold|mint":"webtoon-art/5986ae3c3ecf348fba30f968.webp","신나요|violet|pink":"webtoon-art/d798af053a506ce8a0d224ea.webp","신나요|violet|blue":"webtoon-art/eedaa27c7a44014cab1096e7.webp","신나요|violet|mint":"webtoon-art/aa0c67495004a70ce203de0b.webp"};

// New C4.1 princess is drawn from one modular master model. All six expressions
// reuse the exact same costume, hair and jewelry; only the facial parts change.
function studioEmotionNormalize(emotion){
 const s=String(emotion||'');
 return ['놀랐어요','슬퍼요','화났어요','생각해요','신나요','기뻐요'].includes(s)?s:
   s==='궁금해요'?'생각해요':s==='자랑스러워요'?'신나요':'기뻐요';
}

// Stable per-decoration IDs. All six expressions reuse these exact placements.
let roseActiveId=null;
let roseTouchPointers=new Map();
let roseStartGesture=null;
function roseItems(r){return Array.isArray(r.roseAccessories)?r.roseAccessories:[];}
const studioRoseStyleAssets=window.studioRoseStyleAssets||{};
// C4.5.9: Real image pack pipeline.  One complete high-resolution drawing per expression.
// Artwork is stored in IndexedDB separately; tiny style IDs are saved in each recipe.
const ROSE_ART_DB='webtoon-rose-artist-packs-v1';
const ROSE_ART_STORE='packs';
const roseArtEmotions=['기뻐요','놀랐어요','슬퍼요','화났어요','생각해요','신나요'];
const ROSE_BUILTIN_BOB_ID='rose_bob_palace_pilot_v1';
const ROSE_BUILTIN_BOB_URL='rose-bob-palace.webp';
const ROSE_BOB_EXTRA_ID='rose_bob_palace_additional_emotions_v1';
function roseBuiltinBobSelected(r=studio){return r&&r.roseArtworkId===ROSE_BUILTIN_BOB_ID;}
let roseArtworkPacks=[];
let roseBobExtraImages={};
function roseBobHasEmotion(e){return e==='기뻐요'||Boolean(roseBobExtraImages[e]);}
function roseArtworkAvailableEmotions(r){if(roseBuiltinBobSelected(r))return roseArtEmotions.filter(roseBobHasEmotion);if(!r?.roseArtworkId)return roseArtEmotions.slice();const pack=roseArtworkPacks.find(x=>x.id===r.roseArtworkId);return pack?roseArtEmotions.filter(e=>!!pack.images?.[e]):roseArtEmotions.slice();}
function roseArtworkFallbackEmotion(r,e){const available=roseArtworkAvailableEmotions(r);return available.includes(e)?e:(available[0]||'기뻐요');}
let roseArtworkDb=null;
function roseArtworkOpenDB(){return new Promise((resolve,reject)=>{
 if(!window.indexedDB)return reject(Error('기기에서 IndexedDB를 사용할 수 없습니다.'));
 const req=indexedDB.open(ROSE_ART_DB,1);
 req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(ROSE_ART_STORE))req.result.createObjectStore(ROSE_ART_STORE,{keyPath:'id'});};
 req.onerror=()=>reject(req.error||Error('저장 공간 연결 오류'));
 req.onsuccess=()=>resolve(req.result);
});}
function roseArtworkTx(mode,doIt){return new Promise((resolve,reject)=>{
 if(!roseArtworkDb)return reject(Error('원화 보관함이 준비되지 않았습니다.'));
 const tx=roseArtworkDb.transaction(ROSE_ART_STORE,mode);
 const store=tx.objectStore(ROSE_ART_STORE);
 const request=doIt(store);
 tx.oncomplete=()=>resolve(request?.result);
 tx.onerror=()=>reject(tx.error||Error('그림 저장 중 오류'));
 tx.onabort=()=>reject(tx.error||Error('그림 저장이 중단되었습니다.'));
});}
function roseArtworkFor(recipe,emotion){
 if(roseBuiltinBobSelected(recipe))return roseBobExtraImages[emotion]||ROSE_BUILTIN_BOB_URL; // Complete art; no segmented arm assembly.
 if(!recipe.roseArtworkId)return null;
 const pack=roseArtworkPacks.find(x=>x.id===recipe.roseArtworkId);
 return (pack&&pack.images&&pack.images[emotion])||null;
}
function roseArtworkGalleryRender(){
 const root=document.getElementById('roseArtworkGallery');if(!root)return;
 root.replaceChildren();
 function option(id,name,fn){
  const btn=document.createElement('button');btn.type='button';btn.className='roseArtworkGalleryBtn';
  btn.setAttribute('aria-pressed',String((studio.roseArtworkId||'')===id));
  const txt=document.createElement('span');txt.textContent=name;btn.appendChild(txt);
  btn.addEventListener('click',fn);root.appendChild(btn);
 }
 option('','🌸 기본 꽃빛 공주 · 표정 6종',()=>{studio.roseArtworkId='';roseActiveId=null;studioRender();});
 option(ROSE_BUILTIN_BOB_ID,'🌷 단발머리 + 궁전 드레스 · '+roseArtworkAvailableEmotions({roseArtworkId:ROSE_BUILTIN_BOB_ID}).length+'표정',()=>{
  studio.roseArtworkId=ROSE_BUILTIN_BOB_ID;studio.emotion='기뻐요';studio.pose='서 있기';roseActiveId=null;studioRender();
 });
 for(const pack of roseArtworkPacks){
  option(pack.id,'🎨 '+pack.name+' · '+roseArtEmotions.filter(e=>pack.images?.[e]).length+'표정',()=>{studio.roseArtworkId=pack.id;studio.emotion=roseArtworkFallbackEmotion(studio,studio.emotion);roseActiveId=null;studioRender();});
 }
 const original=document.getElementById('roseCompareOriginal');
 if(original&&!original.src)original.src=studioRoseExpressionAssets['기뻐요'];
 const info=document.getElementById('roseBuiltinStyleNotice');
 if(info){const n=roseArtworkAvailableEmotions({roseArtworkId:ROSE_BUILTIN_BOB_ID}).length;info.textContent=roseBuiltinBobSelected()?`🌷 단발머리 공주: 실제 완성 원화 ${n}장. 없는 표정은 선택할 수 없습니다. 손·팔과 드레스는 각각의 그림 전체를 사용합니다.`:`🌹 꽃빛 공주: 원화 표정 6종. 팔을 올린 「신나요」는 손 자세 고정 보기에서 안전하게 바꿔 볼 수 있습니다. 단발머리 공주에는 완성 원화 ${n}장이 있습니다.`;}

}
function roseArtworkFileData(file){return new Promise((resolve,reject)=>{
 if(!file||!file.type.startsWith('image/'))return reject(Error('PNG, WebP, JPG 이미지 파일을 선택해 주세요.'));
 const reader=new FileReader();
 reader.onerror=()=>reject(Error('이미지 파일을 읽을 수 없습니다.'));
 reader.onload=()=>{
  const img=new Image();img.onerror=()=>reject(Error('이미지 파일이 손상되었거나 열 수 없습니다.'));
  img.onload=()=>{
   const edge=1100,ratio=Math.min(1,edge/Math.max(img.naturalWidth,img.naturalHeight));
   const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));
   const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
   resolve(canvas.toDataURL('image/webp',0.9));
  };
  img.src=reader.result;
 };
 reader.readAsDataURL(file);
});}
function roseBobSlotsRender(){
 const holder=document.getElementById('roseBobInputs');if(!holder)return;
 if(!holder.children.length){
  for(const emotion of roseArtEmotions.filter(x=>x!=='기뻐요')){
   const label=document.createElement('label');label.textContent=(roseBobExtraImages[emotion]?'✅ ':'⬜ ')+emotion;
   const input=document.createElement('input');input.type='file';input.accept='image/png,image/webp,image/jpeg';input.dataset.bobEmotion=emotion;input.setAttribute('aria-label',emotion+' 단발 공주 완성 원화');
   label.append(input);holder.append(label);
  }
 }else{
  for(const input of holder.querySelectorAll('input[data-bob-emotion]'))input.parentElement.firstChild.textContent=(roseBobExtraImages[input.dataset.bobEmotion]?'✅ ':'⬜ ')+input.dataset.bobEmotion;
 }
 const status=document.getElementById('roseBobSlotStatus');if(status)status.textContent='준비된 원화: '+roseArtworkAvailableEmotions({roseArtworkId:ROSE_BUILTIN_BOB_ID}).join(' · ')+' ('+roseArtworkAvailableEmotions({roseArtworkId:ROSE_BUILTIN_BOB_ID}).length+'/6)';
}
async function roseArtworkInit(){
 const inputBox=document.getElementById('roseArtworkInputs');if(!inputBox)return;roseBobSlotsRender();
 inputBox.replaceChildren();
 for(const emotion of roseArtEmotions){
  const label=document.createElement('label');label.textContent='😊 '+emotion;
  const field=document.createElement('input');field.type='file';field.accept='image/png,image/webp,image/jpeg';
  field.dataset.roseArtEmotion=emotion;field.setAttribute('aria-label',emotion+' 표정의 새 고화질 공주 그림');
  label.appendChild(field);inputBox.appendChild(label);
 }
 const status=document.getElementById('roseArtworkNotice');
 try{
  roseArtworkDb=await roseArtworkOpenDB();
  roseArtworkPacks=(await roseArtworkTx('readonly',store=>store.getAll()))||[];
  roseArtworkPacks=roseArtworkPacks.filter(x=>x&&x.id&&x.images);
  const extra=roseArtworkPacks.find(x=>x.id===ROSE_BOB_EXTRA_ID);roseBobExtraImages=extra?.images||{};
  roseArtworkPacks=roseArtworkPacks.filter(x=>x.id!==ROSE_BOB_EXTRA_ID);
  roseBobSlotsRender();
  roseArtworkGalleryRender();
  studioRender();studioSavedView();
  if(studio.roseArtworkId&&studio.roseArtworkId!==ROSE_BUILTIN_BOB_ID&&!roseArtworkPacks.some(x=>x.id===studio.roseArtworkId))status.textContent='이 공주의 등록 원화를 이 기기에서 찾을 수 없습니다. 원본 꽃빛 공주를 보여줍니다.';
 }catch(e){status.textContent='원화 보관함 연결 실패: '+(e.message||e);}
 document.getElementById('roseBobSave')?.addEventListener('click',async()=>{
  const files=[...document.querySelectorAll('input[data-bob-emotion]')].filter(x=>x.files?.[0]);
  const notice=document.getElementById('roseBobNotice');if(!files.length){notice.textContent='추가할 표정 그림을 선택해 주세요.';return;}
  const button=document.getElementById('roseBobSave');button.disabled=true;
  try{
   const images={...roseBobExtraImages};
   for(const input of files)images[input.dataset.bobEmotion]=await roseArtworkFileData(input.files[0]);
   const pack={id:ROSE_BOB_EXTRA_ID,name:'단발 공주 추가 표정',images,created:Date.now()};
   await roseArtworkTx('readwrite',store=>store.put(pack));
   roseBobExtraImages=images;files.forEach(x=>x.value='');roseBobSlotsRender();studioRender();
   notice.textContent='✅ 추가한 '+files.length+'개 표정을 저장했습니다. 기존 꽃빛 공주와 단발 웃는 원화는 변경되지 않았습니다.';
  }catch(e){notice.textContent='표정 저장 실패: '+(e.message||e);}
  finally{button.disabled=false;}
 });
 document.getElementById('roseBobClear')?.addEventListener('click',async()=>{
  const notice=document.getElementById('roseBobNotice');
  if(!Object.keys(roseBobExtraImages).length){notice.textContent='추가한 그림이 없습니다.';return;}
  if(!confirm('단발 공주에 추가 등록한 표정 그림만 초기화할까요? 기본 단발 웃는 원화와 다른 작품은 그대로 유지됩니다.'))return;
  try{await roseArtworkTx('readwrite',store=>store.delete(ROSE_BOB_EXTRA_ID));roseBobExtraImages={};studio.emotion='기뻐요';roseBobSlotsRender();studioRender();notice.textContent='추가 표정만 초기화했습니다.';}
  catch(e){notice.textContent='초기화 실패: '+(e.message||e);}
 });
 document.getElementById('roseArtworkSave')?.addEventListener('click',async()=>{
  const name=document.getElementById('roseArtworkName').value.trim();
  if(!name){status.textContent='새 원화 스타일의 이름을 먼저 입력해 주세요.';return;}
  const inputs=[...inputBox.querySelectorAll('input[data-rose-art-emotion]')];
  if(!inputs.some(i=>i.files?.[0])){status.textContent='적어도 한 표정의 원화를 선택해 주세요.';return;}
  const button=document.getElementById('roseArtworkSave');button.disabled=true;status.textContent='선택한 원화를 읽는 중입니다.';
  try{
   const images={};for(const item of inputs){if(item.files?.[0])images[item.dataset.roseArtEmotion]=await roseArtworkFileData(item.files[0]);}
   const pack={id:'art-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),name:name.slice(0,30),images,created:Date.now()};
   await roseArtworkTx('readwrite',store=>store.put(pack));
   roseArtworkPacks.push(pack);studio.roseArtworkId=pack.id;studio.emotion=roseArtworkFallbackEmotion(studio,studio.emotion);
   inputs.forEach(x=>{x.value='';});
   status.textContent='원화 '+Object.keys(images).length+'장을 저장했습니다. 원화가 없는 표정은 선택되지 않습니다.';
   studioRender();
  }catch(e){status.textContent='등록 실패: '+(e.message||e)+' · 기기 저장공간을 확인해 주세요.';}
  finally{button.disabled=false;}
 });
 document.getElementById('roseArtworkDelete')?.addEventListener('click',async()=>{
  if(!studio.roseArtworkId||roseBuiltinBobSelected()){status.textContent='기본으로 제공되는 원화는 삭제할 수 없습니다. 직접 등록한 원화만 삭제할 수 있어요.';return;}
  const pack=roseArtworkPacks.find(x=>x.id===studio.roseArtworkId);if(!pack)return;
  if(!confirm('「'+pack.name+'」 원화를 이 기기에서 삭제할까요? 기존 웹툰 작품과 기본 공주는 삭제하지 않습니다.'))return;
  try{await roseArtworkTx('readwrite',store=>store.delete(pack.id));roseArtworkPacks=roseArtworkPacks.filter(x=>x.id!==pack.id);studio.roseArtworkId='';status.textContent='등록된 원화만 삭제했습니다.';studioRender();}
  catch(e){status.textContent='삭제 실패: '+(e.message||e);}
 });
}
function roseAssetFor(r,emotion){
 if(r.roseStableHands!==false && !r.roseArtworkId && emotion==='신나요')emotion='기뻐요';
 if(r.roseArtworkId)emotion=roseArtworkFallbackEmotion(r,emotion);
 const custom=roseArtworkFor(r,emotion);if(custom)return custom;
 const hair=['rose','gold','violet'].includes(r.hairColor)?r.hairColor:'rose';
 const dress=['pink','blue','mint'].includes(r.dress)?r.dress:'pink';
 const requestedHair=(r.roseHairShape||'normal');
 const requestedDress=(r.roseDressShape||'normal');
 const hh=['normal','soft','volume'].includes(requestedHair)?requestedHair:(requestedHair==='halfup'?'soft':requestedHair==='updo'?'normal':'normal');
 const dd=['normal','slim'].includes(requestedDress)?requestedDress:(requestedDress==='layered'?'slim':'normal');
 const key=emotion+'|'+hair+'|'+dress;
 if(hh!=='normal'||dd!=='normal'){const alt=studioRoseStyleAssets[key+'|'+hh+'|'+dd];if(alt)return alt;}
 return studioRoseColorAssets[key]||studioRoseExpressionAssets[emotion]||studioRoseExpressionAssets['기뻐요'];
}
function roseAccessorySource(name){return name==='왕관'?null:(premiumPropImages[name]||null);}
// C4.5.9: Distinct high-resolution HAIR STYLING using existing premium raster assets.
// These are hair-tie/accessory arrangements, not a false claim of newly painted haircuts.
// Drawn inside the character art before freely draggable accessories; no new save schema.
function roseHairFinishSvg(recipe){
 const finish=recipe.roseHairFinish||'none';
 if(finish==='none')return '';
 const ribbon=premiumPropImages['리본장식'];
 const rose=premiumPropImages['장미'];
 const flower=premiumPropImages['꽃'];
 if(finish==='twin')return `<g pointer-events="none" aria-label="양갈래 리본 헤어 연출"><image href="${ribbon}" x="48" y="105" width="33" height="30" transform="rotate(-17 64 120)"/><image href="${ribbon}" x="181" y="105" width="33" height="30" transform="rotate(17 197 120)"/></g>`;
 if(finish==='half')return `<g pointer-events="none" aria-label="반묶음 리본 헤어 연출"><image href="${ribbon}" x="106" y="45" width="48" height="42"/><image href="${flower}" x="76" y="73" width="23" height="22"/></g>`;
 if(finish==='flower')return `<g pointer-events="none" aria-label="꽃핀 웨이브 헤어 연출"><image href="${rose}" x="49" y="82" width="37" height="37"/><image href="${flower}" x="178" y="91" width="27" height="27"/></g>`;
 return '';
}
function studioRenderBodyGalleries(){
 // C4.5.9: no repeated large thumbnails. Use the two compact text selectors.
 const note=document.getElementById('studioLegacyHairNotice');
 if(note)note.hidden=!(studio.roseHairFinish&&studio.roseHairFinish!=='none');
}

function roseAccessoryG(r,where){
 return roseItems(r).filter(it=>(it.layer==='back'?'back':'front')===where).map(it=>{
  const source=roseAccessorySource(it.name);if(!source)return '';
  const size=Math.max(.15,Math.min(4.5,(Number(it.size)||100)/100));
  const sx=Math.max(.25,Math.min(3,Number(it.stretchX)||1));
  const sy=Math.max(.25,Math.min(3,Number(it.stretchY)||1));
  const rot=Number(it.rotation)||0;
  const x=Number.isFinite(Number(it.x))?Number(it.x):130,y=Number.isFinite(Number(it.y))?Number(it.y):90;
  // The same invisible touch rectangle used by the webtoon prop editor.
  return `<g class="stageHandle roseAdornment" data-piece="item" data-rose-id="${safe(String(it.id))}" transform="translate(${x} ${y}) rotate(${rot}) scale(${size*sx} ${size*sy})"><rect x="-29" y="-29" width="58" height="58" fill="transparent" pointer-events="all"/><image href="${source}" x="-26" y="-26" width="52" height="52" preserveAspectRatio="xMidYMid meet" transform="scale(${it.flip?-1:1} 1)" pointer-events="none"/></g>`;
 }).join('');
}
// As in webtoon panelSvg: handles live at the SVG root and remain small,
// independent of prop scale.  This avoids oversized rotating controls.
function roseGizmo(r){
 const it=roseItems(r).find(v=>v.id===roseActiveId);
 if(!it||!roseAccessorySource(it.name)||r.baseModel!=='rose3d')return '';
 const sc=Math.max(.15,Math.min(4.5,(Number(it.size)||100)/100));
 const w=27*sc*Math.max(.25,Math.min(3,Number(it.stretchX)||1));
 const h=27*sc*Math.max(.25,Math.min(3,Number(it.stretchY)||1));
 const x=Number(it.x)||0,y=Number(it.y)||0,rot=Number(it.rotation)||0;
 const grip=(name,gx,gy)=>`<g data-rose-handle="${name}" data-rose-for="${safe(String(it.id))}"><circle cx="${gx}" cy="${gy}" r="9" fill="transparent" pointer-events="all"/><circle cx="${gx}" cy="${gy}" r="3.3" fill="#fff" stroke="#784cc0" stroke-width="1.6" pointer-events="none"/></g>`;
 const out=12;
 return `<g class="roseEditGizmo" transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-w}" y="${-h}" width="${2*w}" height="${2*h}" rx="2" fill="none" stroke="#8151c6" stroke-width="1.15" stroke-dasharray="3 3" pointer-events="none"/>${grip('corner',w+out,h+out)}${grip('horizontal',w+out,0)}${grip('vertical',0,h+out)}${grip('rotation',0,-h-out)}</g>`;
}
function roseSelected(){return roseItems(studio).find(it=>it.id===roseActiveId)||null;}
function roseUiSync(){
 const item=roseSelected(),box=document.getElementById('studioRoseEdit');if(!box)return;
 box.hidden=!item;
 if(!item){document.getElementById('studioStatus').textContent='장식을 선택하면 바로 옆에 조절 표시와 꾸미기 메뉴가 나타나요.';return;}
 document.getElementById('studioRoseSelectedLabel').textContent='🎀 선택한 장식: '+item.name;
 document.getElementById('studioStatus').textContent='선택한 장식을 손가락으로 움직이고, 표시된 조절점으로 크기·회전·복제·삭제를 할 수 있어요.';
 document.getElementById('studioRoseSize')&&(document.getElementById('studioRoseSize').value=String(item.size||100));
 document.getElementById('studioRoseAngle')&&(document.getElementById('studioRoseAngle').value=String(item.rotation||0));
}
function roseAdd(name){
 if(!roseAccessorySource(name)){document.getElementById('studioStatus').textContent='이 장식의 그림을 찾지 못했어요: '+name;return;}
 const presets={
 '리본장식':[169,48,60],'화관':[130,38,95],'꽃':[175,57,58],'장미':[176,63,65],
 '보석나비':[194,129,70],'수정보석':[133,162,55],
 '요정날개':[128,146,175],'별지팡이':[205,175,100],'황금열쇠':[204,171,80],'빛가루':[130,135,130]};
 const [x,y,size]=presets[name]||[125,110,90];
 if(!Array.isArray(studio.roseAccessories))studio.roseAccessories=[];
 const item={id:'rose-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),name,x,y,size,rotation:0,layer:name==='요정날개'?'back':'front'};
 studio.roseAccessories.push(item);roseActiveId=item.id;document.getElementById('studioStatus').textContent=name+' 장식을 추가했어요. 장식을 눌러 조절하세요.';studioRender();
}
function rosePoint(ev,svg){
 const p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;
 const matrix=svg.getScreenCTM();if(!matrix)return {x:0,y:0};
 return p.matrixTransform(matrix.inverse());
}
// Identical gesture rules and handle names to the webtoon direct-touch editor.
let roseStageGesture=null;
function roseGestureStartSnapshot(it,pts){return {
 points:pts,x:Number(it.x)||0,y:Number(it.y)||0,
 size:Number(it.size)||100,rotation:Number(it.rotation)||0,
 stretchX:Number(it.stretchX)||1,stretchY:Number(it.stretchY)||1};}
function roseAttachGestures(){
 const root=document.getElementById('studioCanvas');if(!root||root.dataset.roseTouchBound)return;
 root.dataset.roseTouchBound='yes';
 root.addEventListener('pointerdown',ev=>{
  if(studio.baseModel!=='rose3d')return;
  // A second finger may land on empty art; treat it as a pinch on the active prop,
  // exactly as webtoon stagePointerDown does, rather than deselecting it.
  if(roseStageGesture && roseStageGesture.pointers.size===1 && !roseStageGesture.pointers.has(ev.pointerId)){
   const g=roseStageGesture,pt=rosePoint(ev,g.svg);
   g.pointers.set(ev.pointerId,pt);
   g.start=roseGestureStartSnapshot(g.it,[...g.pointers.values()]);
   try{root.setPointerCapture(ev.pointerId)}catch(_){}
   ev.preventDefault();ev.stopPropagation();return;
  }
  const knob=ev.target.closest('[data-rose-handle]');
  const target=knob||ev.target.closest('[data-rose-id]');
  if(!target){if(!roseStageGesture&&roseActiveId){roseActiveId=null;studioRender();}return;}
  const id=knob?.dataset.roseFor||target.dataset.roseId;
  const it=roseItems(studio).find(v=>v.id===id);if(!it)return;
  const current=root.querySelector('svg');if(!current)return;
  if(roseStageGesture&&roseStageGesture.it!==it&&roseStageGesture.pointers.size===1){
   const point=rosePoint(ev,roseStageGesture.svg);
   roseStageGesture.pointers.set(ev.pointerId,point);
   roseStageGesture.start=roseGestureStartSnapshot(roseStageGesture.it,[...roseStageGesture.pointers.values()]);
   try{root.setPointerCapture(ev.pointerId)}catch(_){}
   ev.preventDefault();return;
  }
  if(roseStageGesture&&roseStageGesture.it!==it)return;
  ev.preventDefault();ev.stopPropagation();
  if(!roseStageGesture){
   if(roseActiveId!==id){
    // Selection first, without losing the pointer gesture.  Root remains mounted.
    roseActiveId=id;studioRender();
   }
   const svg=root.querySelector('svg');if(!svg)return;
   roseStageGesture={svg,it,handle:knob?.dataset.roseHandle||'move',pointers:new Map(),start:null};
  }
  const g=roseStageGesture;
  g.pointers.set(ev.pointerId,rosePoint(ev,g.svg));
  g.start=roseGestureStartSnapshot(g.it,[...g.pointers.values()]);
  try{root.setPointerCapture(ev.pointerId)}catch(_){}
 });
 root.addEventListener('pointermove',ev=>{
  const g=roseStageGesture;if(!g||!g.pointers.has(ev.pointerId))return;
  ev.preventDefault();
  const pt=rosePoint(ev,g.svg);if(!pt)return;
  g.pointers.set(ev.pointerId,pt);
  const ps=[...g.pointers.values()],s=g.start,it=g.it;
  if(!s)return;
  if(ps.length>=2){
   const [a,b]=ps,[p,q]=s.points;if(!q)return;
   const d0=Math.hypot(q.x-p.x,q.y-p.y),d1=Math.hypot(b.x-a.x,b.y-a.y);
   const oldAngle=Math.atan2(q.y-p.y,q.x-p.x),newAngle=Math.atan2(b.y-a.y,b.x-a.x);
   it.size=Math.round(clamp(s.size*d1/Math.max(1,d0),20,450));
   it.rotation=Math.round(clamp(s.rotation+(newAngle-oldAngle)*180/Math.PI,-360,360));
   it.x=clamp(s.x+(a.x+b.x-p.x-q.x)/2,-20,280);
   it.y=clamp(s.y+(a.y+b.y-p.y-q.y)/2,-20,330);
  }else{
   const p=s.points[0],a=ps[0],dx=a.x-p.x,dy=a.y-p.y;
   if(g.handle==='rotation'){
    const old=Math.atan2(p.y-s.y,p.x-s.x),now=Math.atan2(a.y-s.y,a.x-s.x);
    it.rotation=Math.round(clamp(s.rotation+(now-old)*180/Math.PI,-360,360));
   }else if(['corner','horizontal','vertical'].includes(g.handle)){
    const radians=s.rotation*Math.PI/180;
    const localX=dx*Math.cos(radians)+dy*Math.sin(radians);
    const localY=-dx*Math.sin(radians)+dy*Math.cos(radians);
    const baseW=Math.max(5,27*s.size/100*s.stretchX),baseH=Math.max(5,27*s.size/100*s.stretchY);
    if(g.handle==='corner')it.size=Math.round(clamp(s.size*Math.max(.1,1+(localX/baseW+localY/baseH)/2),20,450));
    if(g.handle==='horizontal')it.stretchX=+clamp(s.stretchX*(1+localX/baseW),.25,3).toFixed(3);
    if(g.handle==='vertical')it.stretchY=+clamp(s.stretchY*(1+localY/baseH),.25,3).toFixed(3);
   }else{
    it.x=+clamp(s.x+dx,-20,280).toFixed(2);
    it.y=+clamp(s.y+dy,-20,330).toFixed(2);
   }
  }
  // Same as webtoon editor: update image transform directly until release.
  const node=[...root.querySelectorAll('[data-rose-id]')].find(v=>v.dataset.roseId===it.id);
  if(node){const z=clamp((Number(it.size)||100)/100,.15,4.5);
   node.setAttribute('transform',`translate(${Number(it.x)||0} ${Number(it.y)||0}) rotate(${Number(it.rotation)||0}) scale(${z*(Number(it.stretchX)||1)} ${z*(Number(it.stretchY)||1)})`);}
  roseUiSync();
 });
 const end=ev=>{
  const g=roseStageGesture;if(!g||!g.pointers.has(ev.pointerId))return;
  g.pointers.delete(ev.pointerId);
  try{root.releasePointerCapture(ev.pointerId)}catch(_){}
  if(!g.pointers.size){roseStageGesture=null;studioRender();return;}
  g.start=roseGestureStartSnapshot(g.it,[...g.pointers.values()]);
 };
 root.addEventListener('pointerup',end);root.addEventListener('pointercancel',end);
}

function roseTransformAround(cx,cy,sx=1,sy=1,dx=0,dy=0){
 return `translate(${dx} ${dy}) translate(${cx} ${cy}) scale(${sx} ${sy}) translate(${-cx} ${-cy})`;
}
function rose3dFigureSvg(r,src){
 // C4.5.9 hand-safe hotfix: keep one full artwork image, then restore the
 // original untinted hand skin over a tiny mask so dress recoloring never
 // bleeds into the clasped hands.
 const base=`<image href="${src}" x="3" y="4" width="254" height="290" preserveAspectRatio="xMidYMid meet" pointer-events="none"/>`;
 if(r.dress==='pink')return base;
 const baseSkin=studioRoseExpressionAssets[roseArtworkFallbackEmotion(r,r.emotion||'기뻐요')]||studioRoseExpressionAssets['기뻐요'];
 const patchId='roseHandPatch'+Math.random().toString(36).slice(2,8);
 const defs=`<defs><clipPath id="${patchId}">
  <ellipse cx="110" cy="136" rx="12" ry="9" transform="rotate(-18 110 136)"/>
  <ellipse cx="146" cy="136" rx="12" ry="9" transform="rotate(18 146 136)"/>
  <ellipse cx="118" cy="145" rx="13" ry="10"/>
  <ellipse cx="138" cy="145" rx="13" ry="10"/>
  <ellipse cx="128" cy="149" rx="18" ry="11"/>
  <ellipse cx="116" cy="154" rx="10" ry="8"/>
  <ellipse cx="140" cy="154" rx="10" ry="8"/>
  <ellipse cx="128" cy="159" rx="11" ry="7"/>
 </clipPath></defs>`;
 const safeHands=`<image href="${baseSkin}" x="3" y="4" width="254" height="290" preserveAspectRatio="xMidYMid meet" clip-path="url(#${patchId})" pointer-events="none"/>`;
 return defs+base+safeHands;
}

function studioCharacterSvg(recipe, rawEmotion, includeBackground=false, poseOverride=null){
 const r={...studioDefaults,...(recipe||{}),mode:'modular'};
 const incoming=rawEmotion&&typeof rawEmotion==='object'?rawEmotion:{emotion:rawEmotion,pose:poseOverride};
 const e=studioEmotionNormalize(incoming.emotion||r.emotion);
 const pose=studioEnsurePose(e,incoming.pose||r.pose);
 const walking=pose==='걷기';
 const jumping=pose==='뛰어오르기';
 const poseTilt=jumping?-6:(walking?-4:0);
 const poseDx=walking?4:0;
 const poseDy=jumping?-16:0;
 const poseFx=jumping?'<path d="M92 282 Q129 266 167 282" stroke="#fff" stroke-width="5" fill="none" opacity=".68"/><text x="202" y="138" font-size="24">✨</text>':walking?'<path d="M45 229 l30 -5 M45 244 l25 -4" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".75"/>':'';
 if(r.baseModel==='rose3d'){
  const src=roseAssetFor(r,e);
  const stableExcited=!!(r.roseStableHands!==false && !r.roseArtworkId && e==='신나요');
  const extraExcited=stableExcited?`<g pointer-events="none" opacity=".9"><text x="56" y="105" font-size="15">✨</text><text x="191" y="79" font-size="15">💛</text><text x="207" y="174" font-size="13">✨</text></g>`:'';
  const glimmer=r.sparkles===false||r.sparkles==='no'?'':`<g pointer-events="none" stroke="#ffdf8b" stroke-width=".6" fill="#fffbe5" opacity=".95"><path d="M36 112 l3 -11 3 11 11 3 -11 3 -3 11 -3 -11 -11 -3Z"/><path d="M213 95 l3 -12 3 12 12 3 -12 3 -3 12 -3 -12 -12 -3Z"/><path d="M222 191 l3 -10 3 10 10 3 -10 3 -3 10 -3 -10 -10 -3Z"/><circle cx="47" cy="203" r="2.7"/><circle cx="211" cy="238" r="2.6"/></g>`;
  const fromRealArtwork=Boolean(roseArtworkFor(r,e));
  const figure=fromRealArtwork?`<image href="${src}" x="3" y="4" width="254" height="290" preserveAspectRatio="xMidYMid meet" pointer-events="none"/>`:rose3dFigureSvg(r,src);
  return `${roseAccessoryG(r,'back')}${figure}${fromRealArtwork?'':roseHairFinishSvg(r)}${glimmer}${extraExcited}${roseAccessoryG(r,'front')}${r.__roseEditing?roseGizmo(r):''}`;
 }

 const color=(key,table,fallback)=>table[key]||fallback;
 const h=color(r.hairColor,princessColors.hair,'#e9b847');
 const d=color(r.dress,princessColors.dress,'#f6a8d2');
 const shoe=color(r.shoes,princessColors.shoes,'#ed7eaf');
 const style=['long','curl','twintail','bob'].includes(r.hairStyle)?r.hairStyle:'long';
 const eyes=['jewel','soft','bright'].includes(r.eyes)?r.eyes:'jewel';
 const face=['round','oval','heart'].includes(r.face)?r.face:'round';
 const tag='cm'+[r.hairColor,r.dress,r.shoes,r.hairStyle,r.face,r.eyes,r.crown,r.wings,r.staff].join('').replace(/[^a-z]/gi,'').slice(0,60);
 const sat=(v)=>Math.max(0,Math.min(255,v));
 // Self-contained SVG gradients and highlights; avoids colored filters on old artwork.
 const defs=`<defs>
 <linearGradient id="${tag}hair" x1="0" y1="0" x2="1" y2=".5"><stop stop-color="#fff" stop-opacity=".48"/><stop offset=".19" stop-color="${h}"/><stop offset=".62" stop-color="${h}"/><stop offset="1" stop-color="#704060" stop-opacity=".54"/></linearGradient>
 <linearGradient id="${tag}dress" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff5ff"/><stop offset=".27" stop-color="${d}"/><stop offset=".7" stop-color="${d}"/><stop offset="1" stop-color="#9e709c"/></linearGradient>
 <radialGradient id="${tag}skin" cx=".34" cy=".25" r=".95"><stop stop-color="#fff8ed"/><stop offset=".66" stop-color="#ffdccd"/><stop offset="1" stop-color="#d99da7"/></radialGradient>
 <radialGradient id="${tag}gem"><stop stop-color="#fff"/><stop offset=".3" stop-color="#fff8be"/><stop offset=".65" stop-color="#b69ff2"/><stop offset="1" stop-color="#8965ad"/></radialGradient>
 <linearGradient id="${tag}lace" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#e8c8ef"/></linearGradient>
 </defs>`;
 const gem=`url(#${tag}gem)`,hair=`url(#${tag}hair)`,dress=`url(#${tag}dress)`,skin=`url(#${tag}skin)`;
 const wing=r.wings==='none'?'': r.wings==='angel'?`<g opacity=".85" stroke="#fff" stroke-width="3"><path d="M117 177 C65 120 57 138 65 185 C70 216 99 221 119 205Z" fill="#ecffff"/><path d="M145 177 C195 120 204 139 194 185 C190 214 165 220 143 205Z" fill="#edf0ff"/></g>`:
 `<g opacity=".9" stroke="#fff" stroke-width="3"><path d="M116 181 C80 122 52 133 58 161 C59 185 87 193 113 197 C73 188 63 222 82 234 C101 242 116 208 121 193Z" fill="#ffd0ec"/><path d="M144 181 C183 122 205 130 201 162 C200 187 169 194 147 198 C189 188 200 219 180 233 C163 242 147 209 141 192Z" fill="#c9edff"/><path d="M94 163 L113 189 M170 161 L146 188" stroke="#ffefc7"/></g>`;
 const backHair=style==='long'?`<path d="M91 95 C61 110 66 163 61 197 Q61 232 80 257 Q98 241 103 198 L161 197 Q166 243 183 257 C201 220 194 154 179 111 Q156 72 126 82Z" fill="${hair}" stroke="#89576e" stroke-width="1.5"/><path d="M76 142 Q74 215 85 237 M179 143 Q181 216 172 237" fill="none" stroke="#fff" stroke-opacity=".34" stroke-width="5"/>`:
 style==='curl'?`<path d="M91 95 C62 110 64 148 74 165 Q51 179 75 198 Q53 219 83 240 Q100 242 106 219 L156 217 Q162 242 178 238 Q204 220 184 198 Q206 177 186 163 C198 130 171 82 131 83Z" fill="${hair}" stroke="#89576e" stroke-width="2"/>${[81,90,173,182].map((x,i)=>`<circle cx="${x}" cy="${169+i%2*31}" r="13" fill="${hair}"/>`).join('')}`:
 style==='twintail'?`<path d="M93 92 C66 105 79 169 85 179 L167 176 C186 116 158 79 126 82Z" fill="${hair}"/><path d="M84 118 C39 127 45 199 54 231 Q81 245 89 204 L98 145Z" fill="${hair}" stroke="#956b7d" stroke-width="2"/><path d="M169 119 C214 131 209 201 200 229 Q175 246 166 204 L158 147Z" fill="${hair}" stroke="#956b7d" stroke-width="2"/><path d="M58 148 Q52 185 63 213 M196 147 Q202 186 192 212" stroke="#fff" stroke-width="4" opacity=".4" fill="none"/>`:
 `<path d="M91 90 Q60 107 71 172 Q85 194 105 178 L150 178 Q174 190 187 173 Q198 106 163 92Z" fill="${hair}" stroke="#9c7082" stroke-width="2"/><path d="M78 142 Q75 174 93 179 M175 140 Q180 173 165 178" stroke="#fff" stroke-width="3.5" opacity=".35" fill="none"/>`;
 const facePath=face==='oval'?`<path d="M130 106 C87 99 84 127 93 158 C98 176 115 191 130 191 C149 191 163 176 168 156 C178 126 165 103 130 106Z"`:
 face==='heart'?`<path d="M130 111 C94 95 84 126 92 154 C98 175 115 188 130 193 C151 181 164 174 169 152 C179 124 162 98 130 111Z"`:
 `<ellipse cx="130" cy="147" rx="42" ry="47"`;
 const faceShape=`${facePath} fill="${skin}" stroke="#dc9eaa" stroke-width="1.6"/>`;
 const skirt=`<path d="M107 191 C96 204 75 226 53 269 Q128 298 205 269 Q174 216 153 190Z" fill="${dress}" stroke="#b487aa" stroke-width="2.6"/>
 <path d="M107 200 Q85 239 70 273 M151 199 Q177 248 188 273 M127 203 Q125 245 126 281" stroke="#fff" stroke-width="4" opacity=".48" fill="none"/>
 <path d="M65 265 Q129 291 195 265" fill="none" stroke="url(#${tag}lace)" stroke-width="10" opacity=".94"/>
 <path d="M71 273 Q132 299 188 273" fill="none" stroke="#e9c378" stroke-width="2" opacity=".95"/>
 ${[78,98,120,142,163,185].map((x,i)=>`<circle cx="${x}" cy="${270+Math.sin(i/5*Math.PI)*10}" r="2.8" fill="${gem}" stroke="#fff" stroke-width=".6"/>`).join('')}
 <path d="M111 188 Q130 195 149 188 L149 210 Q130 221 111 210Z" fill="${dress}" stroke="#cf9fbb" stroke-width="2"/>
 <path d="M108 198 Q130 207 153 197" fill="none" stroke="#fff7fa" stroke-width="7"/>
 <path d="M116 211 Q129 205 141 211" fill="none" stroke="#ffeab4" stroke-width="2.6"/><path d="M116 205 L130 215 L144 205" fill="none" stroke="#fff" stroke-width="2"/><ellipse cx="130" cy="209" rx="6" ry="7.5" fill="${gem}" stroke="#fff3c8" stroke-width="2"/>`;
 const shoes=jumping?`<path d="M114 262 L104 276 M149 262 L159 276" fill="none" stroke="#f4c2b6" stroke-width="9" stroke-linecap="round"/><ellipse cx="98" cy="276" rx="15" ry="7" fill="${shoe}" stroke="#c19b9d" stroke-width="1.5" transform="rotate(-18 98 276)"/><ellipse cx="165" cy="276" rx="15" ry="7" fill="${shoe}" stroke="#c19b9d" stroke-width="1.5" transform="rotate(18 165 276)"/><path d="M91 273 l10 -2 M159 273 l10 2" stroke="#fff" stroke-width="2"/>`:walking?`<path d="M114 270 L109 283 M149 269 L155 281" fill="none" stroke="#f4c2b6" stroke-width="9" stroke-linecap="round"/><ellipse cx="103" cy="283" rx="15" ry="7" fill="${shoe}" stroke="#c19b9d" stroke-width="1.5" transform="rotate(-10 103 283)"/><ellipse cx="161" cy="280" rx="15" ry="7" fill="${shoe}" stroke="#c19b9d" stroke-width="1.5" transform="rotate(12 161 280)"/><path d="M96 279 l11 -1 M154 277 l12 1" stroke="#fff" stroke-width="2"/>`:`<path d="M112 271 L111 283 M150 271 L151 283" fill="none" stroke="#f4c2b6" stroke-width="9" stroke-linecap="round"/><ellipse cx="105" cy="283" rx="15" ry="7" fill="${shoe}" stroke="#c19b9d" stroke-width="1.5"/><ellipse cx="158" cy="283" rx="15" ry="7" fill="${shoe}" stroke="#c19b9d" stroke-width="1.5"/><path d="M98 279 l11 0 M151 279 l12 0" stroke="#fff" stroke-width="2"/>`;
 const arms=jumping?`<path d="M109 199 Q82 168 80 149 M151 199 Q180 171 185 152" stroke="#e5aab6" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M109 199 Q82 168 80 149 M151 199 Q180 171 185 152" stroke="#ffddd0" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M109 191 Q99 182 94 173 M151 191 Q163 182 169 173" stroke="#fff" stroke-width="8" opacity=".86" fill="none"/>`:walking?`<path d="M109 199 Q83 211 74 233 M151 199 Q174 207 185 223" stroke="#e5aab6" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M109 199 Q83 211 74 233 M151 199 Q174 207 185 223" stroke="#ffddd0" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M104 203 Q96 211 92 221 M154 200 Q162 208 169 215" stroke="#fff" stroke-width="9" opacity=".9" fill="none"/>`:`<path d="M109 199 Q80 216 80 238 M151 199 Q179 215 181 236" stroke="#e5aab6" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M109 199 Q80 216 80 238 M151 199 Q179 215 181 236" stroke="#ffddd0" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M106 201 Q98 210 95 220 M154 201 Q163 211 166 221" stroke="#fff" stroke-width="9" opacity=".9" fill="none"/>`;
 const faceCut=eyes==='bright'?{rx:9.7,ry:12.6}:eyes==='soft'?{rx:7.5,ry:9.6}:{rx:8.5,ry:11.3};
 const surprised=e==='놀랐어요',sad=e==='슬퍼요',angry=e==='화났어요',thinking=e==='생각해요',excited=e==='신나요';
 const eyelids=sad?`<path d="M105 138 Q113 144 119 142 M143 142 Q151 144 159 138" stroke="#80515b" stroke-width="2.5" fill="none"/>`:angry?`<path d="M104 133 L119 140 M144 140 L159 133" stroke="#80515b" stroke-width="3" fill="none"/>`:thinking?`<path d="M103 138 Q110 134 119 138 M143 137 Q151 132 159 135" stroke="#80515b" stroke-width="2.5" fill="none"/>`:
 `<path d="M103 136 Q112 130 120 136 M142 136 Q151 130 159 136" fill="none" stroke="#986a74" stroke-width="2" stroke-linecap="round"/>`;
 const eyePair=[112,150].map((x,i)=>{
  if(excited)return `<path d="M${x-8} 148 Q${x} 137 ${x+8} 148" stroke="#644a62" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${x-8} 147 Q${x} 140 ${x+8} 147" stroke="#fff" stroke-width="1" fill="none"/>`;
  const ry=surprised?faceCut.ry+2:faceCut.ry;
  return `<ellipse cx="${x}" cy="150" rx="${faceCut.rx}" ry="${ry}" fill="#fffefa" stroke="#735367" stroke-width="2.3"/><ellipse cx="${x}" cy="151" rx="${faceCut.rx*.68}" ry="${ry*.76}" fill="${eyes==='soft'?'#86567d':'#6e5e9c'}"/><ellipse cx="${x}" cy="151" rx="${faceCut.rx*.4}" ry="${ry*.59}" fill="#292139"/><circle cx="${x-2.4}" cy="146.5" r="3.3" fill="#fff"/><circle cx="${x+3}" cy="153" r="1.25" fill="#dceaff"/>`;
 }).join('');
 const mouth=surprised?`<ellipse cx="131" cy="172" rx="5.5" ry="7.3" fill="#a94963" stroke="#f4a8a9" stroke-width="1.6"/>`:
 sad?`<path d="M122 175 Q131 167 140 175" stroke="#a34e66" stroke-width="2.9" fill="none" stroke-linecap="round"/><path d="M105 165 Q106 172 103 176" stroke="#b7e5ff" stroke-width="2.8" fill="none"/>`:
 angry?`<path d="M123 172 Q131 167 139 172" stroke="#91425e" stroke-width="3" fill="none" stroke-linecap="round"/>`:
 thinking?`<path d="M126 173 Q131 169 136 173" stroke="#aa5572" stroke-width="2.8" fill="none" stroke-linecap="round"/>`:
 excited?`<path d="M119 167 Q131 183 143 167 Q132 187 119 167Z" fill="#ab526f" stroke="#b35c75" stroke-width="1"/><path d="M123 168 Q131 173 140 168" fill="none" stroke="#fff" stroke-width="2"/>`:
 `<path d="M122 169 Q131 180 141 169" stroke="#a65a70" stroke-width="3" fill="none" stroke-linecap="round"/>`;
 const cheeks=`<ellipse cx="97" cy="163" rx="10" ry="5" fill="#f18b9e" opacity=".42"/><ellipse cx="164" cy="163" rx="10" ry="5" fill="#f18b9e" opacity=".42"/>`;
 const faceArt=`${faceShape}${eyelids}${eyePair}${cheeks}<path d="M130 156 L128 162 Q132 165 134 161" fill="none" stroke="#d18d9f" stroke-width="1.1"/>${mouth}`;
 const fringe=style==='bob'?`<path d="M85 126 Q96 89 137 92 Q162 90 176 120 Q158 114 148 126 Q133 109 121 127 Q107 113 87 135Z" fill="${hair}" stroke="#9e7385" stroke-width="1.4"/>`:
 style==='curl'?`<path d="M89 124 Q91 89 125 91 Q161 88 175 126 Q161 113 146 123 Q132 105 119 125 Q104 113 89 132Z" fill="${hair}"/><circle cx="95" cy="122" r="11" fill="${hair}"/><circle cx="156" cy="113" r="12" fill="${hair}"/>`:
 style==='twintail'?`<path d="M86 119 Q95 88 132 91 Q162 87 174 122 Q154 115 145 126 Q126 109 114 125 Q95 117 86 131Z" fill="${hair}"/>`:
 `<path d="M87 125 Q90 87 127 89 Q166 87 176 125 Q158 111 146 130 Q125 108 115 130 Q95 115 87 136Z" fill="${hair}" stroke="#926477" stroke-width="1.1"/><path d="M99 103 Q109 97 121 101" stroke="#fff" stroke-width="4" opacity=".35" fill="none"/>`;
 const ornament=r.crown==='none'?'':r.crown==='bow'?`<g transform="translate(165 99)"><path d="M0 0 Q-25 -28 -26 1 Q-22 18 0 5 Q24 -25 25 1 Q23 18 0 5Z" fill="#f37db8" stroke="#fff4d3" stroke-width="2"/><circle cx="0" cy="4" r="7" fill="${gem}"/></g>`:
 r.crown==='flower'?`<g transform="translate(160 95)">${[0,60,120,180,240,300].map(a=>`<ellipse cx="0" cy="-11" rx="6" ry="10" transform="rotate(${a})" fill="#ffb7dd" stroke="#fff" stroke-width=".7"/>`).join('')}<circle r="6" fill="${gem}"/></g>`:
 r.crown==='tiara'?`<g><path d="M97 112 L100 94 L113 102 L129 85 L146 102 L158 94 L163 112" fill="none" stroke="#eed793" stroke-width="5" stroke-linejoin="round"/><circle cx="129" cy="86" r="5" fill="${gem}"/><circle cx="102" cy="97" r="2.5" fill="#fff"/><circle cx="157" cy="98" r="2.5" fill="#fff"/></g>`:
 `<g><path d="M96 110 L98 89 L111 99 L130 76 L147 99 L162 89 L164 110Z" fill="#f1cc78" stroke="#bd8c4a" stroke-width="2"/><path d="M99 106 Q131 117 161 106" fill="none" stroke="#fff4cd" stroke-width="3"/><circle cx="130" cy="95" r="7" fill="${gem}" stroke="#fff" stroke-width="1"/><circle cx="110" cy="103" r="4" fill="#ffacc9"/><circle cx="150" cy="103" r="4" fill="#b3e8ff"/></g>`;
 const staff=r.staff==='none'?'':`<g transform="translate(193 172) rotate(12)"><path d="M0 0 L-15 80" stroke="#b68a49" stroke-width="5" stroke-linecap="round"/><path d="M0 0 L-15 80" stroke="#fff5c3" stroke-width="1.4" stroke-linecap="round"/><g transform="translate(0 -4)">${r.staff==='heart'?`<path d="M0 21 Q-26 0 -14 -10 Q-4 -20 0 -7 Q8 -22 18 -10 Q29 0 0 21Z" fill="#ff97cc"/>`:r.staff==='flower'?`${[0,60,120,180,240,300].map(a=>`<ellipse cy="-11" ry="12" rx="8" transform="rotate(${a})" fill="#f6a9d9"/>`).join('')}`:`<path d="M0 -23 L7 -6 L25 -4 L12 8 L15 25 L0 16 L-15 25 L-12 8 L-25 -4 L-7 -6Z" fill="#ffe29a"/>`}<circle r="6" fill="${gem}" stroke="#fff" stroke-width="1.6"/></g></g>`;
 const sparkles=r.sparkles===false||r.sparkles==='no'?'':`<g fill="#fff8b3" stroke="#fff" stroke-width="1"><path d="M55 139 l4 -12 4 12 12 4 -12 4 -4 12 -4 -12 -12 -4Z"/><path d="M198 108 l3 -10 3 10 10 3 -10 3 -3 10 -3 -10 -10 -3Z"/><circle cx="47" cy="221" r="3"/><circle cx="212" cy="239" r="3"/></g>`;
 const ground=false?`<ellipse cx="132" cy="${jumping?292:288}" rx="${walking?70:(jumping?62:74)}" ry="8" fill="#bba2cb" opacity=".23"/>`:'';
 return `${defs}${ground}<g transform="translate(${poseDx} ${poseDy}) rotate(${poseTilt} 130 210)">${wing}${backHair}${shoes}${arms}${skirt}${faceArt}${fringe}${ornament}${staff}${sparkles}</g>${poseFx}`;
}
function studioArtSvg(transparent=false,recipe=studio){
 const r={...studioDefaults,...(recipe||{}),mode:'modular'};
 if(recipe===studio && !transparent)r.__roseEditing=true;
 const bg=studioColors[r.background]||studioColors.rose;
 const grad=`<defs><linearGradient id="studioBk" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient></defs>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="620" viewBox="0 0 260 310" role="img" aria-label="${safe(r.name||'나의 공주')} ${studioEmotionNormalize(r.emotion)} ${studioEnsurePose(r.emotion,r.pose)}">${grad}${transparent?'':'<rect width="260" height="310" fill="url(#studioBk)"/>'}${studioCharacterSvg(r,{emotion:r.emotion,pose:r.pose},!transparent)}</svg>`;
}

function renderRosePropContext(){
 const frame=document.querySelector('#studio .studioFrame');
 const canvas=document.getElementById('studioCanvas');if(!frame||!canvas)return;
 frame.querySelectorAll('.rosePropContext').forEach(n=>n.remove());
 const it=studio.baseModel==='rose3d'?roseSelected():null;if(!it)return;
 const menu=document.createElement('div');menu.className='propContext rosePropContext';
 menu.setAttribute('role','group');menu.setAttribute('aria-label','선택한 소품 바로 꾸미기');
 const choices=[...document.getElementById('studioRoseAdornment').options].filter(o=>roseAccessorySource(o.value)).map(o=>`<option value="${safe(o.value)}" ${o.value===it.name?'selected':''}>${safe(o.textContent)}</option>`).join('');
 menu.innerHTML=`<div class="propContextTitle">🎨 ${safe(it.name)} 꾸미기</div>
 <div class="propContextRow"><button type="button" data-ctx="front">공주 앞</button><button type="button" data-ctx="back">공주 뒤</button><button type="button" data-ctx="bring">맨앞</button></div>
 <div class="propContextRow"><select data-ctx-select="shape" aria-label="고화질 장식 모양 바꾸기">${choices}</select></div>
 <div class="propContextRow"><button type="button" data-ctx="flip">↔ 반전</button><button type="button" data-ctx="duplicate">📋 복제</button><button type="button" data-ctx="delete">🗑 삭제</button></div>
 <p class="propContextTip">이동·확대·회전은 장식을 직접 만져 보세요.</p>`;
 menu.addEventListener('pointerdown',e=>e.stopPropagation());
 menu.addEventListener('click',e=>{
  e.stopPropagation();const btn=e.target.closest('button[data-ctx]');if(!btn)return;
  const action=btn.dataset.ctx,chosen=roseSelected();if(!chosen)return;
  const items=roseItems(studio);
  if(action==='front')chosen.layer='front';
  else if(action==='back')chosen.layer='back';
  else if(action==='bring'){chosen.layer='front';const i=items.indexOf(chosen);if(i>=0){items.splice(i,1);items.push(chosen);}}
  else if(action==='flip')chosen.flip=!chosen.flip;
  else if(action==='duplicate'){const cp={...chosen,id:'rose-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),x:Number(chosen.x)+13,y:Number(chosen.y)+11};items.push(cp);roseActiveId=cp.id;}
  else if(action==='delete'){studio.roseAccessories=items.filter(v=>v.id!==chosen.id);roseActiveId=null;}
  studioRender();
 });
 menu.addEventListener('change',e=>{
  e.stopPropagation();const chosen=roseSelected();if(!chosen||e.target.dataset.ctxSelect!=='shape')return;
  if(!roseAccessorySource(e.target.value))return;
  chosen.name=e.target.value;studioRender();
 });
 frame.appendChild(menu);
 const svg=canvas.querySelector('svg');if(!svg)return;
 const rect=svg.getBoundingClientRect(),fb=frame.getBoundingClientRect();
 const scale=Math.min(rect.width/260,rect.height/310);
 const originX=rect.left-fb.left+(rect.width-260*scale)/2;
 const originY=rect.top-fb.top+(rect.height-310*scale)/2;
 const cx=originX+(Number(it.x)||0)*scale,cy=originY+(Number(it.y)||0)*scale;
 const radius=(47*(Number(it.size)||100)/100*Math.max(Number(it.stretchX)||1,Number(it.stretchY)||1)+17)*scale;
 const w=menu.offsetWidth,h=menu.offsetHeight,fw=frame.clientWidth,fh=frame.clientHeight;
 const right=fw-(cx+radius),left=cx-radius,below=fh-(cy+radius),above=cy-radius;
 let px,py;
 if(right>=w+24){px=cx+radius+22;py=cy-h/2;}
 else if(left>=w+24){px=cx-radius-w-22;py=cy-h/2;}
 else if(below>=h+24){px=cx-w/2;py=cy+radius+22;}
 else if(above>=h+24){px=cx-w/2;py=cy-radius-h-22;}
 else{px=fw/2-w/2;py=fh+12;}
 px=Math.max(2,Math.min(fw-w-2,px));
 if(py<=fh)py=Math.max(0,Math.min(fh-h-2,py));
 menu.style.left=Math.round(px)+'px';menu.style.top=Math.round(py)+'px';
}
function studioRender(){
 if(studio.baseModel==='rose3d'&&studio.roseArtworkId){studio.emotion=roseArtworkFallbackEmotion(studio,studio.emotion);studio.pose='서 있기';}
 document.getElementById('studioCanvas').innerHTML=studioArtSvg();
 document.getElementById('studioPremiumFields').hidden=true;
 document.getElementById('studioModularFields').hidden=studio.baseModel!=='modular';
 document.getElementById('studioRoseFields').hidden=studio.baseModel!=='rose3d';
 if(studio.baseModel==='rose3d'){document.getElementById('studioRoseHairFinish').value=['none','twin','half','flower'].includes(studio.roseHairFinish)?studio.roseHairFinish:'none';document.getElementById('studioRoseHairShape').value=['normal','soft','volume'].includes(studio.roseHairShape)?studio.roseHairShape:'normal';document.getElementById('studioRoseDressShape').value=['normal','slim'].includes(studio.roseDressShape)?studio.roseDressShape:'normal';document.getElementById('studioRoseHair').value=['rose','gold','violet'].includes(studio.hairColor)?studio.hairColor:'rose';document.getElementById('studioRoseDress').value=['pink','blue','mint'].includes(studio.dress)?studio.dress:'pink';document.getElementById('studioRoseHair').disabled=roseBuiltinBobSelected();document.getElementById('studioRoseDress').disabled=roseBuiltinBobSelected();document.getElementById('studioRoseHairShape').disabled=roseBuiltinBobSelected();document.getElementById('studioRoseDressShape').disabled=roseBuiltinBobSelected();}
 const handCheckbox=document.getElementById('roseStableHands');if(handCheckbox){handCheckbox.checked=studio.roseStableHands!==false;handCheckbox.disabled=!!studio.roseArtworkId;}
 studioRenderBodyGalleries();roseArtworkGalleryRender();roseUiSync();roseAttachGestures();renderRosePropContext();
 document.getElementById('studioPremium').classList.toggle('isActive',studio.mode==='premium');
 document.getElementById('studioModular').classList.toggle('isActive',studio.mode==='modular');
 document.getElementById('studioArtHint').textContent=studio.baseModel==='rose3d'?(roseBuiltinBobSelected()?'🌷 단발머리 공주: 완성된 전신 원화 '+roseArtworkAvailableEmotions(studio).length+'장입니다. 다른 표정은 같은 자세로 그린 새 원화가 있어야 추가됩니다.':'🌹 고화질 꽃빛 공주: 얼굴·머리·드레스를 한 장의 고화질 그림으로 표시해 조립 경계가 생기지 않습니다. 장식은 기존 소품 기능에서 추가해요.'):'🎀 기존 도형 조립 공주: 예전 작품을 열 수 있도록 보존합니다.';document.getElementById('studioBaseNote').textContent=studio.baseModel==='rose3d'?'고화질 그림의 품질을 지키기 위해 실제로 그려지지 않은 걷기·점프 자세는 제공하지 않습니다. 움직이는 흉내 대신 완성된 자세 그림을 차례로 추가하겠습니다.':'이전 조립 그림은 기존 저장 작품과 호환되도록 유지됩니다.';studioRenderExpressions();studioRenderPoseButtons();
}
function studioReadControls(){
 const fieldMap={studioBaseModel:'baseModel',studioBackground:'background',studioPremiumHero:'hero',studioHair:'hairStyle',studioHairColor:'hairColor',studioDress:'dress',studioCrown:'crown',studioWings:'wings',studioStaff:'staff',studioShoes:'shoes',studioEmotion:'emotion',studioFace:'face',studioEyes:'eyes'};
 Object.entries(fieldMap).forEach(([id,key])=>{const el=document.getElementById(id);studio[key]=el.value});
 studio.sparkles=document.getElementById('studioSparkle').checked;
 studio.name=studioSafeName();studio.pose=studioEnsurePose(studio.emotion,studio.pose);if(studio.roseArtworkId){studio.emotion=roseArtworkFallbackEmotion(studio,studio.emotion);studio.pose='서 있기';}studioRender();
}
function studioPopulateControls(){
 const fields={studioName:'name',studioBaseModel:'baseModel',studioBackground:'background',studioPremiumHero:'hero',studioHair:'hairStyle',studioHairColor:'hairColor',studioDress:'dress',studioCrown:'crown',studioWings:'wings',studioStaff:'staff',studioShoes:'shoes',studioEmotion:'emotion',studioFace:'face',studioEyes:'eyes'};
 Object.entries(fields).forEach(([id,key])=>{const el=document.getElementById(id);if(el&&(id==='studioName'||Array.from(el.options||[]).some(o=>o.value===studio[key])))el.value=studio[key]});
 document.getElementById('studioSparkle').checked=studio.sparkles!==false&&studio.sparkles!=='no';studioRender();
}
function studioSafeList(){
 try{const val=JSON.parse(localStorage.getItem(STUDIO_STORAGE_KEY)||'[]');return Array.isArray(val)?val.filter(x=>x&&x.recipe&&typeof x.name==='string').slice(0,40):[]}catch(e){return []}
}
function studioWriteList(list){
 try{localStorage.setItem(STUDIO_STORAGE_KEY,JSON.stringify(list.slice(0,40)));return true}catch(e){document.getElementById('studioStatus').textContent='기기 저장 공간을 확인해 주세요. 저장이 완료되지 않았습니다.';return false}
}
function studioSavedView(){
 const area=document.getElementById('studioSaved');area.replaceChildren();const arr=studioSafeList();
 if(!arr.length){const msg=document.createElement('p');msg.className='hint';msg.textContent='아직 만든 공주가 없어요. 공주를 만들고 「내 공주 저장」을 눌러 보세요!';area.appendChild(msg);return;}
 arr.forEach((entry,i)=>{
  const card=document.createElement('div');card.className='studioSavedCard';card.innerHTML=studioArtSvg(false,entry.recipe);
  const name=document.createElement('b');name.textContent=entry.name;card.appendChild(name);const hint=document.createElement('div');hint.className='hint';hint.textContent='표정 '+roseArtworkAvailableEmotions(entry.recipe).length+'종';card.appendChild(hint);
  const btns=document.createElement('div');btns.className='btns';
  const open=document.createElement('button');open.className='secondary';open.textContent='꾸미기';open.onclick=()=>{studio={...studioDefaults,...entry.recipe,mode:'modular'};roseActiveId=null;studioPopulateControls();document.getElementById('studio').scrollIntoView({behavior:'smooth',block:'start'});};
  const remove=document.createElement('button');remove.className='ghost';remove.textContent='삭제';remove.onclick=()=>{if(confirm('「'+entry.name+'」 공주를 보관함에서 삭제할까요?')){const next=studioSafeList();next.splice(i,1);if(studioWriteList(next))studioSavedView();}};
  btns.append(open,remove);card.appendChild(btns);area.appendChild(card);
 });
}
async function studioPngBlob(transparent=false){return svgArtToPng(studioArtSvg(transparent),1040,1240)}
async function studioToComic(){
 const status=document.getElementById('studioStatus');
 const recipe={...studioRecipe(),mode:'modular'};
 settings.hero='custom';settings.custom=null;settings.studioPrincess=true;settings.studioRecipe=recipe;settings.heroName=recipe.name;
 document.getElementById('heroName').value=recipe.name;
 renderCharacterChoices();
 status.textContent=roseBuiltinBobSelected(recipe)?'✅ 단발 공주를 웹툰 주인공으로 준비했어요. 현재 등록된 원화는 '+roseArtworkAvailableEmotions(recipe).length+'종입니다.':'✅ 「'+recipe.name+'」을 웹툰 주인공으로 준비했어요. 컷마다 표정을 다르게 바꿀 수 있어요!';
 switchView('make');toast('「'+recipe.name+'」을 웹툰 주인공으로 준비했어요!');
}

const studioEmotions=['기뻐요','놀랐어요','슬퍼요','화났어요','생각해요','신나요'];
function studioRenderExpressions(){
 const root=document.getElementById('studioExpressions');if(!root)return;
 root.replaceChildren();
 for(const emotion of studioEmotions){
  const button=document.createElement('button');button.type='button';button.className='studioExpressionButton'+(studio.emotion===emotion?' selected':'');button.setAttribute('aria-pressed',String(studio.emotion===emotion));
  if(!roseArtworkAvailableEmotions(studio).includes(emotion)){button.disabled=true;button.title='이 표정은 아직 완성 원화가 등록되지 않았습니다.';}
  const safePose=studioEnsurePose(emotion,studio.pose);
  const art=document.createElement('div');art.innerHTML=studioArtSvg(true,{...studio,emotion,pose:safePose});
  const svg=art.firstElementChild;svg?.removeAttribute('width');svg?.removeAttribute('height');
  // Compact text-only expression choices (the large illustration is above).
  const label=document.createElement('span');label.textContent=emotion;button.appendChild(label);
  button.onclick=()=>{if(button.disabled)return;studio.emotion=emotion;studio.pose=studioEnsurePose(emotion,studio.pose);document.getElementById('studioEmotion').value=emotion;studioRender();};
  root.appendChild(button);
 }
}
function studioRenderPoseButtons(){
 const root=document.getElementById('studioPoseButtons');if(!root)return;
 const hint=document.getElementById('studioPoseHint');
 const allowed=studioAllowedPoses(studio.emotion);
 studio.pose=studioEnsurePose(studio.emotion,studio.pose);
 root.replaceChildren();
 studioPoseCatalog.forEach(item=>{
  const button=document.createElement('button');button.type='button';button.className='studioPoseButton'+(studio.pose===item.id?' selected':'');button.disabled=!allowed.includes(item.id)||(Boolean(studio.roseArtworkId)&&item.id!=='서 있기');button.setAttribute('aria-pressed',String(studio.pose===item.id));
  button.textContent=item.label;
  button.onclick=()=>{if(button.disabled)return;studio.pose=item.id;studioRender();};
  root.appendChild(button);
 });
 if(hint)hint.textContent=roseBuiltinBobSelected()?'단발 공주는 준비된 전체 원화로만 표시합니다. 걷기·뛰기 자세는 아직 제작하지 않았어요.':`${studioEmotionNormalize(studio.emotion)} 표정에서는 ${allowed.join(' · ')} 자세를 고를 수 있어요.`;
}
function studioInit(){
 document.getElementById('roseStableHands')?.addEventListener('change',ev=>{studio.roseStableHands=ev.target.checked;roseActiveId=null;studioRender();});
 document.getElementById('studioRoseHair')?.addEventListener('change',e=>{studio.hairColor=e.target.value;studioRender()});
 document.getElementById('studioRoseDress')?.addEventListener('change',e=>{studio.dress=e.target.value;studioRender()});
 document.getElementById('studioRoseAdd')?.addEventListener('click',()=>roseAdd(document.getElementById('studioRoseAdornment').value));
 document.getElementById('studioLegacyHairClear')?.addEventListener('click',()=>{studio.roseHairFinish='none';roseActiveId=null;studioRender();});
 document.getElementById('studioRoseFront')?.addEventListener('click',()=>{const it=roseSelected();if(it){it.layer='front';studioRender()}});
 document.getElementById('studioRoseBack')?.addEventListener('click',()=>{const it=roseSelected();if(it){it.layer='back';studioRender()}});
 document.getElementById('studioRoseClone')?.addEventListener('click',()=>{const it=roseSelected();if(it){const copy={...it,id:'rose-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),x:it.x+13,y:it.y+12};studio.roseAccessories.push(copy);roseActiveId=copy.id;studioRender()}});
 document.getElementById('studioRoseRemove')?.addEventListener('click',()=>{studio.roseAccessories=roseItems(studio).filter(it=>it.id!==roseActiveId);roseActiveId=null;studioRender()});
 document.getElementById('studioRoseDeselect')?.addEventListener('click',()=>{roseActiveId=null;studioRender()});
 document.getElementById('studioRoseSize')?.addEventListener('input',e=>{const it=roseSelected();if(it){it.size=Number(e.target.value);studioRender()}});
 document.getElementById('studioRoseAngle')?.addEventListener('input',e=>{const it=roseSelected();if(it){it.rotation=Number(e.target.value);studioRender()}});

 document.getElementById('studioPremium').onclick=()=>{studio.mode='modular';studioRender()};
 document.getElementById('studioModular').onclick=()=>{studio.mode='modular';studioRender()};
 STUDIO_FIELDS.forEach(id=>{const el=document.getElementById(id);el?.addEventListener(id==='studioName'?'input':'change',studioReadControls)});
 for(const [id,key,values] of [['studioRoseHairFinish','roseHairFinish',['none','twin','half','flower']],['studioRoseHairShape','roseHairShape',['normal','soft','volume']],['studioRoseDressShape','roseDressShape',['normal','slim']]]){document.getElementById(id)?.addEventListener('change',ev=>{if(!values.includes(ev.target.value))return;studio[key]=ev.target.value;roseActiveId=null;studioRender();});}
 document.getElementById('studioSparkle').addEventListener('change',studioReadControls);
 document.getElementById('studioRandom').onclick=()=>{
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  if(false){}
  else{
   studio.face=pick(['round','oval','heart']);studio.eyes=pick(['jewel','soft','bright']);studio.hairStyle=pick(['long','curl','twintail','bob']);studio.hairColor=pick(Object.keys(princessColors.hair));studio.dress=pick(Object.keys(princessColors.dress));studio.crown=pick(['crown','tiara','bow','flower','none']);studio.wings=pick(['none','butterfly','angel']);studio.staff=pick(['none','star','heart','flower']);studio.shoes=pick(Object.keys(princessColors.shoes));studio.emotion=pick(['기뻐요','놀랐어요','슬퍼요','화났어요','생각해요','신나요']);studio.pose=studioEnsurePose(studio.emotion,pick(studioPoseCatalog.map(v=>v.id)));
  }
  studio.background=pick(Object.keys(studioColors));if(studio.baseModel==='rose3d')studio.emotion=pick(['기뻐요','놀랐어요','슬퍼요','화났어요','생각해요','신나요']);studio.pose=studioEnsurePose(studio.emotion,studio.pose);studioPopulateControls();
 };
 document.getElementById('studioSave').onclick=()=>{
  const entry={id:'studio-'+Date.now(),name:studioSafeName(),recipe:{...studioRecipe(),mode:'modular'},expressionSet:['기뻐요','놀랐어요','슬퍼요','화났어요','생각해요','신나요'],createdAt:Date.now()};
  const arr=studioSafeList();if(arr.length>=40){document.getElementById('studioStatus').textContent='공주 보관함은 최대 40명까지 저장할 수 있어요.';return;}
  arr.unshift(entry);if(studioWriteList(arr)){studioSavedView();document.getElementById('studioStatus').textContent='💖 「'+entry.name+'」을(를) 보관함에 저장했어요!';}
 };
 document.getElementById('studioPhoto').onclick=async()=>{
  try{await shareOrDownloadPng(await studioPngBlob(false),imageSafeName(studioSafeName())+'_공주.png')}
  catch(e){document.getElementById('studioStatus').textContent='사진을 저장할 수 없어요: '+(e.message||e)}
 };
 document.getElementById('studioToComic').onclick=studioToComic;
 studioPopulateControls();
}
// Complete visible studio controls first, but wait for first paint before
// loading the high-resolution saved-art gallery from IndexedDB.

/* C4.5.33.1: independently loaded image bundles. */
const webtoonPackNames=['studio-prop','princess','animal','background'];
const webtoonPackPromises=new Map();
const webtoonResolvedArt=Object.create(null);
const webtoonHydratedGroups=new Set();
function webtoonArtRoots(){return [embeddedCharacters,characterImageUrls,premiumPrincessImages,dedicatedPrincessExpressions,dedicatedFullBodyExpressions,bobStoryArt,richStoryArt,richBackgroundArt,selectableBackgrounds,premiumPropImages,studioRoseExpressionAssets,studioRoseColorAssets];}
function webtoonHydrateArt(){
 for(const group of webtoonPackNames){const pack=window.webtoonArtPacks?.[group];if(pack&&!webtoonHydratedGroups.has(group)){Object.assign(webtoonResolvedArt,pack);webtoonHydratedGroups.add(group);}}
 function update(o){for(const k of Object.keys(o)){const v=o[k];if(typeof v==='string'&&webtoonResolvedArt[v])o[k]=webtoonResolvedArt[v];else if(v&&typeof v==='object')update(v);}}
 webtoonArtRoots().forEach(update);
}
function webtoonLoadPack(name){
 if(window.webtoonArtPacks?.[name])return Promise.resolve();
 if(webtoonPackPromises.has(name))return webtoonPackPromises.get(name);
 const p=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=name+'-art.js?v=45331';s.async=true;s.onload=()=>{if(window.webtoonArtPacks?.[name])resolve();else reject(new Error(name+' 자료가 비어 있습니다.'));};s.onerror=()=>{s.remove();reject(new Error(name+'-art.js를 불러오지 못했습니다.'));};document.head.appendChild(s);});
 webtoonPackPromises.set(name,p);p.catch(()=>webtoonPackPromises.delete(name));return p;
}
async function webtoonEnsureArt(names){await Promise.all(names.map(webtoonLoadPack));webtoonHydrateArt();}
window.webtoonEnsureArt=webtoonEnsureArt;
function webtoonStoryArtReady(){return ['princess','animal','background'].every(name=>webtoonHydratedGroups.has(name));}
let webtoonNavTicket=0;
function webtoonNavNotice(text){const el=document.getElementById('webtoonLoadingNotice');if(el){el.textContent=text||'';el.hidden=!text;}}

webtoonHydrateArt();
studioInit();
let roseArtInitStarted=false,roseArtInitTimer=null;
function scheduleRoseArtInit(){
 if(roseArtInitStarted||roseArtInitTimer!==null)return;
 roseArtInitTimer=setTimeout(()=>{
  roseArtInitTimer=null;
  if(!document.getElementById('studio')?.classList.contains('active')||document.hidden)return;
  roseArtInitStarted=true;
  roseArtworkInit().catch(e=>console.warn('원화 로딩',e));
 },1000);
}
document.addEventListener('webtoon:viewchange',ev=>{if(ev.detail?.id==='studio')scheduleRoseArtInit()});
scheduleRoseArtInit();
setTimeout(()=>{if(document.getElementById('studio')?.classList.contains('active'))studioSavedView()},2200);
document.addEventListener('webtoon:viewchange',ev=>{if(ev.detail?.id==='studio')studioSavedView()});

// Show real preview thumbnails in the child-friendly premium prop gallery.
for(const b of document.querySelectorAll('[data-premium-prop]')){
 const picture=premiumPropImages[b.dataset.premiumProp];
 if(!picture)continue;
 const thumbnail=document.createElement('img');
 thumbnail.src=picture;thumbnail.alt='';thumbnail.loading='lazy';
 thumbnail.style.cssText='width:35px;height:35px;object-fit:contain;vertical-align:middle;margin-right:5px;';
 b.prepend(thumbnail);
}
// After the first screen is ready, verify the published version without blocking editing.
setTimeout(()=>checkWebtoonVersion(true,false),1800);
