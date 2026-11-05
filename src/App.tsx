import { motion } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { duration, ease } from './motion/tokens';
import { DoacoesPage } from './pages/DoacoesPage';
import { HomePage } from './pages/HomePage';
import { MobilePage } from './pages/MobilePage';
import { NewMembersPage } from './pages/NewMembersPage';
import { shouldUseMobileExperience } from './utils/mobile';

function App() {
  const { pathname, hash, key } = useLocation();
  // The first page paints as-is (no fade from blank, and the browser keeps its
  // restored scroll position); only in-app route changes fade in. The router
  // gives the initial history entry the key "default".
  const routeChanged = key !== 'default';
  const previousPathname = useRef(pathname);
  // Phones that open the site root land on the horizontal mobile experience (once per tab).
  const [sendToMobile] = useState(() => !routeChanged && pathname === '/' && !hash && shouldUseMobileExperience());

  // A new page starts from the top, unless the URL points at an in-page anchor.
  useLayoutEffect(() => {
    if (previousPathname.current !== pathname && !hash) window.scrollTo(0, 0);
    previousPathname.current = pathname;
  }, [pathname, hash]);

  // The new page fades in; the old one is swapped out immediately. There is no
  // exit animation on purpose: navigation never waits on an animation, so it
  // can't get stuck (e.g. when the tab is in the background and animation
  // frames are paused).
  // Opacity only: a transform on this wrapper would turn it into the containing
  // block of the pages' position: fixed header.
  return (
    <motion.div
      key={pathname}
      initial={routeChanged ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.base, ease }}
    >
      <Routes>
        <Route path="/" element={sendToMobile ? <Navigate to="/m" replace /> : <HomePage />} />
        <Route path="/m" element={<MobilePage />} />
        <Route path="/novos-membros" element={<NewMembersPage />} />
        <Route path="/doacoes" element={<DoacoesPage />} />
      </Routes>
    </motion.div>
  );
}

export default App;
