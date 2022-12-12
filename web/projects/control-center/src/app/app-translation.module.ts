import { registerLocaleData } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import localeDE from '@angular/common/locales/de';
import localeEN from '@angular/common/locales/en';
import localeDEExtra from '@angular/common/locales/extra/de';
import localeENExtra from '@angular/common/locales/extra/en';

registerLocaleData(localeEN, 'en-EN', localeENExtra)
registerLocaleData(localeDE, 'de-DE', localeDEExtra)

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        // Angular
        BrowserModule,
        HttpClientModule,
        // ngx-translate
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        {
            provide: LOCALE_ID,
            useValue: 'en-EN'
        }
    ]
})
export class AppTranslationModule {

    constructor(private readonly translate: TranslateService) {
        this.initLanguage()
    }

    private initLanguage(): void {
        this.translate.addLangs([
            'de',
            'en'
        ])
        const browserLang: string | undefined = this.translate.getBrowserLang()
        if (!!browserLang) {
            this.translate.use(browserLang)
        }
        this.translate.setDefaultLang('en')
    }

}