import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BeneficioDialogComponent } from './beneficio-dialog.component';
import { Beneficio } from '../../models/beneficio.model';

describe('BeneficioDialogComponent', () => {
  let component: BeneficioDialogComponent;
  let fixture: ComponentFixture<BeneficioDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<BeneficioDialogComponent>>;

  const createComponent = (data: { beneficio?: Beneficio } = {}) => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [BeneficioDialogComponent, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<BeneficioDialogComponent>>;
    fixture = TestBed.createComponent(BeneficioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('Create Mode', () => {
    beforeEach(() => {
      createComponent({});
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      expect(component.form.value).toEqual({
        nome: '',
        descricao: '',
        valor: 0,
        ativo: true
      });
    });

    it('should have invalid form when required fields are empty', () => {
      expect(component.form.valid).toBeFalse();
    });

    it('should have valid form when all fields are filled correctly', () => {
      component.form.patchValue({
        nome: 'Novo Beneficio',
        descricao: 'Descrição do benefício',
        valor: 100
      });

      expect(component.form.valid).toBeTrue();
    });

    it('should validate valor is greater than 0', () => {
      component.form.patchValue({
        nome: 'Beneficio',
        descricao: 'Descrição',
        valor: 0
      });

      expect(component.form.get('valor')?.hasError('min')).toBeTrue();
      expect(component.form.valid).toBeFalse();
    });

    it('should validate nome is required', () => {
      component.form.patchValue({
        nome: '',
        descricao: 'Descrição',
        valor: 100
      });

      expect(component.form.get('nome')?.hasError('required')).toBeTrue();
      expect(component.form.valid).toBeFalse();
    });

    it('should validate descricao is required', () => {
      component.form.patchValue({
        nome: 'Beneficio',
        descricao: '',
        valor: 100
      });

      expect(component.form.get('descricao')?.hasError('required')).toBeTrue();
      expect(component.form.valid).toBeFalse();
    });
  });

  describe('Edit Mode', () => {
    const existingBeneficio: Beneficio = {
      id: 1,
      nome: 'Beneficio Existente',
      descricao: 'Descrição existente',
      valor: 500,
      ativo: true
    };

    beforeEach(() => {
      createComponent({ beneficio: existingBeneficio });
    });

    it('should initialize form with existing beneficio data', () => {
      expect(component.form.value).toEqual({
        nome: 'Beneficio Existente',
        descricao: 'Descrição existente',
        valor: 500,
        ativo: true
      });
    });

    it('should have valid form with existing data', () => {
      expect(component.form.valid).toBeTrue();
    });
  });

  describe('onCancel', () => {
    beforeEach(() => {
      createComponent({});
    });

    it('should close dialog without data', () => {
      component.onCancel();

      expect(dialogRef.close).toHaveBeenCalledWith();
    });
  });

  describe('onSave', () => {
    beforeEach(() => {
      createComponent({});
    });

    it('should close dialog with form data when valid', () => {
      component.form.patchValue({
        nome: 'Novo Beneficio',
        descricao: 'Nova descrição',
        valor: 250,
        ativo: true
      });

      component.onSave();

      expect(dialogRef.close).toHaveBeenCalledWith({
        nome: 'Novo Beneficio',
        descricao: 'Nova descrição',
        valor: 250,
        ativo: true
      });
    });

    it('should not close dialog when form is invalid', () => {
      component.form.patchValue({
        nome: '',
        descricao: '',
        valor: 0
      });

      component.onSave();

      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('Edit Mode - onSave', () => {
    const existingBeneficio: Beneficio = {
      id: 1,
      nome: 'Beneficio Existente',
      descricao: 'Descrição existente',
      valor: 500,
      ativo: true
    };

    beforeEach(() => {
      createComponent({ beneficio: existingBeneficio });
    });

    it('should merge existing beneficio with form data on save', () => {
      component.form.patchValue({
        nome: 'Nome Atualizado',
        valor: 750
      });

      component.onSave();

      expect(dialogRef.close).toHaveBeenCalledWith({
        id: 1,
        nome: 'Nome Atualizado',
        descricao: 'Descrição existente',
        valor: 750,
        ativo: true
      });
    });
  });

  describe('Form validation edge cases', () => {
    beforeEach(() => {
      createComponent({});
    });

    it('should allow valor with decimals', () => {
      component.form.patchValue({
        nome: 'Beneficio',
        descricao: 'Descrição',
        valor: 99.99
      });

      expect(component.form.valid).toBeTrue();
    });

    it('should not allow negative valor', () => {
      component.form.patchValue({
        nome: 'Beneficio',
        descricao: 'Descrição',
        valor: -10
      });

      expect(component.form.get('valor')?.hasError('min')).toBeTrue();
    });

    it('should allow ativo to be false', () => {
      component.form.patchValue({
        nome: 'Beneficio',
        descricao: 'Descrição',
        valor: 100,
        ativo: false
      });

      expect(component.form.valid).toBeTrue();
      expect(component.form.value.ativo).toBeFalse();
    });
  });
});
