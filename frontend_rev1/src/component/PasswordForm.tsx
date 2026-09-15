export default function PasswordForm() {
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
        Password
      </div>

      <div
        style={{
          height: "44px",
          paddingLeft: "14px",
          paddingRight: "14px",
          background: "white",
          overflow: "hidden",
          borderRadius: "10px",
          outline: "1px solid #B42318",
          outlineOffset: "-1px",
          display: "inline-flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      ></div>
    </div>
  );
}