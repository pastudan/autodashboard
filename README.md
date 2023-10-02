This is a [Next.js](https://nextjs.org/) project with a websocket backend

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Build script for updating OUI MAC address database

The build script in `bin/build.sh` will download the latest OUI database from wireguard and convert it to a JSON file. You can run this to update the database before a release or during development.

## Building icons for development

Go to the [figma](https://www.figma.com/file/29phAvBE1H2hgYgv6umJnL/company-logos?type=design&node-id=0%3A1&mode=design&t=ki2gT9glgST218xH-1) and export all as SVGs (Figma -> File -> Export).

Then run `./bin/build.sh`
