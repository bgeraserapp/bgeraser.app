import { NextRequest } from "next/server";
import { rootDomain, devDomains } from "./utils";

export function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // Development environment check
  const isDevelopment = devDomains.some(domain => 
    url.includes(domain) || hostname.includes(domain.split(":")[0])
  );

  if (isDevelopment) {
    // Check for each development domain
    for (const domain of devDomains) {
      const domainHost = domain.split(":")[0];
      
      // Try to extract subdomain from the full URL
      const fullUrlMatch = url.match(new RegExp(`http:\\/\\/([^.]+)\\.${domainHost.replace(".", "\\.")}`));
      if (fullUrlMatch && fullUrlMatch[1]) {
        return fullUrlMatch[1];
      }

      // Fallback to host header approach
      if (hostname.includes(`.${domainHost}`)) {
        return hostname.split(".")[0];
      }
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(":")[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}
