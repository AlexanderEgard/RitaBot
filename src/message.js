/* eslint-disable sort-keys */
// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING]
const db = require("./core/db");
const fn = require("./core/helpers");
const cmdArgs = require("./commands/args");


// --------------------
// Listen for messages
// --------------------

// eslint-disable-next-line no-unused-vars
module.exports = function run (config, message, edited, deleted)
{

   module.exports.message = message;
   const client = message.client;
   const bot = client.user;
   if (message.channel.type === "dm" || message.type !== "DEFAULT")
   {

      return;

   }
   if (!db.server_obj[message.guild.id])
   {

      return;

   }
   const bot2botstyle = db.server_obj[message.guild.id].db.bot2botstyle;

   // ------------------------
   // Ignore messages by bots
   // ------------------------


   if (bot2botstyle === "off")
   {

      if (message.author.bot)
      {

         return;

      }

   }
   else if (bot2botstyle === "on")
   {

      // eslint-disable-next-line no-bitwise
      if (message.webhookID)
      {

         return;

      }
      if (message.author.id === message.client.user.id)
      {

         return;

      }

   }

   if (message.embeds.length !== 0)
   {

      message.content = message.embeds[0].description;

   }

   // -----------------------------------------
   // Embed member permissions in message data
   // -----------------------------------------

   if (message.channel.type === "text" && message.member)
   {

      message.isAdmin =
         message.member.permissions.has("ADMINISTRATOR");

      message.isManager =
         fn.checkPerm(
            message.member,
            message.channel,
            "MANAGE_CHANNELS"
         );

      // Add role color
      message.roleColor = fn.getRoleColor(message.member);

   }

   // ------------
   // Data object
   // ------------

   const data = {
      "canWrite": true,
      "channel": message.channel,
      config,
      client,
      "member": message.member,
      bot,
      message
   };
   if (data.message.channel.type !== "dm")
   {

      if (data.member)
      {

         // Replace username with nickname if exists
         if (data.member.displayName)
         {

            data.message.author.username = data.member.displayName;

         }

      }

   }

   // ------------------
   // Proccess Commands
   // ------------------

   if (message.content.startsWith(config.translateCmd) || message.content.startsWith(config.translateCmdShort) || message.isMentioned(bot))
   {

      // eslint-disable-next-line consistent-return
      return cmdArgs(data);

   }

   // --------------------------
   // Check for automatic tasks
   // --------------------------

   // eslint-disable-next-line consistent-return
   return db.channelTasks(data);

};
