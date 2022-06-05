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
import fs from 'fs';
import chalk from 'chalk';
import FormData from 'form-data';

//-- MODULE INTERNAL
import CommandHandler from './cmd';
import CreateConnection from './connection';
import { loadFile } from './CommandFile';
import {
	format
}
	from 'util';
import {
	readFileSync, readdirSync, existsSync, mkdirSync
}
	from 'fs';
import axios, {
	AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse
}
	from 'axios';

let yargs = require('yargs')

//--- NGANU DATABASE ---//
const set = require('../database/settings.json')

export async function delay(ms: number): Promise<void> {
	new Promise((resolve) => setTimeout(resolve, ms));
}
export function wings(text: string) {
	return `${set.unicode.wings[0]}*${text.trim()}*${set.unicode.wings[1]}`;
}
export function isUrl(text: string): boolean {
	return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&\/=]*)/gi.test(text);
}
export function parseRegex(text: string): string {
	return text.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
export function randomize<T>(content: any[] | number): T | number {
	if (content instanceof Array) {
		return content[Math.floor(Math.random() * content.length)];
	} else {
		return Math.floor(Math.random() * content);
		// console.log(client)
	}
}
export function autoPath(format: string, filename?: string, useTemp = true): string {
	if (useTemp && !existsSync(global.set.tempDir.split('/')[1])) mkdirSync(global.set.tempDir.split('/')[1]);
	const basePath = useTemp ? global.set.tempDir : '';
	return `${basePath}${filename
		? filename.includes('?>')
			? Date.now() + filename.split('?>')[1]
			: filename.includes('?<')
				? filename.split('?<')[1] + Date.now()
				: filename
		: 'clk' + Date.now()
		}${format && !format.includes('.') ? '.' + format : format}`;
}
export function headers(additional?: AxiosRequestConfig, additionalHeaders?: AxiosRequestHeaders) {
	return {
		headers: {
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/99.0.1150.30',
			'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="99", "Microsoft Edge";v="99"',
			dnt: 1,
			...additionalHeaders,
		},
		...additional,
	};
}
export async function waVersion(): Promise<[number, number, number]> {
	const defaultVersion: [number, number, number] = [2, 2022, 12];
	try {
		const request: AxiosResponse = await axios.get('https://web.whatsapp.com/check-update?version=1&platform=web', headers());
		if (request.status === 200 && request.data?.currentVersion) {
			return [
				Number(request.data.currentVersion.split('.')[0]),
				Number(request.data.currentVersion.split('.')[1]),
				Number(request.data.currentVersion.split('.')[2]),
			];
		} else {
			return defaultVersion;
		}
	} catch (e) {
		return defaultVersion;
	}
}
export function parseJson(json: object, options?: {
	ignoreValue?: any[];
	ignoreKey?: string[];
	header?: string;
	body?: string;
	footer?: string;
	preResult?: boolean;
},): string | string[][] {
	if (Object.entries(json).length === 0) throw new Error('No json input provided');
	const opt = {
		ignoreValue: [null, undefined],
		ignoreKey: [],
		header: '',
		body: `${global.set.unicode.bullet} *%key :* %value`,
		footer: '━━━━━━━━━━━━━━━━━━━━',
		preResult: false,
		...options,
	};
	const content: string[][] = [];
	for (const [a, b] of Object.entries(json)) {
		if (opt.ignoreValue.indexOf(b) !== -1) continue;
		const key = a.replace(/[A-Z_]/g, (a) => a.replace(a, ` ${a !== '_' ? a.toLowerCase() : ''}`)).replace(/^\w/, (c) => c.toUpperCase());
		const type = typeof b;
		if (opt.ignoreKey && (opt.ignoreKey as string[]).includes(a)) continue;
		switch (type) {
			case 'boolean':
				content.push([key, b ? 'Ya' : 'Tidak']);
				break;
			case 'object':
				if (Array.isArray(b)) {
					content.push([key, b.join(', ')]);
				} else {
					content.push([
						key,
						parseJson(b, {
							ignoreKey: opt.ignoreKey,
							preResult: true,
						}) as string,
					]);
				}
				break;
			default:
				content.push([key, b]);
				break;
		}
	}
	if (opt.preResult) return content;
	const compile: string[] = [
		opt.header === '' ? '' + '\n' : `${global.set.unicode.wings[0]}*${opt.header}*${global.set.unicode.wings[1]}\n`,
		content.map((a) => {
			return opt.body.replace(/%key/g, a[0]).replace(/%value/g, a[1]).trim();
		}).join('\n'),
		Array.isArray(json) ? `\n\n${opt.footer}\n` : '',
	];
	return compile.join('');
}

export async function run(): Promise<void> {
	try {
		console.clear();
		console.log(chalk.green('Starting NINJA BOT...'));
		await delay(2000);
		console.clear();
		console.log(chalk.cyan.bold(readFileSync('./system/loader.txt').toString()));

		global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
		global.set = set;
		global.util = await
			import('./util');
		global.database = {};
		if (!existsSync('./database')) mkdirSync('./database');
		for (const a of readdirSync('./database/')) {
			global.database[a.replace('.json', '')] = (await
				import(`../database/${a}`)).default;
		}

		//--- GLOBAL DATABASE ---//
		logger.database('Database loaded');
		global.client = await CreateConnection();
		global.cmd = new CommandHandler();
		//console.log(cmd)
		await loadFile('./system/event');
		await loadFile('./system/cmd');
		let usr = require(`../${opts._[0] ? opts._[0] + '_' : 'ninjabot'}.db.json`)
        global.db = usr
		
		client.socket.ev.on('messages.upsert', async (upsert) => {
			if (!Object.keys(upsert.messages[0]).includes('message') || !Object.keys(upsert.messages[0]).includes('key')) {
				return;
			}
			const renz = await client.metadata(upsert.messages[0])
			global.renz = renz
			global.sock = client.socket
		})
		return global.cmd.commandList.length > 0 ? logger.cmd(`Succesfully loaded ${global.cmd.commandList.length} commands, bot ready!!`) : logger.warn('There is no command loaded');

	} catch (e) {
		throw logger.format(e);
	}
}
export const append = {
	params: (data: object): URLSearchParams => new URLSearchParams(Object.entries(data)),
	form: (data: object): FormData => {
		const form = new FormData();
		for (const a of Object.entries(data)) {
			form.append(a[0], a[1]);
		}
		return form;
	},
};
export const logger = {
	format: (message: any) => format(message),
	info: (message: any) => console.log(`${chalk.blueBright.bold('NINJA BOT')} ~> ${format(message)}`),
	warn: (message: any) => console.log(`${chalk.yellowBright.bold('WARNING')}  ~> ${format(message)}`),
	cmd: (message: any) => console.log(`${chalk.hex('#6ca8fc').bold('NINJA BOT')} ~> ${format(message)}`),
	database: (message: any) => console.log(`${chalk.magentaBright.bold('DATABASE')} - ${format(message)}`),
};
