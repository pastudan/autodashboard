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
import { useState } from "react";
import * as svg from "@/svgjs/index.js";
import oui from "../oui/oui.json";

const fields = [
  "deviceType",
  "ip",
  "mac", //key
];

function renderIconHosts({ hosts }) {
  return (
    <>
      <h2 className="text-lg font-semibold px-8 mt-8 container mx-auto">
        Devices
      </h2>
      <div className="container px-8 mx-auto mt-4 flex">
        {hosts.map((host) => {
          return (
            <div
              key={host.ip}
              className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 rounded-md shadow-md mx-2 my-2"
            >
              {host.vendor === "Amazon" && (
                <img src={echoDot.src} className="w-16" />
              )}
              {host.vendor === "Google," && (
                <img src={nestHub.src} className="w-16" />
              )}
              {host.vendor === "Tp-Link" && (
                <img src={tplinkEap.src} className="w-16" />
              )}
              {host.vendor === "TP-Link" && (
                <img src={tplinkEr605.src} className="w-16" />
              )}
              <div className="text-sm text-gray-700">{host.ip}</div>
              <div className="text-sm text-gray-700">
                {host.vendor} {host.deviceType}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function renderTableHosts({ hosts }) {
  const [sortKey, setSortKey] = useState("vendor");

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

                return (
                  <tr key={host.ip}>
                    <td className="pr-3 flex items-center">
                      <div className="mr-2 w-6">
                        {VendorIcon && <VendorIcon style={{ height: 24 }} />}
                      </div>
                      {vendor}
                    </td>
                    {fields.map((field) => (
                      //  ${field === 'spread' ? 'bg-green-' + p.spread * 100 * 1000 : ''}
                      <td
                        key={field}
                        className={`pr-3 ${
                          field === "mac" && " text-sm text-gray-700"
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
                      {host.ports?.map((port) => {
                        if (port === "22")
                          return (
                            <span className="mr-1 px-1 py-0.5 rounded-sm text-xs text-white bg-gray-600 font-bold hover:bg-gray-900 cursor-pointer">
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

                        return (
                          <a
                            key={port}
                            href={`http${
                              ["8443"].includes(port) ? "s" : ""
                            }://${host.ip}:${port}`}
                            className="mr-1 border px-1 py-0.5 rounded-sm text-xs border-gray-300 hover:border-gray-400 hover:text-gray-600"
                            target="_blank"
                          >
                            {port}
                          </a>
                        );
                      })}
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
      {renderIconHosts({ hosts: iconHosts })}
      {renderTableHosts({ hosts: tableHosts })}
    </>
  );
}
