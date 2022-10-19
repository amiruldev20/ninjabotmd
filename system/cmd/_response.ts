//-- MODULE EXTERNAL --//
import util from 'util';
import { readFileSync } from 'fs';
import { red, green, yellow, blue, magenta, cyan } from 'chalk';
import * as baileys from 'baileys';
//-- DATABASE --//
import { mydb } from '../../lowdb';


client.socket.ev.on('messages.upsert', async (upsert: { messages: baileys.proto.IWebMessageInfo[]; }) => {
    if (
        !Object.keys(upsert.messages[0]).includes('message') ||
        !Object.keys(upsert.messages[0]).includes('key')
    ) {
        return;
    }

    process.setMaxListeners(0);
    const renz = await client.metadata(upsert.messages[0]);
    if (renz.from?.endsWith("broadcast")) return console.log("BROADCAST STATUS")
    if (renz.baileys == true) return
  
    
    await mydb(renz)

    //-- ISI FIRST CHAT --//
    //console.log(renz)
    try {
        let date: any = new Date();
        if (renz.validator.isGroup == false) {
            if (date - db.usr[renz.sender!].pc < 60000) return
            client.reply(renz, `Halo, *${renz.pushName}* 👋
selamat datang di *${set.name}*
untuk membuat stiker otomatis, silahkan klik tombol
*on sticker* dibawah!!

*NB:* BOT INI BELUM JADI`)
            db.usr[renz.sender!].pc = date * 1
        }
    } catch {
        console.log(red(`can't insert data!!`))
    }
    /*
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
    await client.reply(renz, `Sticker sedang dibuat, jika sticker tidak bergerak silahkan potong durasi video dibawah 10 detik atau ubah menjadi gif!!`)
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
    */

    /*
    SYSTEM MESSAGE UPSERT & PRINT MSG 
    */
    const rul = client.socket;

    //-- PRINT LOG 
    const p = upsert.messages[0]
    const gc = renz.gcData
    const isGc = renz.validator.isGroup

    //-- NYIMAK MODE
    if (opts['nyimak']) return

    //-- SELF MODE
    if (renz.key.fromMe == true && renz.key.remoteJid == '6285742431407@s.whatsapp.net') throw 'COMMAND DARI BOT'
    if (!renz.validator.isOwner && opts['self']) return

    //-- OFF WHATSAPP MODE 
    if (opts['off'] && renz.from) {
        console.log("MODE OFFLINE")
        client.socket.sendPresenceUpdate('unavailable', `${renz.from}`);
    }

    //-- READ CHAT PC
    if (opts['read'] && renz.from) {
        console.log("MODE READ")

        client.readChat(renz, `${renz.key.remoteJid}`, `${renz.key.id}`);
    }

    //-- READ CHAT GC & SW
    if (opts['readgc'] && renz.from) {
        console.log("MODE READ GC")

        client.readChat(renz, `${renz.key.participant}`, `${renz.key.id}`);
    }


    //-- PRINT MSG
    if (renz.type[0] == "conversation") {
        console.log(`\n\n
${green("GROUP: ")}${green(isGc ? gc?.subject : 'FALSE')}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(isGc ? p.key.participant : 'FALSE')}
${cyan("TIPE: ")}${cyan(renz.type[0])}
MSG: ${renz.string}`)
    }


    else if (renz.type[0] == "buttonsMessage") {
        console.log(`\n\n
${green("GROUP: ")}${green(isGc ? gc?.subject : 'FALSE')}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(isGc ? p.key.participant : 'FALSE')}
${cyan("TIPE: ")}${cyan(renz.type[0])}
MSG: ${util.format(renz.body)}`)
    }


    else if (renz.type[0] == "extendedTextMessage") {
        console.log(`\n\n
${green("GROUP: ")}${green(isGc ? gc?.subject : 'FALSE')}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(isGc ? p.key.participant : 'FALSE')}
${cyan("TIPE: ")}${cyan(renz.type[0])}
MSG: ${renz.string}`)
    }

    else if (renz.type[0] == "stickerMessage") {
        console.log(`\n\n
${green("GROUP: ")}${green(isGc ? gc?.subject : 'FALSE')}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(isGc ? p.key.participant : 'FALSE')}
${cyan("TIPE: ")}${cyan(renz.type[0])}
MSG: ${renz.string}`)
    }
    else if (renz.type[0] == "protocolMessage") {
        console.log(`\n\n
${green("GROUP: ")}${green(isGc ? gc?.subject : 'FALSE')}
${cyan("NAME: ")}${cyan(p.pushName)} 
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(renz.type[0])}
MSG: ${renz.string}`)
    }


    else if (renz.type[0] == "senderKeyDistributionMessage") {
        console.log(`\n\n
${green("GROUP: ")}${green(isGc ? gc?.subject : 'FALSE')}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(renz.type[0])}
MSG: ${renz.string}`)
    }


    else if (renz.type[0] == "listResponseMessage") {
        console.log(`\n\n
${green("GROUP: ")}${green(isGc ? gc?.subject : 'FALSE')}))}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(renz.type[0])}
MSG: ${renz.string}`)
    }

    //console.log("msg", upsert.messages[0])
    console.log("msg2", renz.type[0])

    //if (renz.type[0] == "listResponseMessage") return client.socket.sendMessage(`${config.own[0]}@s.whatsapp.net`, { text: util.format(renz)})

    process.on('uncaughException', console.error)
    if (renz.key.id!.length < 20 || renz.key.remoteJid === 'status@broadcast') {
        return;
    }

    if (renz.validator.isGroup) {
        if (!database.group) database.group = {};
        if (!database.group[renz.from!]) {
            database.group[renz.from!] = { subject: renz.gcData?.subject };
        }
        if (database.group[renz.from!].isMuted) return;
    }
    if (!client.chats[renz.from!]) {
        client.chats[renz.from!] = { messages: {} };
    }
    client.chats[renz.from!].messages[renz.key.id!] = renz;
    database.chats = client.chats;
    global.cmd.emit(renz);
})
