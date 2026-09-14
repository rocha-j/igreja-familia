import { QRCodeSVG } from 'qrcode.react';
import { AnimatedText } from '../components/AnimatedText/AnimatedText';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { OrganicLines } from '../components/OrganicLines/OrganicLines';
import { Reveal } from '../components/Reveal/Reveal';
import { SectionLabel } from '../components/SectionLabel/SectionLabel';
import './NewMembersPage.css';

const FORM_URL = 'https://www.enuv.es/DtCCavA';

export function NewMembersPage() {
  return (
    <>
      <Header />

      <main>
        <section className="section members">
          <OrganicLines variant="top-right" />

          <div className="container members__grid">
            <div className="members__copy">
              <SectionLabel title="NOVOS MEMBROS" />

              <AnimatedText
                as="h1"
                className="members__title"
                text="FAÇA PARTE DA NOSSA FAMÍLIA"
                accentWords={['FAMÍLIA']}
              />

              <Reveal delay={0.15}>
                <p className="members__text">
                  Preencha o formulário de cadastro para se tornar um membro da Igreja Família. Leva
                  poucos minutos e é o primeiro passo para caminhar junto com a gente.
                </p>
              </Reveal>

              <Reveal delay={0.25}>
                <a
                  href={FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary members__cta"
                >
                  Preencher Formulário
                </a>
              </Reveal>
            </div>

            <Reveal delay={0.2} className="members__qr-wrap">
              <div className="members__qr-card">
                <QRCodeSVG value={FORM_URL} size={168} fgColor="currentColor" bgColor="transparent" level="M" />
              </div>
              <span className="members__qr-caption">Ou aponte a câmera do seu celular</span>
              <a href={FORM_URL} target="_blank" rel="noopener noreferrer" className="members__qr-link link-underline">
                {FORM_URL.replace('https://', '')}
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
