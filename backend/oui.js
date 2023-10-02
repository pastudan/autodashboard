import { readFile, writeFile } from "fs/promises";

function removeEndings(vendor) {
  vendor = vendor
    .replace(/ ag\.?$/i, "")
    .replace(/ sl\.?$/i, "")
    .replace(/ bv\.?$/i, "")
    .replace(/ company$/i, "")
    .replace(/ group$/i, "")
    .replace(/ limited$/i, "")
    .replace(/ technology$/i, "")
    .replace(/ technologies$/i, "")
    .replace(/ systems$/i, "")
    .replace(/ telecommunications$/i, "")
    .replace(/ telecommunication$/i, "")
    .replace(/(?<!extreme) networks?$/i, "")
    .replace(/ communications$/i, "")
    .replace(/ communication$/i, "")
    .replace(/ enterprises?$/i, "")
    .replace(/ Electronics$/i, "")
    .replace(/ Manufacturing$/i, "")
    .replace(/ devices?$/i, "")
    .replace(/ digital$/i, "")
    .replace(/ software$/i, "")
    .replace(/(?<!china) mobile$/i, "")
    .replace(/ mobility$/i, "")
    .replace(/ wireless$/i, "")
    .replace(/ computer$/i, "")
    .replace(/ telecom$/i, "")
    .replace(/ trading$/i, "")
    .replace(/ controls$/i, "")
    .replace(/ laboratories$/i, "")
    .replace(/ labs$/i, "")
    .replace(/ headquarters$/i, "")
    .replace(/ hq$/i, "")
    .replace(/ international$/i, "")
    // company types
    .replace(/ co\.?$/i, "")
    .replace(/ corp\.?$/i, "")
    .replace(/ corporate$/i, "")
    .replace(/ corporation/i, "")
    .replace(/ \.?inc\.?$/i, "")
    .replace(/ sdn$/i, "")
    .replace(/ bhd\.?$/i, "")
    .replace(/ pte\.?$/i, "")
    .replace(/ ltd\.?$/i, "")
    .replace(/ ltd$/i, "")
    .replace(/ ind$/i, "")
    .replace(/ llc$/i, "")
    .replace(/ sas$/i, "")
    .replace(/ gmbh$/i, "")
    .replace(/ srl$/i, "")
    // countries
    .replace(/ uk$/i, "")
    .replace(/ usa$/i, "")
    .replace(/ malaysia$/i, "")
    .replace(/ thailand$/i, "")
    .replace(/ singapore$/i, "")
    .replace(/ +/g, " ")
    .replace(/[^a-z0-9- ]/gi, "");
  return vendor;
}

const ouiFile = await readFile("backend/oui.txt", "utf8");
const oui = ouiFile
  .split("\n")
  .map((line) => {
    if (line.startsWith("#")) return null;
    let [prefix, vendorShort, vendor] = line.split("\t");
    vendor = vendor || vendorShort || "Unknown";
    vendor = vendor.split(",")[0];
    vendor = removeEndings(vendor);
    vendor = removeEndings(vendor);
    vendor = removeEndings(vendor);
    vendor = removeEndings(vendor);

    vendor = vendor
      .replace("Hangzhou Hikvision", "Hikvision")
      .replace("Guangdong Oppo", "Oppo")
      .replace("zte", "ZTE")
      .replace("Hewlett Packard", "HP")
      .replace("TexasInstruments", "Texas Instruments")
      .replace("Tp-Link", "TP-Link")
      .replace("Beijing Xiaomi", "Xiaomi")
      .replace("XiaomiCo", "Xiaomi")
      .replace("Sagemcom Broadband", "Sagemcom")
      .replace("Motorola Mobility", "Motorola")
      .replace("Samsung Electro-MechanicsThailand", "Samsung")
      .replace("Sony Interactive Entertainment", "Sony")
      .replace("LG Electronics Mobile Communications", "LG")
      .replace("ASUSTek", "ASUS")
      .replace("Cisco SPVTG", "Cisco")
      .replace(/Hon Hai Precision.*/, "Hon Hai")
      .replace(/Nokia Solutions.*/, "Nokia")
      .replace(/Nokia Danmark.*/, "Nokia")
      .replace("MB connect line GmbH Fernwartungssysteme", "MB connect line");

    return {
      prefix: prefix.trim(),
      vendorShort: vendorShort?.trim(),
      vendor: vendor.trim(),
    };
  })
  .filter(Boolean);

// which vendors appear the most
await writeFile("src/oui/oui.json", JSON.stringify(oui, null, 2));
const vendors = oui.map((entry) => entry.vendor);

const vendorCounts = vendors.reduce((counts, vendor) => {
  counts[vendor] = (counts[vendor] || 0) + 1;
  return counts;
}, {});
const sortedVendorCounts = Object.entries(vendorCounts).sort(
  ([, countA], [, countB]) => countB - countA
);
console.log(sortedVendorCounts);
