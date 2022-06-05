/*
-----------------------
Name: Ninjabot MD
Author: Amirul Dev
Github: amiruldev20
Instagram: amiruldev20
-----------------------
Thanks to: Istiqmal
-----------------------
tambahin aja nama lu, hargai yang buat
*/

//-- MODULE EXTERNAL
import { join, dirname } from 'path'
import { Low, JSONFile } from '@commonify/lowdb'
import { createUnparsedSourceFile } from 'typescript'
const fs = require('fs')
let yargs = require('yargs')
const opts: any = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

const file = join(__dirname, `${opts._[0] ? opts._[0] + '' : 'ninjabot'}.db.json`)
//onst file = join(__dirname, `db.json`)

interface LowData {
    usr: {
        [jid: string]: {
            name: any,
            idsrv: number,
            exp: number,
            limit: number,
            money: number,
            level: number,
            role: string,
            pc: 0,
            call: 0,
            lastclaim: number,
            age: number,
            regtime: number,
            afk: boolean,
            afkmsg: string,
            ban: boolean,
            warn: number,
            prem: boolean,
            premtime: number,
            regist: boolean,
            sticker: boolean,
            download: boolean
        }
    },
    chat: {
        [jid: string]: {
            name: any,
            banned: boolean,
            sticker: boolean,
            download: boolean,
            antilink: boolean,
            antibot: boolean
        }
    }
}
const adapter = new JSONFile<LowData>(file)
const db = new Low<LowData>(adapter)


export async function mydb(meta: any) {
    await db.read()
    db.data = {
        usr: {},
        chat: {},
        ...(db.data || {})
    }
    if (meta.from.endsWith("broadcast")) return console.log("NO WRITE BROADCAST")
    if (meta.key.fromMe == true) return
    try {
        // TODO: use loop to insert data instead of this
        let usr = db.data.usr[meta.sender!]
        if (usr) {
            if (!('regist' in usr))
                usr.regist = false
        } else
            db.data.usr[meta.sender!] = {
                name: meta.pushName,
                idsrv: 0,
                exp: 100,
                limit: 10,
                money: 0,
                level: 1,
                role: 'Bronze',
                pc: 0,
                call: 0,
                lastclaim: 0,
                age: 17,
                regtime: 0,
                regist: false,
                afk: false,
                afkmsg: '',
                ban: false,
                warn: 0,
                prem: false,
                premtime: 0,
                sticker: false,
                download: false
            }

        let chat = meta.gcData
        let idgc = db.data.chat[meta.gcData.id]
   //     if (chat == false) return console.log("NO WRITE CHAT")
        if (idgc) {
            if (!('name' in idgc))
                chat.name = meta.gcData.subject
            if (!('isBanned' in idgc))
                chat.banned = false
        } else
            db.data.chat[meta.gcData.id] = {
                name: meta.gcData.subject,
                banned: false,
                sticker: false,
                download: false,
                antilink: false,
                antibot: false
            }

        await db.write()
    } catch (e) {
        console.error(e)
    }
    setInterval(() => {
        db.write().catch(console.error)
    }, 60000)
}