import Link from "next/link";

// Чекбокс согласия на обработку ПДн (ст. 9 152-ФЗ): обязателен в каждой форме,
// собирающей имя/телефон, и по умолчанию снят — согласие должно быть активным
// действием посетителя. required даёт нативную браузерную подсказку при попытке
// отправить форму без отметки.
export default function ConsentField() {
  return (
    <label className="consent-field">
      <input type="checkbox" name="consent" required />
      <span>
        Отправляя форму, я подтверждаю, что ознакомлен(а) с{" "}
        <Link href="/privacy" target="_blank" rel="noreferrer">
          Политикой обработки персональных данных
        </Link>{" "}
        и даю{" "}
        <Link href="/consent" target="_blank" rel="noreferrer">
          согласие на обработку моих персональных данных
        </Link>
      </span>
    </label>
  );
}
