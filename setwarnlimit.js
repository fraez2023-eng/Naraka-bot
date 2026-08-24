/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/grupos/setwarnlimit.js
ʚĭɞ ೃ funcion :: personalizar el numero de advertencias antes de expulsar
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

import config from '../../config.js'
import { getGroup, getGroups, saveGroups } from '../../lib/database.js'

export default {
    command: ['setwarnlimit', 'limitewarns', 'setlimitewarn'],

    async run(m, { conn, args }) {
        if (!m.isGroup) {
            return m.reply('❌ Este comando solo se puede usar en grupos.')
        }

        const senderNum = String(m.sender || '').split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
        const isOwner = Array.isArray(config?.owners) && config.owners.some(
            owner => String(owner).replace(/[^0-9]/g, '') === senderNum
        )

        let isAdmin = false
        try {
            const groupMetadata = await conn.groupMetadata(m.chat)
            const participants = groupMetadata.participants || []
            const userParticipant = participants.find(p => p.id === m.sender || p.jid === m.sender)
            if (userParticipant && (userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin')) {
                isAdmin = true
            }
        } catch (e) {
            console.error('Error al obtener la metadata del grupo:', e)
        }

        if (!isAdmin && !isOwner) {
            return m.reply('❌ Este comando solo puede ser utilizado por los *Administradores* del grupo.')
        }

        const allGroups = getGroups()
        getGroup(m.chat)

        const nuevoLimite = parseInt(args[0])

        if (!nuevoLimite || isNaN(nuevoLimite) || nuevoLimite < 1) {
            const actual = allGroups[m.chat]?.warnLimit || 3
            return m.reply(
                `⚙️ *LÍMITE DE ADVERTENCIAS*\n\nActual: ${actual}\n\n` +
                `*Cómo usar:*\n/setwarnlimit <número>\n\nEjemplo: \`/setwarnlimit 5\``
            )
        }

        allGroups[m.chat].warnLimit = nuevoLimite
        saveGroups(allGroups)

        return m.reply(`✅ Límite de advertencias actualizado a *${nuevoLimite}*.`)
    }
}
