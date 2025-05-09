import { type TypesTableRecord } from "../recordTables";

export const defaultPersonalProfileTaxCoefficients = {
  1211: 0.5, // DPH, kolik % zboži, které nakoupím spadá do snížené sazby
  1221: 0.06, // Spotrebni dan mineralnich oleju, kolik procent prijmu domacnost utrati za pohonne hmoty
  1222: 0.01, // Spotrebni dan lihu, kolik procent prijmu domacnost utrati za tvrdy alkohol
  1223: 0.01, // Spotrebni dan piva, kolik procent prijmu domacnost utrati za pivo
  1224: 0.01, // Spotrebni dan vina, kolik procent prijmu domacnost utrati za vino
  1225: 0.01, // Spotrebni dan tabaku, kolik procent prijmu domacnost utrati za tabakove vyrobky
  1229: 0.01, // SpD - zahřív.tab.výr.
  1231: 0.02, // Daň z zem.pl. a plyn
  1232: 0.005, // Daň z pevných paliv
  1233: 0.03, // Daň z elektřiny
  1333: 0.005, // P za ulož.odpadů
  1111: 1, // Změstnanec - Příjem z daně z příjmů fyzických osob placené plátci	134,200,000,000	1111
  1612: 1, // Změstnanec - Příjem z pojistného na důchodové pojištění od zaměstnanců	151,829,546,160	1612
  1615: 1, // Změstnanec - Příjem z pojistného na nemocenské pojištění od zaměstnanců	13,934,565,703	1615
  1632: 1, // Změstnanec - Pojistné na veřejné zdravotní pojištění od zaměstnanců	78,649,574,500	1632
  1611: 1, // Zaměstnavatel - Poj.důchP zamv
  1614: 1, // Zaměstnavatel - Poj.nemP-zamv
  1617: 1, // Zaměstnavatel - Přísp. SPZ zamv
  1631: 1, // Zaměstnavatel - Poj.zdravP zamv
  1112: 0, // OSVC - Příjem z daně z příjmů fyzických osob placené poplatníky	12,000,000,000	1112
  1613: 0, // OSVC - Příjem z pojistného na důchodové pojištění od osob samostatně výdělečně činných	41,416,716,943	1613
  2361: 0, // OSVC - Příjem z pojistného na nemocenské pojištění od osob samostatně výdělečně činných	230,000,000	2361
  1633: 0, // OSVC - Pojistné na veřejné zdravotní pojištění od OSVČ	21,454,369,371	1633
  1618: 0, // OSVC - Příjem z příspěvků na státní politiku zaměstnanosti od osob samostatně výdělečně činných	1,774,251,716	1618
  1113: 0, // Daně z investic a bankovních účtů - Příjem z daně z příjmů fyzických osob vybírané srážkou podle zvláštní sazby daně	23,400,000,000	1113
  2362: 0, // Příjem z dobrovolného pojistného na důchodové pojištění	320,000,000	2362
  1121: 0.5, // dane z prijmu pravnickych osob, daněný zisk řetězců podniků odhaduju jako 50 % spotřebitelských tržeb
} as const;

export type PersonalProfileTaxCoefficients = Record<
  keyof typeof defaultPersonalProfileTaxCoefficients | string,
  number
>;

export type PersonalProfile = {
  netIncome: number;
  taxCredit: number;
  incomeTaxCoefficients: PersonalProfileTaxCoefficients;
};

export type PersonalIncome = {
  perceivedNetIncome: number;
  indirectTaxes: number;
  payrollDeduction: number;
  employerContributions: number;
  generalContributions: number;
  totalStateContributions: number;
};

