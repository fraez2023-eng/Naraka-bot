/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/grupos/setwelcome.js
ʚĭɞ ೃ funcion :: personalizar el texto de bienvenida por grupo (mantiene la imagen)
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

import { getGroup, getGroups, saveGroups } from '../../lib/database.js'

export default {
    command: ['setwelcome', 'setbienvenida'],

    async run(m, { conn, args, isOwner }) {
        if (!m.isGroup) {
            return m.reply('❌ Este comando solo se puede usar en grupos.')
        }

        let isAdmin = false
        try {
            const groupMetadata = await conn.groupMetadata(m.chat)
            const participants = groupMetadata.participants || []

            const senderJid = m.sender || m.key.participant
            const userParticipant = participants.find(p => p.id === senderJid || p.jid === senderJid)
            if (userParticipant && (userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin')) {
                isAdmin = true
            }
        } catch (e) {
            console.error('Error al obtener la metadata del grupo:', e)
        }

        if (!isAdmin && !isOwner) {
            return m.reply('❌ Este comando solo puede ser utilizado por los *Administradores* del grupo.')
        }

        const texto = args.join(' ')
        const allGroups = getGroups()
        const groupData = getGroup(m.chat)

        if (!texto || texto.trim() === '') {
            const actual = groupData.welcomeText
                ? groupData.welcomeText
                : '(usando el mensaje por defecto)'

            return m.reply(
                `📝 *Bienvenida actual de este grupo:*\n\n${actual}\n\n` +
                `*Cómo usar:*\n` +
                `/setwelcome <mensaje>\n` +
                `/setwelcome reset — vuelve al mensaje por defecto\n\n` +
                `*Variables disponibles:*\n` +
                `{user} — menciona al nuevo integrante\n` +
                `{grupo} — nombre del grupo\n` +
                `{miembros} — cantidad de miembros`
            )
        }

        if (texto.trim().toLowerCase() === 'reset') {
            delete allGroups[m.chat].welcomeText
            saveGroups(allGroups)
            return m.reply('✅ El mensaje de bienvenida volvió al valor por defecto.')
        }

        allGroups[m.chat].welcomeText = texto.trim()
        saveGroups(allGroups)

        return m.reply(
            `✅ Bienvenida personalizada guardada para este grupo:\n\n${texto.trim()}\n\n` +
            `_Pruébala agregando o simulando un ingreso al grupo._`
        )
    }
}
