// Builds a static PIX "Copia e Cola" payload (EMV / BR Code) so the generated
// QR code is a real, scannable donation QR, not just a plain-text link.
// Spec: BR Code (EMV QRCPS-MPM) as defined by Banco Central do Brasil.

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function tlv(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, '0')}${value}`;
}

function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

interface PixPayloadOptions {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  description?: string;
}

export function buildPixPayload({ pixKey, merchantName, merchantCity, description }: PixPayloadOptions): string {
  const name = stripAccents(merchantName).toUpperCase().slice(0, 25);
  const city = stripAccents(merchantCity).toUpperCase().slice(0, 15);

  let payload = '';
  payload += tlv('00', '01'); // payload format indicator
  payload += tlv('01', '11'); // static, reusable QR

  const merchantAccountInfo =
    tlv('00', 'br.gov.bcb.pix') + tlv('01', pixKey) + (description ? tlv('02', description.slice(0, 60)) : '');
  payload += tlv('26', merchantAccountInfo);

  payload += tlv('52', '0000'); // merchant category code, unspecified
  payload += tlv('53', '986'); // BRL
  payload += tlv('58', 'BR');
  payload += tlv('59', name);
  payload += tlv('60', city);
  payload += tlv('62', tlv('05', '***')); // no specific transaction id

  payload += '6304';
  return payload + crc16(payload);
}
