import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const port = Number(process.argv[2]) || 5173;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json' };

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  let file;
  try {
    const rel = decodeURIComponent(pathname);
    file = normalize(join(root, rel === '/' ? 'index.html' : rel));
  } catch {
    return res.writeHead(400).end('bad path');
  }
  if (!file.startsWith(root)) return res.writeHead(403).end('forbidden');
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}/`));
