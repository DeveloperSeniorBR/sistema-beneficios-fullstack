import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { BeneficioListComponent } from './beneficio-list.component';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';

describe('BeneficioListComponent', () => {
  let component: BeneficioListComponent;
  let fixture: ComponentFixture<BeneficioListComponent>;
  let beneficioService: jasmine.SpyObj<BeneficioService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockBeneficios: Beneficio[] = [
    { id: 1, nome: 'Beneficio A', descricao: 'Desc A', valor: 1000, ativo: true },
    { id: 2, nome: 'Beneficio B', descricao: 'Desc B', valor: 500, ativo: true }
  ];

  beforeEach(async () => {
    const beneficioServiceSpy = jasmine.createSpyObj('BeneficioService', [
      'findAll', 'create', 'update', 'delete', 'transferir'
    ]);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [BeneficioListComponent, BrowserAnimationsModule],
      providers: [
        { provide: BeneficioService, useValue: beneficioServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    beneficioService = TestBed.inject(BeneficioService) as jasmine.SpyObj<BeneficioService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    beneficioService.findAll.and.returnValue(of([]));
    fixture = TestBed.createComponent(BeneficioListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load beneficios on init', () => {
      beneficioService.findAll.and.returnValue(of(mockBeneficios));
      fixture.detectChanges();
      expect(beneficioService.findAll).toHaveBeenCalled();
      expect(component.beneficios).toEqual(mockBeneficios);
    });
  });

  describe('loadBeneficios', () => {
    it('should reload beneficios', () => {
      beneficioService.findAll.and.returnValue(of(mockBeneficios));
      component.loadBeneficios();
      expect(beneficioService.findAll).toHaveBeenCalled();
      expect(component.beneficios).toEqual(mockBeneficios);
    });
  });

  describe('onDelete', () => {
    it('should not delete if user cancels', () => {
      const beneficio = mockBeneficios[0];
      spyOn(window, 'confirm').and.returnValue(false);

      component.onDelete(beneficio);

      expect(beneficioService.delete).not.toHaveBeenCalled();
    });

    it('should delete beneficio on confirmation', (done) => {
      const beneficio = mockBeneficios[0];
      spyOn(window, 'confirm').and.returnValue(true);
      beneficioService.delete.and.returnValue(of(undefined as any));
      beneficioService.findAll.and.returnValue(of([mockBeneficios[1]]));

      component.onDelete(beneficio);
      
      setTimeout(() => {
        expect(window.confirm).toHaveBeenCalledWith(
          `Deseja realmente desativar o benefício "Beneficio A"?`
        );
        expect(beneficioService.delete).toHaveBeenCalledWith(beneficio.id!);
        done();
      }, 100);
    });
  });

  describe('component properties', () => {
    it('should have correct displayedColumns', () => {
      expect(component.displayedColumns).toEqual(['id', 'nome', 'descricao', 'valor', 'ativo', 'actions']);
    });

    it('should initialize with empty beneficios array', () => {
      expect(component.beneficios).toEqual([]);
    });
  });
});
