import {
  AutenticacaoService,
  LoginInterface,
} from './../../service/auth/autenticacao.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/autenticacao/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true;
  capsOn = false;
  userForm!: FormGroup;
  returnUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private autenticacaoService: AutenticacaoService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.createUserForm();
  }

  createUserForm(): void {
    this.userForm = this.fb.group({
      usuario: ['', [Validators.required]],
      senha: ['', [Validators.required]],
    });
  }

  onLogin(): void {
    if (this.userForm.invalid) {
      return;
    }

    const formValue: LoginInterface = {
      usuario: this.userForm.get('usuario')?.value,
      senha: this.userForm.get('senha')?.value,
    };

    this.autenticacaoService.validaUsuario(formValue).subscribe(
      (resp) => {
        this.router.navigate(['/listarAgendamento'], {
          state: { usuario: formValue.usuario },
        });
        this.toast.success('Login realizado com sucesso');
      },
      (erro) => {
        if (typeof erro.error.msg !== 'undefined') {
          this.toast.error(erro.error.msg);
          return;
        }
        this.toast.error('Erro ao tentar logar');
      }
    );
  }

  checkCaps(ativo: any) {
    this.capsOn = ativo;
  }
}
