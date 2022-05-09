import { Readable } from 'stream';
import { AnyMessageContent, GroupMetadata, MiscMessageGenerationOptions, proto } from '@adiwajshing/baileys';
import { formatDiagnosticsWithColorAndContext } from 'typescript';

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

export type GetBuffer = string | number | Readable | readonly number[] | { valueOf(): string | Uint8Array | readonly number[] } | URL;

export interface StickerConfig {
	buffer: Buffer;
	exif: string;
}

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