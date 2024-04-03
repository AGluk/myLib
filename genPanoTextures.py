#!/usr/bin/env python3

import os, sys, threading
from PIL import Image, ImageOps

SRC = sys.argv[1]

if len(sys.argv) > 2:
    ICQ = int(sys.argv[2])
else:
    ICQ = 99

if os.path.isfile(f"{SRC}/pano.jpg"):
    DATA = os.path.getmtime(f"{SRC}/pano.jpg")
    PANO = None

    ############################################################################################################################ 128 ###

    if not os.path.exists(f"{SRC}/128.nosync"):
        os.mkdir(f"{SRC}/128.nosync", 0o774)

    if os.path.getmtime(f"{SRC}/128.nosync") != DATA:
        if PANO is None:
            PANO = ImageOps.flip(Image.open(f"{SRC}/pano.jpg"))

        pano_in = PANO.copy()
        pano_in = pano_in.resize((504, 252), Image.LANCZOS)

        pano_out = Image.new("RGB", (506, 254))
        pano_out.paste(pano_in, (1, 1))
        pano_in.close()

        pano_out.paste(pano_out.crop((1, 1, 2, 253)), (505, 1))
        pano_out.paste(pano_out.crop((504, 1, 505, 253)), (0, 1))

        pano_out.paste(pano_out.crop((0, 1, 506, 2)), (0, 0))
        pano_out.paste(pano_out.crop((0, 252, 506, 253)), (0, 253))

        pano_out.crop((0, 0, 128, 128)).save(f"{SRC}/128.nosync/0.jpg", optimize=True, quality=ICQ)
        pano_out.crop((126, 0, 254, 128)).save(f"{SRC}/128.nosync/1.jpg", optimize=True, quality=ICQ)
        pano_out.crop((252, 0, 380, 128)).save(f"{SRC}/128.nosync/2.jpg", optimize=True, quality=ICQ)
        pano_out.crop((378, 0, 506, 128)).save(f"{SRC}/128.nosync/3.jpg", optimize=True, quality=ICQ)

        pano_out.crop((0, 126, 128, 254)).save(f"{SRC}/128.nosync/4.jpg", optimize=True, quality=ICQ)
        pano_out.crop((126, 126, 254, 254)).save(f"{SRC}/128.nosync/5.jpg", optimize=True, quality=ICQ)
        pano_out.crop((252, 126, 380, 254)).save(f"{SRC}/128.nosync/6.jpg", optimize=True, quality=ICQ)
        pano_out.crop((378, 126, 506, 254)).save(f"{SRC}/128.nosync/7.jpg", optimize=True, quality=ICQ)

        for file in os.listdir(f"{SRC}/128.nosync"):
            os.chmod(f"{SRC}/128.nosync/{file}", 0o660)
            os.utime(f"{SRC}/128.nosync/{file}", (DATA, DATA))

        os.utime(f"{SRC}/128.nosync", (DATA, DATA))

    ############################################################################################################################ 256 ###

    if not os.path.exists(f"{SRC}/256.nosync"):
        os.mkdir(f"{SRC}/256.nosync", 0o774)

    if os.path.getmtime(f"{SRC}/256.nosync") != DATA:
        if PANO is None:
            PANO = ImageOps.flip(Image.open(f"{SRC}/pano.jpg"))

        pano_in = PANO.copy()
        pano_in = pano_in.resize((1016, 508), Image.LANCZOS)

        pano_out = Image.new("RGB", (1018, 510))
        pano_out.paste(pano_in, (1, 1))
        pano_in.close()

        pano_out.paste(pano_out.crop((1, 1, 2, 509)), (1017, 1))
        pano_out.paste(pano_out.crop((1016, 1, 1017, 509)), (0, 1))

        pano_out.paste(pano_out.crop((0, 1, 1018, 2)), (0, 0))
        pano_out.paste(pano_out.crop((0, 508, 1018, 509)), (0, 509))

        pano_out.crop((0, 0, 256, 256)).save(f"{SRC}/256.nosync/0.jpg", optimize=True, quality=ICQ)
        pano_out.crop((254, 0, 510, 256)).save(f"{SRC}/256.nosync/1.jpg", optimize=True, quality=ICQ)
        pano_out.crop((508, 0, 764, 256)).save(f"{SRC}/256.nosync/2.jpg", optimize=True, quality=ICQ)
        pano_out.crop((762, 0, 1018, 256)).save(f"{SRC}/256.nosync/3.jpg", optimize=True, quality=ICQ)

        pano_out.crop((0, 254, 256, 510)).save(f"{SRC}/256.nosync/4.jpg", optimize=True, quality=ICQ)
        pano_out.crop((254, 254, 510, 510)).save(f"{SRC}/256.nosync/5.jpg", optimize=True, quality=ICQ)
        pano_out.crop((508, 254, 764, 510)).save(f"{SRC}/256.nosync/6.jpg", optimize=True, quality=ICQ)
        pano_out.crop((762, 254, 1018, 510)).save(f"{SRC}/256.nosync/7.jpg", optimize=True, quality=ICQ)

        for file in os.listdir(f"{SRC}/256.nosync"):
            os.chmod(f"{SRC}/256.nosync/{file}", 0o660)
            os.utime(f"{SRC}/256.nosync/{file}", (DATA, DATA))

        os.utime(f"{SRC}/256.nosync", (DATA, DATA))

    ############################################################################################################################ 512 ###

    if not os.path.exists(f"{SRC}/512.nosync"):
        os.mkdir(f"{SRC}/512.nosync", 0o774)

    if os.path.getmtime(f"{SRC}/512.nosync") != DATA:
        if PANO is None:
            PANO = ImageOps.flip(Image.open(f"{SRC}/pano.jpg"))

        pano_in = PANO.copy()
        pano_in = pano_in.resize((2040, 1020), Image.LANCZOS)

        pano_out = Image.new("RGB", (2042, 1022))
        pano_out.paste(pano_in, (1, 1))
        pano_in.close()

        pano_out.paste(pano_out.crop((1, 1, 2, 1021)), (2041, 1))
        pano_out.paste(pano_out.crop((2040, 1, 2041, 1021)), (0, 1))

        pano_out.paste(pano_out.crop((0, 1, 2042, 2)), (0, 0))
        pano_out.paste(pano_out.crop((0, 1020, 2042, 1021)), (0, 1021))

        pano_out.crop((0, 0, 512, 512)).save(f"{SRC}/512.nosync/0.jpg", optimize=True, quality=ICQ)
        pano_out.crop((510, 0, 1022, 512)).save(f"{SRC}/512.nosync/1.jpg", optimize=True, quality=ICQ)
        pano_out.crop((1020, 0, 1532, 512)).save(f"{SRC}/512.nosync/2.jpg", optimize=True, quality=ICQ)
        pano_out.crop((1530, 0, 2042, 512)).save(f"{SRC}/512.nosync/3.jpg", optimize=True, quality=ICQ)

        pano_out.crop((0, 510, 512, 1022)).save(f"{SRC}/512.nosync/4.jpg", optimize=True, quality=ICQ)
        pano_out.crop((510, 510, 1022, 1022)).save(f"{SRC}/512.nosync/5.jpg", optimize=True, quality=ICQ)
        pano_out.crop((1020, 510, 1532, 1022)).save(f"{SRC}/512.nosync/6.jpg", optimize=True, quality=ICQ)
        pano_out.crop((1530, 510, 2042, 1022)).save(f"{SRC}/512.nosync/7.jpg", optimize=True, quality=ICQ)

        for file in os.listdir(f"{SRC}/512.nosync"):
            os.chmod(f"{SRC}/512.nosync/{file}", 0o660)
            os.utime(f"{SRC}/512.nosync/{file}", (DATA, DATA))

        os.utime(f"{SRC}/512.nosync", (DATA, DATA))

    ########################################################################################################################### 1024 ###

    if not os.path.exists(f"{SRC}/1024.nosync"):
        os.mkdir(f"{SRC}/1024.nosync", 0o774)

    if os.path.getmtime(f"{SRC}/1024.nosync") != DATA:
        if PANO is None:
            PANO = ImageOps.flip(Image.open(f"{SRC}/pano.jpg"))

        pano_in = PANO.copy()
        pano_in = pano_in.resize((4088, 2044), Image.LANCZOS)

        pano_out = Image.new("RGB", (4090, 2046))
        pano_out.paste(pano_in, (1, 1))
        pano_in.close()

        pano_out.paste(pano_out.crop((1, 1, 2, 2045)), (4089, 1))
        pano_out.paste(pano_out.crop((4088, 1, 4089, 2045)), (0, 1))

        pano_out.paste(pano_out.crop((0, 1, 4090, 2)), (0, 0))
        pano_out.paste(pano_out.crop((0, 2044, 4090, 2045)), (0, 2045))

        pano_out.crop((0, 0, 1024, 1024)).save(f"{SRC}/1024.nosync/0.jpg", optimize=True, quality=ICQ)
        pano_out.crop((1022, 0, 2046, 1024)).save(f"{SRC}/1024.nosync/1.jpg", optimize=True, quality=ICQ)
        pano_out.crop((2044, 0, 3068, 1024)).save(f"{SRC}/1024.nosync/2.jpg", optimize=True, quality=ICQ)
        pano_out.crop((3066, 0, 4090, 1024)).save(f"{SRC}/1024.nosync/3.jpg", optimize=True, quality=ICQ)

        pano_out.crop((0, 1022, 1024, 2046)).save(f"{SRC}/1024.nosync/4.jpg", optimize=True, quality=ICQ)
        pano_out.crop((1022, 1022, 2046, 2046)).save(f"{SRC}/1024.nosync/5.jpg", optimize=True, quality=ICQ)
        pano_out.crop((2044, 1022, 3068, 2046)).save(f"{SRC}/1024.nosync/6.jpg", optimize=True, quality=ICQ)
        pano_out.crop((3066, 1022, 4090, 2046)).save(f"{SRC}/1024.nosync/7.jpg", optimize=True, quality=ICQ)

        for file in os.listdir(f"{SRC}/1024.nosync"):
            os.chmod(f"{SRC}/1024.nosync/{file}", 0o660)
            os.utime(f"{SRC}/1024.nosync/{file}", (DATA, DATA))

        os.utime(f"{SRC}/1024.nosync", (DATA, DATA))

    ########################################################################################################################### 2048 ###

    if not os.path.exists(f"{SRC}/2048.nosync"):
        os.mkdir(f"{SRC}/2048.nosync", 0o774)

    if os.path.getmtime(f"{SRC}/2048.nosync") != DATA:
        if PANO is None:
            PANO = ImageOps.flip(Image.open(f"{SRC}/pano.jpg"))

        pano_in = PANO.copy()
        pano_in = pano_in.resize((8184, 4092), Image.LANCZOS)

        pano_out = Image.new("RGB", (8186, 4094))
        pano_out.paste(pano_in, (1, 1))
        pano_in.close()

        pano_out.paste(pano_out.crop((1, 1, 2, 4093)), (8185, 1))
        pano_out.paste(pano_out.crop((8184, 1, 8185, 4093)), (0, 1))

        pano_out.paste(pano_out.crop((0, 1, 8186, 2)), (0, 0))
        pano_out.paste(pano_out.crop((0, 4092, 8186, 4093)), (0, 4093))

        pano_out.crop((0, 0, 2048, 2048)).save(f"{SRC}/2048.nosync/0.jpg", optimize=True, quality=ICQ)
        pano_out.crop((2046, 0, 4094, 2048)).save(f"{SRC}/2048.nosync/1.jpg", optimize=True, quality=ICQ)
        pano_out.crop((4092, 0, 6140, 2048)).save(f"{SRC}/2048.nosync/2.jpg", optimize=True, quality=ICQ)
        pano_out.crop((6138, 0, 8186, 2048)).save(f"{SRC}/2048.nosync/3.jpg", optimize=True, quality=ICQ)

        pano_out.crop((0, 2046, 2048, 4094)).save(f"{SRC}/2048.nosync/4.jpg", optimize=True, quality=ICQ)
        pano_out.crop((2046, 2046, 4094, 4094)).save(f"{SRC}/2048.nosync/5.jpg", optimize=True, quality=ICQ)
        pano_out.crop((4092, 2046, 6140, 4094)).save(f"{SRC}/2048.nosync/6.jpg", optimize=True, quality=ICQ)
        pano_out.crop((6138, 2046, 8186, 4094)).save(f"{SRC}/2048.nosync/7.jpg", optimize=True, quality=ICQ)

        for file in os.listdir(f"{SRC}/2048.nosync"):
            os.chmod(f"{SRC}/2048.nosync/{file}", 0o660)
            os.utime(f"{SRC}/2048.nosync/{file}", (DATA, DATA))

        os.utime(f"{SRC}/2048.nosync", (DATA, DATA))
else:
    print(f"File '{SRC}/pano.jpg' not found!")
