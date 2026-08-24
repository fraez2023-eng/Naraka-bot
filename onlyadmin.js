/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/grupos/onlyadmin.js
ʚĭɞ ೃ funcion :: activar/desactivar que el bot solo responda a admins en el grupo
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

import config from '../../config.js'
import { getGroup, getGroups, saveGroups } from '../../lib/database.js'

export default {
    command: ['onlyadmin', 'soloadmin'],
    ignoreOnlyAdmin: true,

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

        const option = args[0]?.toLowerCase()
        const allGroups = getGroups()
        getGroup(m.chat)

        if (option === 'on' || option === 'activar' || option === '1') {
            allGroups[m.chat].onlyAdmin = true
            saveGroups(allGroups)
            return m.reply('✅ Modo *Solo Admins* activado.\n\nA partir de ahora, el bot solo responderá comandos de los administradores del grupo.')
        }

        if (option === 'off' || option === 'desactivar' || option === '0') {
            allGroups[m.chat].onlyAdmin = false
            saveGroups(allGroups)
            return m.reply('✅ Modo *Solo Admins* desactivado.\n\nEl bot volverá a responder a todos los integrantes.')
        }

        const estado = allGroups[m.chat]?.onlyAdmin ? 'ACTIVADO ✅' : 'DESACTIVADO ❌'
        return m.reply(
            `⚙️ *MODO SOLO ADMINS*\n\nEstado actual: ${estado}\n\n` +
            `*Cómo usar:*\n/onlyadmin on — activar\n/onlyadmin off — desactivar`
        )
    }
}
