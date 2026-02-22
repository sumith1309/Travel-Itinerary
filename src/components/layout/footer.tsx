import Link from 'next/link';
import { Logo } from './logo';

const footerLinks = {
  Explore: [
    { href: '/destinations', label: 'Destinations' },
    { href: '/experiences', label: 'Experiences' },
    { href: '/itineraries', label: 'Sample Itineraries' },
    { href: '/blog', label: 'Travel Blog' },
  ],
  Tools: [
    { href: '/visa', label: 'Visa Hub' },
    { href: '/itineraries', label: 'Itinerary Builder' },
    { href: '/search', label: 'Search' },
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/careers', label: 'Careers' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-midnight text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-xl font-bold text-white">
              Trails <span className="text-orange">&</span> Miles
            </span>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              AI-powered travel planning for Indian travellers. Explore the world, your way.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white/90 mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            Made with love for Indian travellers
          </p>
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Trails and Miles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
