import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServicesModule } from './services/services.module';
import { ViewsModule } from './views/views.module';

registerLocaleData(localeEn)
registerLocaleData(localeDe)

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        BrowserAnimationsModule,
        // Routing
        AppRoutingModule,
        // Custom
        ViewsModule,
        ServicesModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }