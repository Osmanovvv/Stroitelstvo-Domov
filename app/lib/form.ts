export function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export function num(formData: FormData, key: string): number {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : 0;
}

export function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}
