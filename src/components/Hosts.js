import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChainBroken,
  faExternalLink,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import echoDot from "@/../public/echo-dot.png";
import nestHub from "@/../public/nest-hub.png";
import nestMini from "@/../public/nest-mini.png";
import tplinkEap from "@/../public/tplink-eap.png";
// import tplinkKasa from "@/../public/tplink-kasa.png";
import tplinkEr605 from "@/../public/tplink-er605.png";
import { useEffect, useState } from "react";
import * as svg from "@/svgjs/index.js";
import oui from "../oui/oui.json";


const fields = [
  "ip",
  "mac", //key
];

async function copyToClipboard(textToCopy) {
  // Navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(textToCopy);
  } else {
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }
  }
}

// function renderIconHosts({ hosts }) {
//   return (
//     <>
//       <h2 className="text-lg font-semibold px-8 mt-8 container mx-auto">
//         Devices
//       </h2>
//       <div className="container px-8 mx-auto mt-4 flex">
//         {hosts.map((host) => {
//           return (
//             <div
//               key={host.ip}
//               className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 rounded-md shadow-md mx-2 my-2"
//             >
//               {host.vendor === "Amazon" && (
//                 <img src={echoDot.src} className="w-16" />
//               )}
//               {host.vendor === "Google," && (
//                 <img src={nestHub.src} className="w-16" />
//               )}
//               {host.vendor === "Tp-Link" && (
//                 <img src={tplinkEap.src} className="w-16" />
//               )}
//               {host.vendor === "TP-Link" && (
//                 <img src={tplinkEr605.src} className="w-16" />
//               )}
//               <div className="text-sm text-gray-700">{host.ip}</div>
//               <div className="text-sm text-gray-700">
//                 {host.vendor} {host.deviceType}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// }

