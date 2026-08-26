import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { SharedService } from '../../shared/services/shared.service';
import { QuickCheckoutService } from '../../shared/services/quick-checkout.service';

@Component({
    selector: 'app-home',
    standalone: false,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

    products: any[] = [];
    productsLoading = true;

    activeImg:       { [id: number]: number } = {};
    qty:             { [id: number]: number } = {};
    selectedVariant: { [id: number]: { [vi: number]: number } } = {};

    isMobile = false;

    constructor(
        private productService: ProductService,
        public cartService: CartService,
        private router: Router,
        public sharedservice: SharedService,
        public qcService: QuickCheckoutService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        this.checkDevice();
        this.loadProducts();
    }

    loadProducts() {
        this.productService.getProducts({ limit: 20, page: 1, isActive: true })
            .pipe(catchError(() => of({ data: [] })))
            .subscribe((res: any) => {
                const raw = res?.data || res?.products || [];
                this.products = raw.map((p: any) => ({
                    ...p,
                    images:   this.parseJson(p.images,   []),
                    benefits: this.parseJson(p.benefits, []),
                    variants: this.parseJson(p.variants, []),
                }));
                this.products.forEach(p => {
                    this.activeImg[p.id] = 0;
                    this.qty[p.id] = 1;
                    this.selectedVariant[p.id] = {};
                });
                this.productsLoading = false;
            });
    }

    ngOnDestroy(): void {}

    // ── Per-product helpers ───────────────────────────────────────────────────
    setActiveImg(id: number, idx: number) { this.activeImg[id] = idx; }

    qtyChange(id: number, delta: number) {
        this.qty[id] = Math.max(1, (this.qty[id] ?? 1) + delta);
    }

    selectVariant(id: number, vi: number, oi: number) {
        if (!this.selectedVariant[id]) this.selectedVariant[id] = {};
        this.selectedVariant[id][vi] = oi;
    }

    getSelectedOptions(p: any): { [k: string]: string } {
        const sel = this.selectedVariant[p.id] || {};
        const opts: { [k: string]: string } = {};
        (p.variants || []).forEach((v: any, vi: number) => {
            const opt = v.options?.[sel[vi] ?? 0];
            if (opt) opts[v.name] = opt.label;
        });
        return opts;
    }

    // ── Shared helpers ────────────────────────────────────────────────────────
    parseJson(val: any, fallback: any = null): any {
        if (!val) return fallback;
        if (typeof val !== 'string') return val;
        try { return JSON.parse(val); } catch { return fallback; }
    }

    goToProduct(slug: string) { this.router.navigate(['/product', slug]); }

    buyNow(e: Event, product: any, qty: number = 1, selectedOptions: { [k: string]: string } = {}) {
        e.stopPropagation();
        this.qcService.open(product, qty, selectedOptions);
    }

    getStars(rating: number): string[] {
        const stars: string[] = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) stars.push('full');
            else if (rating >= i - 0.5) stars.push('half');
            else stars.push('empty');
        }
        return stars;
    }

    getDiscount(price: number, salePrice: number): number {
        return Math.round(((price - salePrice) / price) * 100);
    }

    @HostListener('window:resize')
    onResize() { this.checkDevice(); }

    checkDevice() {
        if (isPlatformBrowser(this.platformId)) {
            this.isMobile = window.innerWidth <= 768;
        }
    }
}
