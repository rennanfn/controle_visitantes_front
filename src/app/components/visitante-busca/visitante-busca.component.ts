import { VisitanteComponent } from './../visitante/visitante.component';
import {
  VisitanteService,
  VisitanteInterface,
} from './../../service/visitante/visitante.service';
import {
  Visitante,
  dataDetalhesVisitante,
  VisitanteSelecionado,
} from './../../models/visitante/visitante.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EditarVisitanteComponent } from '../editar-visitante/editar-visitante.component';

@Component({
  selector: 'app-visitante-busca',
  templateUrl: './visitante-busca.component.html',
  styleUrls: ['./visitante-busca.component.scss'],
})
export class VisitanteBuscaComponent implements OnInit {
  cols = [
    { field: 'cod_visitante', header: 'Cód. Visitante' },
    { field: 'nome', header: 'Nome' },
    { field: 'rg', header: 'RG' },
    { field: 'empresa', header: 'Empresa' },
    { field: 'data_criacao', header: 'Data Criação' },
    { field: 'usuario_criacao', header: 'Usuário Criação' },
  ];

  @Output() visitanteSelecionado = new EventEmitter<VisitanteSelecionado>();

  formVisitante = new FormControl();

  visitantesData: VisitanteInterface[] = [];
  searchField = '';

  public cadVisitanteForm: FormGroup = this.fb.group({});

  constructor(
    private visitanteService: VisitanteService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VisitanteBuscaComponent>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.buscaVisitante();
  }

  buscaVisitante() {
    this.visitanteService.buscaVisitante().subscribe(
      (visitantes) => {
        this.visitantesData = visitantes;
      },

      (erro) => {
        if (typeof erro.error.msg !== 'undefined') {
          this.toast.error(erro.error.msg);
          return;
        }
        this.toast.error('Erro ao buscar visitante');
      }
    );
  }

  detalhesVisitante(cod_visitante: number) {
    this.visitanteService.detalhesVisitante(cod_visitante).subscribe(
      (retorno_visitante) => {
        const det_: VisitanteInterface = {
          cod_visitante: retorno_visitante[0].cod_visitante,
          nome: retorno_visitante[0].nome,
          rg: retorno_visitante[0].rg,
          empresa: retorno_visitante[0].empresa,
          foto: retorno_visitante[0].foto,
          data_criacao: retorno_visitante[0].data_criacao,
          usuario_criacao: retorno_visitante[0].usuario_criacao,
        };
        const data_edit: dataDetalhesVisitante = {
          add_visitante: false,
          detalhes: det_,
        };

        const dialog = this.dialog.open<
          EditarVisitanteComponent,
          dataDetalhesVisitante,
          dataDetalhesVisitante
        >(EditarVisitanteComponent, {
          disableClose: true,
          width: '600px',
          data: data_edit,
        });
        dialog.afterClosed().subscribe((result) => {
          this.buscaVisitante();
        });
      },
      (erro) => {
        if (typeof erro.error.msg !== 'undefined') {
          this.toast.error(erro.error.msg);
          return;
        }
        this.toast.error('Não foi possível editar o cadastro');
      }
    );
  }

  selecionarVisitante(nome: string) {
    /*this.visitanteService
      .visitanteSelecao(cod_visitante)
      .subscribe((result) => {
        if (typeof result === 'undefined') return;

    const visi: VisitanteSelecionado = {
      cod_visitante: visitante,
    };
    this.visitanteSelecionado.emit(visi);
    this.formVisitante.setValue(`${visitante}`);*/
    this.dialogRef.close(`${nome}`);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
