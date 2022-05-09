//-- MODULE EXTERNAL --//
import util from 'util';
import chalk from 'chalk';
import fs from 'fs';
import { createHash } from 'crypto';
import * as wsf from 'wa-sticker-formatter';

/*
cmd.on(
    [''],
    [''],
    async (renz: any, { cmd, text, query }) => {

        //-- CONSOLE ALL --//
        console.log("DBUSR", dbusr)
        console.log("USR", usr)
        console.log("TIPE", renz.type[0])
        console.log("ISGROUP", renz.validator.isGroup)

        //-- PUSH DB
        if (dbusr == false) {
            usr.push({
                id: renz.sender,
                nama: renz.pushName,
                umur: 17,
                regist: false,
                limit: 10,
                warn: 0,
                ban: false,
                call: 0,
                afk: false,
                afkmsg: '',
                afktime: 0,
                autodown: false,
                regtime: 0,
                exp: 100,
                money: 0,
                prem: false,
                premtime: 0,
                joincount: 0,
                lastclaim: 0,
                lang: 'id',
                pc: 0,
                sticker: false,
                sn: `NINJA-${createHash('md5').update(renz.sender).digest('hex')}`,
            })
            fs.writeFileSync('./database/user.json', JSON.stringify(usr))
        }

        //-- ISI FIRST CHAT 
        let date: any = new Date();
        if (renz.validator.isGroup == false) {
            if (date - dbusr.pc < 60000) return
            client.sendBtn1(renz, `Halo, *${renz.pushName}* 👋
selamat datang di *${set.name}*
untuk membuat stiker otomatis, silahkan klik tombol
*on sticker* dibawah!!

*NB:* BOT INI BELUM JADI`, `${set.name} 2022`, 'ON STICKER', '#on sticker')
            dbusr.pc = date * 1
        }

        //-- AUTO STICKER PC 
        if (renz.type[0] == "imageMessage") {
            if (dbusr.regist == false) return client.reply(renz, `Halo, *${renz.pushName}* Anda belum terdaftar, silahkan daftar terlebih dahulu
    contoh: #reg nama,umur`)

            if (dbusr.sticker == false) return client.reply(renz, `Silahkan aktifkan auto sticker terlebih dahulu, ketik #on sticker`)

            try {
                let gp = await client.getpp(renz)
                let gpgb = await client.getBuffer(gp)
                var ic = gpgb.buffer
            } catch {
                var gic = await client.getBuffer("https://telegra.ph/file/839791ed5d331b4450bcd.jpg")
                var ic = gic.buffer
            }
            let wame = `https://wa.me/${set.numown[0]}`
            let qq = renz.quoted ? renz.quoted : renz
            let img = await renz.util.downMsg(qq)
            const st = new wsf.Sticker(img.buffer, {
                pack: set.pack,
                author: "",
                type: wsf.StickerTypes.FULL,
            })
            const buf = await st.toBuffer()
            await client.adGc(renz, `Sticker sedang dibuat...`)
            client.sendSt(renz, buf, {
                fileLength: 10540,
                ephemeralExpiration: 24 * 3600,
                contextInfo: {
                    forwardingScore: 449,
                    isForwarded: true,
                    externalAdReply: {
                        title: `${set.name}`,
                        body: `Nih stikernya ${renz.pushName}`,
                        previewType: 'PHOTO',
                        thumbnail: ic,
                        sourceUrl: wame,
                    }
                }
            })
        }
        if (renz.type[0] == "videoMessage" && !asticker.includes(renz.from)) {
            try {
                let gp = await client.getpp(renz)
                let gpgb = await client.getBuffer(gp)
                var ic = gpgb.buffer
            } catch {
                var gic = await client.getBuffer("https://telegra.ph/file/839791ed5d331b4450bcd.jpg")
                var ic = gic.buffer
            }
            let wame = `https://wa.me/${set.numown[0]}`
            let qq = renz.quoted ? renz.quoted : renz
            let mime = (qq.view).mimetype || ''
            let cek = qq.view.seconds > 11
            if (/video/g.test(mime))
                if ((qq.view).seconds > 11) return client.reply(renz, `Durasi video max 10 detik, silahkan kurangi durasi video anda atau ubah menjadi gif sebelum mengirim!!`)
            let img = await renz.util.downMsg(qq)
            const st = new wsf.Sticker(img.buffer, {
                pack: set.pack,
                author: "",
                type: wsf.StickerTypes.FULL,
                quality: 50,
            })
            const buf = await st.toBuffer()
            await client.adGc(renz, `Sticker sedang dibuat, jika sticker tidak bergerak silahkan potong durasi video dibawah 10 detik atau ubah menjadi gif!!`)
            client.sendSt(renz, buf, {
                fileLength: 10540,
                ephemeralExpiration: 24 * 3600,
                contextInfo: {
                    forwardingScore: 449,
                    isForwarded: true,
                    externalAdReply: {
                        title: `${set.name}`,
                        body: `Nih stikernya ${renz.pushName}`,
                        previewType: 'PHOTO',
                        thumbnail: ic,
                        sourceUrl: wame,
                    }
                }
            })
        }

    },
    {
      
        prefix: false,
        wait: false, 
    },
    
) */