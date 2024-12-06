import type { IncomeItem } from "./incomes";

export type PersonalIncome = {
  perceivedNetIncome: number;
  indirectTaxes: number;
  payrollDeduction: number;
  employerContributions: number;
};

export function getPersonalIncome(
  incomeByTypes: Array<IncomeItem>,
  netIncome: number
): PersonalIncome {
  const defaultPersonalIncome: PersonalIncome = {
    perceivedNetIncome: netIncome,
    indirectTaxes: 0,
    payrollDeduction: 0,
    employerContributions: 0,
  };

  return compose(
    applyIndirectTaxes([
      { origTax: 0.32, newTax: 0.32, volume: 0.06 }, // pohonne hmoty
      { origTax: 0.55, newTax: 0.55, volume: 0.01 }, // cigarety
      { origTax: 0.28, newTax: 0.28, volume: 0.01 }, // lih
      { origTax: 0.5, newTax: 0.5, volume: 0.01 }, // pivo
      { origTax: 0.27, newTax: 0.27, volume: 0.01 }, // el. cigarety
    ]),
    applyIndirectTaxes([
      { origTax: 0.21, newTax: 0.21, volume: 0.5 }, // DPH zakladni sazba
      { origTax: 0.12, newTax: 0.12, volume: 0.45 }, // DPH snizena sazba
    ]),
    applyPayrollDeductions(0.065 + 0.006 + 0.045 + 0.15),
    applyTaxCredit(2570),
    applyEmployerContributions(0.215 + 0.021 + 0.012 + 0.09)
  )(defaultPersonalIncome);
}

type PersonalIncomeDecorator = (
  personalIncome: PersonalIncome
) => PersonalIncome;

// Compose function to combine multiple decorators
function compose(
  ...decorators: PersonalIncomeDecorator[]
): PersonalIncomeDecorator {
  return (initialPersonalIncome: PersonalIncome) => {
    return decorators.reduce((personalIncome, decorator) => {
      const newPersonalIncome = decorator(personalIncome);
      return newPersonalIncome;
    }, initialPersonalIncome);
  };
}

type IndirectTaxesInput = {
  origTax: number;
  newTax: number;
  volume: number;
};

/**
 * Spotřební daně a Daň s přidané hodnoty (DPH)
 */
export const applyIndirectTaxes =
  (inputs: Array<IndirectTaxesInput>): PersonalIncomeDecorator =>
  (personalIncome) => {
    const netIncomeOrig = personalIncome.perceivedNetIncome;

    const totalVolume = inputs.reduce((acc, input) => acc + input.volume, 0);
    const weightedAvgTaxPercOrig = inputs.reduce(
      (acc, input) => acc + input.origTax * (input.volume / totalVolume),
      0
    );
    const weightedAvgTaxPercNew = inputs.reduce(
      (acc, input) => acc + input.newTax * (input.volume / totalVolume),
      0
    );

    const taxedNetIncome = netIncomeOrig * totalVolume;
    const untaxedNetIncome = netIncomeOrig - taxedNetIncome;

    const perceivedNetIncome =
      untaxedNetIncome +
      getPerceivedNetIncomeWithNewIndirectTax(
        taxedNetIncome,
        weightedAvgTaxPercOrig,
        weightedAvgTaxPercNew
      );

    const maximalPerceivedNetIncome =
      untaxedNetIncome +
      getPerceivedNetIncomeWithNewIndirectTax(
        taxedNetIncome,
        weightedAvgTaxPercOrig,
        0
      );

    const newIndirectTaxes = maximalPerceivedNetIncome - perceivedNetIncome;

    return {
      ...personalIncome,
      perceivedNetIncome,
      indirectTaxes: personalIncome.indirectTaxes + newIndirectTaxes,
    };
  };

const getPerceivedNetIncomeWithNewIndirectTax = (
  origNetIncome: number,
  origTaxPerc: number,
  newTaxPerc: number
): number => {
  const origProductPrice = origNetIncome;
  const productPriceWithoutTax = origProductPrice / (1 + origTaxPerc);
  const productPriceWithNewTax = productPriceWithoutTax * (1 + newTaxPerc);

  const productVolumeWithNewTax = origNetIncome / productPriceWithNewTax;

  const productVolumeWithNewTaxOrigPrice =
    origProductPrice * productVolumeWithNewTax;

  const perceivedNetIncomeWithNewTax = productVolumeWithNewTaxOrigPrice;

  return perceivedNetIncomeWithNewTax;
};

/**
 * Odvody placené zaměstnancem (Daně z příjmů a Pojištění placené zaměstnancem)
 */
export const applyPayrollDeductions =
  (
    taxPerc: number // in decimal point number, e.g. 0.16 for 16 %
  ): PersonalIncomeDecorator =>
  (personalIncome) => {
    const netIncomeOrig = personalIncome.perceivedNetIncome;

    const newPayrollDeduction = (netIncomeOrig / (1 - taxPerc)) * taxPerc;

    return {
      ...personalIncome,
      payrollDeduction: personalIncome.payrollDeduction + newPayrollDeduction,
    };
  };

/**
 * Sleva na dani (např na polatníka)
 */
export const applyTaxCredit =
  (
    taxCredit: number // in absolute number
  ): PersonalIncomeDecorator =>
  (personalIncome) => {
    return {
      ...personalIncome,
      payrollDeduction: personalIncome.payrollDeduction - taxCredit,
    };
  };

/**
 * Odvody placené zaměstnavatelem (Pojištění placené zaměstnavatelem)
 */
export const applyEmployerContributions =
  (
    taxPerc: number // in decimal point number, e.g. 0.16 for 16 %
  ): PersonalIncomeDecorator =>
  (personalIncome) => {
    const grossIncome =
      personalIncome.perceivedNetIncome + personalIncome.payrollDeduction;

    const employerContributions = grossIncome * taxPerc;

    return {
      ...personalIncome,
      employerContributions:
        personalIncome.employerContributions + employerContributions,
    };
  };

/**
 * všechny ostatní částky, které nezávisí na 
 */
export const applyGeneralContribution =
  (
    taxPerc: number // in decimal point number, e.g. 0.16 for 16 %
  ): PersonalIncomeDecorator =>
  (personalIncome) => {
    const grossIncome =
      personalIncome.perceivedNetIncome + personalIncome.payrollDeduction;

    const employerContributions = grossIncome * taxPerc;

    return {
      ...personalIncome,
      employerContributions:
        personalIncome.employerContributions + employerContributions,
    };
  };
