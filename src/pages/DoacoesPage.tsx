import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { distance, duration, ease } from '../motion/tokens';
import { AnimatedText } from '../components/AnimatedText/AnimatedText';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { Reveal } from '../components/Reveal/Reveal';
import { SectionLabel } from '../components/SectionLabel/SectionLabel';
import { givingChannels } from '../data/giving';
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
    <button
      type="button"
      className={`giving-channel__copy-btn ${copied ? 'is-copied' : ''}`}
      onClick={handleCopy}
      aria-live="polite"
    >
      {/* Keyed so the label remounts on each state change and animates in; the
          text itself swaps immediately, never waiting on an exit animation. */}
      <motion.span
        key={copied ? 'copied' : 'idle'}
        className="giving-channel__copy-label"
        initial={copied ? { opacity: 0, y: distance.sm / 2 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.fast, ease }}
      >
        {copied && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <motion.path
              d="M2 6.5 5 9.5 10 3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: duration.fast, ease, delay: 0.05 }}
            />
          </svg>
        )}
        {copied ? 'Copiado!' : 'Copiar chave'}
      </motion.span>
    </button>
  );
}

export function DoacoesPage() {
  return (
    <>
      <Header />

      <main>
        <section className="section giving-hero">
          <div className="container">
            <SectionLabel title="DOAÇÕES" />

            <AnimatedText
              as="h1"
              className="giving-hero__title"
              text="CONTRIBUA COM A IGREJA FAMÍLIA"
              accentWords={['FAMÍLIA']}
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

      <Footer />
    </>
  );
}
