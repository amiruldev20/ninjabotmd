cmd.on(
    ['plugins1'],
    ['tag'],
    async (renz: any, { query }) => {
    client.reply(renz, `CONTOH PLUGINS 1,
    
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