export function getPersonalIncome(
  items: Record<string, number>,
  typesTable: Record<string, TypesTableRecord>,
  profile: PersonalProfile
): PersonalIncome {
  const defaultPersonalIncome: PersonalIncome = {
    perceivedNetIncome: profile.netIncome,
    indirectTaxes: 0,
    payrollDeduction: 0,
    employerContributions: 0,
    generalContributions: 0,
    totalStateContributions: 0,
  };

  // dan z prijmu pravnickych osob
  const applyCorporateIncomeTaxes = applyIndirectTaxes(
    Object.entries(items)
      .filter(([typeId]) => typesTable[typeId]?.income_type === "podniky")
      .map(([typeId, taxStateIncome]) => {
        const coefficient = profile.incomeTaxCoefficients[typeId];
        if (coefficient === undefined) {
          throw new Error(
            `Missing personal profile income coefficient for income type ${typeId}`
          );
        }
        return {
          origTax: 0.21 * coefficient,
          newTax: 0.21 * coefficient,
          volume: 1,
          taxStateIncome,
          standardVolume: 1,
        };
      })
  );

  // spotrebni dane
  const applyExciseTaxes = applyIndirectTaxes(
    Object.entries(items)
      .filter(([typeId]) => typesTable[typeId]?.income_type === "spotrebni")
      .map(([typeId, taxStateIncome]) => {
        const coefficient = profile.incomeTaxCoefficients[typeId];
        if (coefficient === undefined) {
          throw new Error(
            `Missing personal profile income coefficient for income type ${typeId}`
          );
        }
        const percentage = typesTable[typeId]?.percentage;
        if (percentage === undefined) {
          throw new Error(`Missing tax percentage for income type ${typeId}`);
        }
        return {
          origTax: percentage,
          newTax: percentage,
          volume: coefficient,
          taxStateIncome: taxStateIncome,
          standardVolume: coefficient, // TBD
        };
      })
  );

  // DPH
  const applyVat = applyIndirectTaxes(
    Object.entries(items)
      .filter(([typeId]) => typesTable[typeId]?.income_type === "dph")
      .flatMap(([typeId, taxStateIncome]) => {
        const coefficient = profile.incomeTaxCoefficients[typeId];
        if (coefficient === undefined) {
          throw new Error(
            `Missing personal profile income coefficient for income type ${typeId}`
          );
        }
        const percentage = typesTable[typeId]?.percentage;
        if (percentage === undefined) {
          throw new Error(`Missing tax percentage for income type ${typeId}`);
        }
        return [
          {
            origTax: percentage,
            newTax: percentage,
            volume: 0.95 * (1 - coefficient),
            taxStateIncome: taxStateIncome * 0.95 * (1 - 0.5),
            standardVolume: 0.5,
          }, // DPH zakladni sazba
          {
            origTax: (percentage / 21) * 12,
            newTax: (percentage / 21) * 12,
            volume: 0.95 * coefficient,
            taxStateIncome: taxStateIncome * 0.95 * 0.45,
            standardVolume: 0.45,
          }, // DPH snizena sazba
        ];
      })
  );

  // odvody zamestnance / OSVC
  const applyPayrollDeductions = applyPayrollDeduction(
    profile.taxCredit,
    Object.entries(items)
      .filter(([typeId]) => typesTable[typeId]?.income_type === "os.prijem")
      .map(([typeId, taxStateIncome]) => {
        const coefficient = profile.incomeTaxCoefficients[typeId];
        if (coefficient === undefined) {
          throw new Error(
            `Missing personal profile income coefficient for income type ${typeId}`
          );
        }
        const percentage = typesTable[typeId]?.percentage;
        if (percentage === undefined) {
          throw new Error(`Missing tax percentage for income type ${typeId}`);
        }
        return {
          taxesPerc: percentage * coefficient,
          taxStateIncome,
        };
      })
  );

  // odvody zamestnavatele
  const applyEmployerContributions = applyEmployerContribution(
    Object.entries(items)
      .filter(([typeId]) => typesTable[typeId]?.income_type === "zamestnavatel")
      .map(([typeId, taxStateIncome]) => {
        const coefficient = profile.incomeTaxCoefficients[typeId];
        if (coefficient === undefined) {
          throw new Error(
            `Missing personal profile income coefficient for income type ${typeId}`
          );
        }
        const percentage = typesTable[typeId]?.percentage;
        if (percentage === undefined) {
          throw new Error(`Missing tax percentage for income type ${typeId}`);
        }

        return {
          taxesPerc: percentage * coefficient,
          taxStateIncome,
        };
      })
  );

  // ostatni odvody
  const applyGeneralContributions = applyGeneralContribution(
    Object.entries(items)
      .filter(([typeId]) => typesTable[typeId]?.income_type === "pausal")
      .map(([, taxStateContribution]) => {
        return taxStateContribution;
      })
  );

  return compose(
    applyCorporateIncomeTaxes,
    applyExciseTaxes,
    applyVat,
    applyPayrollDeductions,
    applyEmployerContributions,
    applyGeneralContributions
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
  taxStateIncome: number;
  standardVolume: number;
};

/**
 * Spotřební daně a Daň s přidané hodnoty (DPH)
 */
export const applyIndirectTaxes =
  (inputs: Array<IndirectTaxesInput>): PersonalIncomeDecorator =>
  (personalIncome) => {
    const netIncomeOrig = personalIncome.perceivedNetIncome;

    const totalVolume = inputs.reduce((acc, input) => acc + input.volume, 0);
    const totalStandardVolume = inputs.reduce(
      (acc, input) => acc + input.standardVolume,
      0
    );
    const weightedAvgTaxPercOrig = inputs.reduce(
      (acc, input) => acc + input.origTax * (input.volume / totalVolume),
      0
    );
    const weightedAvgTaxPercNew = inputs.reduce(
      (acc, input) => acc + input.newTax * (input.volume / totalVolume),
      0
    );
    const taxesStateIncome = inputs.reduce(
      (acc, input) => acc + input.taxStateIncome,
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

    const ratio = totalVolume / totalStandardVolume;
    const newTotalStateContributions = taxesStateIncome * ratio;

    return {
      ...personalIncome,
      perceivedNetIncome,
      indirectTaxes: personalIncome.indirectTaxes + newIndirectTaxes,
      totalStateContributions:
        personalIncome.totalStateContributions + newTotalStateContributions,
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

type PayrollDeductionInput = {
  taxesPerc: number;
  taxStateIncome: number;
};

/**
 * Odvody placené zaměstnancem (Daně z příjmů a Pojištění placené zaměstnancem)
 */
export const applyPayrollDeduction =
  (
    taxCredit: number,
    inputs: Array<PayrollDeductionInput> // in decimal point number, e.g. 0.16 for 16 %
  ): PersonalIncomeDecorator =>
  (personalIncome) => {
    const netIncomeOrig = Math.max(
      personalIncome.perceivedNetIncome - taxCredit,
      0
    );
    const taxPerc = inputs.reduce((acc, input) => acc + input.taxesPerc, 0);
    const newTotalStateContributions = inputs.reduce(
      (acc, input) => acc + input.taxStateIncome,
      0
    );

    const newPayrollDeduction = (netIncomeOrig / (1 - taxPerc)) * taxPerc;

    return {
      ...personalIncome,
      payrollDeduction: personalIncome.payrollDeduction + newPayrollDeduction,
      totalStateContributions:
        personalIncome.totalStateContributions + newTotalStateContributions,
    };
  };

type EmployerContributionInput = {
  taxesPerc: number;
  taxStateIncome: number;
};

/**
 * Odvody placené zaměstnavatelem (Pojištění placené zaměstnavatelem)
 */
export const applyEmployerContribution =
  (
    inputs: Array<EmployerContributionInput> // in decimal point number, e.g. 0.16 for 16 %
  ): PersonalIncomeDecorator =>
  (personalIncome) => {
    const grossIncome =
      personalIncome.perceivedNetIncome + personalIncome.payrollDeduction;
    const taxPerc = inputs.reduce((acc, input) => acc + input.taxesPerc, 0);

    const newTotalStateContributions = inputs.reduce(
      (acc, input) => acc + input.taxStateIncome,
      0
    );

    const employerContributions = grossIncome * taxPerc;

    return {
      ...personalIncome,
      employerContributions:
        personalIncome.employerContributions + employerContributions,
      totalStateContributions:
        personalIncome.totalStateContributions + newTotalStateContributions,
    };
  };

/**
 * všechny ostatní odvody
 */
export const applyGeneralContribution =
  (taxStateIncomes: Array<number>): PersonalIncomeDecorator =>
  (personalIncome) => {
    const totalStateContributions = personalIncome.totalStateContributions;
    const totalPersonalContributions =
      12 * // months
      (personalIncome.indirectTaxes +
        personalIncome.payrollDeduction +
        personalIncome.employerContributions);

    const ratio = totalPersonalContributions / totalStateContributions;

    const taxStateIncome = taxStateIncomes.reduce(
      (acc, taxStateIncome) => acc + taxStateIncome,
      0
    );
    const generalContributions = taxStateIncome * ratio;

    return {
      ...personalIncome,
      generalContributions:
        personalIncome.generalContributions + generalContributions,
    };
  };
