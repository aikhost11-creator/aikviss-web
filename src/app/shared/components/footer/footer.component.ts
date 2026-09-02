import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

interface FooterLink {
  label: string;
  url: string;
}

interface PolicyPage {
  slug: string;
  label: string;
  icon: string;
  desc: string;
}

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {

  currentYear = new Date().getFullYear();
  newsletterEmail = '';
  openSection: string | null = 'policies';

  constructor(public sharedService: SharedService) {}

  get siteName(): string {
    return this.sharedService.siteConfig?.siteName || this.displayDomain;
  }

  get siteConfig(): any {
    return this.sharedService.siteConfig || {};
  }

  get displayDomain(): string {
    const cfg = this.siteConfig;
    if (cfg?.clientUrl) {
      const raw = String(cfg.clientUrl).trim();
      try {
        const url = raw.startsWith('http') ? raw : `https://${raw}`;
        return new URL(url).hostname.replace(/^www\./i, '');
      } catch {
        return raw.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '');
      }
    }
    if (cfg?.siteName) return String(cfg.siteName);
    if (typeof window !== 'undefined') {
      return window.location.hostname.replace(/^www\./i, '');
    }
    return 'Store';
  }

  get contactEmail(): string {
    return this.siteConfig?.email || '';
  }

  get contactPhone(): string {
    return this.siteConfig?.mobile || '';
  }

  get hasSocial(): boolean {
    const c = this.siteConfig;
    return !!(c?.instagramURL || c?.facebookURL || c?.twitterURL || c?.linkedInURL || c?.youtubeURL);
  }

  subscribeNewsletter() {
    const email = this.newsletterEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.sharedService.showAlert(2, 'Please enter a valid email address');
      return;
    }
    this.sharedService.showAlert(1, 'Thanks for subscribing!');
    this.newsletterEmail = '';
  }

  toggleSection(id: string) {
    this.openSection = this.openSection === id ? null : id;
  }

  isOpen(id: string): boolean {
    return this.openSection === id;
  }

  /** All legal / policy pages — highlighted in footer */
  policyPages: PolicyPage[] = [
    {
      slug: 'shipping-policy',
      label: 'Shipping Policy',
      icon: 'fa-light fa-truck-fast',
      desc: 'Delivery times, charges & tracking'
    },
    {
      slug: 'return-refund',
      label: 'Return & Refund',
      icon: 'fa-light fa-arrow-rotate-left',
      desc: 'Returns, refunds & replacements'
    },
    {
      slug: 'privacy-policy',
      label: 'Privacy Policy',
      icon: 'fa-light fa-shield-check',
      desc: 'How we protect your data'
    },
    {
      slug: 'terms-conditions',
      label: 'Terms & Conditions',
      icon: 'fa-light fa-file-contract',
      desc: 'Rules for using our store'
    },
  ];

  shopLinks: FooterLink[] = [
    { label: 'Home', url: '/' },
    { label: 'Shop All', url: '/shop' },
    { label: 'About Us', url: '/about-us' },
    { label: 'FAQs', url: '/faqs' },
  ];

  trustBadges = [
    { icon: 'fa-light fa-truck-fast', label: 'Free Shipping', sub: 'On every order' },
    { icon: 'fa-light fa-hand-holding-dollar', label: 'Cash on Delivery', sub: 'Pay at doorstep' },
    { icon: 'fa-light fa-shield-check', label: 'Secure Checkout', sub: '100% protected' },
    { icon: 'fa-light fa-rotate-left', label: 'Easy Returns', sub: 'Hassle-free policy' },
  ];

  mobileColumns: { id: string; heading: string; links: FooterLink[] }[] = [];

  ngOnInit() {
    this.mobileColumns = [
      { id: 'shop', heading: 'Shop', links: this.shopLinks },
      {
        id: 'policies',
        heading: 'Policies & Legal',
        links: this.policyPages.map(p => ({ label: p.label, url: '/' + p.slug })),
      },
    ];
  }
}
