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
import core, { mimeTypes } from 'file-type/core';
import axios from 'axios';
import Ffmpeg from 'fluent-ffmpeg';
import { Agent } from 'https';
import { exec } from 'child_process';
import { Readable } from 'stream';
const { fromBuffer } = require('file-type');
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
const PhoneNumber = require('awesome-phonenumber');
const pino = require('pino');
import * as baileys from 'baileys';


//-- MODULE INTERNAL 
import { headers } from './util';
import { GetBuffer, ButtonConfig, Content, Proto, StickerConfig } from './client.d';
import { TypeQueryNode } from 'typescript';

// EXPORT CLIENT
export default class Client {
  chats: {
    [k: string]: any;
  };
  baileys: typeof baileys;
  messageType: { [k: string]: string };
  constructor(public socket: baileys.WASocket) {
    this.chats = {};
    this.baileys = baileys;
    this.messageType = Object.fromEntries(
      Object.keys(baileys.proto)
        .filter((a) => a.endsWith('Message') || a.includes('Conversation'))
        .map((a) => {
          const type = a[0].toLowerCase() + a.slice(1);
          return [type.replace('Message', '').replace('conversation', 'text'), type];
        }),
    );
  }

  /*
  ------------------------------------
  MEMULAI FUNCTION
  ------------------------------------
  */

  //-- SEND MESSAGE
  /**
   * 
   * @param renz 
   * @param content 
   * @returns 
   */
  public send = async (renz: Proto | string, content: Content): Promise<baileys.proto.WebMessageInfo> => {
    try {
      let property: Record<string, any> = content;

      const type = Object.keys(property).find((a) => this.messageType[a]);
      if (!type) throw util.logger.format(new Error('The type is not defined'));
      const mediaKey = ['document', 'video', 'audio', 'image', 'sticker', 'react'];

      if (!(typeof property[type as keyof baileys.AnyMessageContent] === 'object') && mediaKey.includes(type)) {
        const bufferData = await this.getBuffer(property[type as keyof baileys.AnyMessageContent]);

        if (type === 'image') {
          (property.caption as string) = property?.text ? property.text : property?.caption ? property.caption : '';
          delete property?.text;
        }

        property = {
          mimetype: (property?.mimetype ? property.mimetype : type === 'audio' ? 'audio/mpeg' : bufferData.mime) as string,
          fileName: (!property?.filename
            ? `${Date.now()}.${bufferData.ext}`
            : property?.filename.includes('.')
              ? property.filename
              : `${property.filename}.${bufferData.ext}`) as string,
          ...property,
          [type]: bufferData.buffer,
        };
      }

      return this.socket.sendMessage(
        typeof renz === 'object' ? renz.key.remoteJid! : renz,
        property as baileys.AnyMessageContent,
        property as baileys.MiscMessageGenerationOptions,
      );
    } catch (e) {
      throw util.logger.format(e);
    }
  };


  //-- GET BUFFER 
  /**
   * 
   * @param content 
   * @param filename 
   * @param autoFormat 
   * @returns 
   */
  public getBuffer = async (
    content: GetBuffer,
    filename?: string,
    autoFormat = true,
  ): Promise<{
    filename?: string;
    buffer: Buffer;
    ext: core.FileExtension | 'bin';
    mime: core.MimeType | 'application/octet-stream';
  }> => {
    try {
      let buffer: Buffer;
      if (Buffer.isBuffer(content)) buffer = content;
      else if (/^data:.?\/.?;base64,/i.test(content as string)) buffer = Buffer.from((content as string).split(',')[1], 'base64');
      else if (/^https?:\/\//.test(content as string)) {
        let httpsAgent = undefined;
        if (/y2mate|streamable/gi.test(content as string))
          httpsAgent = new Agent({
            rejectUnauthorized: false,
          });

        buffer = (
          await axios.get(
            content as string,
            headers({
              responseType: 'arraybuffer',
              httpsAgent,
            }),
          )
        ).data;
      } else if (existsSync(content as string)) buffer = readFileSync(content as string);
      else if ((content as unknown as { _readableState: any })?._readableState) buffer = await this.baileys.toBuffer(content as Readable);
      else if (typeof content === 'string') buffer = Buffer.from(content);
      else buffer = Buffer.alloc(0);

      const template = (await fromBuffer(buffer)) || {
        ext: 'bin',
        mime: 'application/octet-stream',
      };

      if (filename) {
        filename = autoFormat ? `${filename}.${template.ext}` : filename;
        if (!existsSync(set.tempDir)) mkdirSync(set.tempDir.split('/')[1]);
        writeFileSync(filename.includes(set.tempDir) ? filename : `${set.tempDir}${filename}`, buffer);
        return {
          filename,
          buffer,
          ...template,
        };
      }
      return {
        buffer,
        ...template,
      };
    } catch (e) {
      throw util.logger.format(e);
    }
  };


