// lib/alertsSocket.ts
export function createAlertsSocket(onAlert: (alert:any) => void) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  // determine ws protocol
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = process.env.NEXT_PUBLIC_WS_HOST || window.location.host;
  const url = `${protocol}://${host}/ws/alerts/`;

  const headers = token ? `?token=${token}` : ''; // alternative to headers (see note)
  const ws = new WebSocket(url + headers);

  ws.onopen = () => console.log('alerts ws open');
  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data);
      if (data.type === 'alert.created') {
        onAlert(data.alert);
      }
    } catch (e) {
      console.error('bad ws msg', e);
    }
  };
  ws.onerror = (err) => console.error('ws error', err);
  ws.onclose = () => console.log('alerts ws closed');

  return ws;
}
