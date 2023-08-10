require('dotenv').config();

export const PLAYWRIGHT_BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000/"
export const PLAYWRIGHT_USERNAME = process.env.PLAYWRIGHT_USERNAME ?? ""
export const PLAYWRIGHT_PASSWORD = process.env.PLAYWRIGHT_PASSWORD ?? ""
export const PLAYWRIGHT_HEADLESS = process.env.PLAYWRIGHT_HEADLESS === "true"
export const PLAYWRIGHT_PREFIX = process.env.PLAYWRIGHT_PREFIX ?? "e2e"
