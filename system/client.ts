// MODULE EXTERNAL 

import core from 'file-type/core';
import axios from 'axios';
import Ffmpeg from 'fluent-ffmpeg';
import { Agent } from 'https';
import { exec } from 'child_process';
import { Readable } from 'stream';
const { fromBuffer } = require('file-type');
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
const PhoneNumber = require('awesome-phonenumber');
const pino = require('pino');
import * as baileys from '@adiwajshing/baileys';


// MODULE INTERNAL 
import { headers } from './util';
//import * as renz from './renz';
import { GetBuffer, ButtonConfig, Content, Proto, StickerConfig } from './client.d';

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

  //-- MULAI FUNCTION

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

  //-- SEND TEXT IMG & EXP --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param time 
   * @param buf 
   * @returns 
   */
  public sendText = async (renz: Proto, text: string, time: number, buf: string): Promise<baileys.proto.WebMessageInfo> =>
    this.send(renz, {
      text: text,
      jpegThumbnail: buf,
      ephemeralExpiration: time,
      quoted: renz
    });

  //-- SEND TEXT THUMB --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param buffer 
   * @returns 
   */
  public sendTt = async (renz: Proto, text: string, buffer: string): Promise<baileys.proto.WebMessageInfo> =>
    this.send(renz, {
      text: util.logger.format(text).trim(),
      jpegThumbnail: buffer
    });


  //-- SEND REPL IMG --//
  /**
   * 
   * @param renz 
   * @param text 
   * @param buffer 
   * @returns 
   */
  public repImg = async (renz: Proto, text: string, buffer: string): Promise<baileys.proto.WebMessageInfo> =>
    this.send(renz, { text: util.logger.format(text).trim(), jpegThumbnail: buffer, quoted: renz });

  //-- SEND VN --//
  /**
   * 
   * @param renz 
   * @param text 
   */
  public sendVn = async (renz: Proto, text: string) => {
    let url = await client.getBuffer(text)
    this.send(renz, { audio: (await url.buffer) as baileys.WAMediaUpload, ptt: true, mimetype: 'audio/mpeg', quoted: renz })
  }

  //-- SEND AUDIO --//
  /**
   * 
   * @param renz 
   * @param text 
   */
  public sendAud = async (renz: Proto, text: string) => {
    let url = await client.getBuffer(text)
    this.send(renz, { audio: (await url.buffer) as baileys.WAMediaUpload, ptt: false, mimetype: 'audio/mpeg', quoted: renz })
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

  /*
  //# SEND REACTION
  public react = async (renz: any, reaction: string, key: string) => {
  return this.socket.sendMessage(renz.from, {
  react: {
  text: reaction,
  key: key
  }
  })
  }
  */

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

  //-- SEND BUTTON --//
  public sendBtn1 = async (renz: any, text: string, foot: string, text1: any, btn1: any) => {
    const buttons = [
      {buttonId: btn1, buttonText: {displayText: text1}, type: 1}
    ]
    
    const buttonMessage = {
        text: text,
        footer: foot,
        buttons: buttons,
        headerType: 1
    }
    
    client.socket.sendMessage(renz.from, buttonMessage, { quoted : renz})

  }
  
  //-- SEND HYDRATE 1 --- //
  public hy1 = async (renz: any, text: any, foot: any, turl1: any, url1: any, turl2: any, url2: any, btn1: any, id1: any) => {
    const templateButtons = [
      { index: 1, urlButton: { displayText: turl1, url: url1 } },
      { index: 2, urlButton: { displayText: turl2, url: url2 } },
      { index: 3, quickReplyButton: { displayText: btn1, id: id1 } },
    ]

    const msg = {
      text: text,
      footer: foot,
      templateButtons: templateButtons
    }
    return this.socket.sendMessage(renz.from, msg)
  }

  //## GET PP 
  public getpp = async (renz: Proto | string) => {
    return await this.socket.profilePictureUrl(typeof renz === 'object' ? renz.key.remoteJid! : renz)
  }

  //# BALAS PESAN 
  public bls = async (renz: any, text: string) => {
    return this.socket.sendMessage(renz.quotedMsg.string, { text: util.logger.format(text).trim() });
  }


  //# READ CHAT 
  public readChat = async (jid: Proto, participant: string, messageID: string) => {
    return await this.socket.sendReadReceipt(typeof jid === 'object' ? jid.key.remoteJid! : jid, participant, [messageID])
  }

  //# ADREPLY GC
  public adGc = async (renz: any, text: any) => {
    let gc = await this.getBuffer("https://telegra.ph/file/839791ed5d331b4450bcd.jpg")
    let ban = gc.buffer

    this.send(renz, {
      text: text,
      quoted: renz,
      ephemeralExpiration: 24 * 3600,
      contextInfo: {
        forwardingScore: 1337,
        isForwarded: true,
        externalAdReply: {
          title: set.name,
          body: `Klik disini untuk wa owner`,
          previewType: 'PHOTO',
          thumbnail: ban,
          sourceUrl: set.gc[0],
        }
      }
    })

  }


  //# ADREPLY FULL 
  public adFul = async (renz: any, text: any) => {
    let gc = await this.getBuffer("https://telegra.ph/file/0b51e39c9d1aaa5404759.jpg")
    let ban = gc.buffer
    let gca = await this.getBuffer("https://telegra.ph/file/f8f6a733d8dd23acec9ab.jpg")
    let bana = gca.buffer

    this.send(renz, {
      text: text,
      //jpegThumbnail: `${bana}`,
      quoted: renz,
      ephemeralExpiration: 24 * 3600,
      contextInfo: {
        forwardingScore: 1337,
        isForwarded: true,
        externalAdReply: {
          title: set.name,
          body: `Klik disini untuk wa owner`,
          previewType: 'PHOTO',
          thumbnail: ban,
          sourceUrl: "https://wa.me/",
        }
      }
    })

  }


  //-- RANDOM HYDRATE 3 --//
  public hyr3 = async (jid: any, capt: any, foot: any, is1: any, iS1: any, is2: any, iS2: any, btn1: any, id1: any, btn2: any, id2: any, btn3: any, id3: any) => {
    //-- KOCOK ANU HYDRATE --//
    //-- RANDOM TITLE
    var name = await this.rand(['MyWA BOT By Amirul Dev', 'MyWA Multi Device', 'Multi Device Bot WA', 'MyWA Bot Hosting'])

    //-- RANDOM MIMETYPE
    var mim = await this.rand(['application/msword', 'application/vnd.ms-powerpoint', 'text/rtf', 'application/vnd.ms-excel', 'application/pdf'])

    var gba = await this.getBuffer(set.banner[0])
    var bana = gba.buffer

    //-- MULAI RANDM HYDRATED
    var key = [{
      video: { url: 'https://amiruldev20.github.io' },
      jpegThumbnail: readFileSync("./media/ban1.jpg"),
      fileLength: 1989988782292,
      caption: capt,
      footer: foot,
      templateButtons: [
        {
          index: 1, urlButton: {
            displayText: is1,
            url: iS1
          }
        },
        {
          index: 2, callButton: {
            displayText: is2,
            phoneNumber: iS2
          }
        },
        {
          index: 3, quickReplyButton: {
            displayText: btn1, id: id1
          }
        },
        {
          index: 4, quickReplyButton: {
            displayText: btn2, id: id2
          }
        },
        {
          index: 5, quickReplyButton: {
            displayText: btn3, id: id3
          }
        },
      ]
    },

    {
      document: { url: 'https://amiruldev20.github.io' },
      jpegThumbnail: readFileSync('./media/ban2.jpg'),
      mimetype: mim,
      fileName: name,
      fileLength: 1989988782292,
      pageCount: 8787622,
      caption: capt,
      footer: foot,
      templateButtons: [
        {
          index: 1, urlButton: {
            displayText: is1,
            url: iS1
          }
        },
        {
          index: 2, callButton: {
            displayText: is2,
            phoneNumber: iS2
          }
        },
        {
          index: 3, quickReplyButton: {
            displayText: btn1, id: id1
          }
        },
        {
          index: 4, quickReplyButton: {
            displayText: btn2, id: id2
          }
        },
        {
          index: 5, quickReplyButton: {
            displayText: btn3, id: id3
          }
        },
      ]
    },

    {
      location: {
        jpegThumbnail: readFileSync("./media/ban3.jpg")
      },
      caption: capt,
      footer: foot,
      templateButtons: [
        {
          index: 1, urlButton: {
            displayText: is1,
            url: iS1
          }
        },
        {
          index: 2, callButton: {
            displayText: is2,
            phoneNumber: iS2
          }
        },
        {
          index: 3, quickReplyButton: {
            displayText: btn1, id: id1
          }
        },
        {
          index: 4, quickReplyButton: {
            displayText: btn2, id: id2
          }
        },
        {
          index: 5, quickReplyButton: {
            displayText: btn3, id: id3
          }
        },
      ]
    },

    {
      image: {
        url: "https://i.ibb.co/bJ8gKpC/l1.jpg"
      },
      jpegThumbnail: readFileSync("./media/ban1.jpg"),
      caption: capt,
      footer: foot,
      templateButtons: [
        {
          index: 1, urlButton: {
            displayText: is1,
            url: iS1
          }
        },
        {
          index: 2, callButton: {
            displayText: is2,
            phoneNumber: iS2
          }
        },
        {
          index: 3, quickReplyButton: {
            displayText: btn1, id: id1
          }
        },
        {
          index: 4, quickReplyButton: {
            displayText: btn2, id: id2
          }
        },
        {
          index: 5, quickReplyButton: {
            displayText: btn3, id: id3
          }
        },
      ]
    },

    {
      video: { url: 'https://telegra.ph/file/08b3d68e948535d96ecec.mp4' },
      jpegThumbnail: readFileSync("./media/ban2.jpg"),
      gifPlayback: true,
      fileLength: 1989988782292,
      caption: capt,
      footer: foot,
      templateButtons: [
        {
          index: 1, urlButton: {
            displayText: is1,
            url: iS1
          }
        },
        {
          index: 2, callButton: {
            displayText: is2,
            phoneNumber: iS2
          }
        },
        {
          index: 3, quickReplyButton: {
            displayText: btn1, id: id1
          }
        },
        {
          index: 4, quickReplyButton: {
            displayText: btn2, id: id2
          }
        },
        {
          index: 5, quickReplyButton: {
            displayText: btn3, id: id3
          }
        },
      ]
    }
    ]
    var hs = await this.rand(key)
    const sendMsg = await this.socket.sendMessage(jid.from, hs)
    return sendMsg
  }

  //# SEND STIKER 
  //public sendStimg


  //# COPY N FORWARD 
  /*
  public copynfwd = async (renz: Proto, text: string, forwardingScore: boolean, content: Content): Promise<baileys.proto.WebMessageInfo> => {
  let m = baileys.generateForwardMessageContent(text, !!forwardingScore)
  let mtype = Object.keys(m)[0]
  if (forwardingScore && typeof forwardingScore == 'number' && forwardingScore > 1) m[mtype].contextInfo.forwardingScore += forwardingScore
   m = baileys.generateWAMessageFromContent(typeof renz === 'object' ? renz.key.remoteJid! : renz, m, { ...options, userJid: conn.user.id })
  await conn.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } })
  return m
  }
  */

  /*
  public sendCar = async (renz: Proto, text: string, content: Content) => {
  let contacts = []
  for (let [number, name, isi1, isi2, isi3, isi4] of text) {
  number = number.replace(/[^0-9]/g, '')
  let njid = number + '@s.whatsapp.net'
  let biz = await this.socket.getBusinessProfile(njid) || {}
  // N:;${name.replace(/\n/g, '\\n').split(' ').reverse().join(';')};;;
   
  var vcard = `
  BEGIN:VCARD
  VERSION:3.0
  N:Sy;Bot;;;
  FN:${name.replace(/\n/g, '\\n')}
  item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
  item1.X-ABLabel:📌 ${isi1}
  item2.EMAIL;type=INTERNET:${isi2}
  item2.X-ABLabel:✉️ Email
  item3.URL:${isi3}
  item3.X-ABLabel:Website
  item4.ADR:;;🇮🇩 Indonesia;;;;
  item4.X-ABADR:ac
  item4.X-ABLabel:📍 Region
  item5.X-ABLabel:🔖 ${isi4}
  END:VCARD`
   
  contacts.push({ vcard, displayName: name })
  }
  return await this.socket.sendMessage(typeof renz === 'object' ? renz.key.remoteJid! : renz, {
  contacts: {
  ...content,
  displayName: (contacts.length > 1 ? `437 kontak` : contacts[0].displayName) || null,
  contacts,
  },
   ...content
  })
  }
  */

  public sendSticker = async (renz: Proto, content: StickerConfig | Content): Promise<baileys.proto.WebMessageInfo> =>
    this.send(renz, {
      sticker: (await this.prepareSticker(
        (content as StickerConfig).buffer,
        (content as StickerConfig).exif ?? './src/ninja.exif',
      )) as baileys.WAMediaUpload,
      ...content,
    });

  public sendButton = async (renz: Proto, content: Content, buttons: ButtonConfig[]): Promise<baileys.proto.WebMessageInfo> => {
    try {
      function parseBtn(type: string, object: ButtonConfig) {
        return 'title' in object
          ? ({
            ...object,
            title: object.listTitle ?? undefined,
            rowId: object.value ?? undefined,
          } as {
            title?: string | null;
            description?: string | null;
            rowId?: string | null;
          })
          : ({
            [type.includes('reply') ? 'quickReplyButton' : type + 'Button']: {
              displayText: object[type as keyof ButtonConfig],
              [type.includes('reply') ? 'id' : type.includes('call') ? 'phoneNumber' : type]: object.value ?? '',
            },
          } as baileys.proto.IHydratedTemplateButton);
      }

      let hasList = false;
      let buttonsData: baileys.proto.IHydratedTemplateButton[] | baileys.proto.ISection[] = [];

      for (const a of buttons) {
        const type = Object.keys(a)
          .find((c) => c !== 'value')
          ?.toLowerCase();
        const parse = type ? parseBtn(type, a) : undefined;

        if ('title' in a) {
          hasList = true;
          const rows: baileys.proto.IRow[] = [];
          rows.push(parse as baileys.proto.IRow);
          buttonsData.push({
            rows,
            title: a.title,
          });
        } else buttonsData = (buttonsData as baileys.proto.IHydratedTemplateButton[]).concat(parse as baileys.proto.IHydratedTemplateButton[]);
      }

      return this.send(renz, {
        ...content,
        ...{ [hasList ? 'sections' : 'templateButtons']: buttonsData },
      });
    } catch (e) {
      throw util.logger.format(e);
    }
  };

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
							//participant: (renz.key.participant : client.socket.user.id) : renz.key.remoteJid,
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
			proto.groupData = proto.validator.isGroup ? (await client.socket.groupMetadata(proto.from!)) ?? undefined : undefined;
			*/

			//proto.gcData = proto.validator.isGroup ? (await client.socket.groupMetadata(proto.from!)) : false;

			proto.gcData = proto.validator.isGroup ? (await client.socket.groupMetadata(renz.key.remoteJid!)) : false;

			proto.util = {
				downMsg: async (filename: string | undefined) => await client.downloadMessage(proto.message! as Proto, filename!),
				delMsg: (forAll = true) => {
					if (forAll) {
						return client.socket.sendMessage(proto.from!, {
							delete: {
								fromMe: true,
								id: renz.key.id,
								participant: renz.key.remoteJid,
							},
						});
					} else {
						return client.socket.sendMessage(proto.from!, {
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
