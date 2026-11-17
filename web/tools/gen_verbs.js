const CHO="ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ",JUNG="ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const JONG=["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const dec=c=>{const n=c.charCodeAt(0)-0xAC00;return [Math.floor(n/588),Math.floor(n%588/28),n%28]};
const com=(l,v,t)=>String.fromCharCode(0xAC00+l*588+v*28+t);
const setT=(s,t)=>{const [l,v]=dec(s.slice(-1));return s.slice(0,-1)+com(l,v,JONG.indexOf(t))};
// [dict, class, english, volitional]
const V=[["먹다","reg","to eat",1],["읽다","reg","to read",1],["웃다","reg","to smile, laugh",0],["찾다","reg","to look for",1],["받다","reg","to receive",1],["얻다","reg","to obtain",0],["찍다","reg","to take (a photo)",1],["닦다","reg","to wipe",1],
["보다","reg","to watch",1],["가다","reg","to go",1],["자다","reg","to sleep",1],["마시다","reg","to drink",1],["배우다","reg","to learn",1],["쉬다","reg","to rest",1],["타다","reg","to ride",1],["따다","reg","to get (a licence, medal)",1],["옮기다","reg","to move, transfer",1],["다니다","reg","to attend",1],["지내다","reg","to spend one's days",1],["부르다","르","to sing, call",1],["치다","reg","to play (piano)",1],["키우다","reg","to raise",1],["그만두다","reg","to quit",1],
["쓰다","으","to write, use",1],["모으다","으","to save up, gather",1],
["일하다","하다","to work",1],["공부하다","하다","to study",1],["운동하다","하다","to exercise",1],["등록하다","하다","to sign up",1],["이사하다","하다","to move house",1],
["듣다","ㄷ","to listen",1],["걷다","ㄷ","to walk",1],
["살다","ㄹ","to live",1],["만들다","ㄹ","to make",1],["놀다","ㄹ","to play, hang out",1],["울다","ㄹ","to cry",0],["열다","ㄹ","to open",1],
["짓다","ㅅ","to build",1]];
const out=V.map(([d,cls,en,vol])=>{const S=d.slice(0,-1);const [l,v,t]=dec(S.slice(-1));let ms,mw,lk,lw;
 if(cls==="ㄷ"){const R=setT(S,"ㄹ");ms=R+"으면서";mw=[S+"으면서",S+"면서",R+"면서"];lk=R+"을까";lw=[S+"을까",R+"까",S+"까"];}
 else if(cls==="ㅅ"){const R=setT(S,"");ms=R+"으면서";mw=[S+"으면서",S+"면서",R+"면서"];lk=R+"을까";lw=[S+"을까",setT(R,"ㄹ")+"까",S+"까"];}
 else if(cls==="ㄹ"){const R=setT(S,"");ms=S+"면서";mw=[S+"으면서",R+"면서",S+"을면서"];lk=S+"까";lw=[S+"을까",R+"을까",S+"으까"];}
 else if(t!==0){const ao=(JUNG[v]==="ㅏ"||JUNG[v]==="ㅗ")?"아":"어";ms=S+"으면서";mw=[S+"면서",S+ao+"면서",S+"을면서"];lk=S+"을까";lw=[S+"까",S+"으까",S+"을가"];}
 else{const R=setT(S,"ㄹ");ms=S+"면서";mw=[S+"으면서",R+"면서",R+"으면서"];lk=R+"까";lw=[S+"을까",R+"을까",S+"까"];}
 return {d,cls,en,ms,mw,lk:vol?lk:null,lw:vol?lw:null};});
require('fs').writeFileSync('src/verbs_ch1.js','// Pre-generated once and checked by hand. d=dictionary form, cls=conjugation class,\n// ms=-으면서/-면서 form, mw=wrong forms, lk=-을까/-ㄹ까 form, lw=wrong forms (null = not asked)\nconst VERBS_CH1 = [\n'+out.map(o=>'  '+JSON.stringify(o)).join(',\n')+'\n];\n');
out.forEach(o=>console.log(o.d,o.cls,'|',o.ms,'✗',o.mw.join(' '),'|',o.lk,'✗',(o.lw||[]).join(' ')));
