import asyncio, json
from playwright.async_api import async_playwright
MOCK='''window.__db={}; window.__writes=0; window.claude={use:(n)=>new Promise(r=>setTimeout(()=>r(n==='user'?{id:async()=>'u_test'}:n==='db'?{doc:(p)=>({get:async()=>{await new Promise(r=>setTimeout(r,DELAY));const d=window.__seed; return {exists:!!d,data:()=>Object.freeze(d)}},set:async(d)=>{window.__writes++;window.__db[p]=JSON.parse(JSON.stringify(d))}})}:null),50))};'''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        # ---- save/load with a mocked account store ----
        ctx = await b.new_context(viewport={'width':360,'height':740}, has_touch=True, is_mobile=True)
        pg = await ctx.new_page(); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        seed={'v':1,'won':43210,'repairs':{'cam':True},'souvenirs':['radio'],'cases':{'c1a':{'closed':True}},'best':{'ch1':900},'skills':{},'reopen':[],'n':0,'vocab':{},'osk':True,'typing':True}
        await pg.add_init_script(MOCK.replace('DELAY','1500')+'window.__seed='+json.dumps(seed)+';')
        await pg.goto('file://'+__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__file__),'..','test.html'))); await pg.wait_for_timeout(300)
        print('while loading: files disabled =', await pg.evaluate('[...document.querySelectorAll(".file,.note")].every(b=>b.disabled)'), '|', await pg.inner_text('#savebar'))
        await pg.wait_for_timeout(1800)
        print('after load:', await pg.inner_text('#won'), '|', await pg.inner_text('#savebar'), '| case2 unlocked =', await pg.evaluate('!document.querySelector("[data-case=c1b]").disabled'), '| shelf:', (await pg.inner_text('.plank'))[:40].replace('\\n',' '))
        # OSK persisted on: open writing case, keyboard must be visible at first typed question
        await pg.evaluate('document.querySelector("[data-case=c1b]").click()'); await pg.wait_for_timeout(200)
        vis=await pg.evaluate('!document.querySelector("#osk").hidden'); im=await pg.evaluate('document.querySelector("#ans").getAttribute("inputmode")')
        print('osk on after reload =',vis,'inputmode =',im)
        geo=await pg.evaluate('''()=>{const k=document.querySelector('#osk').getBoundingClientRect(),i=document.querySelector('#ans').getBoundingClientRect(),a=document.querySelector('.qc .ask').getBoundingClientRect(),key=document.querySelector('#osk button').getBoundingClientRect();return {kbTop:k.top,inputBottom:i.bottom,askTop:a.top,keyW:key.width,keyH:key.height,overflow:document.documentElement.scrollWidth-innerWidth}}''')
        print('geometry',geo); await pg.screenshot(path='shots/osk360.png')
        # type with OSK taps: 지내세요 then Enter
        async def tap(j):
            await pg.locator(f'#osk button[data-j="{j}"]').first.dispatch_event('pointerdown')
        for j in 'ㅈㅣㄴㅐㅅㅔㅇㅛ': await tap(j)
        print('typed via OSK:', await pg.input_value('#ans'))
        await pg.locator('#osk button[data-f="enter"]').dispatch_event('pointerdown'); await pg.wait_for_timeout(150)
        print('enter submitted, stamp ok =', await pg.evaluate('!!document.querySelector(".stamp.ok")'), '| osk hidden after answer =', await pg.evaluate('document.querySelector("#osk").hidden'))
        await pg.evaluate('document.querySelector("#cont").click()'); await pg.wait_for_timeout(150)
        print('next typed task: osk still on =', await pg.evaluate('!document.querySelector("#osk").hidden'))
        # mixed: system keyboard text then OSK, then OSK backspace jamo by jamo
        await pg.fill('#ans','마을 사람들한테 '); 
        for j in 'ㅁㅜㄹㅇㅓㅂㅗㄹ': await tap(j)
        await pg.locator('#osk button[data-f="shift"]').dispatch_event('pointerdown'); await tap('ㄲ'); await tap('ㅏ')
        await pg.locator('#osk button[data-f="space"]').dispatch_event('pointerdown')
        for j in 'ㅎㅐㅇㅛㅇ': await tap(j)
        v1=await pg.input_value('#ans'); await pg.locator('#osk button[data-f="back"]').dispatch_event('pointerdown'); v2=await pg.input_value('#ans')
        await pg.locator('#ans').press_sequentially('!'); await pg.locator('#osk button[data-f="back"]').dispatch_event('pointerdown'); await pg.locator('#osk button[data-f="back"]').dispatch_event('pointerdown'); v3=await pg.input_value('#ans')
        await tap('ㅛ'); v4=await pg.input_value('#ans'); print('mixed:',[v1,v2,v3,v4])
        await pg.locator('#osk button[data-f="enter"]').dispatch_event('pointerdown'); await pg.wait_for_timeout(150)
        print('mixed answer judged ok =', await pg.evaluate('!!document.querySelector(".stamp.ok")'))
        await pg.wait_for_timeout(1200)
        saved=await pg.evaluate('JSON.stringify([window.__writes,window.__db["data/users/u_test/gamgol"].won,window.__db["data/users/u_test/gamgol"].osk])'); print('saved (writes, won, osk):',saved)
        # switch keyboard off -> stays off on next question
        await pg.evaluate('document.querySelector("#cont").click()'); await pg.wait_for_timeout(100)
        # reset with confirm
        await pg.evaluate('document.querySelector("#exit").click()'); await pg.evaluate('document.querySelector("#exit").click()'); await pg.wait_for_timeout(100)
        await pg.evaluate('document.querySelector("#reset").click()'); w=await pg.inner_text('#won'); await pg.evaluate('document.querySelector("#reset").click()'); await pg.wait_for_timeout(1000)
        print('reset: before 2nd tap',w,'after',await pg.inner_text('#won'),'| store won',await pg.evaluate('window.__db["data/users/u_test/gamgol"].won'))
        print('errs',errs); await ctx.close()
        # ---- default state: OSK hidden until switched on; IME Enter guard ----
        ctx = await b.new_context(viewport={'width':1280,'height':900}); pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script('window.__seed={v:1,won:0,repairs:{},souvenirs:[],cases:{c1a:{closed:true}},best:{},skills:{},reopen:[],n:0,vocab:{},osk:false,typing:true};'+MOCK.replace('DELAY','10'))
        await pg.goto('file://'+__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__file__),'..','test.html'))); await pg.wait_for_timeout(400)
        await pg.evaluate('document.querySelector("[data-case=c1b]").click()'); await pg.wait_for_timeout(200)
        print('fresh: osk hidden =', await pg.evaluate('document.querySelector("#osk").hidden'), '| toggle present =', await pg.evaluate('!!document.querySelector("#kbt")'))
        # Enter during IME composition must not submit
        await pg.focus('#ans'); await pg.fill('#ans','지내세')
        await pg.evaluate('''()=>{const i=document.querySelector('#ans'); const e=new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true,isComposing:true}); i.dispatchEvent(e)}''')
        print('enter while composing submitted =', await pg.evaluate('!!document.querySelector(".stamp")'))
        await pg.fill('#ans','지내세요'); await pg.press('#ans','Enter'); await pg.wait_for_timeout(100)
        print('enter after composition submitted =', await pg.evaluate('!!document.querySelector(".stamp.ok")'))
        await pg.keyboard.press('Enter'); await pg.wait_for_timeout(100)
        await pg.fill('#ans','마을사람들에게 물어볼까 합니다'); await pg.press('#ans','Enter'); await pg.wait_for_timeout(100)
        print('feedback:', (await pg.inner_text('#fb')).replace('\\n',' | ')[:260])
        await pg.screenshot(path='shots/desk_fb.png')
        await pg.evaluate('document.querySelector("#kbt").click()'); 
        print('errs',errs); await b.close()
asyncio.run(main())
