import { Link } from 'react-router-dom';
import { navigation } from '../../data/navigation';
import { socialLinks } from '../../data/socialLinks';
import type { Theme } from '../../hooks/useTheme';
import logoDark from '../../assets/logoDark.png';
import logoLight from '../../assets/logoLightIcon.png';
import { SocialIcon } from '../SocialIcon/SocialIcon';
import { withBase } from '../../utils/url';
import './Footer.css';

interface FooterProps {
  theme: Theme;
}

const WHATSAPP_URL =
  'https://wa.me/5511960855620?text=' +
  encodeURIComponent('Olá! Gostaria de saber mais sobre a Igreja Família.');

export function Footer({ theme }: FooterProps) {
  return (
    <footer id="footer" className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="footer__logo">
            <img
              src={theme === 'dark' ? logoDark : logoLight}
              alt="Igreja Família"
              className="footer__logo-mark"
            />
            Igreja Família
          </span>
        </div>

        <nav className="footer__nav" aria-label="Navegação do rodapé">
          {navigation.map((item) => (
            <a key={item.href} href={withBase(item.href)} className="link-underline">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="footer__contact">
          <h3>Fale Conosco</h3>
          <p>Tem alguma dúvida ou quer saber mais? Fale com a gente pelo nosso WhatsApp.</p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary footer__whatsapp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.14-1.35a10 10 0 0 0 4.9 1.25h.01c5.52 0 10-4.48 10-10s-4.49-9.9-10.01-9.9Zm5.87 14.3c-.25.7-1.45 1.33-2 1.42-.51.08-1.15.11-1.86-.12-.43-.14-.98-.32-1.68-.63-2.96-1.28-4.9-4.26-5.04-4.46-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.6.86 2.08.93 2.23.08.15.13.33.02.53-.1.2-.15.32-.3.5-.15.18-.31.4-.44.53-.15.15-.3.32-.13.62.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.48.13.66-.08.18-.2.76-.89.96-1.19.2-.3.4-.25.68-.15.28.1 1.76.83 2.06.98.3.15.5.23.58.35.08.13.08.73-.17 1.43Z" />
            </svg>
            Chamar no WhatsApp
          </a>

          <Link to="/novos-membros" className="footer__members-cta link-underline">
            Formulário de Novos Membros →
          </Link>
        </div>
      </div>

      <div className="container footer__social">
        {socialLinks.map((s) => (
          <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
            <SocialIcon icon={s.icon} />
          </a>
        ))}
      </div>

      <div className="footer__divider" />

      <div className="container footer__bottom">
        <span>© 2021 Igreja Família. Todos os direitos reservados.</span>
        <span>Desenvolvido por Jeferson Rocha</span>
      </div>
    </footer>
  );
}
