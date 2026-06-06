import urllib.request
req = urllib.request.Request('https://upload.wikimedia.org/wikipedia/vi/1/1d/Logo_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_Qu%E1%BB%91c_gia_H%C3%A0_N%E1%BB%99i.svg', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response, open('vnu.svg', 'wb') as out_file:
    out_file.write(response.read())
