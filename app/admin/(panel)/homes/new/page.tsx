import HomeForm from "../HomeForm";
import { createHome } from "../actions";

export default function NewHome() {
  return (
    <>
      <div className="admin-topbar"><h2>Новый дом</h2></div>
      <div className="admin-card">
        <HomeForm action={createHome} />
      </div>
    </>
  );
}
