/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: plugins/busquedas/pinterest.js
ʚĭɞ ೃ funcion :: busqueda de imagenes en Pinterest (scraper directo, sin api key)
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

async function pinterestSearch(query) {
    const link =
        `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(query)}%26rs%3Dtyped&data=%7B%22options%22%3A%7B%22applied_unified_filters%22%3Anull%2C%22appliedProductFilters%22%3A%22---%22%2C%22article%22%3Anull%2C%22auto_correction_disabled%22%3Afalse%2C%22corpus%22%3Anull%2C%22customized_rerank_type%22%3Anull%2C%22domains%22%3Anull%2C%22dynamicPageSizeExpGroup%22%3A%22control%22%2C%22filters%22%3Anull%2C%22journey_depth%22%3Anull%2C%22page_size%22%3Anull%2C%22price_max%22%3Anull%2C%22price_min%22%3Anull%2C%22query_pin_sigs%22%3Anull%2C%22query%22%3A%22${encodeURIComponent(query)}%22%2C%22redux_normalize_feed%22%3Atrue%2C%22request_params%22%3Anull%2C%22rs%22%3A%22typed%22%2C%22scope%22%3A%22pins%22%2C%22selected_one_bar_modules%22%3Anull%2C%22seoDrawerEnabled%22%3Afalse%2C%22source_id%22%3Anull%2C%22source_module_id%22%3Anull%2C%22source_url%22%3A%22%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(query)}%26rs%3Dtyped%22%2C%22top_pin_id%22%3Anull%2C%22top_pin_ids%22%3Anull%7D%2C%22context%22%3A%7B%7D%7D`

    const res = await fetch(link, {
        headers: {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'accept-language': 'es-ES,es;q=0.9,en-US;q=0.8,en;q=0.7',
            'referer': 'https://ar.pinterest.com/',
            'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
            'x-app-version': 'c056fb7',
            'x-pinterest-appstate': 'active',
            'x-pinterest-pws-handler': 'www/index.js',
            'x-pinterest-source-url': '/',
            'x-requested-with': 'XMLHttpRequest'
        }
    })

    if (!res.ok) {
        throw new Error(`Pinterest ${res.status}`)
    }

    const json = await res.json()
    const results = json?.resource_response?.data?.results || []

    return results
        .map(item => {
            if (!item.images) return null

            const image = item.images.orig?.url || item.images['736x']?.url
            if (!image) return null

            return {
                title: item.title || item.grid_title || 'Pinterest Pin',
                image,
                image_small: item.images['236x']?.url || null,
                link: item.id ? `https://www.pinterest.com/pin/${item.id}/` : null,
                desc: item.description || null
            }
        })
        .filter(Boolean)
}

export default {
    command: [
        'pinterest',
        'pin'
    ],

    async run(m, { conn, args, usedPrefix, command }) {
        let limit = 5
        const rawArgs = [...args]

        const lastArg = rawArgs[rawArgs.length - 1]
        if (rawArgs.length > 1 && !isNaN(lastArg)) {
            limit = Math.min(Math.max(parseInt(lastArg, 10), 1), 10)
            rawArgs.pop()
        }

        const query = rawArgs.join(' ').trim()

        if (!query) {
            return m.reply(
                '╭─「 📌 *PINTEREST SEARCH* 」\n' +
                '│\n' +
                '│ ❌ Ingresa un término de búsqueda.\n' +
                '│\n' +
                '│ *Ejemplos:*\n' +
                `│ ${usedPrefix}${command} paisajes\n` +
                `│ ${usedPrefix}${command} anime dark, 8\n` +
                '│\n' +
                '│ (el número final es la cantidad de\n' +
                '│ resultados, máximo 10, por defecto 5)\n' +
                '╰──────────────'
            )
        }

        await m.reply('📌 Buscando en Pinterest...')

        try {
            const results = await pinterestSearch(query)

            if (!results.length) {
                return m.reply('❌ No se encontraron resultados para tu búsqueda.')
            }

            const selected = results.slice(0, limit)

            for (const pin of selected) {
                const caption =
                    '╭━━━〔 📌 PINTEREST 〕━━━⬣\n' +
                    `┃ 📝 Título: ${pin.title}\n` +
                    (pin.link ? `┃ 🔗 Link: ${pin.link}\n` : '') +
                    '╰━━━━━━━━━━━━━━━━━━━━⬣'

                await conn.sendMessage(
                    m.chat,
                    {
                        image: { url: pin.image },
                        caption
                    },
                    { quoted: m }
                )
            }

        } catch (error) {
            console.error('❌ Error Pinterest:', error)
            return m.reply(
                '❌ Ocurrió un error al buscar en Pinterest.\n\n' +
                `📄 ${error?.message || 'Error desconocido'}`
            )
        }
    }
}
