/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/descargas/tiktok.js
ʚĭɞ ೃ funcion :: descarga de tiktok
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

const EVO_KEY = 'evogb-WzR3kPpa'
const STELLAR_KEY = 'api-COTah'
const NYX_KEY = 'nyx_l2Y4HOwx9eblsbx8LGto9JfTvTRLCzTE'

const EVO_API = 'https://api.evogb.org/dl/tiktokv2'
const STELLAR_API = 'https://api.stellarwa.xyz/dl/tiktokv2'
const NYX_API = 'https://nyxdlapi.vercel.app/api/downloads/tiktok'

export default {
    command: [
        'tiktok',
        'tt'
    ],

    async run(m, { conn, args }) {
        if (!args || args.length === 0) {
            return m.reply(
                '╭─「 🎵 *TIKTOK DOWNLOADER* 」\n' +
                '│\n' +
                '│ ❌ Escribe un enlace de TikTok.\n' +
                '│\n' +
                '│ Ejemplos:\n' +
                '│ .tiktok https://vm.tiktok.com/xxxxx\n' +
                '│ .tiktok https://vm.tiktok.com/xxxxx,1\n' +
                '│ .tiktok https://vm.tiktok.com/xxxxx,2\n' +
                '│ .tiktok https://vm.tiktok.com/xxxxx,3\n' +
                '│\n' +
                '│ , 1 = EvoGB\n' +
                '│ , 2 = Stellar\n' +
                '│ , 3 = NyxDLaPI\n' +
                '│\n' +
                '│ Si no eliges API se usará Evo.\n' +
                '╰──────────────'
            )
        }

        let api = 1
        let url = args.join(' ').trim()

        if (url.endsWith(', 3')) {
            api = 3
            url = url.replace(/, 3$/, '').trim()
        } else if (url.endsWith(', 2')) {
            api = 2
            url = url.replace(/, 2$/, '').trim()
        } else if (url.endsWith(', 1')) {
            api = 1
            url = url.replace(/, 1$/, '').trim()
        }

        if (
            !url.includes('tiktok.com') &&
            !url.includes('vm.tiktok.com') &&
            !url.includes('vt.tiktok.com')
        ) {
            return m.reply('❌ Debes ingresar un enlace válido de TikTok.')
        }

        await m.reply(
            '📥 Descargando TikTok...\n\n' +
            `🌐 API: ${api === 1 ? 'EvoGB' : api === 2 ? 'Stellar' : 'NyxDLaPI'}`
        )

        function buildURL(apiNumber) {
            if (apiNumber === 3) {
                return `${NYX_API}?url=${encodeURIComponent(url)}&apikey=${NYX_KEY}`
            }
            if (apiNumber === 2) {
                return `${STELLAR_API}?url=${encodeURIComponent(url)}&key=${STELLAR_KEY}`
            }
            return `${EVO_API}?url=${encodeURIComponent(url)}&key=${EVO_KEY}`
        }

        try {
            let response
            let data

            try {
                response = await fetch(buildURL(api))
                data = await response.json()

                if (!response.ok || !data.status) {
                    throw new Error('API Error')
                }
            } catch {
                if (api === 1) {
                    await m.reply('⚠️ EvoGB no respondió.\nProbando Stellar...')
                    api = 2
                    try {
                        response = await fetch(buildURL(2))
                        data = await response.json()

                        if (!response.ok || !data.status) {
                            throw new Error('API Error')
                        }
                    } catch {
                        await m.reply('⚠️ Stellar tampoco respondió.\nProbando NyxDLaPI...')
                        api = 3
                        response = await fetch(buildURL(3))
                        data = await response.json()

                        if (!response.ok || !data.status) {
                            return m.reply('❌ Las 3 APIs fallaron.')
                        }
                    }
                } else if (api === 2) {
                    await m.reply('⚠️ Stellar no respondió.\nProbando NyxDLaPI...')
                    api = 3
                    response = await fetch(buildURL(3))
                    data = await response.json()

                    if (!response.ok || !data.status) {
                        return m.reply('❌ Stellar y NyxDLaPI fallaron.')
                    }
                } else {
                    return m.reply('❌ La API NyxDLaPI no respondió.')
                }
            }

            let video
            let music = null
            let likes = '0'
            let views = '0'
            let comments = '0'
            let shares = '0'
            let duration = 'Desconocida'
            let author = 'Desconocido'
            let musicTitle = 'Sin información'

            if (api === 3) {
                video = data.result?.downloadNoWatermark || data.result?.download
                music = data.result?.music || null
                duration = data.result?.duration ? `${data.result.duration}s` : 'Desconocida'
                author = data.result?.author || data.result?.username || 'Desconocido'
                musicTitle = data.result?.musicTitle || 'Sin información'
            } else {
                video =
                    data.data?.find(v => v.type === 'nowatermark_hd')?.url ||
                    data.data?.find(v => v.type === 'nowatermark')?.url ||
                    data.data?.find(v => v.type === 'watermark')?.url

                music = data.music_info?.url || null
                likes = data.stats?.likes || '0'
                views = data.stats?.views || '0'
                comments = data.stats?.comment || '0'
                shares = data.stats?.share || '0'
                duration = data.duration || 'Desconocida'
                author = data.author?.nickname || 'Desconocido'
                musicTitle = data.music_info?.title || 'Sin información'
            }

            if (!video) {
                return m.reply('❌ No se encontró el video.')
            }

            await conn.sendMessage(
                m.chat,
                {
                    video: { url: video },
                    mimetype: 'video/mp4',
                    fileName: 'tiktok.mp4',
                    caption:
                        '╭━━━〔 🎵 TIKTOK DOWNLOADER 〕━━━⬣\n' +
                        `┃ 👤 Autor: ${author}\n` +
                        (api === 3
                            ? ''
                            : `┃ ❤️ Likes: ${likes}\n` +
                              `┃ 👀 Vistas: ${views}\n` +
                              `┃ 💬 Comentarios: ${comments}\n` +
                              `┃ 🔄 Compartidos: ${shares}\n`) +
                        `┃ ⏱️ Duración: ${duration}\n` +
                        `┃ 🎧 Música: ${musicTitle}\n` +
                        `┃ 🌐 API: ${api === 1 ? 'EvoGB' : api === 2 ? 'Stellar' : 'NyxDLaPI'}\n` +
                        '╰━━━━━━━━━━━━━━━━━━━━⬣'
                },
                { quoted: m }
            )

            if (music) {
                try {
                    await conn.sendMessage(
                        m.chat,
                        {
                            audio: { url: music },
                            mimetype: 'audio/mpeg',
                            ptt: false,
                            fileName: 'tiktok.mp3'
                        },
                        { quoted: m }
                    )
                } catch (audioError) {
                    console.log('⚠️ No se pudo enviar el audio de TikTok:', audioError.message)
                }
            }

        } catch (error) {
            console.error('❌ Error TikTok:', error)
            return m.reply(
                '❌ Ocurrió un error al descargar el TikTok.\n\n' +
                `📄 ${error?.message || 'Error desconocido'}`
            )
        }
    }
}
