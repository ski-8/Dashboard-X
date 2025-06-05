declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function initGA() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.warn('Google Analytics measurement ID not found');
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag = function() {
    // eslint-disable-next-line prefer-rest-params
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId);
}

export function trackPageView(page: string) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: page,
    });
  }
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}