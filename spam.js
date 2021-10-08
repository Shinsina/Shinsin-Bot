require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client({fetchedMembers: true,});

let workingList = [];
let whitelist = [];
let messageList = []; 
setInterval(clearWorkingList, 60000)

function clearWorkingList() {
    workingList = []
    messageList = []
}

function getAllIndices(arr, val) {
   let indices = [], i;
   for(i = 0; i < arr.length; i++)
       if (arr[i] === val)
           indices.push(i);
   return indices;
}

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 client.guilds.cache.forEach(guild => {
    console.log(`${guild.name} | ${guild.id}`);
    guild.members.fetch().then(fetchedMembers => {
        fetchedMembers.forEach(member => {
            whitelist.push(member.user.tag);
            
        })
    })
  })
});

client.on('message', msg => {
    const containsDiscordUrl = msg.content.toString().match(/discord\.gg\/\w*\d*/);
    const containsDiscordAltUrl = msg.content.toString().match(/discord\.com\/invite\/\w*\d*/);
    const containsTwitchUrl = msg.content.toString().match(/twitch\.tv\/\w*\d*/);
    const containsPinkDiscord = msg.content.toString().match(/discord\.gg\/pink$/);

    if (msg.member.user.tag != 'Shinsin-Bot#1849') {
    if (whitelist.indexOf(msg.member.user.tag)==-1 && msg.member.bannable) {
        console.log(msg.member.user.tag)
        console.log(msg.content)
        workingList.push(msg.member.user.tag);
        messageList.push(msg.content)
        getAllIndices(workingList,msg.member.user.tag)
    
        if (getAllIndices(workingList,msg.member.user.tag).length>=8){
            client.channels.cache.get('797233265572053022').send(msg.member.user.tag + " has been banned for spam")
            messageList.forEach(message => {
                client.channels.cache.get('797233265572053022').send(message)
            })
            msg.member.ban({days: 7, reason: 'Spam'})
        }
        if (containsDiscordUrl != null || containsDiscordAltUrl != null || containsTwitchUrl != null){
            if (containsPinkDiscord != null) {
                msg.reply("Check the pinned messages in the general channel. Lee los mensajes 'pinned' en el canal general");
                }
            else {
                client.channels.cache.get('797233265572053022').send(msg.member.user.tag + " has been banned for self-promotion")
                msg.member.ban({days: 7, reason: 'Self-Promotion'})
                }
            }
        }
        if (msg.content == "!refresh" && msg.member.user.tag == "Shinsina#5610") {
            client.guilds.cache.forEach(guild => {
            whitelist = [];
            console.log(`${guild.name} | ${guild.id}`);
            guild.members.fetch().then(fetchedMembers => {
                fetchedMembers.forEach(member => {
                    whitelist.push(member.user.tag);
                })
            })
        })
        }
        if(msg.content =="!whitelist" && msg.member.user.tag == "Shinsina#5610") {
            console.log(whitelist)
        }
        if(msg.content =="!shinsin-bot") {
            msg.channel.send("Shinsin-Bot is a Discord bot developed by Shinsina, used as a moderation tool.")
        }
    }

});

client.login(process.env.DISCORD_CLIENT_API_KEY);
