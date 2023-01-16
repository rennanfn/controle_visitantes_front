import { UserService } from './../../service/user/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cad-usuario',
  templateUrl: './cad-usuario.component.html',
  styleUrls: ['./cad-usuario.component.css'],
})
export class CadUsuarioComponent implements OnInit {
  hide = true;

  cadUsuarioForm: FormGroup = this.fb.group({
    usuario: ['', [Validators.required]],
    senha: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private userService: UserService,
    public dialogRef: MatDialogRef<CadUsuarioComponent>
  ) {}

  ngOnInit(): void {}

  addUsuario() {
    if (this.cadUsuarioForm.invalid) {
      this.toast.error('Preencha os campos obrigatórios!');
    } else {
      this.userService.cadastroUsuario(this.cadUsuarioForm.value).subscribe(
        (result) => {
          this.toast.success('Usuário cadastrado com sucesso');
        },
        (erro) => {
          if (typeof erro.error.msg !== 'undefined') {
            this.toast.error(erro.error.msg);
            return;
          }
          this.toast.error('Erro ao cadastrar usuário');
        }
      );
      this.dialogRef.close();
      this.cadUsuarioForm.reset;
    }
  }
  cancelar(): void {
    this.dialogRef.close();
    this.cadUsuarioForm.reset;
  }
}
