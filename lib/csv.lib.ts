const validateCSVColumns = async (file: File, requiredColumns: string[]): Promise<{ isValid: boolean; columns: string[]; missingColumns: string[] }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const firstLine = text.split('\n')[0];
      const columns = firstLine
        .split(',')
        .map(col => col.trim().replace(/^"|"$/g, ''));

      const missingColumns = requiredColumns.filter(
        col => !columns.includes(col)
      );

      resolve({
        isValid: missingColumns.length === 0,
        columns,
        missingColumns,
      });
    };

    reader.onerror = () => {
      resolve({
        isValid: false,
        columns: [],
        missingColumns: requiredColumns,
      });
    };

    reader.readAsText(file.slice(0, 1000));
  });
};

export { validateCSVColumns };
