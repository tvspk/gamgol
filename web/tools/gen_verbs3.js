const CHO="ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ",JUNG="ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const JONG=["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const dec=c=>{const n=c.charCodeAt(0)-0xAC00;return [Math.floor(n/588),Math.floor(n%588/28),n%28]};
const com=(l,v,t)=>String.fromCharCode(0xAC00+l*588+v*28+t);
const setT=(s,t)=>{const [l,v]=dec(s.slice(-1));return s.slice(0,-1)+com(l,v,JONG.indexOf(t))};
// [dict, class, english, 반말 form (written by hand), a wrong 반말 form (by hand), ask -을래/-ㄹ래?]
const V=[["사다","reg","to buy","사","사아",1],["가다","reg","to go","가","가아",1],["오다","reg","to come","와","오어",1],["보다","reg","to see, watch","봐","보어",1],["만나다","reg","to meet","만나","만나아",1],["앉다","reg","to sit","앉아","앉어",1],["먹다","reg","to eat","먹어","먹아",1],["읽다","reg","to read","읽어","읽아",1],["배우다","reg","to learn","배워","배우아",1],["기다리다","reg","to wait","기다려","기다리아",1],["마시다","reg","to drink","마셔","마시아",1],["바꾸다","reg","to change","바꿔","바꾸아",1],["미루다","reg","to put off","미뤄","미루아",1],["당기다","reg","to move earlier","당겨","당기아",1],["늦추다","reg","to make later","늦춰","늦추아",1],["옮기다","reg","to move (to another place)","옮겨","옮기아",1],["놓치다","reg","to miss (a bus)","놓쳐","놓치아",0],["잡다","reg","to catch; to make (an appointment)","잡아","잡어",1],["늦다","reg","to be late","늦어","늦아",0],["좋다","reg","to be good","좋아","좋어",0],["괜찮다","reg","to be fine","괜찮아","괜찮어",0],["되다","reg","to become; to be OK","돼","되아",0],
["정하다","하다","to decide","정해","정하아",1],["약속하다","하다","to promise","약속해","약속하아",1],["취소하다","하다","to cancel","취소해","취소하아",1],["전화하다","하다","to phone","전화해","전화하아",1],["피곤하다","하다","to be tired","피곤해","피곤하아",0],
["쓰다","으","to write, use","써","쓰어",1],["바쁘다","으","to be busy","바빠","바쁘어",0],
["묻다","ㄷ","to ask","물어","묻어",0],["듣다","ㄷ","to listen","들어","듣어",1],["걷다","ㄷ","to walk","걸어","걷어",1],
["돕다","ㅂ","to help","도와","돕아",1],["덥다","ㅂ","to be hot","더워","덥어",0],["맵다","ㅂ","to be spicy","매워","맵어",0],["춥다","ㅂ","to be cold","추워","춥어",0],
["만들다","ㄹ","to make","만들어","만들아",1],["놀다","ㄹ","to play, hang out","놀아","놀어",1]];
const out=V.map(([d,cls,en,bm,bad,vol])=>{const S=d.slice(0,-1);const [l,v,t]=dec(S.slice(-1));let br,brw;
 if(cls==="ㄷ"){const R=setT(S,"ㄹ");br=R+"을래";brw=[S+"을래",R+"래",R+"을레"];}
 else if(cls==="ㅂ"){const R=setT(S,"");br=R+"울래";brw=[S+"을래",S+"래",R+"울레"];}
 else if(cls==="ㄹ"){const R=setT(S,"");br=S+"래";brw=[S+"을래",R+"을래",S+"레"];}
 else if(t!==0){br=S+"을래";brw=[S+"래",S+"으래",S+"을레"];}
 else{const R=setT(S,"ㄹ");br=R+"래";brw=[S+"을래",R+"을래",R+"레"];}
 return {d,cls,en,bm,bw:[bm+"요",bad,bad+"요"],br:vol?br:null,brw:vol?brw:null};});
require('fs').writeFileSync('src/verbs_ch3.js','// Checked by hand. bm = 반말 (-아/-어/-여), written out one by one; bw = the polite form and a wrong form;\n// br = -을래/-ㄹ래 form, brw = wrong forms (null = not asked)\nconst VERBS_CH3 = [\n'+out.map(o=>'  '+JSON.stringify(o)).join(',\n')+'\n];\n');
out.forEach(o=>console.log(o.d,o.cls,'|',o.bm,'✗',o.bw.join(' , '),'|',o.br,'✗',(o.brw||[]).join(' , ')));
