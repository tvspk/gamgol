import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        svg=open(__import__('os').path.join(__import__('os').path.dirname(__file__),'icon.svg')).read()
        for name,px in [('mdpi',48),('hdpi',72),('xhdpi',96),('xxhdpi',144),('xxxhdpi',192),('preview',512)]:
            await pg.set_viewport_size({'width':px,'height':px})
            s2=svg.replace('<svg ','<svg width="%d" height="%d" ' % (px,px),1)
            await pg.set_content('<html><body style="margin:0;background:transparent">'+s2+'</body></html>')
            await pg.screenshot(path=__import__('os').path.join(__import__('os').path.dirname(__file__),'ic_%s.png' % name),omit_background=True,clip={'x':0,'y':0,'width':px,'height':px})
        await b.close()
asyncio.run(main())