  // --- FUNCTION BARU --- //

  //-- RANDOM --//
  /**
   * 
   * @param content 
   * @returns 
   */
  public rand = (content: any[] | number) => {
    if (content instanceof Array) {
      return content[Math.floor(Math.random() * content.length)];
    } else {
      return Math.floor(Math.random() * content);
      console.log(client)
    }
  }

  //-- NGANU MEDIA --//
  /**
   * 
   * @param message 
   * @returns 
   */
  public nganu = async (message: any) => {
    if (message.url && message.mediaKey) {
      const mediakei = Buffer.from(message.mediaKey).toString('base64')
      return `https://mmg.soff.tk/d/f/${message.url.split('/d/f/')[1]}/${encodeURIComponent(mediakei)}?type=${message.mimetype.split('/')[0]}`
    }
    const psn = message.message[message.mtype]
    const urlmsg = psn?.url
    if (!urlmsg) return
    const mediakei = Buffer.from(psn.mediaKey).toString('base64')
    return `https://mmg.soff.tk/d/f/${urlmsg.split('/d/f/')[1]}/${encodeURIComponent(mediakei)}?type=${psn.mimetype.split('/')[0]}`
  }

  //-- SET BIO WHATSAPP --//
  /**
   * 
   * @param status 
   * @returns 
   */
  public setBio = async (status: any) => {
    sock.query({
      tag: 'iq',
      attrs: {
        to: '@s.whatsapp.net',
        type: 'set',
        xmlns: 'status',
      },
      content: [{
        tag: 'status',
        attrs: {},
        content: Buffer.from(status, 'utf-8')
      }]
    })
    return status
  }

  //-- SEND MSG --- //
  /**
   * 
   * @param renz 
   * @param text 
   * @returns 
   */
  public sendMsg = async (renz: any, text: any) => {
    return this.socket.sendMessage(renz.from, { text: text })
  }

  //-- SEND REPLY --//
  /**
   * 
   * @param renz 
   * @param text 
   * @returns 
   */
  public reply = async (renz: Proto, text: string): Promise<baileys.proto.WebMessageInfo> =>
    this.send(renz, { text: util.logger.format(text).trim(), quoted: renz });

  //-- SEND VN --//
  /**
   * 
   * @param renz 
   * @param text 
   */
  public sendVn = async (renz: Proto, url: string) => {
    let gurl = await client.getBuffer(url)
    this.send(renz, { audio: (await gurl.buffer) as baileys.WAMediaUpload, ptt: true, mimetype: 'audio/mpeg', quoted: renz })
  }

  //-- SEND AUDIO --//
  /**
   * 
   * @param renz 
   * @param text 
   */
  public sendAud = async (renz: Proto, url: string) => {
    let gurl = await client.getBuffer(url)
    this.send(renz, { audio: (await gurl.buffer) as baileys.WAMediaUpload, ptt: false, mimetype: 'audio/mpeg', quoted: renz })
  }

  //-- SEN STICKER --//
  /**
   * 
   * @param renz 
   * @param sticker 
   * @param content 
   * @returns 
   */
  public sendSt = async (renz: any, sticker: Buffer, content: Content) => {
    return this.socket.sendMessage(renz.from, {
      sticker: sticker,
      ...content
    }, { quoted: renz, ephemeralExpiration: 24 * 3600 })
  }

