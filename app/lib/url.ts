// Защищает от подстановки опасных схем (javascript:, data:) в href:
// в ссылку попадает только http(s)-URL, иначе безопасный "#".
export function safeHref(value: string | undefined | null): string {
  return value && /^https?:\/\//i.test(value.trim()) ? value : "#";
}
