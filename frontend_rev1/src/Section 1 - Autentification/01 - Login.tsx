import React from "react";

export default function LoginPage() {
  return (
    <div
      style={{
        width: "1440px",
        height: "900px",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "1440px",
          height: "900px",
          position: "absolute",
          left: 0,
          top: 0,
          background: "#F8F7F5",
          overflow: "hidden",
          borderRadius: "20px",
          display: "inline-flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        {/* Panel kiri */}
        <div
          style={{
            width: "520px",
            height: "900px",
            paddingLeft: "64px",
            paddingRight: "64px",
            background: "#681813",
            overflow: "hidden",
            borderRadius: "20px",
            display: "inline-flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "30px",
          }}
        >
          <div
            style={{
              alignSelf: "stretch",
              color: "white",
              fontSize: "44px",
              fontFamily: "Inter",
              fontWeight: 700,
              overflowWrap: "break-word",
            }}
          >
            CMMS
          </div>

          <div
            style={{
              alignSelf: "stretch",
              color: "#E3C770",
              fontSize: "11px",
              fontFamily: "Inter",
              fontWeight: 700,
              overflowWrap: "break-word",
            }}
          >
            MAINTENANCE MANAGEMENT SYSTEM
          </div>

          <div
            style={{
              alignSelf: "stretch",
              color: "white",
              fontSize: "28px",
              fontFamily: "Inter",
              fontWeight: 700,
              overflowWrap: "break-word",
            }}
          >
            Control your assets.
            <br />
            Prevent downtime.
            <br />
            Improve reliability.
          </div>

          <div
            style={{
              alignSelf: "stretch",
              color: "#EBE0D1",
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: 400,
              overflowWrap: "break-word",
            }}
          >
            A connected workspace for engineering, maintenance and asset
            performance.
          </div>
        </div>

        {/* Panel kanan */}
        <div
          style={{
            width: "920px",
            height: "900px",
            paddingTop: "120px",
            paddingBottom: "80px",
            paddingLeft: "110px",
            paddingRight: "110px",
            background: "white",
            overflow: "hidden",
            borderRadius: "20px",
            display: "inline-flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div
            style={{
              alignSelf: "stretch",
              color: "#681813",
              fontSize: "30px",
              fontFamily: "Inter",
              fontWeight: 700,
              overflowWrap: "break-word",
            }}
          >
            Welcome back
          </div>

          <div
            style={{
              alignSelf: "stretch",
              color: "#595752",
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: 400,
              overflowWrap: "break-word",
            }}
          >
            Sign in to continue to your maintenance workspace.
          </div>

          {/* Form login */}
          <div
            style={{
              alignSelf: "stretch",
              background: "white",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "30px",
            }}
          >
            {/* Email */}
            <div
              style={{
                width: "700px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "7px",
              }}
            >
              <div
                style={{
                  alignSelf: "stretch",
                  color: "#595752",
                  fontSize: "12px",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  overflowWrap: "break-word",
                }}
              >
                Email address
              </div>

              <div
                style={{
                  alignSelf: "stretch",
                  height: "48px",
                  padding: "14px",
                  background: "white",
                  overflow: "hidden",
                  borderRadius: "10px",
                  outline: "1px solid #D5D2CC",
                  outlineOffset: "-1px",
                  display: "inline-flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    flex: "1 1 0",
                    color: "#595752",
                    fontSize: "14px",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    overflowWrap: "break-word",
                  }}
                >
                  name@company.com
                </div>
              </div>
            </div>

            {/* Password */}
            <div
              style={{
                width: "700px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "7px",
              }}
            >
              <div
                style={{
                  alignSelf: "stretch",
                  color: "#595752",
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
                  alignSelf: "stretch",
                  height: "48px",
                  padding: "14px",
                  background: "white",
                  overflow: "hidden",
                  borderRadius: "10px",
                  outline: "1px solid #D5D2CC",
                  outlineOffset: "-1px",
                  display: "inline-flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    flex: "1 1 0",
                    color: "#595752",
                    fontSize: "14px",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    overflowWrap: "break-word",
                  }}
                >
                  ••••••••••
                </div>
              </div>
            </div>

            {/* Remember me dan Forgot password */}
            <div
              style={{
                alignSelf: "stretch",
                background: "white",
                overflow: "hidden",
                display: "inline-flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "50px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "19px",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                    background: "white",
                    borderRadius: "5px",
                    border: "1px solid #681813",
                  }}
                ></div>

                <div
                  style={{
                    color: "#211F1D",
                    fontSize: "13px",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    overflowWrap: "break-word",
                  }}
                >
                  Remember me
                </div>
              </div>

              <div
                style={{
                  width: "200px",
                  color: "#C9A227",
                  fontSize: "12px",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  overflowWrap: "break-word",
                }}
              >
                Forgot password?
              </div>
            </div>

            {/* Tombol login */}
            <div
              style={{
                display: "inline-flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "30px",
              }}
            >
              {/* Sign in */}
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
                  Sign in
                </div>
              </div>

              {/* Login as Guest */}
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
                  Login as Guest
                </div>
              </div>
            </div>
          </div>

          {/* Register */}
          <div
            style={{
              alignSelf: "stretch",
              color: "#C9A227",
              fontSize: "12px",
              fontFamily: "Inter",
              fontWeight: 700,
              overflowWrap: "break-word",
            }}
          >
            New to CMMS? &nbsp; Create an account
          </div>

          {/* Footer */}
          <div
            style={{
              alignSelf: "stretch",
              color: "#595752",
              fontSize: "11px",
              fontFamily: "Inter",
              fontWeight: 400,
              overflowWrap: "break-word",
            }}
          >
            © 2026 CMMS • Engineering Maintenance
          </div>
        </div>
      </div>
    </div>
  );
}