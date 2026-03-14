import "server-only"

const defaultSsoLogoutUrl =
  "https://sso.corp.bekti.com/flows/-/default/invalidation/"
const defaultSsoSettingsUrl = "https://sso.corp.bekti.com/if/user/#/settings"

function readConfigValue(value: string | undefined, fallback: string) {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : fallback
}

export function getFrontendSsoConfig() {
  return {
    logoutUrl: readConfigValue(
      process.env.INTERN_SSO_LOGOUT_URL,
      defaultSsoLogoutUrl
    ),
    settingsUrl: readConfigValue(
      process.env.INTERN_SSO_SETTINGS_URL,
      defaultSsoSettingsUrl
    ),
  }
}
