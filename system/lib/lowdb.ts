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
const fs = require('fs')

const file = join(__dirname, 'db.json')

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
            regist: boolean
        }
    },
    chat: {
        [jid: string]: {
            name: any,
            banned: boolean
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
    if (meta.from.endsWith("broadcast")) return
    if (meta.key.fromMe) return
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
                premtime: 0
            }

        let chat = db.data.chat[meta.gcData.id]
        if (chat) {
            if (!('name' in chat))
                chat.name = meta.gcData.subject
            if (!('isBanned' in chat))
                chat.banned = false
        } else
            db.data.chat[meta.gcData.id] = {
                name: meta.gcData.subject,
                banned: false
            }
await db.write()
    } catch (e) {
        console.error(e)
    }

}