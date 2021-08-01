import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServicesModule } from './services/services.module';
import { ViewsModule } from './views/views.module';

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