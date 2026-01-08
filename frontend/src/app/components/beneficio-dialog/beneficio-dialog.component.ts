import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Beneficio } from '../../models/beneficio.model';

@Component({
  selector: 'app-beneficio-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.beneficio ? 'Editar Benefício' : 'Novo Benefício' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome" required>
          <mat-error *ngIf="form.get('nome')?.hasError('required')">
            Nome é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <textarea matInput formControlName="descricao" rows="3" required></textarea>
          <mat-error *ngIf="form.get('descricao')?.hasError('required')">
            Descrição é obrigatória
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Valor</mat-label>
          <input matInput type="number" formControlName="valor" required step="0.01">
          <mat-error *ngIf="form.get('valor')?.hasError('required')">
            Valor é obrigatório
          </mat-error>
          <mat-error *ngIf="form.get('valor')?.hasError('min')">
            Valor deve ser maior que zero
          </mat-error>
        </mat-form-field>

        <mat-checkbox formControlName="ativo">Ativo</mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!form.valid">
        Salvar
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

    mat-checkbox {
      margin-bottom: 15px;
    }
  `]
})
export class BeneficioDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BeneficioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { beneficio?: Beneficio }
  ) {
    this.form = this.fb.group({
      nome: [data.beneficio?.nome || '', Validators.required],
      descricao: [data.beneficio?.descricao || '', Validators.required],
      valor: [data.beneficio?.valor || 0, [Validators.required, Validators.min(0.01)]],
      ativo: [data.beneficio?.ativo !== false]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      const beneficio: Beneficio = {
        ...this.data.beneficio,
        ...this.form.value
      };
      this.dialogRef.close(beneficio);
    }
  }
}
