/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/grupos/kick.js
ʚĭɞ ೃ funcion :: expulsar a un integrante mencionado o respondido
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

import config from '../../config.js'

export default {
    command: ['kick', 'expulsar', 'ban'],

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
                '❌ Debes mencionar o responder al mensaje del usuario que quieres expulsar.\n\n' +
                'Ejemplo:\n' +
                '• `/kick @usuario`\n' +
                '• Responder al mensaje del usuario con `/kick`'
            )
        }

        const targetNum = targetJid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
        const isTargetOwner = Array.isArray(config?.owners) && config.owners.some(
            owner => String(owner).replace(/[^0-9]/g, '') === targetNum
        )

        if (isTargetOwner) {
            return m.reply('❌ No puedo expulsar al Owner Global del bot.')
        }

        try {
            await conn.groupParticipantsUpdate(m.chat, [targetJid], 'remove')
            return m.reply(`✅ Se expulsó a @${targetNum} del grupo.`, { mentions: [targetJid] })
        } catch (error) {
            console.error('❌ Error al expulsar:', error)
            return m.reply('❌ No se pudo expulsar al usuario. Verifica que el bot sea *administrador* del grupo.')
        }
    }
}
