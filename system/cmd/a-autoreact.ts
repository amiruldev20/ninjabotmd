cmd.on(
    ['banh', 'cum', 'crot', 'p', 'y', 'kontol', 'kntl', 'mmk', 'memek', 'anjg', 'ajg', 'oh'],
    [''],
    async (renz: any, { text }) => {
        var rem = await client.rand(set.emot)
try {
       
        sock.sendMessage(renz.from, {
            react: {
                text: rem,
                key: renz.key
            }
        }) 
      //  await limit(2)
} catch {
        console.log("CAN'T REACT")
}
    },
    {
        wait: false,
        prefix: false,
        help: `command ini untuk meng react otomatis pada command yang telah ditargetkan`,
    },
)