  //-- SEND MEDIA --//
  /**
   * 
   * @param jid 
   * @param path 
   * @param capt 
   * @param anu 
   * @returns 
   */
  public sendMedia = async (jid: any, path: any, capt: string, anu: boolean) => {
    let { ext, mime, buffer } = await this.getBuffer(path)
    let messageType = mime.split("/")[0]
    let pase = messageType.replace('application', 'document') || messageType
    if (pase === 'document') {
      return client.send(jid, {
        document: buffer,
        mimetype: mime,
        caption: capt,
        quoted: jid
      })
    } else if (pase == "audio") {
      return client.send(jid, {
        audio: buffer,
        mimetype: mime,
        ptt: anu,
        caption: capt,
        quoted: jid
      })
    } else if (pase === 'video') {
      return client.send(jid, {
        video: buffer,
        mimetype: mime,
        caption: capt,
        quoted: jid
      })
    } else if (pase === 'image') {
      return client.send(jid, {
        image: buffer,
        mimetype: mime,
        caption: capt,
        quoted: jid
      })
    }
  }

  //-- SEND BUTTON 1 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param btn1 
   */
  public sendBtn1 = async (renz: any, text: string, foot: string, text1: any, btn1: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 }
    ]

    const buttonMessage = {
      text: text,
      footer: foot,
      buttons: buttons,
      headerType: 1
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON 2 -- //
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param text2 
   * @param btn1 
   * @param btn2 
   */
  public sendBtn2 = async (renz: any, text: string, foot: string, text1: any, text2: any, btn1: any, btn2: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 },
      { buttonId: btn2, buttonText: { displayText: text2 }, type: 1 }
    ]

    const buttonMessage = {
      text: text,
      footer: foot,
      buttons: buttons,
      headerType: 1
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON 3 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param text2 
   * @param text3 
   * @param btn1 
   * @param btn2 
   * @param btn3 
   */
  public sendBtn3 = async (renz: any, text: string, foot: string, text1: any, text2: any, text3: any, btn1: any, btn2: any, btn3: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 },
      { buttonId: btn2, buttonText: { displayText: text2 }, type: 1 },
      { buttonId: btn3, buttonText: { displayText: text3 }, type: 1 }
    ]

    const buttonMessage = {
      text: text,
      footer: foot,
      buttons: buttons,
      headerType: 1
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON IMG 1 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param btn1 
   * @param img 
   */
  public sendBtnImg1 = async (renz: any, text: string, foot: string, text1: any, btn1: any, img: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 }
    ]

    const buttonMessage = {
      image: img,
      caption: text,
      footer: foot,
      buttons: buttons,
      headerType: 1,
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON IMG 2 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param text2 
   * @param btn1 
   * @param btn2 
   * @param img 
   */
  public sendBtnImg2 = async (renz: any, text: string, foot: string, text1: any, text2: any, btn1: any, btn2: any, img: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 },
      { buttonId: btn2, buttonText: { displayText: text2 }, type: 1 }
    ]

    const buttonMessage = {
      image: img,
      caption: text,
      footer: foot,
      buttons: buttons,
      headerType: 1,
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON IMG 3 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param text2 
   * @param text3 
   * @param btn1 
   * @param btn2 
   * @param btn3 
   * @param img 
   */
  public sendBtnImg3 = async (renz: any, text: string, foot: string, text1: any, text2: any, text3: any, btn1: any, btn2: any, btn3: any, img: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 },
      { buttonId: btn2, buttonText: { displayText: text2 }, type: 1 },
      { buttonId: btn3, buttonText: { displayText: text3 }, type: 1 }
    ]

    const buttonMessage = {
      image: img,
      caption: text,
      footer: foot,
      buttons: buttons,
      headerType: 1,
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON VIDEO 1 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param btn1 
   * @param vid 
   */
  public sendBtnVid1 = async (renz: any, text: string, foot: string, text1: any, btn1: any, vid: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 }
    ]

    const buttonMessage = {
      video: vid,
      caption: text,
      footer: foot,
      buttons: buttons,
      headerType: 1,
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON VIDEO 2 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param text2 
   * @param btn1 
   * @param btn2 
   * @param vid 
   */
  public sendBtnVid2 = async (renz: any, text: string, foot: string, text1: any, text2: any, btn1: any, btn2: any, vid: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 },
      { buttonId: btn2, buttonText: { displayText: text2 }, type: 1 }
    ]

    const buttonMessage = {
      video: vid,
      caption: text,
      footer: foot,
      buttons: buttons,
      headerType: 1,
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON VIDEO 3 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param text2 
   * @param text3 
   * @param btn1 
   * @param btn2 
   * @param btn3 
   * @param vid 
   */
  public sendBtnVid3 = async (renz: any, text: string, foot: string, text1: any, text2: any, text3: any, btn1: any, btn2: any, btn3: any, vid: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 },
      { buttonId: btn2, buttonText: { displayText: text2 }, type: 1 },
      { buttonId: btn3, buttonText: { displayText: text3 }, type: 1 }
    ]

    const buttonMessage = {
      video: vid,
      caption: text,
      footer: foot,
      buttons: buttons,
      headerType: 1,
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON DOC 1 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param btn1 
   * @param doc 
   * @param name 
   * @param mime 
   * @param thumb 
   */
  public sendBtnDoc1 = async (renz: any, text: string, foot: string, text1: any, btn1: any, doc: any, name: any, mime: any, thumb: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 }
    ]

    const buttonMessage = {
      document: doc,
      fileName: name,
      mimetype: mime,
      jpegThumbnail: thumb,
      caption: text,
      footer: foot,
      buttons: buttons,
      headerType: 1,
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON DOC 2 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param text2 
   * @param btn1 
   * @param btn2 
   * @param doc 
   * @param name 
   * @param mime 
   * @param thumb 
   */
  public sendBtnDoc2 = async (renz: any, text: string, foot: string, text1: any, text2: any, btn1: any, btn2: any, doc: any, name: any, mime: any, thumb: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 },
      { buttonId: btn2, buttonText: { displayText: text2 }, type: 1 }
    ]

    const buttonMessage = {
      document: doc,
      fileName: name,
      mimetype: mime,
      jpegThumbnail: thumb,
      caption: text,
      footer: foot,
      buttons: buttons,
      headerType: 1,
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON DOC 3 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param text2 
   * @param text3 
   * @param btn1 
   * @param btn2 
   * @param btn3 
   * @param doc 
   * @param name 
   * @param mime 
   * @param thumb 
   */
  public sendBtnDoc3 = async (renz: any, text: string, foot: string, text1: any, text2: any, text3: any, btn1: any, btn2: any, btn3: any, doc: any, name: any, mime: any, thumb: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 },
      { buttonId: btn2, buttonText: { displayText: text2 }, type: 1 },
      { buttonId: btn3, buttonText: { displayText: text3 }, type: 1 }
    ]

    const buttonMessage = {
      document: doc,
      fileName: name,
      mimetype: mime,
      jpegThumbnail: thumb,
      caption: text,
      footer: foot,
      buttons: buttons,
      headerType: 1,
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON LOC 1 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param btn1 
   * @param loc 
   * @param thumb 
   */
  public sendBtnLoc1 = async (renz: any, text: string, foot: string, text1: any, btn1: any, loc: any, thumb: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 }
    ]

    const buttonMessage = {
      location: {
        jpegThumbnail: thumb,
      },
      caption: text,
      footer: foot,
      buttons: buttons,
      headerType: 1,
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON LOC 2 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param text2 
   * @param btn1 
   * @param btn2 
   * @param loc 
   * @param thumb 
   */
  public sendBtnLoc2 = async (renz: any, text: string, foot: string, text1: any, text2: any, btn1: any, btn2: any, loc: any, thumb: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 },
      { buttonId: btn2, buttonText: { displayText: text2 }, type: 1 }
    ]

    const buttonMessage = {
      location: {
        jpegThumbnail: thumb,
      },
      caption: text,
      footer: foot,
      buttons: buttons,
      headerType: 1,
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND BUTTON LOC 3 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param text1 
   * @param text2 
   * @param text3 
   * @param btn1 
   * @param btn2 
   * @param btn3 
   * @param loc 
   * @param thumb 
   */
  public sendBtnLoc3 = async (renz: any, text: string, foot: string, text1: any, text2: any, text3: any, btn1: any, btn2: any, btn3: any, loc: any, thumb: any) => {
    const buttons = [
      { buttonId: btn1, buttonText: { displayText: text1 }, type: 1 },
      { buttonId: btn2, buttonText: { displayText: text2 }, type: 1 },
      { buttonId: btn3, buttonText: { displayText: text3 }, type: 1 }
    ]

    const buttonMessage = {
      location: {
        jpegThumbnail: thumb,
      },
      caption: text,
      footer: foot,
      buttons: buttons,
      headerType: 1,
    }

    sock.sendMessage(renz.from, buttonMessage, { quoted: renz })

  }

  //-- SEND HYDRATE 1 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param turl 
   * @param url 
   * @param tcall 
   * @param call 
   * @param btn1 
   * @param id1 
   */
  public hy1 = async (renz: any, text: any, foot: any, turl: any, url: any, tcall: any, call: any, btn1: any, id1: any) => {
    const tbtn = [
      {
        index: 1, urlButton: {
          displayText: turl,
          url: url,
        }
      },
      {
        index: 2, callButton: {
          displayText: tcall,
          phoneNumber: call,
        }
      },
      { index: 3, quickReplyButton: { displayText: btn1, id: id1 } }
    ]
    const msg = {
      text: text,
      footer: foot,
      templateButtons: tbtn
    }
    sock.sendMessage(renz.from, msg, { quoted: renz })
  }

  //-- SEND HYDRATE 2 --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param foot 
   * @param turl 
   * @param url 
   * @param tcall 
   * @param call 
   * @param btn1 
   * @param id1 
   * @param btn2 
   * @param id2 
   */
  public hy2 = async (renz: any, text: any, foot: any, turl: any, url: any, tcall: any, call: any, btn1: any, id1: any, btn2: any, id2: any) => {
    const tbtn = [
      {
        index: 1, urlButton: {
          displayText: turl,
          url: url,
        }
      },
      {
        index: 2, callButton: {
          displayText: tcall,
          phoneNumber: call,
        }
      },
      { index: 3, quickReplyButton: { displayText: btn1, id: id1 } },
      { index: 4, quickReplyButton: { displayText: btn2, id: id2 } }
    ]
    const msg = {
      text: text,
      footer: foot,
      templateButtons: tbtn
    }
    sock.sendMessage(renz.from, msg, { quoted: renz })
  }

  //# READ CHAT 
  public readChat = async (jid: Proto, participant: string, messageID: string) => {
    return await this.socket.sendReadReceipt(typeof jid === 'object' ? jid.key.remoteJid! : jid, participant, [messageID])
  }



  //-- END FUNC SEND MSG

  public throw = async (renz: Proto, error: any, cmd: string): Promise<baileys.proto.WebMessageInfo> => {
    await this.send(set.numown[0] + '@s.whatsapp.net', {
      text: `Error\nCommand: ${cmd}\n\n${error}`,
    });
    return client.reply(renz, set.resp.error);
  };

  downloadMessage = async (renz: Proto, filename?: string) => {
    try {
      const values = Object.values(this.messageType);
      const type = Object.keys(renz).find((a) => values.includes(a) && !a.includes('senderKey') && !a.includes('context'));
      return this.getBuffer(
        await this.baileys.downloadContentFromMessage(
          renz[type as keyof Proto] as baileys.DownloadableMessage,
          (type as string).replace(/Message/i, '').trim() as baileys.MediaType,
        ),
        filename,
      );
    } catch (e) {
      throw util.logger.format(e);
    }
  };

  public metadata = (renz: baileys.proto.IWebMessageInfo): Promise<Proto> => {
    async function fallback(renz: baileys.proto.IWebMessageInfo) {
      const proto: Proto = {} as Proto;
      proto.type = [
        Object.keys(renz.message!)[0],
        Object.keys(renz.message!).find((a) => {
          const b = a.toString().toLowerCase();
          return !b.includes('senderkey') && !b.includes('context');
        }),
      ]; // [0] for realType else [1]

      //-- NGANU 

      //-- PROTO BAILEYS
      proto.baileys = renz.key?.id ? renz.key?.id.length === 16 || renz.key.id.startsWith("3EB0") : false

      //-- PROTO MESSAGE
      proto.message = proto.type[1] === 'ephemeralMessage' ? renz.message?.ephemeralMessage?.message : renz.message;

      //-- PROTO DATA
      proto.data =
        typeof renz.message![proto.type[1] as keyof baileys.proto.IMessage] === 'object'
          ? Object.keys(renz.message![proto.type[1] as keyof baileys.proto.IMessage]!).includes('contextInfo')
            ? Object.keys(renz.message![proto.type[1] as keyof baileys.proto.IMessage]!).concat(
              Object.keys((renz.message![proto.type[1] as keyof baileys.proto.IMessage]! as Record<string, any>).contextInfo),
            )
            : Object.keys(renz.message![proto.type[1] as keyof baileys.proto.IMessage]!)
          : Object.keys(renz.message!);

      //-- PROTO STRING
      proto.string =
        proto.type[1] === 'conversation'
          ? renz.message?.conversation
          : proto.data.includes('caption')
            ? (renz.message as Record<keyof baileys.proto.IMessage, any>)[proto.type[1] as keyof baileys.proto.IMessage]!.caption
            : proto.type[1] === 'extendedTextMessage'
              ? (renz.message as Record<keyof baileys.proto.IMessage, any>)[proto.type[1] as keyof baileys.proto.IMessage].text
              : proto.type[1] === 'templateButtonReplyMessage'
                ? (renz.message as Record<keyof baileys.proto.IMessage, any>)[proto.type[1] as keyof baileys.proto.IMessage].selectedId
                : proto.type[1] === 'listResponseMessage'
                  ? (renz.message as Record<keyof baileys.proto.IMessage, any>)[proto.type[1] as keyof baileys.proto.IMessage].singleSelectReply.selectedRowId
                  : proto.type[1] === 'buttonsResponseMessage'
                    ? (renz.message as Record<keyof baileys.proto.IMessage, any>)[proto.type[1] as keyof baileys.proto.IMessage].selectedButtonId : '';

      //-- PROTO BODY
      proto.body = renz.message![proto.type[1] as keyof baileys.proto.IMessage];

      //-- PROTO VIEW
      proto.view = proto.body ? proto.body : renz.message![proto.type[1] as keyof baileys.proto.IMessage];

      proto.from = renz.key.remoteJid;

      proto.validator = {
        msg: {
          isText: proto.type[1] === 'conversation' || proto.type[1] === 'extendedTextMessage',
          isMedia:
            proto.type[1] === 'stickerMessage' ||
            proto.type[1] === 'imageMessage' ||
            proto.type[1] === 'audioMessage' ||
            proto.type[1] === 'videoMessage' ||
            proto.type[1] === 'documentMessage',
        },
        isOwner: false,
        isGroup: proto.from!.includes('@g.us'),
      };

      proto.sender = proto.validator.isGroup == false ? renz.key.remoteJid : renz.key.participant;

      proto.validator.isOwner =
        set.numown.includes(proto.sender ? proto.sender.split('@')[0].split(':')[0] : '') || (renz.key.fromMe ?? false);
      proto.client = {
        name: client.socket.user.name,
        jid: client.socket.user.id.split(':')[0] + '@s.whatsapp.net',
      };

      proto.mentions =
        proto.data.includes('contextInfo') && proto.data.includes('mentionedJid')
          ? (renz.message as Record<keyof baileys.proto.IMessage, any>)[proto.type[1] as keyof baileys.proto.IMessage].contextInfo.mentionedJid
          : undefined;

      proto.quotedMsg =
        proto.data.includes('contextInfo') && proto.data.includes('quotedMessage')
          ? ({
            key: {
              remoteJid: proto.from,
              fromMe:
                (renz.message as Record<keyof baileys.proto.IMessage, any>)[proto.type[1] as keyof baileys.proto.IMessage].contextInfo
                  .participant === client.socket.user.id,
              id: (renz.message as Record<keyof baileys.proto.IMessage, any>)[proto.type[1] as keyof baileys.proto.IMessage].contextInfo.stanzaId,
              participant: (renz.message as Record<keyof baileys.proto.IMessage, any>)[proto.type[1] as keyof baileys.proto.IMessage].contextInfo.participant,
              //participant: (renz.key.participant : sock.user.id) : renz.key.remoteJid,
              //baileys: (renz.key.id && renz.key.id.length === 16 || renz.key.id.startsWith("3EB0") && renz.key.id.length === 12 || false as baileys.proto.IMessage),
            },
            message: (renz.message as Record<keyof baileys.proto.IMessage, any>)[proto.type[1] as keyof baileys.proto.IMessage].contextInfo
              .quotedMessage,
          } as {
            key: baileys.proto.IMessageKey;
            message: baileys.proto.IMessage;
          } as Proto)
          : undefined;
      /*
      proto.groupData = proto.validator.isGroup ? (await sock.groupMetadata(proto.from!)) ?? undefined : undefined;
      */

      //proto.gcData = proto.validator.isGroup ? (await sock.groupMetadata(proto.from!)) : false;
      try {
        proto.gcData = proto.validator.isGroup ? (await client.socket.groupMetadata(renz.key.remoteJid!)) : false;
      } catch {
      }
      proto.util = {
        downMsg: async (filename: string | undefined) => await client.downloadMessage(proto.message! as Proto, filename!),
        delMsg: (forAll = true) => {
          if (forAll) {
            return sock.sendMessage(proto.from!, {
              delete: {
                fromMe: true,
                id: renz.key.id,
                participant: renz.key.remoteJid,
              },
            });
          } else {
            return sock.sendMessage(proto.from!, {
              delete: {
                fromMe: true,
                id: renz.key.id,
                participant: renz.key.remoteJid,
              },
            });
          }
        },
      };

      proto.quotedMsg = proto.quotedMsg
        ? (((client.chats as Record<string, object>)[renz.key.remoteJid!] &&
          (client.chats as Record<string, { messages: Record<string, object> }>)[renz.key.remoteJid!].messages[
          (proto.quotedMsg as Proto).key.id!
          ]) as Proto) || (await fallback(proto.quotedMsg! as Proto))
        : false;
      return { ...renz, ...proto };
    }
    return fallback(renz);
  };


  //---- END ANU
  private prepareSticker = async (content: GetBuffer, exifPath: string) => {
    try {
      const bufferData = await this.getBuffer(content),
        Buffer = bufferData.buffer;
      const input = util.autoPath(bufferData.ext),
        output = util.autoPath('webp');
      if (!existsSync('./tmp')) mkdirSync('tmp');
      writeFileSync(input, Buffer);

      if (bufferData.ext === 'webp') {
        if (exifPath) {
          return exec(`webpmux -set exif=${exifPath} ${input} ${input}`, (e) => {
            if (e) throw e;
            const saver = readFileSync(input);
            unlinkSync(input);
            return saver;
          });
        } else {
          const saver = readFileSync(input);
          unlinkSync(input);
          return saver;
        }
      }

      return Ffmpeg(input)
        .on('error', (e) => {
          unlinkSync(input);
          throw util.logger.format(new Error(e));
        })
        .videoCodec('libwebp')
        .addInputOptions([
          '-vf',
          "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
        ])
        .toFormat('webp')
        .save(output)
        .on('end', () => {
          if (exifPath) {
            return exec(`webpmux -set exif=${exifPath} ${output} ${output}`, (e) => {
              if (e) throw util.logger.format(e);
              const saver = readFileSync(output);
              unlinkSync(input);
              unlinkSync(output);
              return saver;
            });
          } else {
            const saver = readFileSync(output);
            unlinkSync(input);
            unlinkSync(output);
            return saver;
          }
        });
    } catch (e) {
      throw util.logger.format(e);
    }
  };
}
