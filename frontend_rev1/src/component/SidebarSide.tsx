export default function SidebarSide() {
  return (
    <div
      style={{
        width: "248px",
        height: "900px",
        paddingTop: "28px",
        paddingBottom: "20px",
        paddingLeft: "18px",
        paddingRight: "18px",
        background: "#681813",
        overflow: "hidden",
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {/* Logo dan Navigasi */}
      <div
        style={{
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        {/* Logo CMMS */}
        <div
          style={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
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
            CMMS
          </div>

          <div
            style={{
              alignSelf: "stretch",
              color: "#E3C770",
              fontSize: "9px",
              fontFamily: "Inter",
              fontWeight: 700,
              overflowWrap: "break-word",
            }}
          >
            MAINTENANCE MANAGEMENT
          </div>
        </div>

        {/* Menu Navigasi */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          {/* Dashboard */}
          <div
            style={{
              width: "212px",
              height: "42px",
              padding: "10px",
              background: "#87241C",
              overflow: "hidden",
              borderRadius: "8px",
              outline: "1px solid #C9A227",
              outlineOffset: "-1px",
              display: "inline-flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "8px",
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
              Dashboard
            </div>
          </div>

          {/* Work Orders */}
          <div
            style={{
              width: "212px",
              height: "42px",
              padding: "10px",
              background: "#681813",
              overflow: "hidden",
              borderRadius: "8px",
              display: "inline-flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "8px",
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

          {/* Equipment */}
          <div
            style={{
              width: "212px",
              height: "42px",
              padding: "10px",
              background: "#681813",
              overflow: "hidden",
              borderRadius: "8px",
              display: "inline-flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "8px",
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
              Equipment
            </div>
          </div>

          {/* Preventive Maintenance */}
          <div
            style={{
              width: "212px",
              height: "42px",
              padding: "10px",
              background: "#681813",
              overflow: "hidden",
              borderRadius: "8px",
              display: "inline-flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "8px",
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
              Preventive Maintenance
            </div>
          </div>

          {/* Spare Parts */}
          <div
            style={{
              width: "212px",
              height: "42px",
              padding: "10px",
              background: "#681813",
              overflow: "hidden",
              borderRadius: "8px",
              display: "inline-flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "8px",
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
              Spare Parts
            </div>
          </div>

          {/* Maintenance Calendar */}
          <div
            style={{
              width: "212px",
              height: "42px",
              padding: "10px",
              background: "#681813",
              overflow: "hidden",
              borderRadius: "8px",
              display: "inline-flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "8px",
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
              Maintenance Calendar
            </div>
          </div>

          {/* Reports */}
          <div
            style={{
              width: "212px",
              height: "42px",
              padding: "10px",
              background: "#681813",
              overflow: "hidden",
              borderRadius: "8px",
              display: "inline-flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "8px",
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
              Reports
            </div>
          </div>

          {/* User Management */}
          <div
            style={{
              width: "212px",
              height: "42px",
              padding: "10px",
              background: "#681813",
              overflow: "hidden",
              borderRadius: "8px",
              display: "inline-flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "8px",
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
              User Management
            </div>
          </div>
        </div>
      </div>

      {/* Profil Pengguna */}
      <div
        style={{
          width: "212px",
          height: "54px",
          padding: "10px",
          background: "#59120E",
          overflow: "hidden",
          borderRadius: "8px",
          display: "inline-flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "8px",
        }}
      >
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
          SA
        </div>

        <div
          style={{
            flex: "1 1 0",
            color: "white",
            fontSize: "11px",
            fontFamily: "Inter",
            fontWeight: 700,
            overflowWrap: "break-word",
          }}
        >
          Syamsabillah
          <br />
          Engineering
        </div>
      </div>
    </div>
  );
}