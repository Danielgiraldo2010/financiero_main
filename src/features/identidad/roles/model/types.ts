export interface Rol {
  id: string
  name: string
  normalizedName: string
  claims: string[]
}

export interface AsignarClaimCommand {
  roleName: string
  permission: string
}