function renderTableHosts({ hosts }) {
  const [sortKey, setSortKey] = useState("vendor");
  const [showingPorts, setShowingPorts] = useState([]);

  hosts = hosts.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));

  return (
    <>
      <h2 className="text-lg font-semibold px-8 mt-8 container mx-auto">
        Hosts
      </h2>
      <div className="container px-8 mx-auto mt-4">
        {hosts.length === 0 ? (
          `No hosts`
        ) : (
          <table>
            <thead>
              <tr>
                <th
                  onClick={() => setSortKey("vendor")}
                  className="uppercase text-gray-500 text-sm text-left pr-8 cursor-pointer"
                >
                  Vendor
                </th>
                <th
                  onClick={() => setSortKey("vendor")}
                  className="uppercase text-gray-500 text-sm text-left pr-8 cursor-pointer"
                >
                  Device Type
                </th>
                {fields.map((field) => (
                  <th
                    onClick={() => setSortKey(field)}
                    key={field}
                    className="uppercase text-gray-500 text-sm text-left pr-8 cursor-pointer"
                  >
                    {field}
                  </th>
                ))}
                <th className="uppercase text-gray-500 text-sm text-left pr-8">
                  Ports
                </th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((host) => {
                const vendor = oui.find((o) =>
                  host.mac.startsWith(o.prefix)
                )?.vendor;
                let vendorOneWord = vendor
                  .replace(/ |-/g, "")
                  .replace(/-/g, "")
                  .toLowerCase();
                vendorOneWord =
                  vendorOneWord.at(0).toUpperCase() + vendorOneWord.slice(1);

                let VendorIcon = svg[vendorOneWord];

                const KNOWN_PORTS = [
                  "22",
                  "554",
                  "80",
                  "443",
                  "53",
                  "8123",
                  "32400",
                ];

                const knownPorts = (host.ports || [])
                  .filter((port) => KNOWN_PORTS.includes(port))
                  .sort((a, b) => {
                    const aIndex = KNOWN_PORTS.indexOf(a);
                    const bIndex = KNOWN_PORTS.indexOf(b);
                    return aIndex > bIndex ? 1 : -1;
                  });

                console.log(host.ip, {
                  ip: host.ip,
                  ports: host.ports,
                  knownPorts,
                });

                const unknownPorts = (host.ports || []).filter(
                  (p) => !KNOWN_PORTS.includes(p.port)
                );

                return (
                  <tr key={host.ip}>
                    <td className="pr-3 flex items-center">
                      <div className="mr-2 w-6">
                        {VendorIcon && <VendorIcon style={{ height: 24 }} />}
                      </div>
                      {vendor}
                    </td>
                    <td
                      className={`pr-3 ${
                        host.deviceType === "Unknown" ? "text-gray-500" : ""
                      }`}
                    >
                      {host.deviceType}
                    </td>
                    {fields.map((field) => (
                      //  ${field === 'spread' ? 'bg-green-' + p.spread * 100 * 1000 : ''}
                      <td
                        key={field}
                        className={`pr-3 ${
                          field === "mac" && " text-sm text-gray-700 font-mono"
                        }`}
                      >
                        {host[field]}
                      </td>
                    ))}
                    {/* <td className="pr-3">
                      {host.services?.map((s, index) => (
                        <a
                          key={index}
                          href={`http://${s.hostname}:${s.port}`}
                          className="mr-1 border px-1 py-0.5 rounded-md text-sm border-gray-300 hover:border-gray-400 hover:text-gray-600"
                          target="_blank"
                        >
                          {s.hostname.split(".local")[0]}:{s.port}
                        </a>
                      ))}
                    </td> */}
                    <td className="pr-3">
                      {knownPorts.map((port) => {
                        if (port === "22")
                          return (
                            <span
                              className="mr-1 px-1 py-0.5 rounded-sm text-xs text-white bg-gray-600 font-bold hover:bg-gray-900 cursor-pointer"
                              onClick={() => {
                                // copy to clipboard
                                const username =
                                  vendor === "Raspberry Pi" ? "pi" : "root";
                                const cmd = `ssh ${username}@${host.ip}`;
                                copyToClipboard(cmd);
                                alert(
                                  `---\n\n${cmd}\n\n---\nCopied to clipboard!`
                                );
                              }}
                            >
                              SSH
                            </span>
                          );

                        if (port === "53")
                          return (
                            <span
                              className="mr-1 px-1 py-0.5 rounded-sm text-xs"
                              title="Port 53"
                            >
                              DNS
                            </span>
                          );

                        if (port === "80")
                          return (
                            <a
                              className="font-bold mr-1 px-1 py-0.5 rounded-md text-xs hover:underline"
                              href={`http://${host.ip}:${port}`}
                              target="_blank"
                            >
                              HTTP{" "}
                              <FontAwesomeIcon
                                icon={faExternalLink}
                                className="ml-0.5"
                              />
                            </a>
                          );

                        if (port === "443")
                          return (
                            <a
                              className="font-bold mr-1 px-1 py-0.5 rounded-md text-xs hover:underline"
                              href={`https://${host.ip}:${port}`}
                              target="_blank"
                            >
                              HTTPS{" "}
                              <FontAwesomeIcon
                                icon={faExternalLink}
                                className="ml-0.5"
                              />
                            </a>
                          );

                        if (port === "554") {
                          return (
                            <span
                              className="mr-1 px-1 py-0.5 rounded-sm text-xs text-white bg-gray-600 font-bold hover:bg-gray-900 cursor-pointer"
                              onClick={() => {
                                const url = `rtsp://${host.ip}:${port}/Streaming/Channels/1`;
                                copyToClipboard(url);
                                alert(
                                  `---\n\n${url}\n\n---\nCopied to clipboard!`
                                );
                              }}
                            >
                              RTSP
                            </span>
                          );
                        }

                        if (port === "8123")
                          return (
                            <a
                              className="font-bold mr-1 px-1 py-0.5 rounded-md text-xs hover:underline"
                              href={`http://${host.ip}:${port}`}
                              target="_blank"
                            >
                              <svg.Homeassistant className="w-4 inline-block mr-0.5" />
                              HomeAssistant{" "}
                            </a>
                          );

                        if (port === "32400")
                          return (
                            <a
                              className="font-bold mr-1 px-1 py-0.5 rounded-md text-xs hover:underline"
                              href={`http://${host.ip}:${port}`}
                              target="_blank"
                            >
                              <svg.Plex className="w-4 inline-block mr-0.5" />
                              Plex{" "}
                            </a>
                          );
                      })}

                      {unknownPorts.length === 0 ? null : showingPorts.includes(
                          host.mac
                        ) ? (
                        unknownPorts.map((port) => {
                          if (KNOWN_PORTS.includes(port)) return null;
                          return (
                            <a
                              key={port}
                              href={`http${
                                ["8443"].includes(port) ? "s" : ""
                              }://${host.ip}:${port}`}
                              className="mr-1 border px-1 py-0.5 rounded-sm text-xs text-gray-400 border-gray-300 hover:border-gray-400 hover:text-gray-700 cursor-pointer"
                              target="_blank"
                            >
                              {port}
                            </a>
                          );
                        })
                      ) : (
                        <a
                          onClick={() => {
                            setShowingPorts([...showingPorts, host.mac]);
                          }}
                          className="text-xs hover:underline cursor-pointer text-gray-400 hover:text-gray-600"
                        >
                          +{unknownPorts.length} open
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default function Hosts({ connected, hosts }) {
  if (connected === null)
    return (
      <h2 className="mx-auto container py-10 px-8 text-lg font-semibold">
        <FontAwesomeIcon icon={faWifi} className="pr-2" />
        Connecting to backend...
      </h2>
    );

  if (connected === false)
    return (
      <h2 className="mx-auto container py-10 px-8 text-lg font-semibold">
        <FontAwesomeIcon icon={faChainBroken} className="pr-2" />
        Disconnected. Please restart the backend.
      </h2>
    );

  // hosts = hosts.map((host) => {
  //   host.mini = [
  //     "10.9.6.34", //
  //     "10.9.6.35",
  //     "10.9.6.42",
  //     "10.9.6.1",
  //     "10.9.6.37",
  //   ].includes(host.ip);
  //   return host;
  // });

  const iconHosts = hosts.filter((h) => h.mini);
  const tableHosts = hosts.filter((h) => !h.mini);

  return (
    <>
      {/* {renderIconHosts({ hosts: iconHosts })} */}
      {renderTableHosts({ hosts: tableHosts })}
      <video id="test_video" controls autoplay>
        <source src="rtsp://your_rtsp_stream/url" />
      </video>
    </>
  );
}
