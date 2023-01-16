import { UserService } from './../../service/user/user.service';
import { VisitanteService } from './../../service/visitante/visitante.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-visitante',
  templateUrl: './visitante.component.html',
  styleUrls: ['./visitante.component.css'],
})
export class VisitanteComponent implements OnInit {
  cadVisitanteForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    rg: ['', [Validators.required]],
    empresa: ['', [Validators.required]],
    foto: ['', []],
    usuario_criacao: [this.userService.usuario.cod_usuario],
  });

  constructor(
    private fb: FormBuilder,
    private visitanteService: VisitanteService,
    private toast: ToastrService,
    private userService: UserService,
    public dialogRef: MatDialogRef<VisitanteComponent>
  ) {}

  ngOnInit(): void {}

  /*dataimage: string | ArrayBuffer | null = '';

  @ViewChild('fileInput') fileInput!: ElementRef;
  fileAttr = 'Escolha um Arquivo';

  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file: any) => {
        this.fileAttr += file.name;
      });

      let reader = new FileReader();
      reader.onload = (e) => {
        this.dataimage = reader.result;
        this.cadVisitanteForm.get('foto')?.setValue(this.dataimage);

      };
      reader.readAsDataURL(imgFile.target.files[0]);

      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'Escolha um Arquivo';
    }
  }*/

  salvarVisitante() {
    if (this.cadVisitanteForm.invalid) {
      this.toast.error('Preencha os campos obrigatórios!');
    } else {
      this.visitanteService
        .cadastroVisitante(this.cadVisitanteForm.value)
        .subscribe(
          (result) => {
            this.toast.success('Visitante cadastrado com sucesso');
          },
          (erro) => {
            if (typeof erro.error.msg !== 'undefined') {
              this.toast.error(erro.error.msg);
              return;
            }
            this.toast.error('Erro ao cadastrar visitante');
          }
        );
      this.dialogRef.close();
      this.cadVisitanteForm.reset;
    }
  }
  cancelar(): void {
    this.dialogRef.close();
    this.cadVisitanteForm.reset;
  }
}
