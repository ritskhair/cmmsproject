export default function SearchEquipmentField() {
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
        Search equipment
      </div>

      <div
        style={{
          height: "44px",
          paddingLeft: "14px",
          paddingRight: "14px",
          background: "#EBE8E3",
          overflow: "hidden",
          borderRadius: "10px",
          outline: "1px solid #CCC9C4",
          outlineOffset: "-1px",
          display: "inline-flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#807D78",
            fontSize: "13px",
            fontFamily: "Inter",
            fontWeight: 400,
            overflowWrap: "break-word",
          }}
        >
          Search...
        </div>
      </div>
    </div>
  );
}