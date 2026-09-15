export default function DetailEquipment() {
  const menuItems = [
    "Dashboard",
    "Work Orders",
    "Equipment",
    "Preventive Maintenance",
    "Spare Parts",
    "Maintenance Calendar",
    "Reports",
    "User Management",
  ];

  const assetInformation = [
    "Manufacturer: CPM",
    "Model: 7936-7",
    "Capacity: 6.0 ton/h",
    "Installed: 2024",
    "Location: Production Line 01",
  ];

  const maintenanceSnapshot = [
    "MTBF: 186 h",
    "MTTR: 92 min",
    "Downtime YTD: 38.5 h",
    "Failure count: 8",
    "Next PM: 04 Sep 2026",
  ];

  const maintenanceHistory = [
    {
      date: "26 Aug",
      event: "Routine inspection",
      type: "PM",
      technician: "A. Rahman",
      status: "Completed",
      downtime: "0 h",
      wo: "WO-081",
    },
    {
      date: "21 Aug",
      event: "Motor overload",
      type: "Corrective",
      technician: "D. Pratama",
      status: "Completed",
      downtime: "2.5 h",
      wo: "WO-079",
    },
    {
      date: "04 Aug",
      event: "Lubrication",
      type: "PM",
      technician: "A. Rahman",
      status: "Completed",
      downtime: "0 h",
      wo: "WO-061",
    },
  ];

  const historyColumns = [
    { label: "Date", width: "130px" },
    { label: "Event", width: "230px" },
    { label: "Type", width: "150px" },
    { label: "Technician", width: "150px" },
    { label: "Status", width: "150px" },
    { label: "Downtime", width: "160px" },
    { label: "WO", width: "120px" },
  ];

  return (
    <div
      style={{
        width: "1440px",
        height: "900px",
        background: "#F8F7F5",
        overflow: "hidden",
        display: "inline-flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {/* Sidebar */}
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

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            {menuItems.map((item) => {
              const isActive = item === "Equipment";

              return (
                <div
                  key={item}
                  style={{
                    width: "212px",
                    height: "42px",
                    padding: "10px",
                    background: isActive ? "#87241C" : "#681813",
                    overflow: "hidden",
                    borderRadius: "8px",
                    outline: isActive ? "1px solid #C9A227" : "none",
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
                    {item}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
            }}
          >
            Syamsabillah
            <br />
            Engineering
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          height: "900px",
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingTop: "28px",
          paddingBottom: "28px",
          overflow: "hidden",
          display: "inline-flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            height: "646px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Header */}
          <div
            style={{
              width: "1172px",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "5px",
              paddingBottom: "5px",
              background: "white",
              overflow: "hidden",
              borderRadius: "8px",
              display: "inline-flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                flex: "1 1 0",
                background: "white",
                overflow: "hidden",
                display: "inline-flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "3px",
              }}
            >
              <div
                style={{
                  alignSelf: "stretch",
                  color: "#681813",
                  fontSize: "24px",
                  fontFamily: "Inter",
                  fontWeight: 700,
                }}
              >
                Equipment
              </div>
            </div>

            <div
              style={{
                background: "white",
                overflow: "hidden",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "13px",
                  color: "#681813",
                  fontSize: "20px",
                  fontFamily: "Inter",
                  fontWeight: 700,
                }}
              >
                ⌕
              </div>

              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#F6F5F2",
                  overflow: "hidden",
                  borderRadius: "20px",
                  outline: "1px solid #D6D1C9",
                  outlineOffset: "-1px",
                  display: "inline-flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "15px",
                    color: "#681813",
                    fontSize: "11px",
                    fontFamily: "Inter",
                    fontWeight: 700,
                  }}
                >
                  SA
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Detail */}
          <div
            style={{
              alignSelf: "stretch",
              paddingTop: "10px",
              paddingBottom: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <div
              style={{
                color: "#595752",
                fontSize: "13px",
                fontFamily: "Inter",
                fontWeight: 400,
              }}
            >
              Equipment detail and maintenance history
            </div>

            {/* Equipment Summary */}
            <div
              style={{
                width: "1152px",
                height: "120px",
                padding: "20px",
                background: "white",
                overflow: "hidden",
                display: "inline-flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "40px",
                }}
              >
                <div
                  style={{
                    color: "#681813",
                    fontSize: "22px",
                    fontFamily: "Inter",
                    fontWeight: 700,
                  }}
                >
                  EQ-PEL-001 | Pellet Mill 01
                </div>

                <div
                  style={{
                    height: "28px",
                    padding: "8px",
                    background: "white",
                    overflow: "hidden",
                    borderRadius: "14px",
                    outline: "1px solid #2E7D33",
                    outlineOffset: "-1px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      color: "#2E7D33",
                      fontSize: "10px",
                      fontFamily: "Inter",
                      fontWeight: 700,
                    }}
                  >
                    Operational
                  </div>
                </div>

                <div
                  style={{
                    color: "#595752",
                    fontSize: "12px",
                    fontFamily: "Inter",
                    fontWeight: 400,
                  }}
                >
                  Production • Line 01
                </div>

                <div
                  style={{
                    color: "#595752",
                    fontSize: "12px",
                    fontFamily: "Inter",
                    fontWeight: 400,
                  }}
                >
                  Criticality A
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    width: "132px",
                    height: "44px",
                    background: "white",
                    overflow: "hidden",
                    borderRadius: "9px",
                    outline: "1px solid #C9A227",
                    outlineOffset: "-1px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      color: "#681813",
                      fontSize: "12px",
                      fontFamily: "Inter",
                      fontWeight: 700,
                    }}
                  >
                    Edit Equipment
                  </div>
                </div>

                <div
                  style={{
                    width: "132px",
                    height: "44px",
                    background: "#681813",
                    overflow: "hidden",
                    borderRadius: "9px",
                    outline: "1px solid #681813",
                    outlineOffset: "-1px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      color: "white",
                      fontSize: "12px",
                      fontFamily: "Inter",
                      fontWeight: 700,
                    }}
                  >
                    Create WO
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div
            style={{
              alignSelf: "stretch",
              paddingTop: "10px",
              paddingBottom: "10px",
              background: "white",
              overflow: "hidden",
              display: "inline-flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "20px",
            }}
          >
            <InfoCard title="Asset Information" items={assetInformation} />
            <InfoCard
              title="Maintenance Snapshot"
              items={maintenanceSnapshot}
            />
          </div>

          {/* Maintenance History */}
          <div
            style={{
              alignSelf: "stretch",
              paddingTop: "10px",
              paddingBottom: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "15px",
            }}
          >
            <div
              style={{
                color: "#681813",
                fontSize: "15px",
                fontFamily: "Inter",
                fontWeight: 700,
              }}
            >
              Maintenance History
            </div>

            <div
              style={{
                width: "1152px",
                background: "white",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              {/* History Header */}
              <div
                style={{
                  width: "1152px",
                  height: "48px",
                  padding: "12px",
                  background: "white",
                  overflow: "hidden",
                  display: "inline-flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                {historyColumns.map((column) => (
                  <div
                    key={column.label}
                    style={{
                      width: column.width,
                      height: "48px",
                      background: "white",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        color: "#595752",
                        fontSize: "11px",
                        fontFamily: "Inter",
                        fontWeight: 700,
                      }}
                    >
                      {column.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* History Rows */}
              {maintenanceHistory.map((history) => (
                <div
                  key={history.wo}
                  style={{
                    width: "1152px",
                    height: "48px",
                    padding: "12px",
                    background: "white",
                    overflow: "hidden",
                    display: "inline-flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  {[
                    history.date,
                    history.event,
                    history.type,
                    history.technician,
                    history.status,
                    history.downtime,
                    history.wo,
                  ].map((value, index) => (
                    <div
                      key={`${history.wo}-${index}`}
                      style={{
                        width: historyColumns[index].width,
                        height: "48px",
                        background: "white",
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          color: index === 0 ? "#681813" : "#211F1D",
                          fontSize: "11px",
                          fontFamily: "Inter",
                          fontWeight: index === 0 ? 700 : 400,
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Pagination */}
              <Pagination />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            alignSelf: "stretch",
            paddingLeft: "24px",
            paddingRight: "24px",
            paddingTop: "20px",
            paddingBottom: "20px",
            background: "white",
            borderRadius: "8px",
            display: "inline-flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#9CA3AF",
                fontSize: "12px",
                fontFamily: "Inter",
                fontWeight: 600,
                lineHeight: "18px",
                letterSpacing: "0.04px",
              }}
            >
              Copyright © 2026{" "}
            </span>

            <span
              style={{
                color: "#C9A227",
                fontSize: "12px",
                fontFamily: "Inter",
                fontWeight: 600,
                lineHeight: "18px",
                letterSpacing: "0.04px",
              }}
            >
              CMMS - JWP.
            </span>

            <span
              style={{
                color: "#9CA3AF",
                fontSize: "12px",
                fontFamily: "Inter",
                fontWeight: 600,
                lineHeight: "18px",
                letterSpacing: "0.04px",
              }}
            >
              {" "}
              All rights reserved.
            </span>
          </div>

          <div
            style={{
              color: "#9CA3AF",
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: 400,
              lineHeight: "22px",
              letterSpacing: "0.04px",
            }}
          >
            CMMS
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div
      style={{
        width: "566px",
        height: "186px",
        padding: "10px",
        background: "white",
        overflow: "hidden",
        borderRadius: "10px",
        outline: "1px solid #D5D2CC",
        outlineOffset: "-1px",
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: "20px",
      }}
    >
      <div
        style={{
          color: "#681813",
          fontSize: "15px",
          fontFamily: "Inter",
          fontWeight: 700,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        {items.map((item) => (
          <div
            key={item}
            style={{
              color: "#211F1D",
              fontSize: "12px",
              fontFamily: "Inter",
              fontWeight: 400,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Pagination() {
  return (
    <div
      style={{
        alignSelf: "stretch",
        height: "72px",
        paddingTop: "12px",
        paddingBottom: "16px",
        paddingLeft: "24px",
        paddingRight: "24px",
        background: "white",
        borderBottomRightRadius: "8px",
        borderBottomLeftRadius: "8px",
        display: "inline-flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          color: "#344054",
          fontSize: "14px",
          fontFamily: "Inter",
          fontWeight: 400,
          lineHeight: "20px",
          letterSpacing: "0.04px",
        }}
      >
        1 - 20 of 50 data
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#A5A3A3",
            fontSize: "20px",
          }}
        >
          ‹
        </div>

        <div
          style={{
            height: "32px",
            paddingLeft: "12px",
            paddingRight: "12px",
            background: "#FFECE5",
            borderRadius: "3px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#19191A",
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "0.04px",
            }}
          >
            1
          </div>
        </div>

        <div
          style={{
            height: "32px",
            paddingLeft: "12px",
            paddingRight: "12px",
            borderRadius: "3px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#172B4D",
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "0.04px",
            }}
          >
            2
          </div>
        </div>

        <div
          style={{
            height: "32px",
            paddingLeft: "8px",
            paddingRight: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#172B4D",
              fontSize: "14px",
              fontFamily: "Source Sans Pro",
              fontWeight: 400,
              lineHeight: "20px",
            }}
          >
            ...
          </div>
        </div>

        <div
          style={{
            height: "32px",
            paddingLeft: "12px",
            paddingRight: "12px",
            borderRadius: "3px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#172B4D",
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "0.04px",
            }}
          >
            5
          </div>
        </div>

        <div
          style={{
            width: "32px",
            height: "32px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#19191A",
            fontSize: "20px",
          }}
        >
          ›
        </div>
      </div>
    </div>
  );
}