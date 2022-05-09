//-- MODULE EXTERNAL
const cp = require('child_process');
import {
	format, promisify
}
	from 'util'
let exec = promisify(cp.exec).bind(cp)
import syntaxerror from 'syntax-error'
import {
	fileURLToPath
}
	from 'url'
import {
	dirname
}
	from 'path'
import * as fetch from 'node-fetch'
const axios = require('axios')
const bo = require('@bochilteam/scraper')
const bail = require('@adiwajshing/baileys')
const wsf = require('wa-sticker-formatter')
const os = require('os')
const fs = require("fs")
const pino = require('pino')

cmd.on(
	['>', '=>'], ['owner'], async (renz, {
		text, cmd
	}) => {
	//-- ATRIBUT
	const anu = await client.rand(set.banner)
	const buf = await client.getBuffer(anu)
	const xurl = `https://telegra.ph/file/0ca2fdeabe1ce8de08103.jpg`
	const wm1 = `Made by Amirul Dev`
	const wm2 = `Made by @687824239`
	const web = 'https://amiruldev.my.id'
	const tweb = 'MY WEBSITE'
	const parse = cmd.includes('=>') ? text.replace('=>', 'return ').replace('md', 'client.socket').replace('legacy', 'client.socket').replace('zz', '.toString()') : text.replace('>', '').replace('md', 'client.socket').replace('legacy', 'client.socket')
	try {
		const evaluate = await eval(`;(async () => {${parse} })()`).catch((e: unknown) => {
			return client.reply(renz, e as string);
		});
		return client.reply(renz, evaluate);
	} catch (e) {
		return client.reply(renz, e as string);
	}
}, {
	help: 'tes',
	owner: true,
	wait: false,
	prefix: false,
});
cmd.on(
	['$'], ['owner'], async (renz, {
		query, text
	}) => {
	let o
	try {
		o = await exec(query)
	} catch (e) {
		o = e
	} finally {
		let {
			stdout, stderr
		} = o
		if (stdout.trim()) client.reply(renz, stdout)
		if (stderr.trim()) client.reply(renz, stderr)
	}
}, {
	owner: true,
	wait: false,
	prefix: false,
});
cmd.on(
	['push'], ['owner'], async (renz, {
		query, text
	}) => {
	let anu = `git add . && git commit -m "${query}" && git push`
	let o
	try {
		o = await exec(anu)
	} catch (e) {
		o = e
	} finally {
		let {
			stdout, stderr
		} = o
		if (stdout.trim()) client.reply(renz, stdout)
		if (stderr.trim()) client.reply(renz, stderr)
	}
}, {
	owner: true,
	wait: false,
	prefix: false,
});
cmd.on(
	['pull'], ['owner'], async (renz, {
		query, text
	}) => {
	let anu = `git pull`
	let o
	try {
		o = await exec(anu)
	} catch (e) {
		o = e
	} finally {
		let {
			stdout, stderr
		} = o
		if (stdout.trim()) client.reply(renz, stdout)
		if (stderr.trim()) client.reply(renz, stderr)
	}
}, {
	owner: true,
	wait: false,
	prefix: false,
});
