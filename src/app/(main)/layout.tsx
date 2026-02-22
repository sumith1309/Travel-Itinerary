import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { SearchOverlay } from '@/components/layout/search-overlay';
import { ChatFAB } from '@/components/chat/chat-fab';
import { ChatPanel } from '@/components/chat/chat-panel';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <MobileNav />
      <SearchOverlay />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <ChatFAB />
      <ChatPanel />
    </>
  );
}
