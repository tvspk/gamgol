import asyncio, json, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width':1280,'height':900})
        errs=[]
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
        await pg.goto('file://'+__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__file__),'..','test.html'))); await pg.wait_for_timeout(600)
        r = await pg.evaluate('''()=>{const G=__game,C=G.C,out={bad:[],vf:[]};for(const ch of C.chapters.concat(C.finale?[C.finale]:[])){
          const chk=(q,src)=>{const o=q.opts; if(!o||o.length<4||o.some(x=>!x||!String(x).trim())||new Set(o).size!==o.length) out.bad.push(src+' '+JSON.stringify(q.opts)+' '+q.ask)};
          for(let i=0;i<4000;i++){chk(G.genSpeed(ch),'speed')}
          ch.vocab.forEach(w=>{['m','r'].forEach(d=>{for(let i=0;i<30;i++)chk(G.genVocab(ch,d,w),'voc')})});
          ch.colloc.forEach(c=>chk(G.genColloc(ch,c),'col'));
          // all generated verb forms must be in the checked table
          
          ch.vocab.forEach((w,i)=>{const t=G.wordTypes(ch,i); if(w.f){const h=[G.headForms(ch,w,0),G.headForms(ch,w,1)]; out.vf.push(w.ko+' | '+w.f.join(' , ')+' | ✗ '+(h[0]||['NONE']).join(' ')+' / '+(h[1]||['NONE']).join(' ')+' | '+t.join(''));
             h.forEach((a,k)=>{if(!a||a.length!==3||a.includes(w.f[k])||new Set(a).size!==3) out.bad.push('headforms '+w.ko)})} else out.vf.push(w.ko+' | (no form q) | '+t.join(''))});
          ch.pool.concat(ch.cases.flatMap(c=>c.scenes.map(s=>s.q).concat(c.clues))).forEach(q=>{ if(q.opts) chk(q,'authored'); if(q.accept){ out.vf.push('ACCEPT '+q.accept.flatMap(G.expand).join(' ; ')) ; (q.diag||[]).forEach(d=>d.p.flatMap(G.expand).forEach(v=>{ if(G.judge(q,v).ok) out.bad.push('diag accepted '+v)})); q.accept.flatMap(G.expand).forEach(v=>{const j=G.judge(q,v); if(!j.ok||j.note) out.bad.push('accept fails/notes '+v+' '+j.note)})}
            if(q.tiles){q.orders.forEach(o=>{const t=o.split(' ').sort().join(), s=q.tiles.slice().sort().join(); if(t!==s) out.bad.push('tiles '+o)})}});
          }
          // judge behaviour
          const q={accept:['(저는 |전 |)라디오(를|) 들으면서 버스(를|) 기다릴까 (해요|합니다)'],lenient:['라디오','버스'],diag:[{p:['라디오를 듣으면서 버스를 기다릴까 해요'],msg:'D'}]};
          out.j=[['라디오를 들으면서 버스를 기다릴까 해요.'],['라디오를들으면서 버스를 기다릴까해요'],['라디오를 들으면서 버쓰를 기다릴까 해요'],['라디오를 들으면서 버스를 기다릴까 해'],['라디오를 듣으면서 버스를 기다릴까 해요'],['radioreul'],['라디오를 들으면서 버스를 기다릴가 해요'],['라디오을 들으면서 버스를 기다릴까 해요']].map(([s])=>s+' => '+JSON.stringify(G.judge(q,s)));
          // keyboard
          const K=__osk; const inp=document.createElement('input'); document.body.appendChild(inp); K.state.inp=inp;
          const type=s=>{K.state.base='';K.state.c={L:'',V:[],T:[]}; for(const ch of s){ if(ch===' '){K.state.base+=inp.value.slice(K.state.base.length);K.state.c={L:'',V:[],T:[]};K.state.base=inp.value+' ';inp.value=K.state.base} else K.type(ch)} return inp.value};
          out.k={ '닭이':type('ㄷㅏㄹㄱㅇㅣ'),'읽어요':type('ㅇㅣㄹㄱㅇㅓㅇㅛ'),'없어요':type('ㅇㅓㅂㅅㅇㅓㅇㅛ'),'않아요':type('ㅇㅏㄴㅎㅇㅏㅇㅛ'),'있어요':type('ㅇㅣㅆㅇㅓㅇㅛ'),'의':type('ㅇㅡㅣ'),'왜':type('ㅇㅗㅐ'),'워':type('ㅇㅜㅓ'),'꽃':type('ㄲㅗㅊ'),'빨리':type('ㅃㅏㄹㄹㅣ'),'얘기':type('ㅇㅒㄱㅣ'),'달가':type('ㄷㅏㄹㄱㅏ'),'저는 학교에 가요':type('ㅈㅓㄴㅡㄴ ㅎㅏㄱㄱㅛㅇㅔ ㄱㅏㅇㅛ')};
          type('ㄷㅏㄹㄱ'); const bs=[inp.value]; for(let i=0;i<5;i++){K.back();bs.push(inp.value)} out.bs=bs;
          // committed text then delete jamo by jamo
          K.state.base='닭';K.state.c={L:'',V:[],T:[]};inp.value='닭'; const b2=[];for(let i=0;i<4;i++){K.back();b2.push(inp.value)} out.bs2=b2; inp.remove();
          return out}''')
        print('BAD:', json.dumps(r['bad'],ensure_ascii=False,indent=1))
        for k,v in r['k'].items(): print('KB', k, '->', v, 'OK' if k==v else 'FAIL')
        print('BS', r['bs'], r['bs2'])
        for l in r['j']: print(l)
        if '-v' in sys.argv:
            for l in r['vf']: print(l)
        print('ERRS', errs)
        await b.close()
asyncio.run(main())
