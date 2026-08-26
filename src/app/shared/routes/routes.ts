import { Routes } from "@angular/router";
import { HomeComponent } from "../../components/home/home.component";
import { ShopComponent } from "../../components/shop/shop.component";
import { ProductDetailComponent } from "../../components/product-detail/product-detail.component";
import { CartComponent } from "../../components/cart/cart.component";
import { CheckoutComponent } from "../../components/checkout/checkout.component";
import { OrderSuccessComponent } from "../../components/order-success/order-success.component";

export const routing: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'product/:slug', component: ProductDetailComponent },
    { path: 'cart', component: CartComponent },
    { path: 'bag', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'order-success/:id', component: OrderSuccessComponent },
    { path: 'order-success', component: OrderSuccessComponent },
    { path: '**', redirectTo: '' },
];
