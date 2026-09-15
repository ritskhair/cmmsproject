export default function SuccessLogin() {
  return (
    <div
      style={{
        padding: "32px",
        background: "white",
        borderRadius: "10px",
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "32px",
      }}
    >
      {/* Ikon berhasil */}
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: "4px",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            background: "#EBF8F1",
            borderRadius: "9999px",
          }}
        ></div>

        <div
          style={{
            width: "54px",
            height: "54px",
            position: "absolute",
            left: "23px",
            top: "23px",
            background: "#19AC6C",
          }}
        ></div>
      </div>

      {/* Pesan berhasil */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            color: "#19AC6C",
            fontSize: "24px",
            fontFamily: "Inter",
            fontWeight: 700,
            overflowWrap: "break-word",
          }}
        >
          Berhasil
        </div>

        <div
          style={{
            width: "350px",
            textAlign: "center",
            color: "#4D4D4D",
            fontSize: "16px",
            fontFamily: "Inter",
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: "0.05px",
            overflowWrap: "break-word",
          }}
        >
          Login berhasil dilakukan, silahkan
          <br />
          memulai sesi anda
        </div>
      </div>
    </div>
  );
}