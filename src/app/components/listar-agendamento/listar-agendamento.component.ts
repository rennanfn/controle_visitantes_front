import { UserService } from './../../service/user/user.service';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { dataDetalhesAgendamento } from 'src/app/models/agendamento/agendamento.model';
import {
  AgendamentoInterface,
  AgendamentoService,
} from 'src/app/service/agendamento/agendamento.service';
import { AutenticacaoService } from 'src/app/service/auth/autenticacao.service';
import { CadUsuarioComponent } from '../cad-usuario/cad-usuario.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditarAgendamentoComponent } from '../editar-agendamento/editar-agendamento.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-listar-agendamento',
  templateUrl: './listar-agendamento.component.html',
  styleUrls: ['./listar-agendamento.component.scss'],
})
export class ListarAgendamentoComponent implements OnInit {
  cols = [
    { field: 'cod_agendamento', header: 'Cód. Agendamento' },
    { field: 'visitante', header: 'Visitante' },
    { field: 'data', header: 'Data' },
    { field: 'hora', header: 'Hora' },
    { field: 'observacao', header: 'Observação' },
    { field: 'status', header: 'Status' },
    { field: 'data_criacao', header: 'Data Criação' },
  ];

  agendamentoData: AgendamentoInterface[] = [];
  searchField = '';

  permissao_addusuario: boolean = false;

  constructor(
    private agendamentoService: AgendamentoService,
    private toast: ToastrService,
    private auth: AutenticacaoService,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.listarAgendamento();
    this.permissao_addusuario =
      this.userService.usuario.cod_usuario == '1' ? true : false;
  }

  addUsuario(): void {
    const dialogRef = this.dialog.open(CadUsuarioComponent, {
      minWidth: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  listarAgendamento() {
    this.agendamentoService.listarAgendamento().subscribe(
      (agendamento) => {
        this.agendamentoData = agendamento;
      },

      (erro) => {
        if (typeof erro.error.msg !== 'undefined') {
          this.toast.error(erro.error.msg);
          return;
        }
        this.toast.error('Erro ao exibir lista de agendamentos');
      }
    );
  }

  delete(cod_agendamento: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      disableClose: false,
      data: {
        title: 'Excluir Agendamento?',
        body: `Tem certeza que deseja excluir o agendamento ${cod_agendamento}?`,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.agendamentoService.delete(cod_agendamento).subscribe(
          (resp) => {
            this.toast.success('Agendamento excluído com sucesso!');
            this.listarAgendamento();
          },
          (erro) => {
            if (typeof erro.error.msg !== 'undefined') {
              this.toast.error(erro.error.msg);
              return;
            }
            this.toast.error('Erro ao excluir agendamento');
          }
        );
      }
    });
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Finalizar Sessão?',
        body: 'Tem certeza que deseja sair do sistema?',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.auth.deslogar();
      }
    });
  }

  addAgendamento() {
    this.router.navigate(['/agendamento']);
  }

  detalhesAgendamento(cod_agendamento: number) {
    this.agendamentoService.detalhesAgendamento(cod_agendamento).subscribe(
      (retorno_visitante) => {
        const det_: AgendamentoInterface = {
          cod_agendamento: retorno_visitante[0].cod_agendamento,
          visitante: retorno_visitante[0].visitante,
          data: retorno_visitante[0].data,
          hora: retorno_visitante[0].hora,
          observacao: retorno_visitante[0].observacao,
          status: retorno_visitante[0].status,
          data_criacao: retorno_visitante[0].data_criacao,
          usuario_criacao: retorno_visitante[0].usuario_criacao,
        };
        const data_edit: dataDetalhesAgendamento = {
          add_agendamento: false,
          detalhes: det_,
        };
        const dialog = this.dialog.open<
          EditarAgendamentoComponent,
          dataDetalhesAgendamento,
          dataDetalhesAgendamento
        >(EditarAgendamentoComponent, {
          disableClose: true,
          width: '600px',
          data: data_edit,
        });
        dialog.afterClosed().subscribe((result) => {
          this.listarAgendamento();
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
}
