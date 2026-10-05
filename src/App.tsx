/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CustomerLayout } from './components/CustomerLayout';
import { LandingPage } from './components/LandingPage';
import { LiveDropsPage } from './components/LiveDropsPage';
import { HelpSupportPage } from './components/HelpSupportPage';
import { ContactPage } from './components/ContactPage';
import { TermsGuidePage } from './components/TermsGuidePage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { PartnersCommunityPage } from './components/PartnersCommunityPage';

export type PageId = 'landing' | 'livedrops' | 'help-support' | 'contact' | 'terms-guide' | 'privacy-policy' | 'partners-community';

function getPageFromHash(): PageId {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash === 'livedrops' || hash === 'live-drops' || hash === 'drops') return 'livedrops';
  if (hash === 'help-support' || hash === 'faqs') return 'help-support';
  if (hash === 'contact' || hash === 'contact-us') return 'contact';
  if (hash === 'terms-guide' || hash === 'terms') return 'terms-guide';
  if (hash === 'privacy-policy' || hash === 'privacy') return 'privacy-policy';
  if (hash === 'partners-community' || hash === 'community' || hash === 'partners') return 'partners-community';
  return 'landing';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string) => {
    const targetPage = (
      page === 'livedrops' ||
      page === 'live-drops' ||
      page === 'help-support' || 
      page === 'contact' || 
      page === 'terms-guide' || 
      page === 'privacy-policy' ||
      page === 'partners-community' ||
      page === 'community'
    ) ? (
      (page === 'community' ? 'partners-community' : page === 'live-drops' ? 'livedrops' : page) as PageId
    ) : 'landing';

    setCurrentPage(targetPage);
    
    if (targetPage === 'landing') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = targetPage;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <CustomerLayout onNavigate={handleNavigate} currentPage={currentPage}>
        {currentPage === 'livedrops' && <LiveDropsPage onNavigate={handleNavigate} />}
        {currentPage === 'help-support' && <HelpSupportPage onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
        {currentPage === 'terms-guide' && <TermsGuidePage onNavigate={handleNavigate} />}
        {currentPage === 'privacy-policy' && <PrivacyPolicyPage onNavigate={handleNavigate} />}
        {currentPage === 'partners-community' && <PartnersCommunityPage onNavigate={handleNavigate} />}
        {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      </CustomerLayout>
    </AuthProvider>
  );
}

