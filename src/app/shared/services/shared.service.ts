import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    isSidebarOpen = true;
    isSidebarSlim = false;

    siteConfig: any;
    userData: any;

    get currency(): string {
        return this.siteConfig?.currency || '£';
    }

    deviceWidth: number;
    deviceHeight: number;

    currentTheme: 'light' | 'dark' = 'light';

    constructor(
        private router: Router,
        private toastr: ToastrService,
        @Inject(DOCUMENT) private doc: Document
    ) {
        if (localStorage.getItem('admin_data')) {
            this.userData = JSON.parse(atob(localStorage.getItem('admin_data')!));
        }
    }

    logout() {
        localStorage.removeItem('admin_data');
        localStorage.clear();
        this.router.navigate(['/']);
    }

    showAlert(type: number, title: string, message?: string) {
        const opts = { enableHtml: true, progressBar: true, positionClass: 'toast-top-right' as const };
        if (type === 1) this.toastr.success(title, message || '', opts);
        else if (type === 2) this.toastr.warning(title, message || '', opts);
        else if (type === 3) this.toastr.error(title, message || '', opts);
        else if (type === 4) this.toastr.info(title, message || '', opts);
    }

    openURL(url: string) {
        window.open(url, '_blank');
    }

    setPrimaryColor(color: string) {
        if (color && this.doc?.documentElement) {
            this.doc.documentElement.style.setProperty('--primary', color);
            this.doc.documentElement.style.setProperty('--primary-dark', this.shadeColor(color, -20));
            this.doc.documentElement.style.setProperty('--primary-bg', this.shadeColor(color, 85));
        }
    }

    private shadeColor(hex: string, percent: number): string {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + percent));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
        const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
    }
}
