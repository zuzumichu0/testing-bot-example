const Discord = require("discord.js")
/**
 *
 *
 * @param {import("discord.js").Client} bot
 * @param {import("discord.js").Message} message
 * @param {String[]} args
 */
exports.run = async (bot, message, args) => {
    let userdata = await bot.db.getuser(message.author.id)
    if(userdata.backpackinventory.length>=config.storageperlvl*userdata.backpack){
        return message.reply("กระเป๋าคุณเต็มแล้ว")
    }
    
    let pickaxe = bot.item.pickaxe[userdata.pickaxe]
    const expanded = pickaxe.rate.flatMap(ore => Array(ore.pct).fill(ore));
    let reward = []
    let fishtime = 2
    for (let i = 0; i < fishtime; i++) {
        let fish = expanded[Math.floor(Math.random() * expanded.length)].id;
        if(fish) reward.push(fish)
    }

    message.channel.send(new Discord.MessageEmbed()
    .addField(`<:pickaxe:719196232739979284> Mine!`,`คุณขุดแร่ **${fishtime}** รอบและได้:
${reward.length?reward.map((id)=>"+ "+bot.item[id].emoji+" "+bot.item[id].name).join("\n"):":x: คุณไม่ได้อะไรเลย ;-;"}`)
    .setAuthor(message.author.tag)
    .setColor(config.color)
    )
    for (let i = 0; i < reward.length; i++) {
        if(userdata.backpackinventory.length>=config.storageperlvl*userdata.backpacklvl){
            message.reply("กระเป๋าคุณเต็มแล้ว")
            break;
        }
        userdata.backpackinventory.push(reward[i])
    }
    bot.db.prepare(`UPDATE users SET backpackinventory = :backpackinventory WHERE id = :id`).run({
        backpackinventory: JSON.stringify(userdata.backpackinventory),
        id: message.author.id
    })
}
exports.conf = { aliases: ["m"],delay: 4000 };