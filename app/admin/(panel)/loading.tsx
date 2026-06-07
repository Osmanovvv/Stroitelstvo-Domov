export default function PanelLoading() {
  return (
    <div className="admin-loading" aria-live="polite">
      <span className="admin-spinner" aria-hidden="true" />
      Загрузка…
    </div>
  );
}
