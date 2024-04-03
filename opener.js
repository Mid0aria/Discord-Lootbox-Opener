const red = "\x1b[31m(-)\x1b[0m";
const blue = "\x1b[34m(+)\x1b[0m";
const green = "\x1b[32m(+)\x1b[0m";
const yellow = "\x1b[33m(!)\x1b[0m";

function getTimestamp() {
    const now = new Date();
    const timeIdk = now.toLocaleTimeString("en-US");
    const timestamp = `[${timeIdk}]`;
    return timestamp;
}

class DiscordSession {
    async post(url, headers) {
        const response = await fetch(url, { method: "POST", headers });
        return response;
    }
}

class LootBoxOpener {
    constructor(discordSession, token) {
        this.discordSession = discordSession;
        this.token = token;
        this.lootboxItems = {
            "1214340999644446726": "Quack!!",
            "1214340999644446724": "⮕⬆⬇⮕⬆⬇",
            "1214340999644446722": "Wump Shell",
            "1214340999644446720": "Buster Blade",
            "1214340999644446725": "Power Helmet",
            "1214340999644446723": "Speed Boost",
            "1214340999644446721": "Cute Plushie",
            "1214340999644446728": "Dream Hammer",
            "1214340999644446727": "OHHHHH BANANA",
        };
        this.headers = {
            authority: "discord.com",
            accept: "*/*",
            "accept-language": "en-US",
            authorization: token,
            origin: "https://discord.com",
            referer:
                "https://discord.com/channels/1222747973205758002/1224417703100551169",
            "sec-ch-ua": '"Not?A_Brand";v="8", "Chromium";v="108"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9037 Chrome/108.0.5359.215 Electron/22.3.26 Safari/537.36",
            "x-debug-options": "bugReporterEnabled",
            "x-discord-locale": "en-US",
            "x-discord-timezone": "Europe/Istanbul",
            "x-super-properties":
                "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC45MDM3Iiwib3NfdmVyc2lvbiI6IjEwLjAuMjI2MzEiLCJvc19hcmNoIjoieDY0IiwiYXBwX2FyY2giOiJpYTMyIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV09XNjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIGRpc2NvcmQvMS4wLjkwMzcgQ2hyb21lLzEwOC4wLjUzNTkuMjE1IEVsZWN0cm9uLzIyLjMuMjYgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6IjIyLjMuMjYiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoyODA3MDAsIm5hdGl2ZV9idWlsZF9udW1iZXIiOjQ1MzY5LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==",
        };
    }

    async openLootbox() {
        try {
            const response = await this.discordSession.post(
                "https://discord.com/api/v9/users/@me/lootboxes/open",
                this.headers
            );
            if (response.status === 429) {
                console.log(
                    `${getTimestamp()} ${yellow} You Are Being Rate Limited!`
                );
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } else if (response.status === 200) {
                const data = await response.json();
                const openedItem = data.opened_item;
                if (this.lootboxItems.hasOwnProperty(openedItem)) {
                    console.log(
                        `${getTimestamp()} ${green} Successfully Opened A Lootbox : ${
                            this.lootboxItems[openedItem]
                        }`
                    );
                } else {
                    console.log(
                        `${getTimestamp()} ${red} An Unknown Item Was Received.`
                    );
                }
            } else {
                console.log(
                    `${getTimestamp()} ${red} An Error Occurred : ${
                        response.status
                    } - ${await response.text()}`
                );
            }
        } catch (error) {
            console.error(
                `${getTimestamp()} ${red} An Error Occurred : ${error.message}`
            );
        }
    }
}

async function main() {
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question(
        `${getTimestamp()} ${blue} Please Enter Your Account Token : `,
        async (token) => {
            const discordSession = new DiscordSession();
            const lootboxOpener = new LootBoxOpener(discordSession, token);

            while (true) {
                await lootboxOpener.openLootbox();
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            readline.close();
        }
    );
}

main().catch((error) =>
    console.error(
        `${getTimestamp()} ${red} An Error Occurred : ${error.message}`
    )
);
