import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {

  currentYear = new Date().getFullYear();
  newsletterEmail = '';
  openSection: string | null = 'quick';

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

  quickLinks = [
    { label: 'Home', url: '/' },
    { label: 'Shop All', url: '/shop' },
    { label: 'Cart', url: '/cart' },
    { label: 'Checkout', url: '/checkout' },
  ];

  trustBadges = [
    { icon: 'fa-light fa-truck-fast', label: 'Free Shipping', sub: 'On every order' },
    { icon: 'fa-light fa-hand-holding-dollar', label: 'Cash on Delivery', sub: 'Pay at doorstep' },
    { icon: 'fa-light fa-shield-check', label: 'Secure Checkout', sub: '100% protected' },
    { icon: 'fa-light fa-rotate-left', label: 'Easy Returns', sub: 'Hassle-free policy' },
  ];

  mobileColumns = [
    { id: 'quick', heading: 'Quick Links', links: [] as { label: string; url: string }[] },
  ];

  ngOnInit() {
    this.mobileColumns[0].links = this.quickLinks;
  }
}
