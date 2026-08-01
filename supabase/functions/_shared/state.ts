// HMAC-signed, stateless CSRF token for the OAuth `state` param.
// No server-side store needed: the signature + embedded expiry are enough
// to prove the callback matches a login request we issued.

const encoder = new TextEncoder();

async function importKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(s.length + ((4 - (s.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export async function createState(secret: string, ttlSeconds = 600): Promise<string> {
  const payload = JSON.stringify({ nonce: crypto.randomUUID(), exp: Date.now() + ttlSeconds * 1000 });
  const payloadB64 = toBase64Url(encoder.encode(payload));
  const key = await importKey(secret);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64)));
  return `${payloadB64}.${toBase64Url(sig)}`;
}

export async function verifyState(secret: string, state: string | null): Promise<boolean> {
  if (!secret || !state || !state.includes(".")) return false;
  const [payloadB64, sigB64] = state.split(".");
  try {
    const key = await importKey(secret);
    const valid = await crypto.subtle.verify("HMAC", key, fromBase64Url(sigB64), encoder.encode(payloadB64));
    if (!valid) return false;
    const { exp } = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64)));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}
