const JONG=["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const dec=c=>{const n=c.charCodeAt(0)-0xAC00;return [Math.floor(n/588),Math.floor(n%588/28),n%28]};
const com=(l,v,t)=>String.fromCharCode(0xAC00+l*588+v*28+t);
const setT=(s,t)=>{const [l,v]=dec(s.slice(-1));return s.slice(0,-1)+com(l,v,JONG.indexOf(t))};
// [dict, class, english, command (by hand), two wrong commands (by hand), wrong -자 for irregulars (by hand)]
const V=[["가다","reg","to go","가라",["가아라","가어라"]],["오다","reg","to come","와라",["오어라","와아라"]],["보다","reg","to look","봐라",["보어라","봐아라"]],
["먹다","reg","to eat","먹어라",["먹아라","먹라"]],["읽다","reg","to read","읽어라",["읽아라","읽라"]],["닦다","reg","to wipe, clean","닦아라",["닦어라","닦라"]],["앉다","reg","to sit","앉아라",["앉어라","앉라"]],["박다","reg","to hammer in","박아라",["박어라","박라"]],["뚫다","reg","to unblock","뚫어라",["뚫아라","뚫라"]],["깎다","reg","to mow, cut","깎아라",["깎어라","깎라"]],
["돌리다","reg","to run (a machine)","돌려라",["돌리아라","돌리라"]],["치우다","reg","to clear away","치워라",["치우아라","치우라"]],["차리다","reg","to set (the table)","차려라",["차리아라","차리라"]],["고치다","reg","to fix","고쳐라",["고치아라","고치라"]],["버리다","reg","to throw away","버려라",["버리아라","버리라"]],["꾸미다","reg","to decorate","꾸며라",["꾸미아라","꾸미라"]],["주다","reg","to give","줘라",["주아라","주라"]],["쉬다","reg","to rest","쉬어라",["쉬아라","쉬라"]],
["정리하다","하다","to tidy","정리해라",["정리하아라","정리해어라"]],["청소하다","하다","to clean","청소해라",["청소하아라","청소해어라"]],["수리하다","하다","to repair","수리해라",["수리하아라","수리해어라"]],
["쓰다","으","to write, use","써라",["쓰어라","쓰라"]],
["널다","ㄹ","to hang out (washing)","널어라",["널아라","너라"]],["털다","ㄹ","to dust off","털어라",["털아라","터라"]],["달다","ㄹ","to hang, put up","달아라",["달어라","다라"]],["갈다","ㄹ","to change, replace","갈아라",["갈어라","갈라"]],["만들다","ㄹ","to make","만들어라",["만들아라","만드라"]],["열다","ㄹ","to open","열어라",["열아라","여라"]],
["걷다","ㄷ","to walk","걸어라",["걷어라","걸라"],["걸자","걸으자"]],["듣다","ㄷ","to listen","들어라",["듣어라","들라"],["들자","들으자"]],
["걷다","reg","to take in (washing), draw back (curtains)","걷어라",["걸어라","걷라"],["걸자","걷으자"]],
["돕다","ㅂ","to help","도와라",["돕아라","도워라"],["도우자","도와자"]],
["부르다","르","to call, sing","불러라",["부르어라","부러라"],["불르자","불러자"]],["고르다","르","to choose","골라라",["고르아라","고라라"],["골르자","골라자"]]];
const out=V.map(([d,cls,en,cm,bad,jb])=>{const S=d.slice(0,-1);const [l,v,t]=dec(S.slice(-1));const ja=S+"자";let jw;
 if(jb) jw=jb; else if(cls==="ㄹ") jw=[setT(S,"")+"자",S+"으자"]; else if(t!==0) jw=[S+"으자",cm.slice(0,-1)+"자"]; else jw=[setT(S,"ㄹ")+"자",S+"으자"];
 const o={d,cls,en,cm,cw:[...bad,cm+"요"],ja,jaw:[...jw,ja+"요"]};
 if(d==="걷다"&&cls==="reg") o.why={cm:"걷다 ‘to take in, to draw back’ is regular: 걷어라. Only 걷다 ‘to walk’ changes to 걸어라.",ja:"-자 goes straight onto the stem: 걷자."};
 return o;});
require('fs').writeFileSync('src/verbs_ch4.js','// Checked by hand. cm = command (-아라/-어라/-여라), cw = wrong forms; ja = -자, jaw = wrong forms\nconst VERBS_CH4 = [\n'+out.map(o=>'  '+JSON.stringify(o)).join(',\n')+'\n];\n');
out.forEach(o=>console.log(o.d,o.cls,'|',o.cm,'✗',o.cw.join(' , '),'|',o.ja,'✗',o.jaw.join(' , ')));
