export default function SidebarButton() {
  return (
    <div
      style={{
        width: "212px",
        height: "42px",
        padding: "10px",
        background: "#681813",
        overflow: "hidden",
        borderRadius: "8px",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "8px",
        display: "inline-flex",
      }}
    >
      <div
        style={{
          flex: "1 1 0",
          color: "#C9A227",
          fontSize: "12px",
          fontFamily: "Inter",
          fontWeight: 700,
          overflowWrap: "break-word",
        }}
      >
        •
      </div>

      <div
        style={{
          flex: "1 1 0",
          color: "white",
          fontSize: "12px",
          fontFamily: "Inter",
          fontWeight: 700,
          overflowWrap: "break-word",
        }}
      >
        Work Orders
      </div>
    </div>
  );
}