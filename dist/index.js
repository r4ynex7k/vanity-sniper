"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });

const chalk_1 = __importDefault(require("chalk"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const ws_1 = require("ws");

const ws = new ws_1.WebSocket(`wss://gateway-us-east1-b.discord.gg/?encoding=json&v=9&`);
const guilds = {};
const guildid = ""; // SERVER İD
const snipertoken = "";  // SNİPER TOKEN

ws.onopen = () => {
    console.log(`${chalk_1.default("succes")} ${chalk_1.default(`websocket baglantisi kuruldu`)}`);
    ws.send(JSON.stringify({
        op: 2,
        d: {
            token: "SELF TOKEN",  // SELF TOKEN BURAYA GİR !!!
            intents: 1 << 0,
            properties: {
                os: "win",
                browser: "chrome",
                device: "desktop",
            },
        },
    }));
};

ws.onmessage = async (message) => {
    const data = JSON.parse(message.data);

    if (data.t === "GUILD_UPDATE") {
        const getguild = guilds[data.d.id];

        if (find && find !== data.d.vanity_url_code) {
            const start = Date.now();
            await node_fetch_1.default(`https://discord.com/api/v7/guilds/${guildid}/vanity-url`, {
                method: "PATCH",
                headers: {
                    Authorization: snipertoken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: find }),
            }).then(async (res) => {
                const body = await res.json();
                const end = Date.now();
                const elapsed = end - start;
                const elapsedSeconds = elapsed / 1000;
                const text = res.ok
                    ? `\`\`\`json\n${JSON.stringify({
                        ...body,
                        type: data.t,
                        guild_name: data.d.name,
                        new_vanity: data.d.vanity_url_code,
                        accuracy: elapsedSeconds,
                    })}\`\`\``
                    : `@everyone ${find} \n\`\`\`json\n${JSON.stringify({
                        ...body,
                        type: data.t,
                        guild_name: data.d.name,
                        new_vanity: data.d.vanity_url_code,
                        accuracy: elapsedSeconds,
                    })}\`\`\``;

                return await node_fetch_1.default("https://discord.com/api/webhooks/1180700318896496710/Kj47Cg6FiqOlQhr1QqZYkk3SlqjawN5zpzlxyxK7xeGwSLXK6k3wjzbkD1PBOIjE9_so", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content: text,
                    }),
                });
            });
        }
    } else if (data.t === "GUILD_DELETE") {
        const find = guilds[data.d.id];
        if (find) {
            await node_fetch_1.default(`https://discord.com/api/v7/guilds/${guildid}/vanity-url`, {
                method: "PATCH",
                headers: {
                    Authorization: snipertoken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: find }),
            }).then(async (res) => {
                const body = await res.json();
                const text = res.ok
                    ? `\`\`\`json\n${JSON.stringify({
                        ...body,
                        type: data.t,
                        guild_name: data.d.name,
                        new_vanity: data.d.vanity_url_code,
                    })}\`\`\``
                    : `@everyone })}\`\`\``;

                return await node_fetch_1.default("https://discord.com/api/webhooks/1180700318896496710/Kj47Cg6FiqOlQhr1QqZYkk3SlqjawN5zpzlxyxK7xeGwSLXK6k3wjzbkD1PBOIjE9_so", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: res.ok ? "OK" : "ERROR",
                        content: text,
                    }),
                });
            });
        }
    }

    if (data.t === "READY") {
        for (let guild of data.d.guilds) {
            if (guild.vanity_url_code)
                guilds[guild.id] = guild.vanity_url_code;
        }
        console.log(Object.values(guilds)
            .map((value) => {
                return value;
            })
            .join(", "));
    }

    if (data.op === 1) {
        console.log(`${chalk_1.default("info")} ${chalk_1.default("hello.")}`);
        setInterval(() => ws.send(JSON.stringify({ op: 0.0002 })), data.d.heartbeat_interval);
    } else if (data.op === 7)
        return process.exit();
};

ws.onclose = () => {
    console.log(`${chalk_1.default("warning")} ${chalk_1.default("WEBSOCKET BAGLANTİSİ KAYBEDİLDİ")} ${chalk_1.default(chalk_1.default("websocket baglantisi yeniden kuruluyor"))}`);
    return process.exit();
};

ws.onerror = (event) => {
    console.log(event);
    return process.exit();
};
