/**
 * Interface para representar um Beneficio
 */
export interface Beneficio {
  id?: number;
  nome: string;
  descricao?: string;
  valor: number;
  ativo: boolean;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interface para criar/atualizar beneficio
 */
export interface BeneficioRequest {
  nome: string;
  descricao?: string;
  valor: number;
  ativo?: boolean;
}

/**
 * Interface para transferência
 */
export interface TransferenciaRequest {
  deId: number;
  paraId: number;
  valor: number;
}
