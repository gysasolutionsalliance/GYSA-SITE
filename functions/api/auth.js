export async function onRequest({ request, env }) {
  const o = new URL(request.url).origin, state = crypto.randomUUID();
  const q = new URLSearchParams({ client_id: env.GITHUB_CLIENT_ID, redirect_uri: o + "/api/callback", scope: "repo,user", state });
  return new Response(null, { status: 302, headers: { Location: "https://github.com/login/oauth/authorize?" + q, "Set-Cookie": "oauth_state=" + state + "; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=600" } });
}
