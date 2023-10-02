curl https://www.wireshark.org/download/automated/data/manuf -o src/oui/oui.txt
node backend/oui.js
npx @svgr/cli src/svg --out-dir src/svgjs --filename-case=camel --no-dimensions