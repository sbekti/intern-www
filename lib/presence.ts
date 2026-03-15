export function sourceTypeLabel(value: string) {
  switch (value) {
    case "radius":
      return "RADIUS"
    case "unifi":
      return "UniFi"
    case "juniper-snmp":
      return "Juniper SNMP"
    case "juniper-ssh":
      return "Juniper SSH"
    default:
      return value
  }
}

export function mediumLabel(value: string) {
  switch (value) {
    case "wireless":
      return "Wi-Fi"
    case "wired":
      return "Wired"
    default:
      return value
  }
}

export function statusLabel(value: string) {
  switch (value) {
    case "online":
      return "Online now"
    case "offline":
      return "Offline"
    default:
      return value
  }
}
