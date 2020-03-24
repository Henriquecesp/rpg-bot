# Rpg Bot
Discord bot rpg

![Sword shield](https://i.ibb.co/w0TqSz4/rpg-game-1.png "Sword shield")

# ℹ️ How to run the application locally

```bash
# to clone the repository
git clone https://github.com/Henriquecesp/rpg-bot.git

# go to the project folder
cd rpg-bot

# install the dependencies
npm install
or
yarn
```
create your config file called config.json
content: 
```javascript
{
masterId: #admin_user_id(int)
token: #'your discord bot token'(string)
}
```
with your discord user id and token from discord dev api

How to get your token, create a bot and add to a serve:
<br/>
https://discordapp.com/developers/applications

To start the bot just run:
```bash
node .
```

Or use nodemon for liveupload running:
```bash
nodemon start
```

## Commands:
- !ciar [nick] [role] = create new char on database

- !char = shows your character

- !editar [nick] = edits your nickname

- !apagar = delete your character

- !quote ...text = create a quote to your character

## External dependencies
DiscordJS Library i used:
<br/>
https://discord.js.org/

DataBase i used LowDb (json based db):
<br/>
https://github.com/typicode/lowdb
##
I plan to create more methods and commands later.
<hr>
<p>Made with :coffee: and ♥ by Henrique Cruz</p>
