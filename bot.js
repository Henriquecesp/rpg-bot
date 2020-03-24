const { Client } = require("discord.js");
const client = new Client();
const config = require("./config.json");

const low = require("lowdb"); //banco de dados
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("banco.json");
const db = low(adapter);

const prefix = "!";
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

client.on("ready", () => {
  console.log(`Bot foi iniciado, em ${client.guilds.cache.size} servidores.`);
  client.user.setActivity(`Estou pronto!`);
});

client.on("guildCreate", guild => {
  console.log(
    `O bot entrou no servidor: ${guild.name} (id: ${guild.id}. Populacao: ${guild.memberCount} membros!)`
  );
  db.set(guild.id, []).write();
  client.user.setActivity(`Estou pronto!`);
});

client.on("guildDelete", guild => {
  console.log(
    `O bot foi removido do servidor: ${guild.name} (id: ${guild.id}.)`
  );
  client.user.setActivity(`Estou pronto!`);
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

  if (command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(
      `Pong! A Latencia e ${m.createdTimestamp - message.createdTimestamp}ms.
      )}ms`
    );
  }

  if (command === "char") {
    const char = db
      .get(message.guild.id)
      .find({ id: message.author.id })
      .value();
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
          <:role:691838202700627968> Role: ${char.role}
          <:coin:691838183817609226> Money: ${char.money}`
        },
        {
          name: "Progress",
          value: `<:xp:691841766281707550> XP: ${char.progress.xp}/${char.progress.levelxp}
          <:level:691842752354189412> Level: ${char.progress.level}`
        }
      ],
      timestamp: new Date(),
      footer: {
        text: char.quote
      }
    };
    message.channel.send({ embed: charEmbed });
  }

  if (command === "criar") {
    if (!args[(0, 1)])
      return message.channel.send(
        "Você esqueceu do argumento, !criar [nome] [role] "
      );
    let [nick, role] = args;
    let char = db
      .get(message.guild.id)
      .find({ id: message.author.id })
      .value();
    if (char == undefined) {
      db.get(message.guild.id)
        .push({
          id: message.author.id,
          nick: nick,
          role: role,
          life: 100,
          money: 50,
          progress: {
            xp: 0,
            level: 1,
            levelxp: 10
          },
          avatar: message.author.displayAvatarURL()
        })
        .write();
      message.channel.send(`Perfil criado`);
    } else {
      message.channel.send("Voce ja possui um perfil!");
    }
  }

  if (command === "editar") {
    if (!args[0]) return message.channel.send("Você esqueceu do argumento ");
    let [newnick] = args;
    db.get(message.guild.id)
      .find({ id: message.author.id })
      .assign({ nick: newnick })
      .write();
    message.channel.send("Perfil editado com sucesso!");
  }

  if (command === "apagar") {
    db.get(message.guild.id)
      .remove({ id: message.author.id })
      .write();
    message.channel.send("Perfil deletado");
  }

  if (command === "status") {
    if (!args[0]) return message.channel.send("Você esqueceu do argumento ");
    let [newstatus] = args;
    db.get(message.guild.id)
      .find({ id: message.author.id })
      .assign({ status: newstatus })
      .write();
    message.channel.send("Perfil editado com sucesso!");
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
      message.channel.send("Perfil editado com sucesso!");
    }
    const embedQuote = {
      title: char.nick,
      description: char.quote
    };
    message.channel.send({ embed: embedQuote });
  }

  if (command === "xp") {
    if (message.author.id != config.masterId) {
      message.channel.send("Voce nao tem permissao");
    }
    if (!args[0]) return message.channel.send("Voce esqueceu do argumento");
    let [newxp] = args;
    let char = db
      .get(message.guild.id)
      .find({ id: message.author.id })
      .value();
    let newchar = {
      progress: {
        xp: newxp,
        level: char.progress.level,
        levelxp: char.progress.levelxp
      }
    };
    console.log(args[0]);
    for (let i = 0; i <= args[0]; i++) {
      if (newchar.progress.xp >= newchar.progress.levelxp) {
        newchar.progress.level++;
        newchar.progress.xp = 0;
      }
      console.log(newchar.progress);
    }
    db.get(message.guild.id)
      .find({ id: message.author.id })
      .assign({ progress: newchar.progress })
      .write();
  }
});

client.login(config.token);
//create a config.json
// {
//   masterId: admin user id,
//   token: 'your discord bot token'
// }
