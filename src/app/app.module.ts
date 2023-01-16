import { MatTabsModule } from '@angular/material/tabs';
import { AutenticacaoService } from 'src/app/service/auth/autenticacao.service';
import { EditarVisitanteComponent } from './components/editar-visitante/editar-visitante.component';
import { PanelModule } from 'primeng-lts/panel';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { VisitanteComponent } from './components/visitante/visitante.component';
import { MatNativeDateModule } from '@angular/material/core';
import { environment } from './../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ToastrModule } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { AgendamentoComponent } from './components/agendamento/agendamento.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { VisitanteBuscaComponent } from './components/visitante-busca/visitante-busca.component';
import { TableModule } from 'primeng-lts/table';
import { ToastModule } from 'primeng-lts/toast';
import { AngularMaterialModule } from './components/angular-material.module';
import { InputTextModule } from 'primeng-lts/inputtext';
import { InputNumberModule } from 'primeng-lts/inputnumber';
import { InputTextareaModule } from 'primeng-lts/inputtextarea';
import { CalendarModule } from 'primeng-lts/calendar';
import { ButtonModule } from 'primeng-lts/button';
import { MessageModule } from 'primeng-lts/message';
import { ListarAgendamentoComponent } from './components/listar-agendamento/listar-agendamento.component';
import { EditarAgendamentoComponent } from './components/editar-agendamento/editar-agendamento.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { TokenApiService } from './interceptors';
import { CryptoService } from './service/crypto-service/crypto.service';
import { CapsDetectDirective } from './directives/caps-detect.directive';
import { CadUsuarioComponent } from './components/cad-usuario/cad-usuario.component';

@NgModule({
  declarations: [
    AppComponent,
    AgendamentoComponent,
    LoginComponent,
    VisitanteComponent,
    VisitanteBuscaComponent,
    ConfirmDialogComponent,
    EditarVisitanteComponent,
    ListarAgendamentoComponent,
    EditarAgendamentoComponent,
    CadUsuarioComponent,
    CapsDetectDirective,
  ],
  imports: [
    AngularMaterialModule,
    BrowserModule,
    ButtonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    ToastrModule,
    MatInputModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(environment.toastConfig),
    MatDialogModule,
    FormsModule,
    MatNativeDateModule,
    TableModule,
    ToastModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    PanelModule,
    CalendarModule,
    MessageModule,
    MatTabsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenApiService, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    },
    AutenticacaoService,
    JwtHelperService,
    CryptoService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
