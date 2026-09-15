import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside>
      <button onClick={() => navigate("/dashboard")}>
        Dashboard
      </button>

      <button onClick={() => navigate("/work-orders")}>
        Work Orders
      </button>

      <button onClick={() => navigate("/equipment")}>
        Equipment
      </button>
    </aside>
  );
}