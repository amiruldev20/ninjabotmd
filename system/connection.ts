//-- MODULE EXTERNAL --//
import pino from 'pino';
import { Boom } from '@hapi/boom';
import { writeFileSync } from 'fs';
import makeWASocket, { DisconnectReason, useSingleFileAuthState, makeInMemoryStore } from 'baileys';
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
      browser: ["NinjaBot MD", 'Firefox', '3.0.0'],
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


    // NEW CONNECTION
    socket.ev.on('connection.update', (update: any) => {
      const { connection, lastDisconnect } = update
      if (connection === 'close') {
        // @ts-ignore
        const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('- connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
        // reconnect if not logged out
        if (shouldReconnect) {
          CreateConnection();
        }
      } else if (connection === 'open') {
        console.log('- opened connection -')
      }
    })

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
