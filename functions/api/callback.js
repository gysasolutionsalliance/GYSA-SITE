export async function onRequest({ request, env }) {
  const u = new URL(request.url), code = u.searchParams.get("code"), st = u.searchParams.get("state");
  const ck = (request.headers.get("Cookie") || "").match(/oauth_state=([^;]+)/);
  let msg;
  if (!code || !ck || ck[1] !== st) { msg = "authorization:github:error:" + JSON.stringify({ message: "invalid state" }); }
  else {
    const r = await fetch("https://github.com/login/oauth/access_token", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }) });
    const d = await r.json();
    msg = d.access_token ? "authorization:github:success:" + JSON.stringify({ token: d.access_token, provider: "github" }) : "authorization:github:error:" + JSON.stringify(d);
  }
  const html = "<script>(function(){var m=" + JSON.stringify(msg) + ";function r(e){window.opener.postMessage(m,e.origin);window.removeEventListener('message',r)}window.addEventListener('message',r);window.opener.postMessage('authorizing:github','*')})()</script>";
  return new Response(html, { headers: { "Content-Type": "text/html;charset=utf-8" } });
}
