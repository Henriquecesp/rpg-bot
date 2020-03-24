# rpg-bot
Discord bot rpg

First install all dependencies using:
npm install

create your config file called config.json
content: 
{
   masterId: admin user id, (int)
   token: 'your discord bot token' (string)
}

To start the bot just run:
node .

Or use nodemon for liveupload running:
nodemon start

Commands:
!ciar [nick] [role] = create new char on database
!char = shows your character
!editar [nick] = edits your nickname
!apagar = delete your character
!quote ...text = create a quote to your character

How to get your token, create a bot and add to a serve:
https://discordapp.com/developers/applications

DiscordJS Library i used:
https://discord.js.org/


I plan to create more methods and commands later.
