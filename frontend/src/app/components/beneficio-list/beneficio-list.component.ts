import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';
import { BeneficioDialogComponent } from '../beneficio-dialog/beneficio-dialog.component';
import { TransferenciaDialogComponent } from '../transferencia-dialog/transferencia-dialog.component';

/**
 * Componente para listar benefícios
 */
@Component({
  selector: 'app-beneficio-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <h2>Gerenciamento de Benefícios</h2>

      <div class="actions">
        <button mat-raised-button color="primary" (click)="onCreate()">
          <mat-icon>add</mat-icon>
          Novo Benefício
        </button>
        <button mat-raised-button (click)="loadBeneficios()">
          <mat-icon>refresh</mat-icon>
          Atualizar
        </button>
      </div>

      <table mat-table [dataSource]="beneficios" class="mat-elevation-z8">
        <!-- ID Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let beneficio">{{ beneficio.id }}</td>
        </ng-container>

        <!-- Nome Column -->
        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let beneficio">{{ beneficio.nome }}</td>
        </ng-container>

        <!-- Descrição Column -->
        <ng-container matColumnDef="descricao">
          <th mat-header-cell *matHeaderCellDef>Descrição</th>
          <td mat-cell *matCellDef="let beneficio">{{ beneficio.descricao }}</td>
        </ng-container>

        <!-- Valor Column -->
        <ng-container matColumnDef="valor">
          <th mat-header-cell *matHeaderCellDef>Valor</th>
          <td mat-cell *matCellDef="let beneficio">
            {{ beneficio.valor | currency: 'BRL' }}
          </td>
        </ng-container>

        <!-- Ativo Column -->
        <ng-container matColumnDef="ativo">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let beneficio">
            <span [class]="beneficio.ativo ? 'status-ativo' : 'status-inativo'">
              {{ beneficio.ativo ? 'Ativo' : 'Inativo' }}
            </span>
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Ações</th>
          <td mat-cell *matCellDef="let beneficio">
            <button mat-icon-button color="primary" (click)="onEdit(beneficio)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="accent" (click)="onTransfer(beneficio)">
              <mat-icon>swap_horiz</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="onDelete(beneficio)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }

    .actions {
      margin: 20px 0;
      display: flex;
      gap: 10px;
    }

    table {
      width: 100%;
      margin-top: 20px;
    }

    .status-ativo {
      color: green;
      font-weight: bold;
    }

    .status-inativo {
      color: red;
      font-weight: bold;
    }
  `]
})
export class BeneficioListComponent implements OnInit {
  beneficios: Beneficio[] = [];
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'valor', 'ativo', 'actions'];

  constructor(
    private beneficioService: BeneficioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBeneficios();
  }

  loadBeneficios(): void {
    this.beneficioService.findAll().subscribe({
      next: (data) => {
        this.beneficios = data;
      },
      error: (error) => {
        this.showMessage('Erro ao carregar benefícios: ' + error.message);
      }
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(BeneficioDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.beneficioService.create(result).subscribe({
          next: () => {
            this.showMessage('Benefício criado com sucesso');
            this.loadBeneficios();
          },
          error: (error) => {
            this.showMessage('Erro ao criar benefício: ' + error.message);
          }
        });
      }
    });
  }

  onEdit(beneficio: Beneficio): void {
    const dialogRef = this.dialog.open(BeneficioDialogComponent, {
      width: '500px',
      data: { beneficio: { ...beneficio } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.beneficioService.update(beneficio.id!, result).subscribe({
          next: () => {
            this.showMessage('Benefício atualizado com sucesso');
            this.loadBeneficios();
          },
          error: (error) => {
            this.showMessage('Erro ao atualizar benefício: ' + error.message);
          }
        });
      }
    });
  }

  onTransfer(beneficio: Beneficio): void {
    const dialogRef = this.dialog.open(TransferenciaDialogComponent, {
      width: '500px',
      data: { beneficio: { ...beneficio } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.beneficioService.transferir(result).subscribe({
          next: () => {
            this.showMessage('Transferência realizada com sucesso');
            this.loadBeneficios();
          },
          error: (error) => {
            this.showMessage('Erro ao transferir: ' + error.message);
          }
        });
      }
    });
  }

  onDelete(beneficio: Beneficio): void {
    if (confirm(`Deseja realmente desativar o benefício "${beneficio.nome}"?`)) {
      this.beneficioService.delete(beneficio.id!).subscribe({
        next: () => {
          this.showMessage('Benefício desativado com sucesso');
          this.loadBeneficios();
        },
        error: (error) => {
          this.showMessage('Erro ao desativar: ' + error.message);
        }
      });
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000
    });
  }
}
