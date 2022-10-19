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
import { Readable } from 'stream';
import { AnyMessageContent, GroupMetadata, MiscMessageGenerationOptions, proto } from 'baileys';
import { formatDiagnosticsWithColorAndContext } from 'typescript';

// EXPORT CONTENT
export type Content =
	| (AnyMessageContent & MiscMessageGenerationOptions)
	| { image: string }
	| { filename: string }
	| { contextInfo: any }
	| { externalAdReply: any }
	| { isForwarded: boolean }
	| { forwardingScore: number }
	| { fileLength: number }
	| { video: string }
	| { image: string };

// EXPORT BUTTON CONFIG
export type ButtonConfig = { value: string } & (
	| {
		reply: string;
	}
	| {
		url: string;
	}
	| {
		call: string;
	}
	| {
		title?: string;
		description?: string;
		listTitle?: string;
	}
);

// EXPORT GET BUFFER
export type GetBuffer = string | number | Readable | readonly number[] | { valueOf(): string | Uint8Array | readonly number[] } | URL;

export interface StickerConfig {
	buffer: Buffer;
	exif: string;
}


//-- EXPORT PROTO
export interface Proto extends proto.IWebMessageInfo {
	sender: string | null | undefined;
	from: string | null | undefined;
	baileys: boolean;
	chat: string | null | undefined;
	client: {
		name: string | undefined;
		jid: string;
	};
	validator: {
		msg: {
			isText: boolean;
			isMedia: boolean;
		};
		isOwner: boolean;
		isGroup: boolean;
	};
	util: {
		downMsg: (filename?: string) => ReturnType<typeof client.downloadMessage>;
		delMsg: (forAll?: boolean) => Promise<proto.WebMessageInfo>;
	};
	type: [string, string | undefined];
	string: string;
	fromMe: boolean;
	mentions: string[] | undefined;
	message: proto.IMessage | null | undefined;
	quotedMsg: any;
	body: proto.IMessage[keyof proto.IMessage];
	view: proto.Imagemessage[keyof proto.ImageMessage];
	data: string[];
	gcData: any;

}
