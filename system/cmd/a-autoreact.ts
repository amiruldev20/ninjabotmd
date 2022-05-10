cmd.on(
['banh','cum','crot', 'p', 'y', 'kontol', 'kntl', 'mmk', 'memek','anjg', 'ajg'],
[''],
async (renz: any, { text }) => {
var rem = await client.rand(set.emot)
sock.sendMessage(renz.from, {
react: {
text: rem,
key: renz.key
}})
},
{
wait: false,
prefix: false,
},
)