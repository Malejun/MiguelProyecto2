export const clean =
  (...properties) =>
  (data) => {
    const result = { ...data };

    for (const property of properties) {
      delete result[property];
    }

    return result;
  };

export const isString = (value) => {
  if (typeof value === "string") return value;
  return JSON.stringify(value);
};

export const catcher = (fn, { exceptionCase } = {}) => async (...params) => {
    try {
      return {
        ok: true,
        content: await fn(...params),
      };
    } catch (error) {
      console.log(`> [${fn.name} error]: ${error.message}`);
      return {
        ok: false,
        content: exceptionCase
      };
    }
  };

