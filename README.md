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

## GUIDE

> Follow this guide to use the Master Bot RPG

First create your character by executing:
`-create [CharName] [race]`
Passing your name and function, example:
`-create Henrique Human`
Your character is ready! To see your character:
`-char`

## Commands:

-create [CharName][race] = create a new character in the database

-char = shows your character

-editname [CharName] = edit character name

-editavatar = Update avatar (Saves your current discord photo)

-delete = delete your character

-quote ... text = create a phrase for your character

-status ... text = creates status for your character

-gold [CharName][value] = Edit a specific character's gold

-life [CharName][value] = Edit the life of a specific character

-additem [CharName][item] = Add an item to a specific character's inventory

-removeitem [CharName][item] = Removes an item from a specific character's inventory

-clearinventory [CharName] = Clear a specific character's inventory and create a backup

-backupinventory [CharName] = Restores the inventory based on the backup created in the last clearInventory, ITEMS ADDED AFTER THE COMMAND -clearInventory WILL BE LOST

**Don't forget the arguments for your commands.**

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
