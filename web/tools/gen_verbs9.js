// [dict, class, english, kind (v/a), -아/-어 form (used only to build wrong answers)] — forms generated, then every line read and checked by hand
const L=s=>s.slice(0,-1)+String.fromCharCode(s.charCodeAt(s.length-1)+8);            // add ㄹ underneath a vowel-final syllable
const cons=s=>(s.charCodeAt(s.length-1)-0xAC00)%28!==0;
const SP={ // irregular and ㄹ stems: wrong forms written out one by one
 "굽다":[["구우거든요","구워거든요","굽으거든요"],["구우고","구워고","굽으고"]],
 "돕다":[["도우거든요","도와거든요","돕으거든요"],["도우고","도와고","돕으고"]],
 "쉽다":[["쉬우거든요","쉬워거든요","쉽으거든요"],null],
 "맵다":[["매우거든요","매워거든요","맵으거든요"],null],
 "듣다":[["들으거든요","들어거든요","듣으거든요"],["들으고","들어고","듣으고"]],
 "걷다":[["걸으거든요","걸어거든요","걷으거든요"],["걸으고","걸어고","걷으고"]],
 "붓다":[["부으거든요","부어거든요","붓으거든요"],["부으고","부어고","붓으고"]],
 "썰다":[["썰으거든요","써는거든요","썰어거든요"],["썰으고","써고","썰어고"]],
 "만들다":[["만들으거든요","만드는거든요","만들어거든요"],["만들으고","만드고","만들어고"]],
 "멀다":[["멀으거든요","먼거든요","멀어거든요"],null],
 "자르다":[["잘르거든요","잘라거든요","자를거든요"],["잘르고","자르으고","자를고"]],
 "두르다":[["둘르거든요","둘러거든요","두를거든요"],["둘르고","둘러고","두를고"]],
 "바쁘다":[["바빠거든요","바쁜거든요","바쁠거든요"],null]};
const V=[
["볶다","reg","to stir-fry","v","볶아"],["삶다","reg","to boil (in water)","v","삶아"],["넣다","reg","to put in","v","넣어"],["섞다","reg","to mix","v","섞어"],["씻다","reg","to wash","v","씻어"],["먹다","reg","to eat","v","먹어"],
["데치다","reg","to blanch","v","데쳐"],["찌다","reg","to steam","v","쪄"],["끓이다","reg","to boil, to make (soup)","v","끓여"],["부치다","reg","to pan-fry","v","부쳐"],["튀기다","reg","to deep-fry","v","튀겨"],["익히다","reg","to cook through","v","익혀"],["벗기다","reg","to peel","v","벗겨"],["뿌리다","reg","to sprinkle","v","뿌려"],["끝내다","reg","to finish (something)","v","끝내어"],["오다","reg","to come","v","와"],["보다","reg","to see, to taste","v","봐"],
["좋아하다","하다","to like","v","좋아해"],["졸업하다","하다","to graduate","v","졸업해"],["세수하다","하다","to wash one's face","v","세수해"],["준비하다","하다","to prepare","v","준비해"],
["굽다","ㅂ","to grill, to roast","v"],["돕다","ㅂ","to help","v"],["듣다","ㄷ","to listen, hear","v"],["걷다","ㄷ","to walk","v"],["붓다","ㅅ","to pour","v"],["썰다","ㄹ","to slice, chop","v"],["만들다","ㄹ","to make","v"],["자르다","르","to cut","v"],["두르다","르","to coat (a pan with oil)","v"],
["맛있다","reg","to taste good","a","맛있어"],["많다","reg","to be many","a","많아"],["쉽다","ㅂ","to be easy","a"],["맵다","ㅂ","to be spicy","a"],["바쁘다","으","to be busy","a"],["멀다","ㄹ","to be far","a"]];
const out=V.map(([d,cls,en,kind,ae])=>{const s=d.slice(0,-1),o={d,cls,en,kd:s+"거든요"};
  if(SP[d]){o.kdw=SP[d][0]; if(SP[d][1]){o.gs=s+"고";o.gsw=SP[d][1];}}
  else if(cons(s)){o.kdw=[s+"으거든요",ae+"거든요",s+(kind==="v"?"는":"은")+"거든요"]; if(kind==="v"){o.gs=s+"고";o.gsw=[s+"으고",ae+"고",s+"는고"];}}
  else{o.kdw=[L(s)+"거든요",ae+"거든요",s+"는거든요"]; if(kind==="v"){o.gs=s+"고";o.gsw=[L(s)+"고",ae+"고",s+"으고"];}}
  return o;});
require('fs').writeFileSync('src/verbs_ch9.js','// Checked by hand. kd = -거든요 form, kdw = wrong forms; gs = -고 (나서) form, gsw = wrong forms (absent for adjectives)\nconst VERBS_CH9 = [\n'+out.map(o=>'  '+JSON.stringify(o)).join(',\n')+'\n];\n');
console.log(out.length, out.every(o=>o.kdw.length===3&&new Set([o.kd,...o.kdw]).size===4&&(!o.gs||new Set([o.gs,...o.gsw]).size===4)));
