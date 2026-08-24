/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: config.js
ʚĭɞ ೃ funcion :: configuracion principal del bot
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

export const config = {

    botName: '𝑵𝔸Ꮢ𝔸𝗞𝔸-𝗕ＯＴ',
    ownerName: 'ϝяαєȥ',

    owners: [
        '593989954417',
        '254610627371058'
    ],

    prefixes: [
        '/'
    ],

    sessionName: './sessions/principal',

    pluginsFolder: './plugins',

    databaseFolder: './database',

    printQRInTerminal: true,
    loggerLevel: 'silent',

    menu: {
        title: '⚔️ 𝑵𝔸Ꮢ𝔸𝗞𝔸-𝗕ＯＴ',
        description: 'Bot de WhatsApp forjado en batalla',
        footer: '⚔️ 𝑵𝔸Ꮢ𝔸𝗞𝔸-𝗕ＯＴ · Que el vencedor se alce'
    },

    subbots: {
        enabled: true,
        folder: './database/subbots',
        database: './database/subbots.json'
    }
}

export default config
