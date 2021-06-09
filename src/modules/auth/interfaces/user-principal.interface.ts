export interface UserPrincipal {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
  readonly login: string;
  readonly roles: string;
}
