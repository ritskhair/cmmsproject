export default function ListEquipment() {
  const equipmentData = [
    {
      id: "EQ-PEL-001",
      name: "Pellet Mill 01",
      section: "5",
      type: "Pellet Mill",
      status: "Operational",
      criticality: "A",
      lastPM: "26 Aug",
    },
    {
      id: "EQ-WHM-002",
      name: "Wet Hammer Mill 02",
      section: "2",
      type: "Hammer Mill",
      status: "Warning",
      criticality: "A",
      lastPM: "22 Aug",
    },
    {
      id: "EQ-RDR-001",
      name: "Rotary Dryer 01",
      section: "3",
      type: "Dryer",
      status: "Operational",
      criticality: "B",
      lastPM: "28 Aug",
    },
    {
      id: "EQ-PKG-003",
      name: "Packing Machine 03",
      section: "5",
      type: "Packing",
      status: "Critical",
      criticality: "A",
      lastPM: "19 Aug",
    },
    {
      id: "EQ-LCH-001",
      name: "Log Chipper 01",
      section: "1",
      type: "Chipper",
      status: "Operational",
      criticality: "B",
      lastPM: "27 Aug",
    },
  ];

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

  const tableColumns = [
    { label: "Asset ID", width: "130px" },
    { label: "Equipment Name", width: "230px" },
    { label: "Section", width: "150px" },
    { label: "Type", width: "150px" },
    { label: "Status", width: "150px" },
    { label: "Criticality", width: "160px" },
    { label: "Last PM", width: "120px" },
  ];

  const statusColor = (status: string) => {
    if (status === "Operational") return "#2E7D33";
    if (status === "Warning") return "#B8781F";
    if (status === "Critical") return "#B22417";
    return "#211F1D";
  };

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

      {/* Main Content */}
      <div
        style={{
          width: "1192px",
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: "20px",
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
                  overflowWrap: "break-word",
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
                  overflowWrap: "break-word",
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
                    overflowWrap: "break-word",
                  }}
                >
                  SA
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              color: "#595752",
              fontSize: "13px",
              fontFamily: "Inter",
              fontWeight: 400,
              overflowWrap: "break-word",
            }}
          >
            Asset registry, condition and maintenance readiness
          </div>

          {/* Search and Filters */}
          <div
            style={{
              alignSelf: "stretch",
              paddingLeft: "20px",
              paddingRight: "20px",
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
                gap: "12px",
              }}
            >
              {[
                { label: "Search equipment", value: "Asset ID / name", width: "360px" },
                { label: "Status", value: "All statuses", width: "180px" },
                { label: "Area", value: "All areas", width: "180px" },
              ].map((filter) => (
                <div
                  key={filter.label}
                  style={{
                    width: filter.width,
                    height: "70px",
                    overflow: "hidden",
                    display: "inline-flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      color: "#595752",
                      fontSize: "11px",
                      fontFamily: "Inter",
                      fontWeight: 700,
                      overflowWrap: "break-word",
                    }}
                  >
                    {filter.label}
                  </div>

                  <div
                    style={{
                      width: filter.width,
                      height: "44px",
                      padding: "14px",
                      background: "white",
                      overflow: "hidden",
                      borderRadius: "9px",
                      outline: "1px solid #D5D2CC",
                      outlineOffset: "-1px",
                      display: "inline-flex",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        color: "#595752",
                        fontSize: "12px",
                        fontFamily: "Inter",
                        fontWeight: 400,
                        overflowWrap: "break-word",
                      }}
                    >
                      {filter.value}
                    </div>
                  </div>
                </div>
              ))}
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
                  overflowWrap: "break-word",
                }}
              >
                Add Equipment
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div
            style={{
              alignSelf: "stretch",
              height: "92px",
              overflow: "hidden",
              display: "inline-flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            {[
              { label: "Total Assets", value: "128", color: "#681813" },
              { label: "Operational", value: "112", color: "#2E7D33" },
              { label: "Warning", value: "11", color: "#B8781F" },
              { label: "Critical", value: "5", color: "#B22417" },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  flex: "1 1 0",
                  height: "88px",
                  background: "white",
                  boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                  overflow: "hidden",
                  borderRadius: "10px",
                  outline: "1px solid #D5D2CC",
                  outlineOffset: "-1px",
                  display: "inline-flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: "#595752",
                    fontSize: "11px",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    overflowWrap: "break-word",
                  }}
                >
                  {card.label}
                </div>

                <div
                  style={{
                    color: card.color,
                    fontSize: "26px",
                    fontFamily: "Inter",
                    fontWeight: 700,
                    overflowWrap: "break-word",
                  }}
                >
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Equipment Table */}
          <div
            style={{
              alignSelf: "stretch",
              background: "white",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              {/* Table Header */}
              <div
                style={{
                  width: "1152px",
                  height: "48px",
                  padding: "12px",
                  background: "white",
                  overflow: "hidden",
                  borderBottom: "1px solid black",
                  display: "inline-flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {tableColumns.map((column) => (
                  <div
                    key={column.label}
                    style={{
                      width: column.width,
                      height: "48px",
                      background: "white",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        color: "#595752",
                        fontSize: "11px",
                        fontFamily: "Inter",
                        fontWeight: 700,
                        overflowWrap: "break-word",
                      }}
                    >
                      {column.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Rows */}
              {equipmentData.map((equipment, index) => (
                <div
                  key={equipment.id}
                  style={{
                    width: "1152px",
                    height: "48px",
                    padding: "12px",
                    background:
                      index % 2 === 1 ? "#F8F7F5" : "white",
                    overflow: "hidden",
                    display: "inline-flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {[
                    equipment.id,
                    equipment.name,
                    equipment.section,
                    equipment.type,
                    equipment.status,
                    equipment.criticality,
                    equipment.lastPM,
                  ].map((value, valueIndex) => (
                    <div
                      key={`${equipment.id}-${valueIndex}`}
                      style={{
                        width: tableColumns[valueIndex].width,
                        height: "48px",
                        background:
                          index % 2 === 0 ? "white" : "transparent",
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          color:
                            valueIndex === 0
                              ? "#681813"
                              : valueIndex === 4
                              ? statusColor(equipment.status)
                              : "#211F1D",
                          fontSize: "11px",
                          fontFamily: "Inter",
                          fontWeight: valueIndex === 0 ? 700 : 400,
                          overflowWrap: "break-word",
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Pagination */}
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
                  overflowWrap: "break-word",
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
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
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
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
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
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
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
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
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
                overflowWrap: "break-word",
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
                overflowWrap: "break-word",
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
                overflowWrap: "break-word",
              }}
            >
              {" "}
              All rights reserved.
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              color: "#9CA3AF",
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: 400,
              lineHeight: "22px",
              letterSpacing: "0.04px",
              overflowWrap: "break-word",
            }}
          >
            CMMS
          </div>
        </div>
      </div>
    </div>
  );
}