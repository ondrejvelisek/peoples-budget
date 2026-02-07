export const getBudgetFile = async (budgetName: string, fileName: string) => {
  const csvModules = import.meta.glob<string>("./*/*.csv", {
    query: "?raw",
    import: "default",
  });
  const csvData = await csvModules[`./${budgetName}/${fileName}.csv`]?.();
  if (!csvData) {
    throw new Error(
      `Budget CSV data not found for ${budgetName}/${fileName}.csv`
    );
  }
  return csvData;
};
