"use client";

import { Inter } from "next/font/google";
import { faComputer, faUmbrellaBeach } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Hosts from "@/components/Hosts";

const inter = Inter({ subsets: ["latin"] });
const onOff = (on) => (on ? "" : "text-red-500");

export default function Home() {
  const [activeTab, setActiveTab] = useState("Hosts");
  const [connected, setConnected] = useState(null);
  const [hosts, setHosts] = useState([]);

  useEffect(() => connectWebsocket(), []);

  function connectWebsocket() {
    console.log("connecting to websocket backend...");
    window.AUTODASHBOARD_WS = new WebSocket(
      `ws://${window.location.hostname}:8181`
    );
    window.AUTODASHBOARD_WS.onopen = () => {
      setConnected(true);
      console.log("connected to autodashboard backend");
    };
    window.AUTODASHBOARD_WS.onmessage = (e) => {
      const { type, payload } = JSON.parse(e.data);
      if (type === "hosts") {
        setHosts(payload);
      } else if (type === "host") {
        setHosts((hosts) => {
          const index = hosts.findIndex((o) => o.id === payload.id);
          const newHosts = [...hosts];
          if (index === -1) {
            newHosts.push(payload);
          } else {
            newHosts[index] = payload;
          }
          return newHosts;
        });
      } else if (type === "error") {
        alert(payload);
      }
    };
    window.AUTODASHBOARD_WS.onclose = () => {
      setConnected(false);
      // automatically try to reconnect on connection loss
      setTimeout(() => {
        connectWebsocket();
      }, 1000);
    };
  }

  const renderTab = (Icon, name) => {
    return (
      <a key={name} className="whitespace-nowrap py-2 group relative">
        <div
          className={
            "mr-2 inline-flex items-center px-3 py-2 rounded-md group-hover:bg-gray-200 " +
            (activeTab === name &&
              "text-blue-600 after:visible after:bg-blue-600 after:absolute after:bottom-0 after:right-3 after:left-3 after:h-0.5 after:bg-text-primary")
          }
          onClick={() => setActiveTab(name)}
        >
          <FontAwesomeIcon icon={Icon} className={`pr-2 ${onOff(connected)}`} />
          {name}
        </div>
      </a>
    );
  };

  return (
    <main className={`${inter.className} mb-40`}>
      <header>
        <div className="px-8 pt-4 container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              <FontAwesomeIcon icon={faUmbrellaBeach} className="pr-2" />
              Auto Dashboard
            </h2>
            <div className="font-semibold text-xl">😎</div>
          </div>

          <nav className="-ml-3 flex font-medium text-gray-600 cursor-pointer relative overflow-auto navigation">
            {renderTab(faComputer, "Hosts")}
          </nav>
        </div>
      </header>
      {activeTab === "Hosts" && <Hosts {...{ hosts, connected }} />}
    </main>
  );
}
