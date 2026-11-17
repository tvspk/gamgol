import asyncio, json, sys
from playwright.async_api import async_playwright
W=int(sys.argv[1]) if len(sys.argv)>1 else 360
H=740 if W<500 else 900
ANS='''(right)=>{const q=__game.q,G=__game,box=document.querySelector('.qc'); if(!box||document.querySelector('#cont')) return 'none';
 if(q.type==='mc'||q.type==='odd'){const b=[...box.querySelectorAll('.opt')].find(b=>(b.dataset.i==='0')===right); b.click(); return q.type}
 if((q.type==='fill'||q.type==='write')&&box.querySelector('#tray')){const t=G.buildTiles(q);(right?t.good:t.good.slice().reverse().concat(t.extra.slice(0,1))).forEach(w=>{[...box.querySelectorAll('#bank .tile')].find(x=>x.textContent===w&&!x.classList.contains('used')).click()}); box.querySelector('#go').click(); return 'build'}
 if(q.type==='fill'||q.type==='write'){const i=box.querySelector('#ans'); i.value=right?G.expand(q.accept[0])[0]:'몰라요'; box.querySelector('#go').click(); return q.type}
 if(q.type==='tiles'){const ws=right?q.orders[0].split(' '):q.tiles.slice().reverse(); ws.forEach(w=>{[...box.querySelectorAll('#bank .tile')].find(t=>t.textContent===w&&!t.classList.contains('used')).click()}); box.querySelector('#go').click(); return 'tiles'}
 if(q.type==='match'){q.pairs.forEach((p,i)=>{box.querySelector('[data-s=l][data-i="'+i+'"]').click();box.querySelector('[data-s=r][data-i="'+i+'"]').click()}); return 'match'} }'''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width':W,'height':H}, has_touch=W<500, is_mobile=W<500)
        pg = await ctx.new_page(); errs=[]; over=[]
        await pg.add_init_script('window.__fast=1')
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_TUNNEL' not in m.text else None)
        pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
        await pg.goto('file://'+__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__file__),'..','test.html'))); await pg.wait_for_timeout(500)
        n=[0]
        async def shot(name):
            n[0]+=1; await pg.screenshot(path=f'shots/{W}_{n[0]:02d}_{name}.png')
        async def chk(where):
            o=await pg.evaluate('document.documentElement.scrollWidth-window.innerWidth')
            if o>0: over.append((where,o))
        async def click(sel):
            await pg.evaluate('s=>document.querySelector(s).dispatchEvent(new MouseEvent("click",{bubbles:true}))', sel); await pg.wait_for_timeout(60); await chk(sel)
        async def has(sel): return await pg.evaluate('s=>!!document.querySelector(s)', sel)
        async def play_items(wrong_at=(), shots=()):
            i=0
            while await has('.qc') :
                if await has('#cont'): await click('#cont'); continue
                t=await pg.evaluate(ANS, i not in wrong_at); await pg.wait_for_timeout(80); await chk('q%d'%i)
                if i in shots: await shot('q%d_%s'%(i,t))
                i+=1
                if await has('#cont'): await click('#cont')
                if await has('#nx') or await has('#st') or await has('#close'): break
            return i
        await shot('home'); await chk('home')
        for cid in ['c1a','c1b','c1c','c2a','c2b','c2c','c3a','c3b','c3c','c4a','c4b','c4c','c5a','c5b','c5c','c6a','c6b','c6c','c7a','c7b','c7c','c8a','c8b','c8c','c9a','c9b','c9c','c10a','c10b','c10c','c11a','c11b','c11c','c12a','c12b','c12c','c13a','c13b','c13c','c14a','c14b','c14c','fin1']:
            await click(f'[data-case="{cid}"]'); await shot('scene1')
            k=await play_items(wrong_at=(1,5), shots=(0,1,4,9)); print(cid,'scenes+reopened answered',k)
            await shot('souvenir'); await click('#nx')
            k=await play_items(wrong_at=(2,), shots=(0,2,3,4,5)); print(cid,'clues answered',k)
            assert await has('#st'), 'no speed intro'; await shot('speedintro'); await click('#st')
            # speed: answer right 7x, wrong once, then right until time is out
            for j in range(400):
                if await has('#nx'): break
                if await has('#bk'): await shot('speed_wrong') if j<12 else None; await click('#bk'); continue
                if await has('#qb .opt'):
                    await pg.evaluate('(r)=>{const o=[...document.querySelectorAll("#qb .opt")];(o.find(b=>(b.dataset.i==="0")===r)||o[0]).click()}', j!=7)
                    if j==3: await shot('speed')
                await pg.wait_for_timeout(350 if j>10 else 60)
            st=await pg.evaluate('JSON.stringify({won:__game.S.won,best:__game.S.best})'); print('after speed',st)
            await shot('speed_end'); await click('#nx'); await shot('map')
            # work order: fail first, then pass
            await click('[data-spot="coffee"]'); await shot('spot')
            if await has('#wo'):
                await click('#wo'); await shot('workorder')
                for r in (False,False):
                    await pg.evaluate(ANS, r); await pg.wait_for_timeout(60); await click('#cont')
                assert await has('#again'),'expected fail screen'; w0=await pg.evaluate('__game.S.won'); await shot('wo_fail')
                await click('#again')
                while not await has('#mp'):
                    await pg.evaluate(ANS, True); await pg.wait_for_timeout(60); await click('#cont')
                w1=await pg.evaluate('__game.S.won'); print('work order: budget',w0,'->',w1, await pg.evaluate('JSON.stringify(__game.S.repairs)')); await shot('wo_pass')
                await click('#mp'); await shot('map_fixed')
            await click('#close'); await shot('summary')
            print(cid,'summary:',(await pg.inner_text('.sum')).replace('\n',' | ')[:400])
            await click('#hm'); await shot('home_after')
        # night duty
        await click('#night'); k=0
        while not await has('#ag'):
            if await has('#cont'): await click('#cont'); continue
            await pg.evaluate(ANS, k%4!=0); k+=1; await pg.wait_for_timeout(60)
            if k==2: await shot('night')
        await shot('night_end'); print('night answered',k); await click('#hm')
        # vocab: three rounds
        await click('[data-vocab="ch14"]'); types=[]
        for rd in range(18):
            while not await has('#ag'):
                if await has('#cont'): await click('#cont'); continue
                types.append(await pg.evaluate(ANS, True)); await pg.wait_for_timeout(40)
                if len(types) in (1,62,170): await shot('vocab_q')
            if rd==0: await shot('vocab_end')
            if rd<17: await click('#ag')
        v=await pg.evaluate('''()=>{const V=__game.S.vocab.ch14; return JSON.stringify({ptr:V.ptr,seen:Object.keys(V.w).length,gold:Object.values(V.w).filter(t=>t.w).length})}''')
        print('vocab',v,'typed q count',types.count('build')); await shot('vocab_late'); await click('#hm'); await shot('home_final')
        # leave button: two taps, timer stops
        await click('[data-case="c1a"]'); await click('#exit'); assert await has('.qc'); await click('#exit'); assert await has('.cork'); print('leave ok')
        print('OVERFLOW',over); print('ERRS',errs)
        await b.close()
asyncio.run(main())
