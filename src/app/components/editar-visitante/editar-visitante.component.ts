import {
  VisitanteService,
  VisitanteInterface,
} from './../../service/visitante/visitante.service';
import { ToastrService } from 'ngx-toastr';
import { dataDetalhesVisitante } from './../../models/visitante/visitante.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-visitante',
  templateUrl: './editar-visitante.component.html',
  styleUrls: ['./editar-visitante.component.css'],
})
export class EditarVisitanteComponent implements OnInit {
  formEditVisitante!: FormGroup;
  visitanteSelecionado: VisitanteInterface[] = [];
  visitante: VisitanteInterface[] = [];
  listaVisitante = false;
  exibe_msg_erro = false;
  habilita_selecao = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: dataDetalhesVisitante,
    public dialogRef: MatDialogRef<EditarVisitanteComponent>,
    private fb: FormBuilder,
    public toast: ToastrService,
    private visitanteService: VisitanteService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.data.add_visitante;
    this.preencherDados(this.fb, this.data.detalhes);
    //this.habilitarCamposForm(this.formEditVisitante, true);
    this.getVisitanteEspecifico(this.data.detalhes.cod_visitante);
  }

  createForm() {
    this.formEditVisitante = this.fb.group({
      cod_visitante: new FormControl({ value: '', disabled: true }),
      nome: new FormControl({ value: '', disabled: false }, [
        Validators.maxLength(100),
        Validators.required,
      ]),
      rg: new FormControl({ value: 0, disabled: false }, [
        Validators.maxLength(15),
        Validators.required,
      ]),
      empresa: new FormControl({ value: '', disabled: false }, [
        Validators.maxLength(100),
        Validators.required,
      ]),
      /*data_criacao: new FormControl({ value: '', disabled: false }, [
        Validators.maxLength(10),
      ]),*/
      usuario_criacao: new FormControl({ value: 0, disabled: false }, [
        Validators.required,
      ]),
    });
  }

  get f() {
    return this.formEditVisitante.controls;
  }

  preencherDados(fb: FormBuilder, dados: VisitanteInterface) {
    this.f.cod_visitante.setValue(dados.cod_visitante);
    this.f.nome.setValue(dados.nome);
    this.f.rg.setValue(dados.rg);
    this.f.empresa.setValue(dados.empresa);

    /*const [diaDe, mesDe, anoDe] = dados.data_criacao.split('/');
    const dataCriacao = new Date(
      Number(anoDe),
      Number(mesDe) - 1,
      Number(diaDe),
      0,
      0,
      0
    );
    this.f.data_criacao.setValue(dados.data_criacao);*/
    this.f.usuario_criacao.setValue(dados.usuario_criacao);
  }

  getVisitanteEspecifico(cod_visitante: number) {
    this.visitanteService.detalhesVisitante(cod_visitante).subscribe(
      (retornoVisitante) => {
        this.visitanteSelecionado = retornoVisitante;

        if (this.visitanteSelecionado.length > 0) {
          const filtroVisitante = this.visitante.filter((vis) => {
            return !this.visitanteSelecionado.some(
              (sel) => sel.cod_visitante === vis.cod_visitante
            );
          });
          this.visitante = filtroVisitante;
        }
      },
      (erro) => {
        if (typeof erro.error.msg !== 'undefined') {
          this.toast.error(erro.error.msg);
          return;
        }
        this.toast.error('Erro ao editar visitante');
      }
    );
  }

  addFormVisitantes(fb: FormBuilder, vis: string): FormGroup {
    return fb.group({
      cod_visitante: new FormControl(vis, []),
    });
  }

  atualizaVisitanteSelecionado(visitanteSelecionado: VisitanteInterface[]) {
    const formArrayVisitantes = visitanteSelecionado.reduce<FormArray>(
      (vissf, atual) => {
        vissf.push(
          this.addFormVisitantes(this.fb, atual.cod_visitante.toString())
        );
        return vissf;
      },
      this.fb.array([])
    );

    this.f.listaVisitante = formArrayVisitantes;
    if (visitanteSelecionado.length > 0) this.exibe_msg_erro = false;
  }

  salvarEdicao() {
    if (this.formEditVisitante.valid) {
      const form_visitante: VisitanteInterface =
        this.formEditVisitante.getRawValue();
      if (
        form_visitante.cod_visitante === undefined ||
        form_visitante.cod_visitante === 0
      ) {
        this.exibe_msg_erro = true;
        return;
      }

      if (this.data.add_visitante) {
        this.visitanteService.cadastroVisitante(form_visitante).subscribe(
          (retorno) => {
            this.toast.success(`Visitante incluído com sucesso!`);
            this.closeDialog();
          },
          (erro) => {
            if (typeof erro.error.msg !== 'undefined') {
              this.toast.error(erro.error.msg);
              return;
            }
            this.toast.error('Erro ao incluir visitante');
          }
        );
      } else {
        this.visitanteService.updateVisitante(form_visitante).subscribe(
          (retorno) => {
            this.toast.success(`Visitante alterado com sucesso!`);
            this.closeDialog();
          },
          (erro) => {
            if (typeof erro.error.msg !== 'undefined') {
              this.toast.error(erro.error.msg);
              return;
            }
            this.toast.error('Erro ao alterar visitante');
          }
        );
      }
    }
  }
  editarVisitante() {
    this.habilitarCamposForm(this.formEditVisitante, true);
  }

  habilitarCamposForm(form: FormGroup, ativa: boolean): void {
    if (ativa) {
      form.enable();
      this.habilita_selecao = true;
    } else {
      form.disable();
      this.habilita_selecao = false;
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  convertDate2String(date: Date) {
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${mes}-${dia}`;
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
