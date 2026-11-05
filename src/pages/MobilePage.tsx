import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import heroMobile from '../assets/heroChurchMobile.jpg';
import { pillars } from '../data/pillars';
import { schedule } from '../data/schedule';
import { socialLinks } from '../data/socialLinks';
import { SocialIcon } from '../components/SocialIcon/SocialIcon';
import { DESKTOP_FLAG } from '../utils/mobile';
import { getNextEntry, weekdayOf } from '../utils/nextService';
import './MobilePage.css';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Av.+Wallace+Simonsen%2C+414+-+Nova+Petr%C3%B3polis%2C+S%C3%A3o+Bernardo+do+Campo+-+SP%2C+09771-210';

type ModuleId = 'inicio' | 'somos' | 'programacao' | 'redes' | 'contribua' | 'onde';
type Word = { t: string; em?: boolean };

interface Cta {
  label: string;
  href?: string;
  to?: string;
}

/** One vertical module. `cards` modules hold sub-items in a horizontal carousel; `bleed` modules are full-screen scenes. */
interface Module {
  id: ModuleId;
  kind: 'bleed' | 'cards' | 'text';
  kicker: string;
  title: Word[];
  sub: string;
  /** Only external/useful actions; navigation between modules is by touch only. */
  cta?: Cta;
  items: { key: string; node: ReactNode }[];
  bg?: string;
  map?: boolean;
  extra?: ReactNode;
}

const rv = (i: number): CSSProperties => ({ '--i': i }) as CSSProperties;

function useNextService() {
  return useMemo(() => {
    let best: { programIndex: number; entryIndex: number; wait: number } | null = null;
    schedule.forEach((program, programIndex) => {
      const n = getNextEntry(program.schedule);
      if (n && (!best || n.wait < best.wait)) best = { programIndex, entryIndex: n.index, wait: n.wait };
    });
    if (!best) return null;
    const found = best as { programIndex: number; entryIndex: number; wait: number };
    const entry = schedule[found.programIndex].schedule[found.entryIndex];
    const days = Math.floor(found.wait / 1440);
    return { ...found, label: `${entry.day.split('-')[0]} ${entry.time}`, when: days === 0 ? 'hoje' : days === 1 ? 'amanhã' : `em ${days} dias` };
  }, []);
}

const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.2527373491116!2d-46.54520709999999!3d-23.702666999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce422f55f16241%3A0x2d891678b09eee7a!2sAv.%20Wallace%20Simonsen%2C%20414%20-%20Nova%20Petr%C3%B3polis%2C%20S%C3%A3o%20Bernardo%20do%20Campo%20-%20SP%2C%2009771-210!5e0!3m2!1sen!2sbr!4v1788382267430!5m2!1sen!2sbr';

const DAY_LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

/** Today's date in the church's time zone. */
function todayInChurch() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' }).formatToParts(new Date());
  const get = (t: string) => parts.find((x) => x.type === t)?.value ?? '';
  return { y: +get('year'), m: +get('month') - 1, d: +get('day'), wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')) };
}

