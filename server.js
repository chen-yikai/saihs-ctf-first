const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const TARGET = 1000000000;
const FLAG = "FLAG{y0u_4re_G4Y_1_kn0w}"
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function send(res, code, headers, body) {
  res.writeHead(code, headers);
  res.end(body);
}

function sendJSON(res, code, obj) {
  send(
    res,
    code,
    { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() },
    JSON.stringify(obj)
  );
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
  });
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return send(res, 204, corsHeaders(), "");
  }

  // 首頁 / 或 /index.html
  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    const htmlPath = path.join(__dirname, "index.html");
    if (!fs.existsSync(htmlPath)) {
      return send(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "index.html not found");
    }
    const html = fs.readFileSync(htmlPath, "utf8");
    return send(res, 200, { "Content-Type": "text/html; charset=utf-8", ...corsHeaders() }, html);
  }

  // API：領旗（故意有洞：相信前端分數）
  if (req.method === "POST" && req.url === "/api/claim") {
    const raw = await readBody(req);

    let body;
    try {
      body = JSON.parse(raw || "{}");
    } catch {
      return sendJSON(res, 400, { ok: false, error: "bad json" });
    }

    const score = Number(body.score);
    const timeLeft = Number(body.timeLeft);

    if (!Number.isFinite(score) || !Number.isFinite(timeLeft)) {
      return sendJSON(res, 400, { ok: false, error: "bad input" });
    }

    if (score >= TARGET && timeLeft >= 0) {
      return sendJSON(res, 200, { ok: true, flag: FLAG });
    }

    return sendJSON(res, 200, { ok: false, error: "not enough" });
  }

  // 其他
  send(res, 404, { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() }, "404 Not Found");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`✅ Server running: http://127.0.0.1:${PORT}`);
  console.log(`✅ API endpoint:  http://127.0.0.1:${PORT}/api/claim`);
});
