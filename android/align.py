import zipfile, sys, struct
src, dst = sys.argv[1], sys.argv[2]
zin = zipfile.ZipFile(src)
with zipfile.ZipFile(dst, 'w') as zout:
    for info in zin.infolist():
        data = zin.read(info.filename)
        ni = zipfile.ZipInfo(info.filename, date_time=(2026, 1, 1, 0, 0, 0))
        ni.external_attr = info.external_attr
        stored = info.filename == 'resources.arsc' or info.compress_type == zipfile.ZIP_STORED or info.filename.endswith('.png')
        ni.compress_type = zipfile.ZIP_STORED if stored else zipfile.ZIP_DEFLATED
        if stored:
            start = zout.fp.tell()
            base = start + 30 + len(info.filename.encode())
            pad = (-(base + 6)) % 4
            ni.extra = struct.pack('<HHH', 0xD935, 2 + pad, 4) + b'\0' * pad
        zout.writestr(ni, data)
zout = zipfile.ZipFile(dst)
bad = [i.filename for i in zout.infolist() if i.compress_type == zipfile.ZIP_STORED and (i.header_offset + 30 + len(i.filename.encode()) + len(i.extra)) % 4]
print('aligned entries checked, misaligned:', bad)
