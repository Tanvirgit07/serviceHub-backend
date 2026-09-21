import AppError from "../errors/AppError.js";

export type Sorting<Field extends string> = {
  sortBy: Field;
  sortOrder: "asc" | "desc";
};

export const getSorting = <Field extends string>(
  query: { sortBy?: unknown; sortOrder?: unknown },
  allowedFields: readonly Field[],
  defaults: Sorting<Field>,
): Sorting<Field> => {
  const sortBy = query.sortBy ?? defaults.sortBy;
  const sortOrder = query.sortOrder ?? defaults.sortOrder;
  if (typeof sortBy !== "string" || !allowedFields.includes(sortBy as Field)) {
    throw new AppError(`sortBy must be one of: ${allowedFields.join(", ")}`, 400);
  }
  if (sortOrder !== "asc" && sortOrder !== "desc") {
    throw new AppError("sortOrder must be asc or desc", 400);
  }
  return { sortBy: sortBy as Field, sortOrder };
};
