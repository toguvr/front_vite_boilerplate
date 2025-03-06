export interface StateProps {
  [key: string]: any;
}

export type SelectProps = {
  label: string;
  value: string;
};

export interface User {
  id: string;
  name: string;
  cellphone: string;
  logo_url: string;
  avatar: string;
  avatar_url: string;
  verified: boolean;
  email: string;
  cpf: string;
  rg: string;
  street: string;
  complemento: string;
  number: string;
  cep: string;
  bairro: string;
  cidade: string;
  expoToken: string;
  uf: string;
  created_at: Date;
  updated_at: Date;
}
