let resolveBackendEndpoint =
  "https://duqact-backend-dev.azurewebsites.net/api/v1";

if (window.location.hostname.includes("duqact.com")) {
  resolveBackendEndpoint = "https://backend.duqact.com/api/v1";
}

export const BASE_URL = resolveBackendEndpoint;
