export default function WorkOrderIdForm() {
  return (
    <div
      style={{
        width: "280px",
        height: "86px",
        overflow: "hidden",
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: "7px",
      }}
    >
      <div
        style={{
          color: "#4A4745",
          fontSize: "12px",
          fontFamily: "Inter",
          fontWeight: 700,
          overflowWrap: "break-word",
        }}
      >
        Work Order ID
      </div>

      <div
        style={{
          height: "44px",
          paddingLeft: "14px",
          paddingRight: "14px",
          background: "white",
          overflow: "hidden",
          borderRadius: "10px",
          outline: "2px solid #C9A227",
          outlineOffset: "-2px",
          display: "inline-flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#33302E",
            fontSize: "13px",
            fontFamily: "Inter",
            fontWeight: 400,
            overflowWrap: "break-word",
          }}
        >
          WO-2026-001
        </div>
      </div>
    </div>
  );
}