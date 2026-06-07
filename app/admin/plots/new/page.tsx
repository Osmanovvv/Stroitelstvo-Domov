import PlotForm from "../PlotForm";
import { createPlot } from "../actions";

export default function NewPlot() {
  return (
    <>
      <div className="admin-topbar"><h2>Новый участок</h2></div>
      <div className="admin-card">
        <PlotForm action={createPlot} />
      </div>
    </>
  );
}
