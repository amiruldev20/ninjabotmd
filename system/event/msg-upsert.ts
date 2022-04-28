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

const mel = await client.metadata(upsert.messages[0]);

const rul = client.socket;

//-- PRINT LOG 
const p = upsert.messages[0]
const gc = mel.gcData

//console.log(mel)
//-- MSG CONVERSATION
if (mel.type[0] == "conversation"){
console.log(`\n\n
${green("GROUP: ")}${green(gc?.subject)}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(mel.type[0])}
MSG: ${mel.string}`)
} 


else if (mel.type[0] == "buttonsMessage"){
console.log(`\n\n
${green("GROUP: ")}${green(gc?.subject)}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(mel.type[0])}
MSG: ${util.format(mel.body)}`)
} 


else if (mel.type[0] == "extendedTextMessage"){
console.log(`\n\n
${green("GROUP: ")}${green(gc?.subject)}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(mel.type[0])}
MSG: ${mel.string}`)
} 


else if (mel.type[0] == "protocolMessage"){
console.log(`\n\n
${green("GROUP: ")}${green(gc?.subject)}
${cyan("NAME: ")}${cyan(p.pushName)} MEMBUAT STATUS!!
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(mel.type[0])}
MSG: ${mel.string}`)
} 


else if (mel.type[0] == "senderKeyDistributionMessage"){
console.log(`\n\n
${green("GROUP: ")}${green(gc?.subject)}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(mel.type[0])}
MSG: ${mel.string}`)
} 


else if (mel.type[0] == "listResponseMessage"){
console.log(`\n\n
${green("GROUP: ")}${green(gc?.subject)}
${cyan("NAME: ")}${cyan(p.pushName)}
${green("JID: ")}${green(p.key.remoteJid)}
${magenta("ID: ")}${magenta(p.key.id)}
${cyan("PARTICIPANT: ")}${cyan(p.key.participant)}
${cyan("TIPE: ")}${cyan(mel.type[0])}
MSG: ${mel.string}`)
} 


//console.log("msg", upsert.messages[0])
console.log("msg2", mel.type[0])

//if (mel.type[0] == "listResponseMessage") return client.socket.sendMessage(`${config.own[0]}@s.whatsapp.net`, { text: util.format(mel)})

process.on('uncaughException', console.error)
if (mel.key.id!.length < 20 || mel.key.remoteJid === 'status@broadcast') {
return;
}

if (mel.validator.isGroup) {
if (!database.group) database.group = {};
if (!database.group[mel.from!]) {
database.group[mel.from!] = { subject: mel.gcData?.subject };
}
if (database.group[mel.from!].isMuted) return;
}
if (!client.chats[mel.from!]) {
client.chats[mel.from!] = { messages: {} };
}
client.chats[mel.from!].messages[mel.key.id!] = mel;
database.chats = client.chats;
cmd.emit(mel);
});