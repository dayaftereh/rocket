import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppTranslationModule } from './app-translation.module';
import { AppComponent } from './app.component';
import { ViewsModule } from './views/views.module';

@NgModule({
  imports: [
    // Angular
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    // Custom
    ViewsModule,
    AppRoutingModule,
    AppTranslationModule,
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
