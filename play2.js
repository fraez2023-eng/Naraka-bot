/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/descargas/play2.js
ʚĭɞ ೃ funcion :: descarga de youtube en mp4
ʚĭɞ ೃ api :: AetherApi
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

const AETHER_KEY = 'AETHER-a33ab1e6b9649a3d876571ad'
const AETHER_BASE = 'https://aetherapi-i7fc.onrender.com'

export default {
    command: [
        'play2',
        'playvideo',
        'mp4'
    ],

    async run(m, { conn, args }) {
        if (!args || args.length === 0) {
            return m.reply(
                '╭─「 🎬 *YOUTUBE MP4* 」\n' +
                '│\n' +
                '│ ❌ Escribe el nombre o enlace de un video.\n' +
                '│\n' +
                '│ 📌 Ejemplos:\n' +
                '│ .play2 nombre del video\n' +
                '│ .play2 https://youtu.be/xxxxxx\n' +
                '╰──────────────'
            )
        }

        const query = args.join(' ')

        await m.reply('> ⏳ *Buscando...*')

        try {
            const dlUrl = `${AETHER_BASE}/api/ytmp4?query=${encodeURIComponent(query)}&apikey=${AETHER_KEY}`

            const res = await fetch(dlUrl)
            if (!res.ok) throw new Error(`HTTP Error ${res.status}`)

            const data = await res.json()

            if (!data.status) {
                return m.reply('❌ Error: No se pudo procesar la solicitud.')
            }

            const captionText =
                '╭━━━〔 🎬 YOUTUBE VIDEO 〕━━━⬣\n' +
                `┃ 📌 *Título:* ${data.title}\n` +
                `┃ ⏱️ *Duración:* ${data.duration}s\n` +
                `┃ 🎚️ *Formato:* ${data.format} (${data.quality})\n` +
                '╰━━━━━━━━━━━━━━━━━━━━⬣'

            if (data.thumbnail) {
                await conn.sendMessage(m.chat, { image: { url: data.thumbnail }, caption: captionText }, { quoted: m })
            } else {
                await m.reply(captionText)
            }

            await conn.sendMessage(
                m.chat,
                {
                    video: { url: data.download_url },
                    mimetype: 'video/mp4',
                    fileName: `${sanitizeFileName(data.title)}.mp4`,
                    caption: `🎬 *${data.title}*`
                },
                { quoted: m }
            )

        } catch (error) {
            console.error('❌ Error en play2:', error)
            return m.reply(
                '❌ Ocurrió un error al procesar el video.\n\n' +
                `📄 ${error instanceof Error ? error.message : 'Error desconocido'}`
            )
        }
    }
}

function sanitizeFileName(input) {
    return String(input || 'video')
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 100) || 'video'
}
