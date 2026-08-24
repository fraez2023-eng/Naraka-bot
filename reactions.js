/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: lib/reactions.js
ʚĭɞ ೃ funcion :: motor compartido para comandos de reacciones anime (hug, slap, etc.)
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'lib', 'data', 'reactions.json')

let REACTIONS = {}

try {
    REACTIONS = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
} catch (e) {
    console.error('❌ Error cargando lib/data/reactions.json:', e)
}

const VERBS = {
    hug: { with: 'abrazó a', solo: 'se abraza a sí mism@' },
    kiss: { with: 'besó a', solo: 'se da un beso' },
    pat: { with: 'acarició a', solo: 'se acaricia' },
    slap: { with: 'abofeteó a', solo: 'se da una bofetada' },
    punch: { with: 'golpeó a', solo: 'se golpea solo' },
    kill: { with: 'asesinó a', solo: 'se autodestruye' },
    cuddle: { with: 'acurrucó con', solo: 'se acurruca solo' },
    dance: { with: 'bailó con', solo: 'baila solo' },
    cry: { with: 'lloró con', solo: 'está llorando' },
    laugh: { with: 'se rió de', solo: 'se ríe solo' },
    bite: { with: 'mordió a', solo: 'se muerde' },
    lick: { with: 'lamió a', solo: 'se lame' },
    poke: { with: 'tocó a', solo: 'se toca' },
    love: { with: 'ama a', solo: 'se ama a sí mism@' },
    blush: { with: 'se sonroja por', solo: 'se sonroja' },
    angry: { with: 'se enfadó con', solo: 'está enfadad@' },
    happy: { with: 'está feliz con', solo: 'está feliz' },
    sad: { with: 'está triste por', solo: 'está triste' },
    sleep: { with: 'durmió con', solo: 'se durmió' },
    run: { with: 'corrió de', solo: 'está corriendo' },
    bath: { with: 'se baña con', solo: 'se está bañando' },
    bleh: { with: 'le sacó la lengua a', solo: 'saca la lengua' },
    bored: { with: 'se aburre con', solo: 'está aburrid@' },
    clap: { with: 'aplaude a', solo: 'aplaude' },
    coffee: { with: 'toma un café con', solo: 'toma un café' },
    drunk: { with: 'se emborracha con', solo: 'está borrach@' },
    eat: { with: 'come con', solo: 'está comiendo' },
    facepalm: { with: 'se decepciona de', solo: 'se hace un facepalm' },
    pout: { with: 'hace pucheros a', solo: 'hace pucheros' },
    scared: { with: 'se asusta de', solo: 'está asustad@' },
    seduce: { with: 'intenta seducir a', solo: 'intenta seducir' },
    shy: { with: 'se pone tímid@ con', solo: 'está tímid@' },
    smoke: { with: 'fuma con', solo: 'está fumando' },
    think: { with: 'piensa en', solo: 'está pensando' }
}

function pickUrl(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function resolveTarget(m) {
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        return m.mentionedJid[0]
    }

    if (m.quoted?.key?.participant) {
        return m.quoted.key.participant
    }

    return null
}

function buildCaption(m, action, targetJid) {
    const verb = VERBS[action] || {
        with: `hizo *${action}* a`,
        solo: `hace *${action}* solo`
    }

    const me = m.pushName || 'Alguien'
    const mentions = [m.sender]

    if (targetJid && targetJid !== m.sender) {
        mentions.push(targetJid)
        const targetTag = `@${String(targetJid).split('@')[0]}`
        return {
            caption: `🦈 *${me}* ${verb.with} ${targetTag}`,
            mentions
        }
    }

    return {
        caption: `🦈 *${me}* ${verb.solo}`,
        mentions
    }
}

function createReactionPlugin(action) {
    const urls = REACTIONS[action] || []

    return {
        command: [action],

        async run(m, { conn }) {
            if (!urls.length) {
                return m.reply('❌ No hay contenido disponible para esta reacción.')
            }

            const target = resolveTarget(m)
            const { caption, mentions } = buildCaption(m, action, target)
            const url = pickUrl(urls)
            const isImg = /\.(jpe?g|png|webp)(\?|$)/i.test(url)

            try {
                if (isImg) {
                    await conn.sendMessage(
                        m.chat,
                        { image: { url }, caption, mentions },
                        { quoted: m }
                    )
                } else {
                    await conn.sendMessage(
                        m.chat,
                        { video: { url }, caption, gifPlayback: true, mentions },
                        { quoted: m }
                    )
                }
            } catch (error) {
                console.error(`❌ Error en reacción ${action}:`, error)
                await m.reply(caption)
            }
        }
    }
}

export { createReactionPlugin, REACTIONS }
