import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { TransferenciaDialogComponent } from './transferencia-dialog.component';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';

describe('TransferenciaDialogComponent', () => {
  let component: TransferenciaDialogComponent;
  let fixture: ComponentFixture<TransferenciaDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<TransferenciaDialogComponent>>;
  let beneficioService: jasmine.SpyObj<BeneficioService>;

  const sourceBeneficio: Beneficio = {
    id: 1,
    nome: 'Beneficio A',
    descricao: 'Desc A',
    valor: 1000,
    ativo: true
  };

  const mockBeneficiosDestino: Beneficio[] = [
    { id: 2, nome: 'Beneficio B', descricao: 'Desc B', valor: 500, ativo: true },
    { id: 3, nome: 'Beneficio C', descricao: 'Desc C', valor: 750, ativo: true }
  ];

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const beneficioServiceSpy = jasmine.createSpyObj('BeneficioService', ['findAllAtivos']);

    await TestBed.configureTestingModule({
      imports: [TransferenciaDialogComponent, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: BeneficioService, useValue: beneficioServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: { beneficio: sourceBeneficio } }
      ]
    }).compileComponents();

    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<TransferenciaDialogComponent>>;
    beneficioService = TestBed.inject(BeneficioService) as jasmine.SpyObj<BeneficioService>;

    beneficioService.findAllAtivos.and.returnValue(of([sourceBeneficio, ...mockBeneficiosDestino]));

    fixture = TestBed.createComponent(TransferenciaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load beneficios destino excluding source beneficio', () => {
      expect(beneficioService.findAllAtivos).toHaveBeenCalled();
      expect(component.beneficiosDestino.length).toBe(2);
      expect(component.beneficiosDestino).not.toContain(sourceBeneficio);
    });

    it('should handle error when loading beneficios', () => {
      const error = new Error('Network error');
      beneficioService.findAllAtivos.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Erro ao carregar benefícios:', error);
    });
  });

  describe('Form initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.form.value).toEqual({
        paraId: '',
        valor: 0
      });
    });

    it('should have invalid form when required fields are empty', () => {
      expect(component.form.valid).toBeFalse();
    });

    it('should validate paraId is required', () => {
      component.form.patchValue({
        paraId: '',
        valor: 100
      });

      expect(component.form.get('paraId')?.hasError('required')).toBeTrue();
    });

    it('should validate valor is required', () => {
      component.form.patchValue({
        paraId: 2,
        valor: null
      });

      expect(component.form.get('valor')?.hasError('required')).toBeTrue();
    });

    it('should validate valor is greater than zero', () => {
      component.form.patchValue({
        paraId: 2,
        valor: 0
      });

      expect(component.form.get('valor')?.hasError('min')).toBeTrue();
    });

    it('should validate valor does not exceed source beneficio valor', () => {
      component.form.patchValue({
        paraId: 2,
        valor: 1500
      });

      expect(component.form.get('valor')?.hasError('max')).toBeTrue();
    });

    it('should have valid form with correct data', () => {
      component.form.patchValue({
        paraId: 2,
        valor: 500
      });

      expect(component.form.valid).toBeTrue();
    });
  });

  describe('onCancel', () => {
    it('should close dialog without data', () => {
      component.onCancel();

      expect(dialogRef.close).toHaveBeenCalledWith();
    });
  });

  describe('onTransferir', () => {
    it('should close dialog with transferencia data when valid', () => {
      component.form.patchValue({
        paraId: 2,
        valor: 300
      });

      component.onTransferir();

      expect(dialogRef.close).toHaveBeenCalledWith({
        deId: 1,
        paraId: 2,
        valor: 300
      });
    });

    it('should not close dialog when form is invalid', () => {
      component.form.patchValue({
        paraId: '',
        valor: 0
      });

      component.onTransferir();

      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should include source beneficio id in transferencia', () => {
      component.form.patchValue({
        paraId: 3,
        valor: 250
      });

      component.onTransferir();

      const transferencia = (dialogRef.close as jasmine.Spy).calls.mostRecent().args[0];
      expect(transferencia.deId).toBe(sourceBeneficio.id);
    });
  });

  describe('Form validation edge cases', () => {
    it('should allow transfer of exact available valor', () => {
      component.form.patchValue({
        paraId: 2,
        valor: 1000
      });

      expect(component.form.valid).toBeTrue();
    });

    it('should allow decimal values', () => {
      component.form.patchValue({
        paraId: 2,
        valor: 99.99
      });

      expect(component.form.valid).toBeTrue();
    });

    it('should not allow negative valor', () => {
      component.form.patchValue({
        paraId: 2,
        valor: -10
      });

      expect(component.form.get('valor')?.hasError('min')).toBeTrue();
    });

    it('should enforce max valor based on source beneficio', () => {
      component.form.patchValue({
        paraId: 2,
        valor: 1000.01
      });

      expect(component.form.get('valor')?.hasError('max')).toBeTrue();
    });
  });

  describe('Beneficios destino filtering', () => {
    it('should exclude source beneficio from destination list', () => {
      const hasSourceBeneficio = component.beneficiosDestino.some(
        b => b.id === sourceBeneficio.id
      );

      expect(hasSourceBeneficio).toBeFalse();
    });

    it('should only include active beneficios', () => {
      const allActive = component.beneficiosDestino.every(b => b.ativo);

      expect(allActive).toBeTrue();
    });
  });

  describe('Data display', () => {
    it('should display source beneficio data', () => {
      expect(component.data.beneficio).toEqual(sourceBeneficio);
    });

    it('should have correct max validator based on source valor', () => {
      const valorControl = component.form.get('valor');
      const maxValidator = valorControl?.hasError('max');

      valorControl?.setValue(sourceBeneficio.valor + 1);

      expect(valorControl?.hasError('max')).toBeTrue();
    });
  });
});
