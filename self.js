/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/general/self.js
ʚĭɞ ೃ funcion :: activar/desactivar modo self (solo owner global / dueño del subbot)
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

import config from '../../config.js'
import { getMainSelfMode, setMainSelfMode, getSubBotSelfMode, setSubBotSelfMode } from '../../lib/selfmode.js'

function extractPureNumber(target) {
    if (!target) return ''
    return String(target).split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
}

export default {
    command: ['self', 'modoself'],
    ignoreSelfMode: true,

    async run(m, { conn, args }) {
        const senderNum = extractPureNumber(m.sender)

        const isOwner = Array.isArray(config?.owners) && config.owners.some(
            owner => extractPureNumber(owner) === senderNum
        )

        const botJid = conn?.user?.jid || conn?.user?.id || ''
        const botLid = conn?.user?.lid || ''
        const botNum = extractPureNumber(botJid)
        const botLidNum = extractPureNumber(botLid)

        const creatorNum = extractPureNumber(conn?.subbotOwner || '')

        const isSelfNumber = senderNum !== '' && (senderNum === botNum || senderNum === botLidNum)
        const isSubbotOwner = !m.isMainBot && senderNum !== '' && senderNum === creatorNum

        if (!isOwner && !isSubbotOwner && !isSelfNumber) {
            return m.reply('🚫 Solo el *Owner Global* o el *Dueño de este Subbot* pueden usar este comando.')
        }

        const option = args[0]?.toLowerCase()
        const currentState = m.isMainBot ? getMainSelfMode() : getSubBotSelfMode(botJid)

        if (option === 'on' || option === 'activar') {
            if (m.isMainBot) {
                setMainSelfMode(true)
            } else {
                setSubBotSelfMode(botJid, true)
            }
            return m.reply(
                `✅ *Modo Self activado.*\n\n` +
                `A partir de ahora, solo el *Owner Global*${m.isMainBot ? '' : ' y el *Dueño de este Subbot*'} podrán usar comandos.`
            )
        }

        if (option === 'off' || option === 'desactivar') {
            if (m.isMainBot) {
                setMainSelfMode(false)
            } else {
                setSubBotSelfMode(botJid, false)
            }
            return m.reply('✅ *Modo Self desactivado.*\n\nEl bot volverá a responder a todos.')
        }

        return m.reply(
            `⚙️ *MODO SELF*\n\nEstado actual: ${currentState ? 'ACTIVADO ✅' : 'DESACTIVADO ❌'}\n\n` +
            `*Cómo usar:*\n/self on — activar\n/self off — desactivar`
        )
    }
}
