import * as util from 'util';
import { red, green, yellow, blue, magenta, cyan } from 'chalk';
import * as baileys from '@adiwajshing/baileys';

client.socket.ev.on('messages.upsert', async (upsert) => {
    if (
        !Object.keys(upsert.messages[0]).includes('message') ||
        !Object.keys(upsert.messages[0]).includes('key')
    ) {
        return;
    }

    const renz = await client.metadata(upsert.messages[0]);

    const rul = client.socket;

    //-- PRINT LOG 
    const p = upsert.messages[0]
    const gc = renz.gcData

    //console.log(renz)
    //-- MSG CONVERSATION
    if (renz.type[0] == "conversation") {
        console.log(`\n\n
${green("GROUP: ")}${green(gc?.subject)}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(renz.type[0])}
MSG: ${renz.string}`)
    }


    else if (renz.type[0] == "buttonsMessage") {
        console.log(`\n\n
${green("GROUP: ")}${green(gc?.subject)}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(renz.type[0])}
MSG: ${util.format(renz.body)}`)
    }


    else if (renz.type[0] == "extendedTextMessage") {
        console.log(`\n\n
${green("GROUP: ")}${green(gc?.subject)}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(renz.type[0])}
MSG: ${renz.string}`)
    }


    else if (renz.type[0] == "protocolMessage") {
        console.log(`\n\n
${green("GROUP: ")}${green(gc?.subject)}
${cyan("NAME: ")}${cyan(p.pushName)} MEMBUAT STATUS!!
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(renz.type[0])}
MSG: ${renz.string}`)
    }


    else if (renz.type[0] == "senderKeyDistributionMessage") {
        console.log(`\n\n
${green("GROUP: ")}${green(gc?.subject)}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(renz.type[0])}
MSG: ${renz.string}`)
    }


    else if (renz.type[0] == "listResponseMessage") {
        console.log(`\n\n
${green("GROUP: ")}${green(gc?.subject)}
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
    cmd.emit(renz);
});