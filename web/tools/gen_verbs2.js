const CHO="ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ",JUNG="ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
const JONG=["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const dec=c=>{const n=c.charCodeAt(0)-0xAC00;return [Math.floor(n/588),Math.floor(n%588/28),n%28]};
const com=(l,v,t)=>String.fromCharCode(0xAC00+l*588+v*28+t);
const setT=(s,t)=>{const [l,v]=dec(s.slice(-1));return s.slice(0,-1)+com(l,v,JONG.indexOf(t))};
// [dict, class, english, ask the 줄 알다 form?]
const V=[["치다","reg","to play (tennis, guitar, piano)",1],["타다","reg","to ride",1],["읽다","reg","to read",1],["찍다","reg","to take (a photo), shoot (a video)",1],["쓰다","으","to write",1],["부르다","르","to sing",1],["그리다","reg","to draw, paint",1],["추다","reg","to dance (a dance)",1],["끓이다","reg","to boil, cook (soup, noodles)",1],["고치다","reg","to fix, repair",1],["올리다","reg","to upload, post",1],
["운전하다","하다","to drive",1],["수영하다","하다","to swim",1],["요리하다","하다","to cook",1],
["먹다","reg","to eat",0],["자다","reg","to sleep",0],["쉬다","reg","to rest",0],["마시다","reg","to drink",0],["보다","reg","to watch",0],["웃다","reg","to laugh",0],["끝나다","reg","to end, be over",0],["흘리다","reg","to shed (sweat)",0],["지나다","reg","to pass (time)",0],["뛰다","reg","to run",0],["끄다","으","to switch off",0],["배우다","reg","to learn",0],["운동하다","하다","to exercise",0],
["걷다","ㄷ","to walk",1],["듣다","ㄷ","to listen",0],["만들다","ㄹ","to make",1],["놀다","ㄹ","to play, have fun",0],["돕다","ㅂ","to help",1],["짓다","ㅅ","to build; to cook (rice)",1]];
const out=V.map(([d,cls,en,askJ])=>{const S=d.slice(0,-1);const [l,v,t]=dec(S.slice(-1));let jl,jw,gn=S+"고 나면",gw;
 const ao=(JUNG[v]==="ㅏ"||JUNG[v]==="ㅗ")?"아":"어";
 if(cls==="ㄷ"){const R=setT(S,"ㄹ");jl=R+"을 줄";jw=[S+"을 줄",R+" 줄",R+"을 쭐"];gw=[R+"고 나면",R+"으고 나면",S+"으고 나면"];}
 else if(cls==="ㅅ"){const R=setT(S,"");jl=R+"을 줄";jw=[S+"을 줄",setT(R,"ㄹ")+" 줄",R+"을 쭐"];gw=[R+"고 나면",R+"으고 나면",S+"으고 나면"];}
 else if(cls==="ㅂ"){const R=setT(S,"");jl=R+"울 줄";jw=[S+"을 줄",S+" 줄",R+"울 쭐"];gw=[R+"우고 나면",R+"고 나면",S+"으고 나면"];}
 else if(cls==="ㄹ"){const R=setT(S,"");jl=S+" 줄";jw=[S+"을 줄",R+"을 줄",S+" 쭐"];gw=[R+"고 나면",S+"으고 나면",S+"고 나으면"];}
 else if(t!==0){jl=S+"을 줄";jw=[S+" 줄",S+"으 줄",S+"을 쭐"];gw=[S+"으고 나면",S+ao+"고 나면",S+"고 나으면"];}
 else{const R=setT(S,"ㄹ");jl=R+" 줄";jw=[S+"을 줄",R+"을 줄",R+" 쭐"];gw=[R+"고 나면",S+"으고 나면",S+"고 나으면"];}
 return {d,cls,en,jl:askJ?jl:null,jw:askJ?jw:null,gn,gw};});
require('fs').writeFileSync('src/verbs_ch2.js','// Pre-generated once and checked by hand. jl = -을/-ㄹ 줄 (알다) form, jw = wrong forms (null = not asked),\n// gn = -고 나면 form, gw = wrong forms\nconst VERBS_CH2 = [\n'+out.map(o=>'  '+JSON.stringify(o)).join(',\n')+'\n];\n');
out.forEach(o=>console.log(o.d,o.cls,'|',o.jl,'✗',(o.jw||[]).join(' , '),'|',o.gn,'✗',o.gw.join(' , ')));
