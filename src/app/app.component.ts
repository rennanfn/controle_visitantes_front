import { AutenticacaoService } from './service/auth/autenticacao.service';
import { Component } from '@angular/core';
import { TranslatePrimeNGService } from './service/translate/translate-prime-ng.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    public auth: AutenticacaoService,
    translate: TranslatePrimeNGService
  ) {
    //translate.getTranslate('pt').then((res) => config.setTranslation(res));
  }

  ngOnInit(): void {}
}
