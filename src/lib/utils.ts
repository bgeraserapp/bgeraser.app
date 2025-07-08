import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const protocol =
  process.env.NODE_ENV === "production" ? "https" : "http";

const getDevDomains = (): string[] => {
  const devDomains = process.env.NEXT_PUBLIC_DEV_DOMAINS;
  if (devDomains) {
    return devDomains.split(",").map(domain => domain.trim());
  }
  return ["localhost:3000", "bgeraser.me"];
};

export const devDomains = getDevDomains();
export const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || devDomains[0];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
