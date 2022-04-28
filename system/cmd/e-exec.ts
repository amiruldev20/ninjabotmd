//-- MODULE EXTERNAL
import { exec } from 'child_process';
import syntaxerror from 'syntax-error'
import { format } from 'util'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as fetch from 'node-fetch'
const axios = require('axios')
const bo = require('@bochilteam/scraper')
const bail = require('@adiwajshing/baileys')
const wsf = require('wa-sticker-formatter')
const os = require('os')
const fs = require("fs")
import pino from 'pino';

cmd.on(
	['>', '=>'],
	['owner'],
	async (mel, { text, cmd }) => {
		const parse = cmd.includes('=>') ? text.replace('=>', 'return ').replace('md', 'client.socket').replace('legacy', 'client.socket').replace('zz', '.toString()') : text.replace('>', '').replace('md', 'client.socket').replace('legacy', 'client.socket')
	 	try {
			const evaluate = await eval(`;(async () => {${parse} })()`).catch((e: unknown) => {
				return client.reply(mel, e as string);
			});
			return client.reply(mel, evaluate);
		} catch (e) {
			return client.reply(mel, e as string);
		}
	},
	{
	  help: 'detail command',
		owner: true,
		wait: false,
		prefix: false,
	},
);

cmd.on(
	['$'],
	['owner'],
	async (mel, { query }) => {
		try {
			exec(`${query}`, (e, a) => {
				if (e) return client.reply(mel, `${e}`);
				client.reply(mel, a);
			});
		} catch (e) {
			return client.reply(mel, e as string);
		}
	},
	{
		owner: true,
		wait: false,
		prefix: false,
	},
);
