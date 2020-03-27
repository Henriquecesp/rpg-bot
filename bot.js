const { Client } = require("discord.js");
const client = new Client();
const config = require("./config.json");

const low = require("lowdb"); //banco de dados
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("banco.json");
const db = low(adapter);

const prefix = "-";
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

client.on("ready", () => {
  console.log(`Bot started, in ${client.guilds.cache.size} servers.`);
  client.user.setActivity(`Im ready!`);
});

client.on("guildCreate", guild => {
  console.log(
    `The bot started at server: ${guild.name} (id: ${guild.id}. Population: ${guild.memberCount} members!)`
  );
  db.set(guild.id, []).write();
  client.user.setActivity("Im ready!");
});

client.on("guildDelete", guild => {
  console.log(
    `The bot was removed from server: ${guild.name} (id: ${guild.id}.)`
  );
  client.user.setActivity(`Im ready!`);
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content
    .slice(matchedPrefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "teste") {
    let server = message.guild.emojis.cache;
    console.log(server);
    // message.channel.send(server);
  }

  if (command === "char") {
    const char = db
      .get(message.guild.id)
      .find({ id: message.author.id })
      .value();
    //inventory cant be null
    let inventory = [...char.inventory];
    if (inventory[0] == null) {
      inventory[0] = "Vazio";
    }
    const charEmbed = {
      color: 0x0099ff,
      title: char.nick,
      description: char.status,
      thumbnail: {
        url: char.avatar
      },
      fields: [
        {
          name: " <:heart:691838366039408760> Status",
          value: ` Life: ${char.life}
          Race: ${char.race}
          Gold: ${char.gold}`
          //<:race:691838202700627968>
          // <:coin:691838183817609226>
        },
        {
          name: `<:chest:692593319548682280> Inventory`,
          value: `${inventory}`
        }
        // {
        //   name: "Progress",
        //   value: `<:xp:691841766281707550> XP: ${char.progress.xp}
        //   <:level:691842752354189412> Level: ${char.progress.level}`
        // }
      ],
      timestamp: new Date(),
      footer: {
        text: char.quote
      }
    };
    message.channel.send({ embed: charEmbed });
  }

  if (command === "create") {
    if (!args[(0, 1)])
      return message.channel.send(
        "You forgot the argument, !create [name] [race] "
      );
    let nickvalue = args[0];
    let nick = nickvalue.toUpperCase();
    let subtract = 8 + nick.length + 1;
    let race = message.author.lastMessage.content;
    race = race.substr(subtract, race.length);
    race = race.toLowerCase();
    race = race.charAt(0).toUpperCase() + race.slice(1);
    let nickverify = db
      .get(message.guild.id)
      .find({ nick: nick })
      .value();
    if (nickverify != undefined) {
      return message.channel.send("Already exist character with this name");
    }
    let char = db
      .get(message.guild.id)
      .find({ id: message.author.id })
      .value();
    if (char == undefined) {
      db.get(message.guild.id)
        .push({
          id: message.author.id,
          nick: nick,
          race: race,
          life: 100,
          gold: 50,
          progress: {
            xp: 0,
            level: 1,
            levelxp: 10
          },
          avatar: message.author.displayAvatarURL(),
          inventory: [],
          backupInventory: []
        })
        .write();
      message.channel.send("Profile created");
    } else {
      message.channel.send("You already have a profile!");
    }
  }

  if (command === "editname") {
    if (!args[0])
      return message.channel.send(
        "You forgot the argument, !editname [newname]"
      );
    let value = args[0];
    let newnick = value.toUpperCase();
    let nickverify = db
      .get(message.guild.id)
      .find({ nick: newnick })
      .value();
    if (nickverify != undefined) {
      return message.channel.send("Already exist character with this name");
    }
    db.get(message.guild.id)
      .find({ id: message.author.id })
      .assign({ nick: newnick })
      .write();
    message.channel.send("Profile edited successfully!");
  }

  if (command === "editavatar") {
    db.get(message.guild.id)
      .find({ id: message.author.id })
      .assign({ avatar: message.author.displayAvatarURL() })
      .write();
    message.channel.send("Profile edited successfully!");
  }

  if (command === "gold") {
    if (!args[(0, 1)])
      return message.channel.send(
        "You forgot the argument, !gold [value] [name] "
      );
    let value = args[1];
    let newgold = parseInt(value);
    let userValue = args[0];
    let user = userValue.toUpperCase();

    const char = db
      .get(message.guild.id)
      .find({ nick: user })
      .value();
    if (char === undefined) {
      return message.channel.send("Character does not exist");
    }
    newgold += char.gold;
    db.get(message.guild.id)
      .find({ nick: user })
      .assign({ gold: newgold })
      .write();
    message.channel.send("Gold atualized " + newgold);
  }

  if (command === "life") {
    if (!args[(0, 1)])
      return message.channel.send(
        "You forgot the argument, !life [name] [value] "
      );
    let value = args[1];
    let newlife = parseInt(value);
    let userValue = args[0];
    let user = userValue.toUpperCase();

    const char = db
      .get(message.guild.id)
      .find({ nick: user })
      .value();
    newlife += char.life;
    if (newlife < 0) {
      message.channel.send("YOU DIED");
    }
    db.get(message.guild.id)
      .find({ nick: user })
      .assign({ life: newlife })
      .write();
    message.channel.send("Life atualized " + newlife);
  }

  if (command === "additem") {
    if (!args[(0, 1)])
      return message.channel.send(
        "You forgot the argument, !additem [charName] [item] "
      );
    let user = args[0];
    user = user.toUpperCase();
    let subtract = 9 + user.length + 1;
    let item = message.author.lastMessage.content;
    item = item.substr(subtract, item.length);
    item = item.toLowerCase();
    item = item.charAt(0).toUpperCase() + item.slice(1);
    const char = db
      .get(message.guild.id)
      .find({ nick: user })
      .value();
    if (char == undefined) {
      return message.channel.send("This character does not exist!");
    }
    let inventory = char.inventory;
    inventory.push(item);
    db.get(message.guild.id)
      .find({ id: message.author.id })
      .assign({ inventory: inventory })
      .write();
    message.channel.send("Item " + item + " added to inventory");
  }

  if (command === "removeitem") {
    if (!args[(0, 1)])
      return message.channel.send(
        "You forgot the argument, !removeitem [charname] [item] "
      );
    let user = args[0];
    user = user.toUpperCase();
    let subtract = 12 + user.length + 1;
    let item = message.author.lastMessage.content;
    item = item.substr(subtract, item.length);
    item = item.toLowerCase();
    item = item.charAt(0).toUpperCase() + item.slice(1);
    const char = db
      .get(message.guild.id)
      .find({ nick: user })
      .value();
    if (char == undefined) {
      return message.channel.send("This character does not exist!");
    }
    let inventory = char.inventory;
    inventory = inventory.filter(e => e !== item);
    db.get(message.guild.id)
      .find({ id: message.author.id })
      .assign({ inventory: inventory })
      .write();
    message.channel.send("Item " + item + " removed from inventory");
  }

  if (command === "clearinventory") {
    if (!args[0])
      return message.channel.send(
        "You forgot the argument, !clearinventory [charname] "
      );
    let user = args[0];
    user = user.toUpperCase();
    let char = db
      .get(message.guild.id)
      .find({ nick: user })
      .value();
    let backupInventory = char.inventory;
    db.get(message.guild.id)
      .find({ nick: user })
      .assign({ inventory: [], backupInventory: backupInventory })
      .write();
    message.channel.send("Inventory of " + user + " cleared");
  }

  if (command === "backupinventory") {
    if (!args[0])
      return message.channel.send(
        "You forgot the argument, !backupinventory [charname] "
      );
    let user = args[0];
    user = user.toUpperCase();
    let char = db
      .get(message.guild.id)
      .find({ nick: user })
      .value();
    let inventory = char.backupInventory;
    db.get(message.guild.id)
      .find({ nick: user })
      .assign({ inventory: inventory, backupInventory: [] })
      .write();
    message.channel.send("Inventory of " + user + " restaured");
  }

  if (command === "delete") {
    db.get(message.guild.id)
      .remove({ id: message.author.id })
      .write();
    message.channel.send("Profile deleted");
  }

  if (command === "status") {
    if (!args[0])
      return message.channel.send("You forgot the argument, !status [status] ");
    let [newstatus] = args;
    db.get(message.guild.id)
      .find({ id: message.author.id })
      .assign({ status: newstatus })
      .write();
    message.channel.send("Status created!");
  }

  if (command === "quote") {
    const char = db
      .get(message.guild.id)
      .find({ id: message.author.id })
      .value();
    quote = message.author.lastMessage.content;
    newquote = quote.substr(7, quote.length);
    if (newquote != "") {
      db.get(message.guild.id)
        .find({ id: message.author.id })
        .assign({ quote: newquote })
        .write();
      message.channel.send("Quote created");
    }
    const embedQuote = {
      title: char.nick,
      description: char.quote
    };
    message.channel.send({ embed: embedQuote });
  }

  if (command === "showall") {
    const chars = db.get(message.guild.id).value();
    chars.forEach(function(char) {
      const charEmbed = {
        color: 0x0099ff,
        title: char.nick,
        description: char.status,
        thumbnail: {
          url: char.avatar
        },
        fields: [
          {
            name: "Status",
            value: `<:heart:691838366039408760> Life: ${char.life}
            <:race:691838202700627968> Race: ${char.race}`
          }
        ],
        timestamp: new Date()
      };
      return message.channel.send({ embed: charEmbed });
    });
  }
});

client.login(config.token);
//create a config.json
// {
//   masterId: admin user id,
//   token: 'your discord bot token'
// }
