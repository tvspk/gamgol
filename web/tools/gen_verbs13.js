// [dict, class, english, kind (v/a), modifier before 편이다, 3 wrong, 3 wrong -더라고요 forms] — every form written by hand
const D=a=>a.map(x=>x+"더라고요");
const V=[
["먹다","reg","to eat","v","먹는",["먹으는","먹느는","먹을"],D(["먹으","먹어","먹는"])],
["읽다","reg","to read","v","읽는",["읽으는","읽느는","읽을"],D(["읽으","읽어","읽는"])],
["입다","reg","to wear","v","입는",["입으는","이우는","입을"],D(["입으","입어","이우"])],
["받다","reg","to receive","v","받는",["받으는","받느는","받을"],D(["받으","받아","받는"])],
["가다","reg","to go","v","가는",["가으는","가느는","갈"],D(["가아","간","갈"])],
["오다","reg","to come","v","오는",["오으는","오느는","올"],D(["와","온","올"])],
["보다","reg","to see, watch","v","보는",["보으는","보느는","볼"],D(["봐","본","볼"])],
["사다","reg","to buy","v","사는",["사으는","사느는","살"],D(["사아","산","살"])],
["마시다","reg","to drink","v","마시는",["마시으는","마시느는","마실"],D(["마셔","마신","마실"])],
["쓰다","으","to spend, use","v","쓰는",["쓰으는","쓰느는","쓸"],D(["써","쓴","쓸"])],
["자르다","르","to cut","v","자르는",["잘르는","자르으는","자를"],D(["잘르","잘라","자를"])],
["저금하다","하다","to save (money in the bank)","v","저금하는",["저금하으는","저금하느는","저금할"],D(["저금해","저금한","저금할"])],
["절약하다","하다","to economise","v","절약하는",["절약하으는","절약하느는","절약할"],D(["절약해","절약한","절약할"])],
["운동하다","하다","to exercise","v","운동하는",["운동하으는","운동하느는","운동할"],D(["운동해","운동한","운동할"])],
["걷다","ㄷ","to walk","v","걷는",["걸는","걸으는","걷으는"],D(["걸으","걸어","걷으"])],
["듣다","ㄷ","to listen, hear","v","듣는",["들는","들으는","듣으는"],D(["들으","들어","듣으"])],
["돕다","ㅂ","to help","v","돕는",["도우는","돕으는","도울"],D(["도우","도와","돕으"])],
["만들다","ㄹ","to make","v","만드는",["만들는","만들으는","만들"],D(["만드","만들으","만들어"])],
["살다","ㄹ","to live","v","사는",["살는","살으는","살"],D(["살으","살아","사는"])],
["놀다","ㄹ","to play, hang out","v","노는",["놀는","놀으는","놀"],D(["노","놀으","놀아"])],
["많다","reg","to be many","a","많은",["많는","많으는","많을"],D(["많으","많아","많은"])],
["적다","reg","to be few","a","적은",["적는","적으는","적을"],D(["적으","적어","적은"])],
["좋다","reg","to be good","a","좋은",["좋는","좋으는","좋을"],D(["좋으","좋아","좋은"])],
["작다","reg","to be small","a","작은",["작는","작으는","작을"],D(["작으","작아","작은"])],
["비싸다","reg","to be expensive","a","비싼",["비싸는","비싸은","비쌀"],D(["비싸아","비싼","비쌀"])],
["싸다","reg","to be cheap","a","싼",["싸으는","싸은","쌀"],D(["싸아","싼","쌀"])],
["바쁘다","으","to be busy","a","바쁜",["바쁘는","바쁘은","바쁠"],D(["바빠","바쁜","바쁠"])],
["부족하다","하다","to be short, insufficient","a","부족한",["부족하는","부족하은","부족할"],D(["부족해","부족한","부족할"])],
["조용하다","하다","to be quiet","a","조용한",["조용하는","조용하은","조용할"],D(["조용해","조용한","조용할"])],
["재미있다","reg","to be fun, interesting","x","재미있는",["재미있은","재미있으는","재미있을"],D(["재미있으","재미있어","재미있은"])],
["맛없다","reg","to taste bad","x","맛없는",["맛없은","맛없으는","맛없을"],D(["맛없으","맛없어","맛없은"])],
["길다","ㄹ","to be long","a","긴",["길은","길는","길으는"],D(["길으","길어","긴"])],
["멀다","ㄹ","to be far","a","먼",["멀은","멀는","머는"],D(["머","멀으","멀어"])],
["맵다","ㅂ","to be spicy","a","매운",["맵은","맵는","매은"],D(["매우","매워","맵으"])],
["춥다","ㅂ","to be cold","a","추운",["춥은","춥는","추은"],D(["추우","추워","춥으"])],
["어렵다","ㅂ","to be difficult","a","어려운",["어렵은","어렵는","어려은"],D(["어려우","어려워","어렵으"])],
["빨갛다","ㅎ","to be red","a","빨간",["빨갛은","빨갛는","빨가은"],D(["빨가","빨개","빨간"])]];
const cons=d=>(d.charCodeAt(d.length-2)-0xAC00)%28!==0;
const out=V.map(([d,cls,en,kind,py,pyw,drw])=>{const a=py+" 편이에요", dr=d.slice(0,-1)+"더라고요";
  const wp= kind==="x" ? d+" ends in 있다 or 없다, which take -는 like a verb: "+a+"."
    : kind==="v" ? (cls==="ㄹ" ? d+" is a verb with a ㄹ stem: the ㄹ drops before -는, giving "+a+"." : cls==="ㄷ"||cls==="ㅂ" ? d+" is a verb, and -는 begins with a consonant, so the stem does not change: "+a+"." : d+" is a verb, so -는: "+a+".")
    : cls==="ㅂ" ? d+" is an adjective and ㅂ irregular: ㅂ becomes 우, then -ㄴ, giving "+a+"."
    : cls==="ㄹ" ? d+" is an adjective with a ㄹ stem: the ㄹ drops and -ㄴ goes on, giving "+a+"."
    : cls==="ㅎ" ? d+" is an adjective and ㅎ irregular: ㅎ drops and -ㄴ goes on, giving "+a+"."
    : cons(d) ? d+" is an adjective ending in a consonant, so -은: "+a+"." : d+" is an adjective ending in a vowel, so -ㄴ: "+a+".";
  return {d,cls,en,py,pyw,dr,drw,why:{py:wp,dr:"-더라고요 goes straight onto the stem, and the stem never changes: "+dr+"."}};});
require('fs').writeFileSync('src/verbs_ch13.js','// Checked by hand. py = modifier before 편이다 (-는 for verbs, -은/-ㄴ for adjectives), pyw = wrong forms; dr = -더라고요 form, drw = wrong forms\nconst VERBS_CH13 = [\n'+out.map(o=>'  '+JSON.stringify(o)).join(',\n')+'\n];\n');
console.log(out.length, out.every(o=>new Set([o.py,...o.pyw]).size===4&&new Set([o.dr,...o.drw]).size===4));
out.forEach(o=>console.log(o.d,'|',o.py,o.pyw.join(' '),'|',o.dr,o.drw.map(x=>x.replace("더라고요","~")).join(' ')));
