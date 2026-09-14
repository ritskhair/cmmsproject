export default function ButtonCreateWorkOrder() {
  return (
    <div
      style={{
        width: "180px",
        height: "48px",
        position: "relative",
        background: "#681813",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "26px",
          top: "15px",
          color: "white",
          fontSize: "14px",
          fontFamily: "Inter",
          fontWeight: 700,
          overflowWrap: "break-word",
        }}
      >
        Create Work Order
      </div>
    </div>
  );
}