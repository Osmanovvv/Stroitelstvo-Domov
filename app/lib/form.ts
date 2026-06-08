export function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

// Безопасное сужение значения FormData до File (поле type=file) без приведения as.
export function file(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File ? value : null;
}
