import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for w in (360,1280):
            pg=await b.new_page(viewport={'width':w,'height':800}); errs=[]
            pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto('file://'+__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__file__),'..','test.html'))); await pg.wait_for_timeout(1500)
            n=await pg.evaluate('document.querySelectorAll("[data-cards]:not([disabled])").length')
            info=await pg.evaluate('__game.C.chapters.map(c=>c.no+":"+__game.deck(c).length+"/"+__game.deck(c).filter(x=>x.seen).length).join(" ")')
            ov=[]
            async def chk(t):
                o=await pg.evaluate('document.documentElement.scrollWidth>innerWidth+1')
                if o: ov.append(t)
            await chk('home')
            for ch in ('ch1','ch7','ch14'):
                await pg.evaluate('s=>document.querySelector(s).click()', f'[data-cards="{ch}"]')
                for rnd in range(3):
                    for i in range(10):
                        await pg.click('#fc'); await chk(f'{ch} {rnd} {i}')
                        if rnd==0 and i<2: await pg.screenshot(path=f'/tmp/claude-0/-home-claude/bdb6135f-a80b-55f6-a7bb-4c534dbf2d0e/scratchpad/fc_{w}_{ch}_{i}.png')
                        await pg.click(f'.rb[data-b="{(i+rnd)%3}"]')
                    await chk('end')
                    if rnd==0: await pg.screenshot(path=f'/tmp/claude-0/-home-claude/bdb6135f-a80b-55f6-a7bb-4c534dbf2d0e/scratchpad/fc_{w}_{ch}_end.png')
                    await pg.click('#ag' if rnd<2 else '#hm')
            st=await pg.evaluate('JSON.stringify([__game.cstat(__game.C.chapters[0]),__game.S.att.cnt])')
            await pg.screenshot(path=f'/tmp/claude-0/-home-claude/bdb6135f-a80b-55f6-a7bb-4c534dbf2d0e/scratchpad/fc_{w}_home.png')
            print(w,'buttons',n,'|',info,'|',st,'| overflow',ov,'| errs',errs)
        await b.close()
asyncio.run(main())
