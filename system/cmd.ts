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
import { proto } from 'baileys';
import { createLiteralTypeNode } from 'typescript';
import { Z_ASCII } from 'zlib';

//-- MODULE INTERNAL
import { Proto } from './client.d';
import { ICommandHandler } from './cmd.d';

export default class CommandHandler {
  commandList: ICommandHandler.Event[];
  tag: { [k: string]: ICommandHandler.Event[] };
  prefix: (string | RegExp)[];
  constructor() {
    this.commandList = [];
    this.tag = {};
    this.prefix = set.prefix.map((a) => ((a as String) instanceof RegExp ? a : new RegExp(`^(${util.parseRegex(a)})`, 'i')));
  }

  public on = (
    cmd: (string | RegExp)[],
    tag: string[],
    callback: (renz: Proto, property: ICommandHandler.CommandProperty) => Promise<any> | any,
    additonal?: ICommandHandler.AdditonalEvent | ICommandHandler.Event,
  ): CommandHandler => {
    const ev: ICommandHandler.Event = {
      name: (cmd as string[])[0].toString(),
      cmd: {
        string: (cmd as string[]).map((a) => a, toString()),
        regExp: (cmd as string[]).map((a) => ((a as any) instanceof RegExp ? a : new RegExp(`^(${util.parseRegex(a)})`, 'i'))),
      },
      tag,
      help: 'Tidak ada info detail command!!',
      limit: 0,
      wait: true,
      prefix: true,
      enable: true,
      index: 0,
      callback,
      ...additonal,
    };

    for (const a of tag) {
      this.tag[a] = this.tag[a] ? this.tag[a] : [];
      this.tag[a].push(ev);
    }
    ev.cmd.regExp = ev.cmd.regExp.concat(
      ((additonal?.alternativeCommand ?? []) as string[]).map((a) =>
        (a as any) instanceof RegExp ? a : new RegExp(`^(${util.parseRegex(a)})`, 'i'),
      ),
    );
    ev.index = this.commandList.length;
    this.commandList.push(ev);
    return this;
  };

  public emit = (renz: Proto): void => {
    const ev = this.getCommand(renz.string);
    try {
      if (!('event' in ev)) return;
      const access = this.getAccess(renz, ev);
      if (access === 200)
        ev.event.callback(renz, {
          ...ev,
        });
    } catch (e) {
      //  throw util.logger.format(e);
      return
    }
  };

  private action = (
    renz: Proto,
    event: string | string[] | boolean,
    responseKey: string,
    additonal?: {
      prefix?: string;
      cmd?: string;
    },
  ): Promise<proto.WebMessageInfo> | void => {
    const resultResponse =
      typeof event === 'boolean'
        ? set.resp[responseKey as keyof typeof set.resp]
        : event.includes('?>') && !(event instanceof Array)
          ? `${set.resp[responseKey as keyof typeof set.resp]} ${event.split('?>')[1]}`
          : event;
    if (resultResponse === '--noresp') return;
    return client.reply(
      renz,
      (() => {
        const possiblyArray = ['mediaCustomReply'];
        let result = '';
        if (possiblyArray.includes(responseKey)) {
          const length = resultResponse.length;
          switch (responseKey) {
            case 'mediaCustomReply':
              result = set.resp.replymedia;
              if (resultResponse instanceof Array && length > 1)
                resultResponse.forEach((a, b) => {
                  if (b === length - 1) result += `dan ${a}`;
                  else result += ` ${a}, `;
                });
              else result += ` ${resultResponse}`;
              break;
          }
        } else if (!(resultResponse instanceof Array)) {
          result =
            resultResponse.trim() +
            (() => {
              if (!['owner', 'wait', 'regist'].includes(responseKey))
                if (['query'].includes(responseKey) || resultResponse.includes('-h')) return set.resp.help;
              return '';
            })();
        }
        return result;
      })()!
        .replace('</prefix>', additonal?.prefix ?? '')
        .replace('</command>', additonal?.cmd ?? ''),
    );
  };

  public getAccess = (renz: Proto, event: ICommandHandler.CommandProperty): void | Promise<proto.WebMessageInfo> | 200 => {
    let CONFIG!: [string | string[] | boolean, string];

    if (event.event?.regist && db.usr[renz.sender!].regist == false) {
      //     console.log(db.usr[renz.sender!])
      CONFIG = [event.event.regist!, 'regist'];
    }

    if (event.event?.limit > 0) {
      console.log(event)
      client.reply(renz, `anda memakai *${event.event.limit}* limit`)
    }

    if (event.event?.help && renz.string.includes('-h')) {
      client.reply(renz, `*COMMAND HELP*
    
${event.event.help}`)
    }

    if (event.event?.query && event.query.length === 0) CONFIG = [event.event.query!, 'query'];
    if (event.event?.group && !renz.validator.isGroup) CONFIG = [event.event.group!, 'group'];
    if (event.event?.owner && !renz.validator.isOwner) CONFIG = [event.event.owner!, 'owner'];
    if (
      event.event?.mediaCustomReply &&
      !(event.event.mediaCustomReply instanceof Array
        ? event.event.mediaCustomReply.some((a) => a in client.messageType && client.messageType[a] === (renz.quotedMsg?.type[1] ?? renz.type[1]))
        : event.event.mediaCustomReply in client.messageType &&
        client.messageType[event.event.mediaCustomReply] === (renz.quotedMsg?.type[1] ?? renz.type[1]))
    )
      CONFIG = [event.event.mediaCustomReply, 'mediaCustomReply'];

    if (typeof CONFIG === 'object' && CONFIG.length > 0) {
      return this.action(renz, CONFIG[0], CONFIG[1], {
        prefix: event.prefix,
        cmd: event.cmd,
      });
    }

    if (event.event?.wait) this.action(renz, event.event.wait as boolean | string, 'wait');
    return 200;
  };

  private getCommand = (text: string): ICommandHandler.CommandProperty | {} => {
    let ev: ICommandHandler.CommandProperty = {} as ICommandHandler.CommandProperty;
    for (const a of this.commandList) {

      if (!a.enable) continue;
      const prefix = a.prefix
        ? this.prefix.filter((a) => (a as RegExp).test(text)).sort((a, b) => b.toString().length - a.toString().length)[0]
        : /^()/i;
      if (!prefix) continue;
      const commandWithQuery = text.replace(prefix, '');
      const commandValidator = a.cmd.regExp.filter((a) => (a as RegExp).test(commandWithQuery))[0];
      if (!commandValidator) continue;
      ev = {
        event: a,
        text,
        cmd: (commandValidator as RegExp).exec(commandWithQuery)![0].toLowerCase(),
        commandWithQuery,
        query: commandWithQuery.replace(commandValidator, '').trim(),
        prefix: (prefix as RegExp).exec(text)![0],
        modify: (property: ICommandHandler.Event) => {
          this.commandList[ev.event.index] = {
            ...this.commandList[ev.event.index],
            ...property,
          };

          return this.commandList[ev.event.index];
        },
      };
    }
    return ev;
  };
}
