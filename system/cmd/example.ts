cmd.on(
['test'],
// diatas ini command, jika ingin bnyk command, tambahkan sererusnya. cnth: ['command1', 'command2']
['tag'],
// diatas ini adalah tag, jika ingin bnyk tag, tambahkan sererusnya. cnth: ['tag1', 'tag2']
async (renz: any, { query }) => {
/*
query sama dengan args, anda bisa input query, text, command
*/
client.reply(renz, `halo`)
//untuk list function anda cek di system/client.ts

//jika ingin gunakan send message dari baileys begini
client.socket.sendMessage(renz.from, {
    text: "halo"
})
// jika tidak ingin kepanjangan, anda buat const md = client.socket  jadi nanti tinggal md.sendMessage.

//apabila butuh bantuan silahkan hubungi ig atau wa yang tertera di readme.md
},
{
    owner: true, //true jika khusus owner
    wait: true, // true jika ingin ada pesan menunggu
    prefix: true, // true jika ingin pakai prefix, jika tanpa prefix silahkan di false
    group: true, // true jika hanya di group saja
},
)

// jika ingin jadikan case cukup tambahkan kode sesuai diatas seperti ini
cmd.on(
['command'],
['tag'],
async (renz: any, { query }) => {
client.reply(renz, "oke")
},
{
    owner: false,
    wait: true,
    prefix: true,
},
)