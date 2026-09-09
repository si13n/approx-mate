export type B2BZUSProfile = "ulgaNaStart" | "preferential" | "full"
export type UoPKUPType = "standard" | "commuter"
export interface TaxProfile {
  b2b: { ryczaltRate: number; zusProfile: B2BZUSProfile; /** Historical storage key. */ sicknesInsurance: boolean }
  uop: { kupType: UoPKUPType; ppkEnabled: boolean }
}
export interface TaxBracket { readonly maxAnnual: number; readonly rate: number }
export interface TaxYearRules {
  readonly year: number
  readonly effectiveFrom: string
  readonly effectiveTo: string
  readonly verifiedOn: string
  readonly b2b: {
    readonly ryczaltRates: readonly number[]
    readonly defaultRate: number
    readonly zus: Readonly<Record<B2BZUSProfile, { readonly socialMonthly: number; readonly sicknessMonthly: number; readonly labourFundMonthly: number }>>
    readonly health: readonly { readonly maxAnnual: number; readonly monthly: number }[]
    readonly healthDeductionFraction: number
  }
  readonly uop: {
    readonly taxBrackets: readonly TaxBracket[]
    readonly taxReductionAmount: number
    readonly socialContributions: { readonly pension: number; readonly disability: number; readonly sickness: number }
    readonly healthRate: number
    readonly socialContributionAnnualLimit: number
    readonly kup: Readonly<Record<UoPKUPType, number>>
    readonly ppk: { readonly employeeContribution: number; readonly employerContribution: number }
    readonly healthCapReference: { readonly lowerRate: number; readonly upperRate: number; readonly threshold: number; readonly monthlyReduction: number }
  }
  readonly sources: Readonly<Record<string, string>>
}
