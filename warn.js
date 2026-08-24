/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/grupos/warn.js
ʚĭɞ ೃ funcion :: advertir a un usuario; expulsa automaticamente al llegar al limite
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

import config from '../../config.js'
import { getGroup, getGroups, saveGroups } from '../../lib/database.js'

const DEFAULT_LIMIT = 3

export default {
    command: ['warn', 'advertir', 'advertencia'],

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

        let targetJid = ''
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetJid = m.mentionedJid[0]
        } else if (m.quoted && m.quoted.key && m.quoted.key.participant) {
            targetJid = m.quoted.key.participant
        }

        if (!targetJid) {
            return m.reply(
                '❌ Debes mencionar o responder al mensaje del usuario que quieres advertir.\n\n' +
                'Ejemplo:\n• `/warn @usuario`\n• Responder al mensaje del usuario con `/warn`'
            )
        }

        const targetNum = targetJid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '')

        const isTargetOwner = Array.isArray(config?.owners) && config.owners.some(
            owner => String(owner).replace(/[^0-9]/g, '') === targetNum
        )
        if (isTargetOwner) {
            return m.reply('❌ No puedo advertir al Owner Global del bot.')
        }

        const razon = args.filter(a => !a.startsWith('@')).join(' ') || 'Sin razón especificada'

        const allGroups = getGroups()
        const groupData = getGroup(m.chat)

        if (!allGroups[m.chat].warns) allGroups[m.chat].warns = {}
        const limit = allGroups[m.chat].warnLimit || DEFAULT_LIMIT

        const current = (allGroups[m.chat].warns[targetNum] || 0) + 1
        allGroups[m.chat].warns[targetNum] = current
        saveGroups(allGroups)

        if (current >= limit) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [targetJid], 'remove')
                allGroups[m.chat].warns[targetNum] = 0
                saveGroups(allGroups)
                return m.reply(
                    `🚫 *@${targetNum}* alcanzó el límite de advertencias (${current}/${limit}) y fue *expulsado* automáticamente.`,
                    { mentions: [targetJid] }
                )
            } catch (error) {
                console.error('❌ Error al expulsar por warns:', error)
                return m.reply('⚠️ Se alcanzó el límite de advertencias, pero no pude expulsar al usuario. Verifica que el bot sea *administrador*.')
            }
        }

        return m.reply(
            `⚠️ *@${targetNum}* ha sido advertido.\n\n` +
            `📄 Razón: ${razon}\n` +
            `📊 Advertencias: ${current}/${limit}`,
            { mentions: [targetJid] }
        )
    }
}
