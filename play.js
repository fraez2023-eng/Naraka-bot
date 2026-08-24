/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/descargas/play.js
ʚĭɞ ೃ funcion :: descarga de youtube en mp3
ʚĭɞ ೃ api :: AetherApi
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

const AETHER_KEY = 'AETHER-a33ab1e6b9649a3d876571ad'
const AETHER_BASE = 'https://aetherapi-i7fc.onrender.com'

export default {
    command: [
        'play',
        'playaudio'
    ],

    async run(m, { conn, args }) {
        if (!args || args.length === 0) {
            return m.reply(
                '╭─「 🎵 *YOUTUBE PLAY* 」\n' +
                '│\n' +
                '│ ❌ Escribe el nombre o enlace de una canción.\n' +
                '│\n' +
                '│ 📌 Ejemplos:\n' +
                '│ .play nombre de la canción\n' +
                '│ .play https://youtu.be/xxxxxx\n' +
                '╰──────────────'
            )
        }

        const query = args.join(' ')

        await m.reply('> ⏳ *Buscando...*')

        try {
            const dlUrl = `${AETHER_BASE}/api/ytmp3?query=${encodeURIComponent(query)}&apikey=${AETHER_KEY}`

            const res = await fetch(dlUrl)
            if (!res.ok) throw new Error(`HTTP Error ${res.status}`)

            const data = await res.json()

            if (!data.status) {
                return m.reply('❌ Error: No se pudo procesar la solicitud.')
            }

            const captionText =
                '╭━━━〔 🎵 YOUTUBE PLAY 〕━━━⬣\n' +
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
                    audio: { url: data.download_url },
                    mimetype: 'audio/mp4',
                    fileName: `${sanitizeFileName(data.title)}.mp3`,
                    ptt: false
                },
                { quoted: m }
            )

        } catch (error) {
            console.error('❌ Error en play:', error)
            return m.reply(
                '❌ Ocurrió un error al procesar el audio.\n\n' +
                `📄 ${error instanceof Error ? error.message : 'Error desconocido'}`
            )
        }
    }
}

function sanitizeFileName(input) {
    return String(input || 'audio')
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 100) || 'audio'
}
