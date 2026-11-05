// Minimalist line-art tree that grows with scroll: thin branches draw outward
// and almond-shaped leaves (outline only, filled with the section background)
// unfurl once a branch reaches them. Deterministic: a fixed seed gives the
// same tree on every visit.

const NS = 'http://www.w3.org/2000/svg';
const INK = '#7b431e';
const BG = '#e8d5b8';
const MAX_DEPTH = 3;

interface Branch {
  el: SVGPathElement;
  start: number;
  end: number;
}

interface Leaf {
  el: SVGPathElement;
  x: number;
  y: number;
  rot: number;
  t0: number;
}

export interface GrowingTree {
  /** Draw the tree at growth progress p (0 = bare ground, 1 = full canopy). */
  render: (p: number) => void;
  destroy: () => void;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function make<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>) {
  const el = document.createElementNS(NS, tag);
  for (const key of Object.keys(attrs)) el.setAttribute(key, String(attrs[key]));
  return el;
}

function leafPath(len: number) {
  const w = len * 0.46;
  const f = (n: number) => n.toFixed(1);
  return (
    `M0 0 C ${f(len * 0.22)} ${f(-w)}, ${f(len * 0.68)} ${f(-w * 0.95)}, ${f(len)} 0 ` +
    `C ${f(len * 0.72)} ${f(w * 0.38)}, ${f(len * 0.26)} ${f(w * 0.5)}, 0 0 Z`
  );
}

export function createTree(svg: SVGSVGElement): GrowingTree {
  let seed = 41;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const ground = make('path', {
    d: 'M110 696 Q200 688 290 696',
    fill: 'none',
    stroke: INK,
    'stroke-width': 1.2,
    'stroke-linecap': 'round',
    opacity: 0.35,
  });
  const branchLayer = make('g', {});
  const leafLayer = make('g', {});
  svg.append(ground, branchLayer, leafLayer);

  const branches: Branch[] = [];
  const pending: { x: number; y: number; deg: number; len: number; branch: Branch; jitter: number; op: number }[] = [];

  function addLeaf(x: number, y: number, deg: number, len: number, branch: Branch) {
    pending.push({ x, y, deg, len, branch, jitter: rnd() * 0.07, op: rnd() < 0.15 ? 0.55 : 1 });
  }

  function grow(x: number, y: number, angle: number, len: number, depth: number, start: number, width: number) {
    const ang = clamp(angle, -1.3, 1.3);
    const dur = 0.14 + len / 900;
    const x2 = x + Math.sin(ang) * len;
    const y2 = y - Math.cos(ang) * len;
    const bend = (rnd() - 0.5) * len * 0.28;
    const cx = (x + x2) / 2 + Math.cos(ang) * bend;
    const cy = (y + y2) / 2 + Math.sin(ang) * bend;

    const el = make('path', {
      d: `M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
      pathLength: 1,
      fill: 'none',
      stroke: INK,
      'stroke-linecap': 'round',
      'stroke-width': Math.max(1, width).toFixed(2),
      'stroke-dasharray': 1,
      'stroke-dashoffset': 1,
    });
    branchLayer.appendChild(el);
    const branch: Branch = { el, start, end: start + dur };
    branches.push(branch);

    const at = (t: number): [number, number] => {
      const u = 1 - t;
      return [u * u * x + 2 * u * t * cx + t * t * x2, u * u * y + 2 * u * t * cy + t * t * y2];
    };
    const deg = (ang * 180) / Math.PI - 90;
    const side = () => (rnd() < 0.5 ? -1 : 1);

    if (depth >= 2) {
      const [mx, my] = at(0.55);
      addLeaf(mx, my, deg + side() * (38 + rnd() * 30), 30 + rnd() * 10, branch);
    }

    if (depth === MAX_DEPTH) {
      addLeaf(x2, y2, deg + (rnd() - 0.5) * 30, 36 + rnd() * 12, branch);
      const [qx, qy] = at(0.78);
      addLeaf(qx, qy, deg + side() * (45 + rnd() * 25), 30 + rnd() * 8, branch);
      return;
    }

    const kids = depth === 0 ? 3 : 2;
    for (let k = 0; k < kids; k++) {
      grow(x2, y2, ang + (k / (kids - 1) - 0.5) * 0.9 + (rnd() - 0.5) * 0.2, len * 0.72, depth + 1, branch.end, width * 0.68);
    }
    if (depth <= 1) {
      const [sx, sy] = at(0.5 + rnd() * 0.15);
      grow(sx, sy, ang - 0.8, len * 0.5, depth + 1, start + dur * 0.55, width * 0.58);
      grow(sx, sy, ang + 0.8, len * 0.5, depth + 1, start + dur * 0.7, width * 0.58);
    }
  }

  grow(200, 694, 0, 250, 0, 0, 3.4);

  // Fit the growth into the first 80% of the scroll; leaves bloom afterwards.
  const maxEnd = Math.max(...branches.map((b) => b.end));
  const k = 0.8 / maxEnd;
  for (const b of branches) {
    b.start *= k;
    b.end *= k;
  }
  const leaves: Leaf[] = pending.map((l) => {
    const el = make('path', {
      d: leafPath(l.len),
      fill: BG,
      stroke: INK,
      'stroke-width': 1.3,
      'stroke-linejoin': 'round',
      opacity: l.op,
      transform: `translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) scale(0)`,
    });
    leafLayer.appendChild(el);
    return { el, x: l.x, y: l.y, rot: l.deg, t0: l.branch.end * 0.92 + l.jitter };
  });

  return {
    render(p) {
      for (const b of branches) {
        const g = clamp((p - b.start) / (b.end - b.start), 0, 1);
        b.el.setAttribute('stroke-dashoffset', (1 - g).toFixed(3));
      }
      for (const l of leaves) {
        const s = 1 - Math.pow(1 - clamp((p - l.t0) / 0.1, 0, 1), 3);
        l.el.setAttribute(
          'transform',
          `translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${(l.rot + (1 - s) * 24).toFixed(1)}) scale(${s.toFixed(3)})`,
        );
      }
    },
    destroy() {
      ground.remove();
      branchLayer.remove();
      leafLayer.remove();
    },
  };
}
