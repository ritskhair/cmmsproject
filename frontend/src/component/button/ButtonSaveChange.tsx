export default function ButtonSaveChanges() {
  return (
    <div
      style={{
        width: "180px",
        height: "48px",
        position: "relative",
        background: "white",
        borderRadius: "10px",
        outline: "1px solid #C9A227",
        outlineOffset: "-1px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "20px",
          top: "15px",
          color: "#681813",
          fontSize: "14px",
          fontFamily: "Inter",
          fontWeight: 700,
          overflowWrap: "break-word",
        }}
      >
        Save Changes
      </div>
    </div>
  );
}