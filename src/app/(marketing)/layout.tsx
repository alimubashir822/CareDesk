import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-teal-500/30 selection:text-teal-200">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      {/* Client-side Floating Chat Widget */}
      <ChatWidget clinicSubdomain="smile-dental" />
    </div>
  );
}
