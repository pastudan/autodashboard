import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChainBroken, faWifi } from "@fortawesome/free-solid-svg-icons";

const fields = ["mac", "vendor", "deviceType"];

function renderHosts({ hosts }) {
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
                <th className="uppercase text-gray-500 text-sm text-left pr-8">
                  IP
                </th>
                {fields.map((field) => (
                  <th
                    key={field}
                    className="uppercase text-gray-500 text-sm text-left pr-8"
                  >
                    {field}
                  </th>
                ))}
                <th className="uppercase text-gray-500 text-sm text-left pr-8">
                  Services
                </th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((host) => {
                return (
                  <tr key={host.ip}>
                    <td className="pr-3">{host.ip}</td>
                    {fields.map((field) => (
                      //  ${field === 'spread' ? 'bg-green-' + p.spread * 100 * 1000 : ''}
                      <td key={field} className={`pr-3`}>
                        {host[field]}
                      </td>
                    ))}
                    <td className="pr-3">
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

  console.log(hosts.find((h) => h.ip === "10.9.6.35"));

  return <>{renderHosts({ hosts })}</>;
}
