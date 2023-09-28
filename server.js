// const { createServer } = require("http");
// const { parse } = require("url");
// const next = require("next");
// const { exec } = require("child_process");
// const { promisify } = require("util");
// const execAsync = promisify(exec);
// const parseString = require("xml2js").parseString;

import fetch from "node-fetch";
import { exec } from "child_process";
import { promisify } from "util";
import { parseString } from "xml2js";
import next from "next";
import parse from "url";
import createServer from "http";
import { readFile, writeFile } from "fs/promises";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 8828;

// // when using middleware `hostname` and `port` must be provided below
// const app = next({ dev, hostname, port });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   createServer((req, res) => {
//     handle(req, res);
//   }).listen(port, () => {
//     console.log(`> Ready on http://${hostname}:${port}`);
//   });
// });

// download wireshark OUI db file if not exists
let oui;
try {
  oui = await readFile("oui.txt", "utf8");
} catch (e) {}
if (!oui) {
  const ouiRes = await fetch(
    "https://www.wireshark.org/download/automated/data/manuf"
  );
  oui = await ouiRes.text();
  await writeFile("oui.txt", oui);
}
oui = oui
  .split("\n")
  .filter((line) => !line.startsWith("#"))
  .map((line) => {
    const [mac, _shortVendor, vendor] = line.split("\t").map((s) => s.trim());
    return { mac, vendor };
  }); // TODO handle blocks like /24

let hosts = [];

console.log("Scanning via nmap...");

exec("nmap -sn 192.168.1.0/24 -oX -", (error, stdout, stderr) => {
  if (error) {
    console.error(`nmap error: ${error}`);
    return;
  }
  parseString(stdout, (err, result) => {
    if (err) {
      console.error(`parseString error: ${err}`);
      return;
    }
    result.nmaprun.host.forEach((host) => {
      const ip = host.address.find((a) => a?.$?.addrtype === "ipv4")?.$?.addr;
      const mac = host.address.find((a) => a?.$?.addrtype === "mac")?.$?.addr;
      hosts.push({
        ip,
        mac,
        vendor: oui.find((o) => mac?.startsWith(o.mac))?.vendor,
      });
    });
    hosts = hosts.sort((a, b) => (a.vendor > b.vendor ? 1 : -1));
    console.table(hosts);
  });
});
