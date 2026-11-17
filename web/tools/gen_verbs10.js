// [dict, class, english, -을/-ㄹ form, wrong forms before 뻔하다, wrong forms before 때마다] — every form written by hand
const C=(s,past)=>[s+"을",[s+"는",s+"은",past+"을"],[s+"는",s+"은",s+"으는"]];
const W=(s,l,n,past)=>[l,[s+"는",n,past+"을"],[s+"는",n,s+"을"]];   // vowel stem: ㄹ form, ㄴ form, past stem
const V=[
["쏟다","reg","to spill",...C("쏟","쏟았")],["잊다","reg","to forget",...C("잊","잊었")],["늦다","reg","to be late",...C("늦","늦었")],["죽다","reg","to die",...C("죽","죽었")],["먹다","reg","to eat",...C("먹","먹었")],["앉다","reg","to sit",...C("앉","앉았")],
["웃다","reg","to laugh","웃을",["우을","웃는","웃은"],["우을","웃는","웃은"]],
["넘어지다","reg","to fall over",...W("넘어지","넘어질","넘어진","넘어졌")],["놓치다","reg","to miss (a bus, a chance)",...W("놓치","놓칠","놓친","놓쳤")],["마시다","reg","to drink",...W("마시","마실","마신","마셨")],["다치다","reg","to get hurt",...W("다치","다칠","다친","다쳤")],["잊어버리다","reg","to forget completely",...W("잊어버리","잊어버릴","잊어버린","잊어버렸")],["잃어버리다","reg","to lose (a thing)",...W("잃어버리","잃어버릴","잃어버린","잃어버렸")],["헤어지다","reg","to part, to break up",...W("헤어지","헤어질","헤어진","헤어졌")],["싸우다","reg","to quarrel",...W("싸우","싸울","싸운","싸웠")],["미끄러지다","reg","to slip",...W("미끄러지","미끄러질","미끄러진","미끄러졌")],["떨어지다","reg","to fall, to drop",...W("떨어지","떨어질","떨어진","떨어졌")],["만나다","reg","to meet",...W("만나","만날","만난","만났")],["보다","reg","to see",...W("보","볼","본","봤")],["오다","reg","to come",...W("오","올","온","왔")],["타다","reg","to ride, take",...W("타","탈","탄","탔")],
["지각하다","하다","to be late (for work, school)",...W("지각하","지각할","지각한","지각했")],["실수하다","하다","to make a mistake",...W("실수하","실수할","실수한","실수했")],["인사하다","하다","to greet",...W("인사하","인사할","인사한","인사했")],
["졸다","ㄹ","to doze off","졸",["졸을","존","조는"],["졸을","존","조는"]],["울다","ㄹ","to cry","울",["울을","운","우는"],["울을","운","우는"]],["놀다","ㄹ","to play, hang out","놀",["놀을","논","노는"],["놀을","논","노는"]],
["듣다","ㄷ","to listen, hear","들을",["듣을","듣는","들은"],["듣을","듣는","들은"]],["걷다","ㄷ","to walk","걸을",["걷을","걷는","걸은"],["걷을","걷는","걸은"]],
["짓다","ㅅ","to build; to give (a name)","지을",["짓을","짓는","지은"],["짓을","짓는","지은"]],
["줍다","ㅂ","to pick up","주울",["줍을","주을","주운"],["줍을","주을","주운"]],["돕다","ㅂ","to help","도울",["돕을","도을","도운"],["돕을","도을","도운"]],
["모르다","르","not to know","모를",["몰를","모르을","모른"],["몰를","모르을","모른"]],["부르다","르","to sing, call","부를",["불를","부르을","부른"],["불를","부르을","부른"]]];
const out=V.map(([d,cls,en,pp,ppw,tmw])=>({d,cls,en,pp,ppw,tm:pp,tmw}));
require('fs').writeFileSync('src/verbs_ch10.js','// Checked by hand. pp = -을/-ㄹ form before 뻔하다, ppw = wrong forms; tm = the same form before 때마다, tmw = wrong forms\nconst VERBS_CH10 = [\n'+out.map(o=>'  '+JSON.stringify(o)).join(',\n')+'\n];\n');
console.log(out.length, out.every(o=>new Set([o.pp,...o.ppw]).size===4&&new Set([o.tm,...o.tmw]).size===4));
out.forEach(o=>console.log(o.d,o.pp,o.ppw.join(' '),'|',o.tmw.join(' ')));
