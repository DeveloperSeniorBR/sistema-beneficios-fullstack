import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Beneficio } from '../../models/beneficio.model';
import { BeneficioService } from '../../services/beneficio.service';

@Component({
  selector: 'app-transferencia-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Transferir Valor</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>De (Origem)</mat-label>
          <input matInput [value]="data.beneficio.nome" disabled>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Valor Disponível</mat-label>
          <input matInput [value]="data.beneficio.valor | currency: 'BRL'" disabled>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Para (Destino)</mat-label>
          <mat-select formControlName="paraId" required>
            <mat-option *ngFor="let beneficio of beneficiosDestino" [value]="beneficio.id">
              {{ beneficio.nome }} - {{ beneficio.valor | currency: 'BRL' }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('paraId')?.hasError('required')">
            Selecione o benefício de destino
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Valor a Transferir</mat-label>
          <input matInput type="number" formControlName="valor" required step="0.01">
          <mat-error *ngIf="form.get('valor')?.hasError('required')">
            Valor é obrigatório
          </mat-error>
          <mat-error *ngIf="form.get('valor')?.hasError('min')">
            Valor deve ser maior que zero
          </mat-error>
          <mat-error *ngIf="form.get('valor')?.hasError('max')">
            Valor não pode ser maior que o saldo disponível
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onTransferir()" [disabled]="!form.valid">
        Transferir
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
  `]
})
export class TransferenciaDialogComponent implements OnInit {
  form: FormGroup;
  beneficiosDestino: Beneficio[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransferenciaDialogComponent>,
    private beneficioService: BeneficioService,
    @Inject(MAT_DIALOG_DATA) public data: { beneficio: Beneficio }
  ) {
    this.form = this.fb.group({
      paraId: ['', Validators.required],
      valor: [0, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(data.beneficio.valor)
      ]]
    });
  }

  ngOnInit(): void {
    // Carrega benefícios ativos exceto o de origem
    this.beneficioService.findAllAtivos().subscribe({
      next: (beneficios) => {
        this.beneficiosDestino = beneficios.filter(
          b => b.id !== this.data.beneficio.id
        );
      },
      error: (error) => {
        console.error('Erro ao carregar benefícios:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onTransferir(): void {
    if (this.form.valid) {
      const transferencia = {
        deId: this.data.beneficio.id!,
        paraId: this.form.value.paraId,
        valor: this.form.value.valor
      };
      this.dialogRef.close(transferencia);
    }
  }
}
