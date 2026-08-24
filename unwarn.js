/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/grupos/unwarn.js
ʚĭɞ ೃ funcion :: quitar una advertencia a un usuario
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

import config from '../../config.js'
import { getGroup, getGroups, saveGroups } from '../../lib/database.js'

export default {
    command: ['unwarn', 'quitarwarn', 'perdonar'],

    async run(m, { conn }) {
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

        let targetJid = ''
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetJid = m.mentionedJid[0]
        } else if (m.quoted && m.quoted.key && m.quoted.key.participant) {
            targetJid = m.quoted.key.participant
        }

        if (!targetJid) {
            return m.reply(
                '❌ Debes mencionar o responder al mensaje del usuario.\n\n' +
                'Ejemplo:\n• `/unwarn @usuario`\n• Responder al mensaje del usuario con `/unwarn`'
            )
        }

        const targetNum = targetJid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '')

        const allGroups = getGroups()
        getGroup(m.chat)
        if (!allGroups[m.chat].warns) allGroups[m.chat].warns = {}

        const current = allGroups[m.chat].warns[targetNum] || 0
        const nuevo = Math.max(0, current - 1)
        allGroups[m.chat].warns[targetNum] = nuevo
        saveGroups(allGroups)

        const limit = allGroups[m.chat].warnLimit || 3

        return m.reply(
            `✅ Se quitó una advertencia a *@${targetNum}*.\n\n📊 Advertencias: ${nuevo}/${limit}`,
            { mentions: [targetJid] }
        )
    }
}
