/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/general/menu.js
ʚĭɞ ೃ funcion :: menu dinamico con lectura automatica de plugins, banner de video autoplay
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

import fs from 'fs'
import path from 'path'
import config from '../../config.js'
import { getSubbotConfig } from '../../lib/subbotconfig.js'

// Ruta del banner de video por defecto (se reproduce en bucle y sin sonido, como un GIF)
const BANNER_PATH = path.join(process.cwd(), 'media', 'menu-banner.mp4')

function getCategoryIcon(category) {
    const icons = {
        'general': '🖤',
        'convertidores': '🌀',
        'descargas': '📼',
        'grupos': '⛓️',
        'subbots': '🕸️',
        'owner': '✝️',
        'economia': '🩸',
        'juegos': '👁️',
        'herramientas': '🔧',
        'nsfw': '🔞',
        'reacciones': '🦈'
    }
    return icons[category.toLowerCase()] || '◈'
}

const categoryNames = {
    'general': 'GENERAL',
    'convertidores': 'TRANSMUTACIÓN',
    'descargas': 'ARCHIVOS PERDIDOS',
    'grupos': 'EL CÍRCULO',
    'subbots': 'MARIONETAS',
    'owner': 'EL AMO',
    'herramientas': 'RITUALES',
    'nsfw': 'ZONA VELADA',
    'reacciones': 'INSTINTOS'
}

export default {
    command: ['menu', 'menú', 'help', 'inicio'],

    async run(m, { conn, usedPrefix = '/' }) {
        const nombre = m.pushName || 'sombra'
        const rawJid = conn?.user?.jid || conn?.user?.id || conn?.subBotJid || ''
        const botData = getSubbotConfig(rawJid, config)

        const botName = botData.name || config.botName || '𝑵𝔸Ꮢ𝔸𝗞𝔸-𝗕ＯＴ'
        const ownerName = botData.ownerName || config.ownerName || 'ϝяαєȥ'

        // Permite que un subbot use su propia media personalizada; si no, usamos el banner por defecto
        const customMediaUrl = botData.mediaUrl || botData.image
        const customMediaType = botData.mediaType || (botData.image ? 'image' : null)

        const pluginsDir = path.join(process.cwd(), 'plugins')
        const categories = {}

        try {
            const folders = fs.readdirSync(pluginsDir)

            for (const folder of folders) {
                const folderPath = path.join(pluginsDir, folder)

                if (fs.statSync(folderPath).isDirectory()) {
                    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'))

                    for (const file of files) {
                        const filePath = path.join(folderPath, file)
                        try {
                            const pluginModule = await import(`file://${filePath}`)
                            const plugin = pluginModule.default || pluginModule

                            if (plugin && plugin.command) {
                                if (!categories[folder]) {
                                    categories[folder] = []
                                }

                                const mainCmd = Array.isArray(plugin.command) ? plugin.command[0] : plugin.command
                                if (mainCmd) {
                                    categories[folder].push(mainCmd)
                                }
                            }
                        } catch (e) {
                            console.error(`Error al cargar el plugin ${file} para el menú:`, e)
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Error al leer el directorio de plugins:', e)
        }

        let menuText = `◤━━━━━━━━━━━━━━━━━━◥\n`
        menuText += `     *${botName}*\n`
        menuText += `◣━━━━━━━━━━━━━━━━━━◢\n\n`
        menuText += `⛓️ Despierta, *${nombre}*.\n`
        menuText += `La espiral ya te encontró.\n\n`
        menuText += `┌─ ✝️ PERFIL\n`
        menuText += `│ 🖤 Bot ・ ${botName}\n`
        menuText += `│ 👁️ Amo ・ ${ownerName}\n`
        menuText += `│ ⛓️ Ver ・ ${config.version || '1.0.0'}\n`
        menuText += `└───────────────\n\n`

        for (const [category, commands] of Object.entries(categories)) {
            if (commands.length === 0) continue

            const icon = getCategoryIcon(category)
            const catName = categoryNames[category.toLowerCase()] || category.toUpperCase()

            menuText += `┌─ ${icon} ${catName}\n`
            for (const cmd of commands) {
                menuText += `│ ⟶ ${usedPrefix}${cmd}\n`
            }
            menuText += `└───────────────\n\n`
        }

        menuText += `🕸️ *${botName}* · nada permanece en la oscuridad 🕸️`

        // Prioridad 1: media personalizada del subbot (si el dueño la configuró)
        if (customMediaUrl) {
            if (customMediaType === 'video') {
                await conn.sendMessage(m.chat, {
                    video: { url: customMediaUrl },
                    caption: menuText,
                    gifPlayback: true
                }, { quoted: m })
            } else {
                await conn.sendMessage(m.chat, {
                    image: { url: customMediaUrl },
                    caption: menuText
                }, { quoted: m })
            }
            return
        }

        // Prioridad 2: banner de video por defecto, en bucle y silencioso (autoplay tipo GIF)
        try {
            if (fs.existsSync(BANNER_PATH)) {
                const bannerBuffer = fs.readFileSync(BANNER_PATH)
                await conn.sendMessage(m.chat, {
                    video: bannerBuffer,
                    caption: menuText,
                    gifPlayback: true
                }, { quoted: m })
                return
            }
        } catch (e) {
            console.error('❌ Error enviando el banner del menú:', e)
        }

        // Fallback: solo texto si no hay banner disponible
        await m.reply(menuText)
    }
}
