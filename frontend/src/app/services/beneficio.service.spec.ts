import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BeneficioService } from './beneficio.service';
import { Beneficio, BeneficioRequest, TransferenciaRequest } from '../models/beneficio.model';

describe('BeneficioService', () => {
  let service: BeneficioService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://localhost:8080/api/v1/beneficios';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BeneficioService]
    });
    service = TestBed.inject(BeneficioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('findAll', () => {
    it('should return list of beneficios', () => {
      const mockBeneficios: Beneficio[] = [
        { id: 1, nome: 'Beneficio A', descricao: 'Desc A', valor: 1000, ativo: true },
        { id: 2, nome: 'Beneficio B', descricao: 'Desc B', valor: 500, ativo: true }
      ];

      service.findAll().subscribe(beneficios => {
        expect(beneficios.length).toBe(2);
        expect(beneficios).toEqual(mockBeneficios);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockBeneficios);
    });

    it('should handle error', () => {
      service.findAll().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(API_URL);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('findAllAtivos', () => {
    it('should return only active beneficios', () => {
      const mockBeneficios: Beneficio[] = [
        { id: 1, nome: 'Beneficio A', descricao: 'Desc A', valor: 1000, ativo: true }
      ];

      service.findAllAtivos().subscribe(beneficios => {
        expect(beneficios.length).toBe(1);
        expect(beneficios[0].ativo).toBe(true);
      });

      const req = httpMock.expectOne(`${API_URL}/ativos`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBeneficios);
    });
  });

  describe('findById', () => {
    it('should return single beneficio', () => {
      const mockBeneficio: Beneficio = {
        id: 1,
        nome: 'Beneficio A',
        descricao: 'Desc A',
        valor: 1000,
        ativo: true
      };

      service.findById(1).subscribe(beneficio => {
        expect(beneficio).toEqual(mockBeneficio);
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBeneficio);
    });
  });

  describe('create', () => {
    it('should create new beneficio', () => {
      const newBeneficio: BeneficioRequest = {
        nome: 'Novo Beneficio',
        descricao: 'Nova Desc',
        valor: 750,
        ativo: true
      };

      const createdBeneficio: Beneficio = {
        id: 3,
        nome: newBeneficio.nome,
        descricao: newBeneficio.descricao,
        valor: newBeneficio.valor,
        ativo: true
      };

      service.create(newBeneficio).subscribe(beneficio => {
        expect(beneficio.id).toBe(3);
        expect(beneficio.nome).toBe(newBeneficio.nome);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newBeneficio);
      req.flush(createdBeneficio);
    });
  });

  describe('update', () => {
    it('should update existing beneficio', () => {
      const updateData: BeneficioRequest = {
        nome: 'Updated Name',
        descricao: 'Updated Desc',
        valor: 1500,
        ativo: true
      };

      const updatedBeneficio: Beneficio = {
        id: 1,
        nome: updateData.nome,
        descricao: updateData.descricao,
        valor: updateData.valor,
        ativo: true
      };

      service.update(1, updateData).subscribe(beneficio => {
        expect(beneficio.id).toBe(1);
        expect(beneficio.nome).toBe('Updated Name');
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedBeneficio);
    });
  });

  describe('delete', () => {
    it('should delete beneficio', () => {
      service.delete(1).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('transferir', () => {
    it('should transfer value between beneficios', () => {
      const transferencia: TransferenciaRequest = {
        deId: 1,
        paraId: 2,
        valor: 100
      };

      service.transferir(transferencia).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${API_URL}/transferir`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(transferencia);
      req.flush(null);
    });

    it('should handle transfer error', () => {
      const transferencia: TransferenciaRequest = {
        deId: 1,
        paraId: 2,
        valor: 10000
      };

      service.transferir(transferencia).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${API_URL}/transferir`);
      req.flush({ message: 'Saldo insuficiente' }, { status: 400, statusText: 'Bad Request' });
    });
  });
});
