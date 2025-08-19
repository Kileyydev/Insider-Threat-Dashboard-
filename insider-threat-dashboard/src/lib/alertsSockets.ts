// lib/alertsSocket.ts
export function createAlertsSocket(token: string | null, onAlert: (a:any)=>void) {
  const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = process.env.NEXT_PUBLIC_WS_HOST || (typeof window !== 'undefined' ? window.location.host : '');
  const url = `${protocol}://${host}/ws/alerts/${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  const ws = new WebSocket(url);

  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data);
      if (data.type === 'alert.created') onAlert(data.alert);
      if (data.type === 'alert.updated') onAlert(data.alert);
    } catch {}
  };

  return ws;
}
