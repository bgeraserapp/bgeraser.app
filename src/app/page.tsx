import { Features } from '@/components/layout/features';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/layout/hero';
import { Navbar } from '@/components/layout/navbar';
import { Pricing } from '@/components/layout/pricing';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
