import AppError from "../errors/AppError.js";

type FilterParser<T> = (value: unknown, field: string) => T;
type FilterSchema = Record<string, FilterParser<unknown>>;
export type ParsedFilters<S extends FilterSchema> = {
  [K in keyof S]?: ReturnType<S[K]>;
};

export const stringFilter = (options: {
  maxLength: number;
  allowEmpty?: boolean;
  pattern?: RegExp;
}): FilterParser<string> => (value, field) => {
  if (typeof value !== "string") {
    throw new AppError(`${field} must be a single string`, 400);
  }
  const text = value.trim();
  if (!text && !options.allowEmpty) {
    throw new AppError(`${field} must not be empty`, 400);
  }
  if (text.length > options.maxLength) {
    throw new AppError(`${field} must be at most ${options.maxLength} characters`, 400);
  }
  if (options.pattern) {
    options.pattern.lastIndex = 0;
    if (!options.pattern.test(text)) throw new AppError(`${field} is invalid`, 400);
  }
  return text;
};

// Each module supplies its own parsers; pagination/sorting stay separate.
export const getQueryFilters = <S extends FilterSchema>(
  query: Record<string, unknown>,
  schema: S,
  otherAllowedKeys: readonly string[] = [],
): ParsedFilters<S> => {
  for (const key of Object.keys(query)) {
    if (!Object.hasOwn(schema, key) && !otherAllowedKeys.includes(key)) {
      throw new AppError("Unsupported query parameter", 400);
    }
  }
  const result: Record<string, unknown> = Object.create(null);
  for (const [key, parse] of Object.entries(schema)) {
    if (Object.hasOwn(query, key) && query[key] !== undefined) {
      result[key] = parse(query[key], key);
    }
  }
  return result as ParsedFilters<S>;
};
