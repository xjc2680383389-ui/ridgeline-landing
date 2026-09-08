import { useCallback, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProofSection } from './components/ProofSection';
import { CatalogSection } from './components/CatalogSection';
import { ProductDrawer } from './components/ProductDrawer';
import { StorySection } from './components/StorySection';
import { PreorderSection } from './components/PreorderSection';
import { SiteFooter } from './components/SiteFooter';
import { Toast } from './components/Toast';
import { getProduct } from './data/catalog';
import { useReducedMotion } from './hooks/useMotion';
import { PreorderProvider } from './state/PreorderContext';

export default function App() {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const product = openId ? getProduct(openId) : undefined;

  const closeDrawer = useCallback(() => setOpenId(null), []);

  const goToPreorder = useCallback(() => {
    document.getElementById('preorder')?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [reduced]);

  return (
    <PreorderProvider>
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>
      <Header />
      <main id="main">
        <Hero onOpenProduct={setOpenId} />
        <ProofSection />
        <CatalogSection onOpenProduct={setOpenId} />
        <StorySection />
        <PreorderSection />
      </main>
      <SiteFooter />
      {product && (
        <ProductDrawer
          key={product.id}
          product={product}
          onClose={closeDrawer}
          onGoToPreorder={goToPreorder}
        />
      )}
      <Toast />
    </PreorderProvider>
  );
}
