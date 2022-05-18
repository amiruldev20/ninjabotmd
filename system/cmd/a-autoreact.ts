global.cmd.on(
    ['banh', 'cum', 'crot', 'p', 'y', 'kontol', 'kntl', 'mmk', 'memek', 'anjg', 'ajg'],
    [''],
    async (renz: any, { text }) => {
        var rem = await global.client.rand(global.set.emot)
        global.sock.sendMessage(renz.from, {
            react: {
                text: rem,
                key: renz.key
            }
        })
    },
    {
        wait: false,
        prefix: false,
    },
)