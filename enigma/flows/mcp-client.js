// Minimal stdio MCP client for scripted Craft-app flows (newline-delimited JSON-RPC).
const { spawn } = require('child_process');

class McpClient {
  static async start(command, args = []) {
    const c = new McpClient(command, args);
    await c.rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'enigma-flow', version: '0.1' } });
    c.notify('notifications/initialized');
    return c;
  }

  constructor(command, args) {
    this.proc = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    this.nextId = 0;
    this.pending = new Map();
    this.buf = '';
    this.proc.stderr.on('data', d => { if (process.env.MCP_DEBUG) process.stderr.write(d); });
    this.proc.stdout.on('data', d => this.onData(d));
    this.proc.on('exit', code => {
      for (const { reject } of this.pending.values()) reject(new Error(`MCP server exited (${code})`));
      this.pending.clear();
    });
  }

  // Calls a tool; throws when the tool reports an error.
  async call(name, args = {}) {
    const res = await this.rpc('tools/call', { name, arguments: args });
    if (res.isError) throw new Error(`${name}: ${res.content.map(c => c.text).join(' ')}`);
    return res;
  }

  // Calls a tool and parses its first text block as JSON.
  async json(name, args = {}) {
    const res = await this.call(name, args);
    return JSON.parse(res.content[0].text);
  }

  rpc(method, params) {
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    });
  }

  notify(method, params) {
    this.proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
  }

  close() { this.proc.kill(); }

  onData(chunk) {
    this.buf += chunk;
    let i;
    while ((i = this.buf.indexOf('\n')) >= 0) {
      const line = this.buf.slice(0, i);
      this.buf = this.buf.slice(i + 1);
      let msg;
      try { msg = JSON.parse(line); } catch { continue; }
      const p = this.pending.get(msg.id);
      if (!p) continue;
      this.pending.delete(msg.id);
      msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
    }
  }
}

module.exports = { McpClient };
