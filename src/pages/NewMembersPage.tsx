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
        <section className="section members-hero">
          <div className="container">
            <SectionLabel title="NOVOS MEMBROS" />

            <AnimatedText
              as="h1"
              className="members-hero__title"
              text="FAÇA PARTE DA NOSSA FAMÍLIA"
              accentWords={['FAMÍLIA']}
            />

            <Reveal delay={0.15}>
              <p className="members-hero__text">
                Preencha o formulário de cadastro para se tornar um membro da Igreja Família.
                Leva poucos minutos e é o primeiro passo para caminhar junto com a gente.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <a
                href={FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary members-hero__cta"
              >
                Preencher Formulário
              </a>
            </Reveal>
          </div>
        </section>

        <section className="section section--alt members-qr">
          <OrganicLines variant="top-right" />

          <div className="container members-qr__inner">
            <Reveal>
              <h2 className="members-qr__title">Ou aponte a câmera do seu celular</h2>
              <p className="members-qr__text">
                Escaneie o QR Code abaixo para abrir o formulário diretamente no seu celular.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="members-qr__card">
                <QRCodeSVG value={FORM_URL} size={200} fgColor="currentColor" bgColor="transparent" level="M" />
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <a href={FORM_URL} target="_blank" rel="noopener noreferrer" className="members-qr__link link-underline">
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
