import { Link } from "react-router-dom";

export default function OperatorChoice() {
  return (
    <section className="operator-choice-page">
      <div className="operator-choice-card">
        <p className="operator-eyebrow">Production Operator</p>
        <h1>Emergency Work Order</h1>
        <p className="operator-choice-description">
          Pilih aktivitas yang ingin Anda lakukan pada sistem EWO.
        </p>
        <div className="operator-choice-actions">
          <Link className="operator-choice-button operator-choice-primary" to="/operator/request">
            Request EWO
          </Link>
          <Link className="operator-choice-button operator-choice-secondary" to="/operator/approve">
            Approve EWO
          </Link>
        </div>
      </div>
    </section>
  );
}
