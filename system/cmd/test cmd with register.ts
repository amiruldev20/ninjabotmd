cmd.on(
['xb'],
[''],
async (renz: any, { query }) => {
client.reply(renz, 'halo')
},
{
    owner: false, // owner only
    prefix: false, // with prefix
    group: false, // group only
    enable: true, // on/off feature
    wait: false, // msg waiting
    regist: true, // register only
}
)