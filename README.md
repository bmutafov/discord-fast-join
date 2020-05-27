### Discord Add-On - Fast Join Server
Electron app which runs a chrome browser (with headless option), powered by Puppeteer. When provided credentials, the app loads the channel and listen for discord invites. Whenever an invite is received it is clicked as fast as possible.

# How to run
Make sure you have Node installed on your computer. 
`npm install` to install all dependencies needed
`npm start` to start the application
`npm run build` to build the application to executable file

# Operating

![UI Screenshot](https://i.snipboard.io/7gJDHm.jpg)

You have to provide your email and password for Discord so Puppeteer can login you and start listening.

Server name is the name of the server in which you are going to be listnening for invites.

![Example](https://i.snipboard.io/UbNYwd.jpg)
In this example the name of the server is *Observe*

Lastly in the channel field, a *url* has to be provided to the channel in the server which you are going to listen to. Looks something like this: `https://discord.com/channels/713837111624303133/716662834624309943`

Save for next start-up checkbox is to save your data so you don't have to re-enter it every time.

Headless browser - check if you want your browser to run in the background invisibly, uncheck if you want to have the browser opened.

Once setup is done, press *START* and you should be alright.

# Console
The console will provide all relevant information in real time, so you can watch closely for updates.
