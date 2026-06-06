import urllib.request, ssl, re
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
req = urllib.request.Request('https://commons.wikimedia.org/wiki/File:Vietnam_National_University_Logo.svg', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
m = re.search(r'href="(https://upload.wikimedia.org/[^"]+Vietnam_National_University_Logo.svg)"', html)
print(m.group(1) if m else 'Not found')
