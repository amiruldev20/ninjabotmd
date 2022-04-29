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

	//# SEND MESSAGE
	public send = async (renz: Proto | string, content: Content): Promise<baileys.proto.WebMessageInfo> => {
		try {
			let property: Record<string, any> = content;

			const type = Object.keys(property).find((a) => this.messageType[a]);
			if (!type) throw util.logger.format(new Error('The type is not defined'));
			const mediaKey = ['document', 'video', 'audio', 'image', 'sticker'];

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


	//# GET BUFFER
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
	 * @param  {any[]|number} content
	 */
	public rand = (content: any[] | number) => {
		if (content instanceof Array) {
			return content[Math.floor(Math.random() * content.length)];
		} else {
			return Math.floor(Math.random() * content);
			console.log(client)
		}
	}

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
	 * @param  {any} renz
	 * @param  {any} text
	 */
	public sendMsg = async (renz: any, text: any) => {
		return this.socket.sendMessage(renz.from, { text: text })
	}

	//# SEND REPLY 
	/**
	 * @param  {Proto} renz
	 * @param  {string} text
	 */
	public reply = async (renz: Proto, text: string): Promise<baileys.proto.WebMessageInfo> =>
		this.send(renz, { text: util.logger.format(text).trim(), quoted: renz });

	//-- SEND STICKER --//
	/**
	 * @param  {any} renz
	 * @param  {Buffer} sticker
	 * @param  {Content} content
	 */
	public sendSt = async (renz: any, sticker: Buffer, content: Content) => {
		return this.socket.sendMessage(renz.from, {
			sticker: sticker,
			...content
		}, { quoted: renz, ephemeralExpiration: 24 * 3600 })
	}

	//# SEND VN 
	/**
	 * @param  {Proto} renz
	 * @param  {string} text
	 */
	public sendVn = async (renz: Proto, text: string) => {
		let url = await client.getBuffer(text)
		this.send(renz, { audio: url.buffer as baileys.WAMediaUpload, ptt: true, mimetype: 'audio/mpeg', quoted: renz })
	}


	//# SEND AUDIO
	/**
	 * @param  {Proto} renz
	 * @param  {string} text
	 */
	public sendAud = async (renz: Proto, text: string) => {
		let url = await client.getBuffer(text)
		this.send(renz, { audio: url.buffer as baileys.WAMediaUpload, ptt: false, mimetype: 'audio/mpeg', quoted: renz })
	}

	//-- SEND MEDIA --//
	/**
	 * @param  {any} jid
	 * @param  {any} path
	 * @param  {string} capt
	 * @param  {boolean} anu
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

	//# READ CHAT 
	/**
	 * @param  {Proto} jid
	 * @param  {string} participant
	 * @param  {string} messageID
	 */
	public readChat = async (jid: Proto, participant: string, messageID: string) => {
		return await this.socket.sendReadReceipt(typeof jid === 'object' ? jid.key.remoteJid! : jid, participant, [messageID])
	}

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

			proto.sender = {
				name: renz.pushName,
				jid: proto.validator.isGroup ? (renz.key.participant ? renz.key.participant : client.socket.user.id) : renz.key.remoteJid,
			};
			proto.validator.isOwner =
				set.numown.includes(proto.sender.jid ? proto.sender.jid.split('@')[0].split(':')[0] : '') || (renz.key.fromMe ?? false);
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
