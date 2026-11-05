import type { AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { withBase } from '../../utils/url';

type NavAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

/**
 * Plain page routes ("/doacoes") go through the router so the page-to-page
 * fade can play. Links with an in-page anchor ("/#somos") keep the regular
 * <a>: they rely on the browser to jump to the section after loading.
 */
export function NavAnchor({ href, ...props }: NavAnchorProps) {
  if (href.includes('#')) {
    return <a href={withBase(href)} {...props} />;
  }
  return <Link to={href} {...props} />;
}
