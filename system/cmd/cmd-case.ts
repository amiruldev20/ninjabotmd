//-- EXAMPLE COMMAND CASE

//-- COMMAND 1
cmd.on(
['case1'],
['tag'],
async (renz: any, { query }) => {
client.reply(renz, `CONTOH CASE 1,

Untuk list function anda bisa cek di system/client.ts.
jika ingin menggunakn socket dari baileys. cukup sock.xxx
contoh: sock.sendMessage(renz.from, { text: "hello world"})
`)
},
{
    owner: false,
    wait: false,
    prefix: true,
    group: false,
    enable: true,
    regist: false,
}
)

//-- COMMAND 2
.on(
['case2'],
['tag'],
async (renz: any, { query }) => {
client.reply(renz, `CONTOH CASE 2,

Untuk list function anda bisa cek di system/client.ts.
jika ingin menggunakn socket dari baileys. cukup sock.xxx
contoh: sock.sendMessage(renz.from, { text: "hello world"})
`)
},
{
    owner: false,
    wait: false,
    prefix: true,
    group: false,
    enable: true,
    regist: false,
}
)