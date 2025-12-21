
// import { PythonShell } from "python-shell";

export async function POST(req) {
  return new Response(JSON.stringify({
    error: "Python execution is not available in this environment. Vercel only supports Node.js."
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}