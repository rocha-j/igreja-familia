import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { AnimatedText } from '../components/AnimatedText/AnimatedText';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { Reveal } from '../components/Reveal/Reveal';
import { SectionLabel } from '../components/SectionLabel/SectionLabel';
import { givingChannels } from '../data/giving';
import { useTheme } from '../hooks/useTheme';
import { buildPixPayload } from '../utils/pix';
import './DoacoesPage.css';

const MERCHANT_NAME = 'IGREJA FAMILIA';
const MERCHANT_CITY = 'SAO BERNARDO DO CAMPO';

function CopyPixButton({ pixKey }: { pixKey: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access denied; the key is already shown as selectable text
    }
  }

  return (
    <button type="button" className="giving-channel__copy-btn" onClick={handleCopy}>
      {copied ? 'Copiado!' : 'Copiar chave'}
    </button>
  );
}

export function DoacoesPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <section className="section giving-hero">
          <div className="container">
            <SectionLabel title="DOAÇÕES" />

            <AnimatedText
              as="h1"
              className="giving-hero__title"
              text="CONTRIBUA COM A IGREJA FAMÍLIA"
              goldWords={['FAMÍLIA']}
            />

            <Reveal delay={0.15}>
              <p className="giving-hero__text">
                Escolha abaixo como fazer parte do que Deus está fazendo. Aponte a câmera do seu celular
                para o QR Code ou copie a chave Pix para contribuir.
              </p>
            </Reveal>
          </div>
        </section>

        {givingChannels.map((channel, index) => {
          const pixPayload = buildPixPayload({
            pixKey: channel.pixKey,
            merchantName: MERCHANT_NAME,
            merchantCity: MERCHANT_CITY,
            description: channel.pixDescription,
          });
          const reversed = index % 2 === 1;

          return (
            <section
              key={channel.id}
              id={channel.id}
              className={`section giving-channel ${reversed ? 'section--alt' : ''}`}
            >
              <div className={`container giving-channel__grid ${reversed ? 'is-reversed' : ''}`}>
                <Reveal className="giving-channel__copy">
                  {channel.eyebrow && <span className="giving-channel__eyebrow">{channel.eyebrow}</span>}
                  <h2 className="giving-channel__title">{channel.title}</h2>
                  <p className="giving-channel__text">{channel.description}</p>

                  <div className="giving-channel__pix">
                    <span className="giving-channel__pix-label">Chave Pix</span>
                    <div className="giving-channel__pix-row">
                      <span className="giving-channel__pix-key">{channel.pixKey}</span>
                      <CopyPixButton pixKey={channel.pixKey} />
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.15} className="giving-channel__qr-wrap">
                  <div className="giving-channel__qr-card">
                    <QRCodeSVG value={pixPayload} size={200} fgColor="currentColor" bgColor="transparent" level="M" />
                  </div>
                </Reveal>
              </div>
            </section>
          );
        })}
      </main>

      <Footer theme={theme} />
    </>
  );
}