/** The week (Sun–Sat) of today, with the services of one program on their days. */
function WeekCalendar({ entries, nextEntry }: { entries: { day: string; time?: string }[]; nextEntry: number | null }) {
  const t = todayInChurch();
  const base = new Date(Date.UTC(t.y, t.m, t.d - t.wd));
  return (
    <div className="cal cal--week" aria-label="Semana atual">
      {Array.from({ length: 7 }, (_, i) => {
        const date = new Date(base.getTime() + i * 86400000).getUTCDate();
        const hits = entries.map((e, ei) => ({ e, ei })).filter(({ e }) => weekdayOf(e.day) === i);
        const isNext = hits.some(({ ei }) => ei === nextEntry);
        return (
          <div key={i} className={`cal__day${hits.length ? ' has' : ''}${i === t.wd ? ' today' : ''}${isNext ? ' next' : ''}`} style={{ '--k': i } as CSSProperties}>
            <span className="cal__dow">{DAY_LETTERS[i]}</span>
            <span className="cal__num">{date}</span>
            <span className="cal__times">{hits.map(({ e }, k) => <em key={k}>{e.time}</em>)}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Month grid highlighting the 4th Saturday (the next one still to come). */
function FourthSaturday() {
  const t = todayInChurch();
  const fourth = (y: number, m: number) => 1 + ((6 - new Date(Date.UTC(y, m, 1)).getUTCDay() + 7) % 7) + 21;
  let y = t.y;
  let m = t.m;
  if (t.d > fourth(y, m)) { m += 1; if (m > 11) { m = 0; y += 1; } }
  const hit = fourth(y, m);
  const lead = new Date(Date.UTC(y, m, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const name = new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m, 1)));
  return (
    <div className="cal cal--month" aria-label={`Quarto sábado de ${name}: dia ${hit}`}>
      <div className="cal__head"><b>{name}</b><span>Quarto sábado · dia {hit}</span></div>
      <div className="cal__grid">
        {DAY_LETTERS.map((l, i) => <span key={`h${i}`} className="cal__h">{l}</span>)}
        {Array.from({ length: lead }, (_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const d = i + 1;
          return <span key={d} className={`cal__d${d === hit ? ' hit' : ''}${y === t.y && m === t.m && d === t.d ? ' today' : ''}`}>{d}</span>;
        })}
      </div>
    </div>
  );
}

function Words({ words }: { words: Word[] }) {
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w">
            <span className={w.em ? 'em' : undefined} style={{ '--k': i } as CSSProperties}>{w.t}</span>
          </span>{' '}
        </Fragment>
      ))}
    </>
  );
}

const w = (text: string, emFrom = -1): Word[] =>
  text.split(' ').map((t, i) => ({ t, em: emFrom >= 0 && i >= emFrom }));

export function MobilePage() {
  const next = useNextService();
  const pagesRef = useRef<HTMLDivElement>(null);
  const secRefs = useRef<(HTMLElement | null)[]>([]);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const [sub, setSub] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [mapLive, setMapLive] = useState(false);

  const modules: Module[] = useMemo(() => {
    const prog: Module['items'] = schedule.map((p, pi) => {
      const nextEntry = next && next.programIndex === pi ? next.entryIndex : null;
      const monthly = p.schedule.every((e) => weekdayOf(e.day) === undefined);
      return {
        key: p.id,
        node: (
          <div className="in prog">
            <div className="prog__head">
              <div className="ic" style={{ backgroundImage: `url(${p.icon})` }} />
              <div>
                <span className="eyebrow">Programação</span>
                <h3>{p.title}</h3>
              </div>
            </div>
            {monthly ? <FourthSaturday /> : <WeekCalendar entries={p.schedule} nextEntry={nextEntry} />}
            <ul className="times">
              {p.schedule.map((e, ei) => (
                <li key={ei} className={ei === nextEntry ? 'next' : ''}>
                  <span>{e.day}</span>
                  {e.time && <b>{e.time}</b>}
                </li>
              ))}
            </ul>
          </div>
        ),
      };
    });
    return [
      {
        id: 'inicio', kind: 'bleed', bg: heroMobile, kicker: 'Bem-vindo',
        title: w('Um lugar pra chamar de lar', 5),
        sub: 'Nossas portas estão sempre abertas. Domingos às 10h e 18h30 · Quartas às 19h30.',
        items: [],
      },
      {
        id: 'somos', kind: 'cards', kicker: 'Quem somos',
        title: w('Amar, servir, restaurar', 2),
        sub: 'Três pilares que sustentam a nossa família.',
        items: pillars.map((p, i) => ({
          key: p.id,
          node: (
            <div className={`in pillar c${i + 1}`}>
              <div className="giant" aria-hidden="true">{p.word}</div>
              <span className="num">0{i + 1} / 03 · {p.subtitle}</span>
              <h3>{p.word}</h3>
              <p>{p.text}</p>
            </div>
          ),
        })),
      },
      {
        id: 'programacao', kind: 'cards', kicker: 'Programação',
        title: next ? [{ t: 'Próximo:' }, ...next.label.split(' ').map((t) => ({ t, em: true }))] : w('Venha nos visitar', 2),
        sub: next ? `Começa ${next.when}. Deslize para ver cada encontro.` : 'Deslize para ver cada encontro.',
        items: prog,
      },
      {
        id: 'redes', kind: 'cards', kicker: 'Nossas redes',
        title: w('Fique por perto', 2),
        sub: 'Toque em uma rede para abrir.',
        items: [
          {
            key: 'redes',
            node: (
              <div className="in social">
                <span className="eyebrow">Siga a Igreja Família</span>
                <ul className="nets">
                  {socialLinks.map((l, i) => (
                    <li key={l.id} style={{ '--k': i } as CSSProperties}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className={`net net--${l.id}`}>
                        <span className="net__icon"><SocialIcon icon={l.icon} /></span>
                        <span className="net__text"><b>{l.label}</b><small>{l.tagline}</small></span>
                        <span className="net__go" aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          },
        ],
      },
      {
        id: 'contribua', kind: 'text', kicker: 'Contribua',
        title: w('Semeie com alegria', 2),
        sub: '',
        cta: { label: 'Doar', to: '/doacoes' },
        items: [],
        extra: (
          <figure className="verse">
            <span className="verse__mark" aria-hidden="true">“</span>
            <blockquote className="rv" style={rv(3)}>
              Cada um contribua segundo propôs no seu coração: não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria.
            </blockquote>
            <figcaption className="rv" style={rv(5)}>2 Coríntios 9:7</figcaption>
          </figure>
        ),
      },
      {
        id: 'onde', kind: 'bleed', map: true, kicker: 'Como chegar',
        title: w('Av. Wallace Simonsen, 414'),
        sub: 'Nova Petrópolis · São Bernardo do Campo – SP',
        cta: { label: 'Abrir no Google Maps', href: MAPS_URL }, items: [],
      },
    ];
  }, [next]);

  const count = modules.length;
  const goModule = useCallback((i: number) => {
    const el = pagesRef.current;
    if (!el) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ top: Math.max(0, Math.min(count - 1, i)) * el.clientHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [count]);

  const goSub = useCallback((m: number, i: number) => {
    const tr = trackRefs.current[m];
    const first = tr?.children[0] as HTMLElement | undefined;
    const second = tr?.children[1] as HTMLElement | undefined;
    if (!tr || !first || !second) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    tr.scrollTo({ left: i * (second.offsetLeft - first.offsetLeft), behavior: reduce ? 'auto' : 'smooth' });
  }, []);

  // Vertical scroll between modules: write --vp (entering 0..1) and --cov (covered 0..1)
  // straight to the DOM so scrolling never re-renders React.
  useEffect(() => {
    const pages = pagesRef.current;
    if (!pages) return;
    // With native scroll-driven animations the compositor does the reveals (see the
    // @supports block in MobilePage.css); the per-frame JS write is only the fallback.
    const native = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');
    const skipVars = native || matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = -1;
    const frame = () => {
      raf = 0;
      const H = pages.clientHeight || 1;
      const st = pages.scrollTop;
      if (!skipVars) {
        secRefs.current.forEach((el, i) => {
          if (!el || Math.abs(i * H - st) > 2 * H) return;
          const v = (i * H - st) / H;
          el.style.setProperty('--vp', Math.max(0, Math.min(1, v)).toFixed(3));
          el.style.setProperty('--cov', Math.max(0, Math.min(1, -v)).toFixed(3));
        });
      }
      const idx = Math.max(0, Math.min(count - 1, Math.round(st / H)));
      if (idx !== last) {
        last = idx;
        setActive(idx);
        setMapLive(false); // leaving a module returns the map to swipe mode
        setSeen((prev) => (prev.has(idx) ? prev : new Set(prev).add(idx)));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    frame();
    pages.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      pages.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count]);

  // Horizontal scroll inside a module: only tracks the sub index (card content stays still).
  const onTrackScroll = useCallback((m: number) => {
    const tr = trackRefs.current[m];
    if (!tr || tr.children.length < 2) return;
    const a = tr.children[0] as HTMLElement;
    const b = tr.children[1] as HTMLElement;
    const stride = b.offsetLeft - a.offsetLeft || 1;
    const idx = Math.max(0, Math.min(tr.children.length - 1, Math.round(tr.scrollLeft / stride)));
    setSub((prev) => (prev[m] === idx ? prev : prev.map((v, i) => (i === m ? idx : v))));
  }, []);

  useEffect(() => {
    modules.forEach((mod, i) => { if (mod.kind === 'cards') onTrackScroll(i); });
  }, [modules, onTrackScroll]);

  // Ambient embers, pushed by the scroll speed.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = canvasRef.current;
    const pages = pagesRef.current;
    const g = cv?.getContext('2d');
    if (!cv || !pages || !g) return;
    let frameN = 0, W = 0, H = 0, raf = 0, v = 0, last = pages.scrollTop, visible = !document.hidden;
    let dots: { x: number; y: number; r: number; z: number; t: number }[] = [];
    const size = () => {
      const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 1.5);
      W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; g.setTransform(d, 0, 0, d, 0, 0);
      dots = Array.from({ length: 16 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 2, z: 0.3 + Math.random() * 0.9, t: Math.random() * 6.28 }));
    };
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible || (frameN = (frameN + 1) % 2)) return; // ~30fps keeps the main thread free for the gesture
      const dv = Math.max(-60, Math.min(60, pages.scrollTop - last));
      last = pages.scrollTop;
      v = v * 0.88 + dv * 0.12;
      g.clearRect(0, 0, W, H);
      for (const d of dots) {
        d.y -= v * d.z * 1.2 + 0.18 * d.z; d.x += Math.sin(d.t) * 0.2; d.t += 0.02;
        if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
        if (d.y > H + 10) { d.y = -10; d.x = Math.random() * W; }
        const a = (0.22 + 0.3 * Math.sin(d.t)) * d.z;
        g.beginPath(); g.fillStyle = `rgba(240,179,92,${Math.max(0.05, a).toFixed(2)})`; g.arc(d.x, d.y, d.r * d.z, 0, 6.283); g.fill();
        if (Math.abs(v) > 3) {
          g.strokeStyle = `rgba(240,179,92,${Math.min(0.25, Math.abs(v) / 80).toFixed(2)})`; g.lineWidth = d.r * d.z * 0.8;
          g.beginPath(); g.moveTo(d.x, d.y); g.lineTo(d.x, d.y + v * d.z * 3); g.stroke();
        }
      }
    };
    const onVis = () => { visible = !document.hidden; };
    size();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', size);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prev; };
  }, []);

  // Escape leaves the live map and returns to swipe mode.
  useEffect(() => {
    if (!mapLive) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMapLive(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mapLive]);

  const mod = modules[active];
  const subIdx = sub[active];
  const cta = mod.cta;

  return (
    <div className="mx-root">
      <div className="mx">
        <div className="bar">
          <div className="brand"><i />Igreja Família</div>
          <div className="counter"><b>{String(active + 1).padStart(2, '0')}</b> / {String(count).padStart(2, '0')}</div>
        </div>

        <div className="rail" aria-hidden="true">
          {modules.map((m, i) => (
            <span key={m.id} className={i === active ? 'on' : ''} />
          ))}
        </div>

        <div
          ref={pagesRef}
          className="pages"
          tabIndex={0}
          aria-label="Módulos da Igreja Família. Deslize para cima e para baixo."
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); goModule(active + 1); }
            if (e.key === 'ArrowUp') { e.preventDefault(); goModule(active - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goSub(active, subIdx + 1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); goSub(active, subIdx - 1); }
          }}
        >
          {modules.map((m, i) => (
            <div key={m.id} className="slot" style={{ zIndex: i + 1 }}>
            <section
              ref={(el) => { secRefs.current[i] = el; }}
              className={`sec sec--${m.kind} sec--${m.id}${m.map && mapLive ? ' live' : ''}${seen.has(i) ? ' seen' : ''}${i === active ? ' is-active' : ''}`}
            >
              {m.bg && (
                <div className="scene" aria-hidden="true">
                  <div className="photo" style={{ backgroundImage: `url(${m.bg})` }} />
                </div>
              )}
              {m.map && (
                <div className="scene scene--map">
                  <div className="photo mapwrap">
                    <iframe
                      className="map"
                      title="Mapa da Igreja Família — Av. Wallace Simonsen, 414, Nova Petrópolis, São Bernardo do Campo - SP"
                      src={MAP_SRC}
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      tabIndex={mapLive ? 0 : -1}
                      inert={!mapLive}
                    />
                  </div>
                  <span className="radar" aria-hidden="true"><i /><i /><i /></span>
                </div>
              )}
              <header className={`info${m.map && mapLive ? ' info--hidden' : ''}`}>
                <p className="info__kicker rv" style={rv(0)}>{m.kicker}</p>
                <h1 className="info__title"><Words words={m.title} /></h1>
                {m.sub && <p className="info__sub rv" style={rv(4)}>{m.sub}</p>}
              </header>

              {m.kind === 'cards' && (
                <div className="track" ref={(el) => { trackRefs.current[i] = el; }} onScroll={() => onTrackScroll(i)}>
                  {m.items.map((it, k) => (
                    <article key={it.key} className={`card card--${m.id}`} style={{ '--k': k } as CSSProperties}>{it.node}</article>
                  ))}
                </div>
              )}
              {m.kind === 'text' && m.extra}

              {m.id === 'inicio' && (
                <div className="hint rv" style={rv(6)}>Deslize para cima <i /></div>
              )}
              {m.id === 'onde' && (
                <div className="foot rv" style={rv(6)}>
                  <button type="button" className={`maplive${mapLive ? ' on' : ''}`} aria-pressed={mapLive} onClick={() => setMapLive((v) => !v)}>
                    {mapLive ? 'Voltar a deslizar' : 'Explorar o mapa'}
                  </button>
                  <Link className="full" to="/" onClick={() => { try { sessionStorage.setItem(DESKTOP_FLAG, '1'); } catch { /* blocked */ } }}>
                    Ver site completo →
                  </Link>
                </div>
              )}
            </section>
            </div>
          ))}
        </div>

        <footer className="dock">
          {cta?.to ? (
            <Link key={mod.id} className="cta cta--accent" to={cta.to}>
              <span className="cta__label">{cta.label}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          ) : cta?.href ? (
            <a key={`${mod.id}-${cta.label}`} className="cta" href={cta.href} target="_blank" rel="noopener noreferrer">
              <span className="cta__label">{cta.label}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          ) : null}
          <div className="nav">
            <div className="subnav" aria-hidden="true">
              {mod.items.length > 1 ? (
                <>
                  {mod.items.map((it, k) => (
                    <span key={it.key} className={`dot${k === subIdx ? ' on' : ''}`} />
                  ))}
                  <span className="subcount">{subIdx + 1}/{mod.items.length}</span>
                </>
              ) : (
                <span className="subcount" />
              )}
            </div>
          </div>
        </footer>

        <canvas ref={canvasRef} className="fx" aria-hidden="true" />
      </div>
    </div>
  );
}
