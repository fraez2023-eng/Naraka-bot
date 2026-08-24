/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/grupos/warns.js
ʚĭɞ ೃ funcion :: consultar las advertencias propias o de un usuario mencionado
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

import { getGroup, getGroups } from '../../lib/database.js'

export default {
    command: ['warns', 'misadvertencias', 'advertencias'],

    async run(m) {
        if (!m.isGroup) {
            return m.reply('❌ Este comando solo se puede usar en grupos.')
        }

        let targetJid = m.sender
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetJid = m.mentionedJid[0]
        } else if (m.quoted && m.quoted.key && m.quoted.key.participant) {
            targetJid = m.quoted.key.participant
        }

        const targetNum = targetJid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '')

        const allGroups = getGroups()
        getGroup(m.chat)

        const warns = allGroups[m.chat]?.warns?.[targetNum] || 0
        const limit = allGroups[m.chat]?.warnLimit || 3

        return m.reply(
            `📊 *@${targetNum}* tiene ${warns}/${limit} advertencias.`,
            { mentions: [targetJid] }
        )
    }
}
