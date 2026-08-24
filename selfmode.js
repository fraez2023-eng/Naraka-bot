/*
•❅──────✧✦✧──────❅•
Codigo Creado Por NARAKA-BOT-TEAM
Para Naraka-Bot Este Codigo Es 
Exclusivo Y Unico Para Este Bot Al 
Clonar O Copiar Dejar Estos Creditos 
De Naraka-Bot-Team
━━━━━ ☾☽ ━━━━━
ʚĭɞ ೃ CODIGO JAVASCRIPT ʚĭɞ ೃ
ʚĭɞ ೃ codigo :: lib/selfmode.js
ʚĭɞ ೃ funcion :: guardar/leer el estado del modo self (bot principal y subbots)
ʚĭɞ ೃ estado :: completo
──────✧✦✧──────
*/

import fs from 'fs'

const MAIN_FLAG_PATH = './database/mainbot_config.json'
const SUBBOTS_FLAG_PATH = './database/subbots_config.json'

function ensureFile(filePath, defaultData) {
    if (!fs.existsSync('./database')) {
        fs.mkdirSync('./database', { recursive: true })
    }
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2))
    }
}

function decodeIdentifier(target) {
    if (!target) return ''
    return String(target).split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
}

export function getMainSelfMode() {
    ensureFile(MAIN_FLAG_PATH, { selfMode: false })
    try {
        const data = JSON.parse(fs.readFileSync(MAIN_FLAG_PATH, 'utf-8'))
        return Boolean(data.selfMode)
    } catch {
        return false
    }
}

export function setMainSelfMode(value) {
    ensureFile(MAIN_FLAG_PATH, { selfMode: false })
    fs.writeFileSync(MAIN_FLAG_PATH, JSON.stringify({ selfMode: Boolean(value) }, null, 2))
}

export function getSubBotSelfMode(botJid) {
    ensureFile(SUBBOTS_FLAG_PATH, {})
    const cleanNumber = decodeIdentifier(botJid)
    if (!cleanNumber) return false

    try {
        const data = JSON.parse(fs.readFileSync(SUBBOTS_FLAG_PATH, 'utf-8'))
        return Boolean(data[cleanNumber]?.selfMode)
    } catch {
        return false
    }
}

export function setSubBotSelfMode(botJid, value) {
    ensureFile(SUBBOTS_FLAG_PATH, {})
    const cleanNumber = decodeIdentifier(botJid)
    if (!cleanNumber) return

    const data = JSON.parse(fs.readFileSync(SUBBOTS_FLAG_PATH, 'utf-8'))
    data[cleanNumber] = {
        ...(data[cleanNumber] || {}),
        selfMode: Boolean(value),
        updatedAt: Date.now()
    }
    fs.writeFileSync(SUBBOTS_FLAG_PATH, JSON.stringify(data, null, 2))
}
