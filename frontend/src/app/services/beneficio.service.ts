import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Beneficio, BeneficioRequest, TransferenciaRequest } from '../models/beneficio.model';

/**
 * Serviço para comunicação com API de benefícios
 */
@Injectable({
  providedIn: 'root'
})
export class BeneficioService {
  private readonly API_URL = 'http://localhost:8080/api/v1/beneficios';

  constructor(private http: HttpClient) {}

  /**
   * Lista todos os benefícios
   */
  findAll(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /**
   * Lista benefícios ativos
   */
  findAllAtivos(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(`${this.API_URL}/ativos`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Busca benefício por ID
   */
  findById(id: number): Observable<Beneficio> {
    return this.http.get<Beneficio>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Cria novo benefício
   */
  create(beneficio: BeneficioRequest): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.API_URL, beneficio)
      .pipe(catchError(this.handleError));
  }

  /**
   * Atualiza benefício
   */
  update(id: number, beneficio: BeneficioRequest): Observable<Beneficio> {
    return this.http.put<Beneficio>(`${this.API_URL}/${id}`, beneficio)
      .pipe(catchError(this.handleError));
  }

  /**
   * Deleta (desativa) benefício
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Transfere valor entre benefícios
   */
  transferir(transferencia: TransferenciaRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/transferir`, transferencia)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handler de erros HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = error.error?.message ||
                    `Erro ${error.status}: ${error.statusText}`;
    }

    console.error('Erro na requisição:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
