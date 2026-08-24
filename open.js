/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/grupos/open.js
ʚĭɞ ೃ funcion :: abrir el grupo (todos los integrantes pueden escribir)
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

import config from '../../config.js'

export default {
    command: ['open', 'abrir', 'abrirgrupo'],

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

        try {
            await conn.groupSettingUpdate(m.chat, 'not_announcement')
            return m.reply('🔓 *Grupo abierto.*\n\nA partir de ahora, todos los integrantes pueden escribir mensajes.')
        } catch (error) {
            console.error('❌ Error al abrir el grupo:', error)
            return m.reply('❌ No se pudo abrir el grupo. Verifica que el bot sea *administrador* del grupo.')
        }
    }
}
