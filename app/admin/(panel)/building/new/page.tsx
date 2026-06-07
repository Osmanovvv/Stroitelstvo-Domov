import BuildingForm from "../BuildingForm";
import { createBuilding } from "../actions";

export default function NewBuilding() {
  return (
    <>
      <div className="admin-topbar"><h2>Новый объект</h2></div>
      <div className="admin-card">
        <BuildingForm action={createBuilding} />
      </div>
    </>
  );
}
