export default function UserRole() {
  const users = [
    {
      no: 1,
      name: "John doe",
      department: "Warehouse",
      position: "Team Leader",
      type: "Admin",
    },
    {
      no: 2,
      name: "Supri",
      department: "EMTC",
      position: "Area Head",
      type: "Superadmin",
    },
    {
      no: 3,
      name: "Tarjo",
      department: "EMTC",
      position: "Team Leader",
      type: "Admin",
    },
    {
      no: 4,
      name: "Sukri",
      department: "Production",
      position: "Area Head",
      type: "SPV/Manager",
    },
    {
      no: 5,
      name: "Syemi",
      department: "Production",
      position: "Team Leader",
      type: "Admin",
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

  return (
    <div
      style={{
        width: "1440px",
        height: "900px",
        background: "#F8F7F5",
        overflow: "hidden",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        display: "inline-flex",
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
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          display: "inline-flex",
        }}
      >
        <div
          style={{
            alignSelf: "stretch",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: "8px",
            display: "flex",
          }}
        >
          <div
            style={{
              alignSelf: "stretch",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "8px",
              display: "flex",
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
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "8px",
              display: "flex",
            }}
          >
            {menuItems.map((item) => {
              const isActive = item === "User Management";

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
                    outline: isActive
                      ? "1px solid #C9A227"
                      : "none",
                    outlineOffset: "-1px",
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
                    {item}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Profile */}
        <div
          style={{
            width: "212px",
            height: "54px",
            padding: "10px",
            background: "#59120E",
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
            SA
            <br />
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
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          display: "inline-flex",
        }}
      >
        <div
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: "20px",
            display: "flex",
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
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "16px",
              display: "inline-flex",
            }}
          >
            <div
              style={{
                flex: "1 1 0",
                background: "white",
                overflow: "hidden",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "3px",
                display: "inline-flex",
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
                User Management
              </div>
            </div>

            <div
              style={{
                background: "white",
                overflow: "hidden",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "10px",
                display: "flex",
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
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "inline-flex",
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

          {/* Subtitle */}
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

          {/* Statistic Cards */}
          <div
            style={{
              alignSelf: "stretch",
              height: "92px",
              overflow: "hidden",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "16px",
              display: "inline-flex",
            }}
          >
            {[
              {
                label: "Total Users",
                value: "128",
                color: "#681813",
              },
              {
                label: "Superadmin",
                value: "112",
                color: "#2E7D33",
              },
              {
                label: "SPV/Manager",
                value: "11",
                color: "#B8781F",
              },
              {
                label: "Admin",
                value: "5",
                color: "#B22417",
              },
            ].map((statistic) => (
              <div
                key={statistic.label}
                style={{
                  flex: "1 1 0",
                  height: "88px",
                  background: "white",
                  boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                  overflow: "hidden",
                  borderRadius: "10px",
                  outline: "1px solid #D5D2CC",
                  outlineOffset: "-1px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  display: "inline-flex",
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
                  {statistic.label}
                </div>

                <div
                  style={{
                    color: statistic.color,
                    fontSize: "26px",
                    fontFamily: "Inter",
                    fontWeight: 700,
                    overflowWrap: "break-word",
                  }}
                >
                  {statistic.value}
                </div>
              </div>
            ))}
          </div>

          {/* User Table */}
          <div
            style={{
              alignSelf: "stretch",
              background: "white",
              overflow: "hidden",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "10px",
              display: "flex",
            }}
          >
            {/* Toolbar */}
            <div
              style={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                display: "flex",
              }}
            >
              <div
                style={{
                  alignSelf: "stretch",
                  background: "white",
                  borderBottom: "1px solid #EAECF0",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    alignSelf: "stretch",
                    paddingTop: "20px",
                    paddingBottom: "19px",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "16px",
                    display: "inline-flex",
                  }}
                >
                  {/* Search */}
                  <div
                    style={{
                      flex: "1 1 0",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      gap: "4px",
                      display: "inline-flex",
                    }}
                  >
                    <div
                      style={{
                        width: "400px",
                        height: "44px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "400px",
                          left: 0,
                          top: 0,
                          position: "absolute",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          gap: "6px",
                          display: "inline-flex",
                        }}
                      >
                        <div
                          style={{
                            alignSelf: "stretch",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            gap: "6px",
                            display: "flex",
                          }}
                        >
                          <div
                            style={{
                              alignSelf: "stretch",
                              paddingLeft: "14px",
                              paddingRight: "14px",
                              paddingTop: "10px",
                              paddingBottom: "10px",
                              background: "white",
                              boxShadow:
                                "0px 1px 2px rgba(16, 24, 40, 0.05)",
                              borderRadius: "8px",
                              outline: "1px solid #D0D5DD",
                              outlineOffset: "-1px",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              gap: "8px",
                              display: "inline-flex",
                            }}
                          >
                            <div
                              style={{
                                flex: "1 1 0",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                gap: "8px",
                                display: "flex",
                              }}
                            >
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  position: "relative",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: "15px",
                                    height: "15px",
                                    left: "2.5px",
                                    top: "2.5px",
                                    position: "absolute",
                                    outline: "1.67px solid #667085",
                                    outlineOffset: "-0.83px",
                                    borderRadius: "50%",
                                  }}
                                />
                              </div>

                              <div
                                style={{
                                  color: "#667085",
                                  fontSize: "14px",
                                  fontFamily: "Inter",
                                  fontWeight: 400,
                                  lineHeight: "20px",
                                  letterSpacing: "0.04px",
                                  overflowWrap: "break-word",
                                }}
                              >
                                Search
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tampilkan Button */}
                  <div
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "8px",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          paddingLeft: "16px",
                          paddingRight: "16px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          background: "white",
                          overflow: "hidden",
                          borderRadius: "8px",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "8px",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: "15px",
                              height: "10px",
                              left: "2.5px",
                              top: "5px",
                              position: "absolute",
                              outline: "1.67px solid #344054",
                              outlineOffset: "-0.83px",
                            }}
                          />
                        </div>

                        <div
                          style={{
                            color: "#344054",
                            fontSize: "14px",
                            fontFamily: "Inter",
                            fontWeight: 600,
                            lineHeight: "18px",
                            letterSpacing: "0.04px",
                            overflowWrap: "break-word",
                          }}
                        >
                          Tampilkan
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Role Button */}
                  <div
                    style={{
                      borderRadius: "8px",
                      outline: "1px solid #D0D5DD",
                      outlineOffset: "-1px",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        overflow: "hidden",
                        borderRadius: "8px",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: "13.34px",
                            height: "15px",
                            left: "3.33px",
                            top: "2.5px",
                            position: "absolute",
                            background: "#344054",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          color: "#344054",
                          fontSize: "14px",
                          fontFamily: "Inter",
                          fontWeight: 600,
                          lineHeight: "18px",
                          letterSpacing: "0.04px",
                          overflowWrap: "break-word",
                        }}
                      >
                        Role
                      </div>
                    </div>
                  </div>

                  {/* Tambah Data Button */}
                  <div
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "16px",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "5px",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          paddingLeft: "16px",
                          paddingRight: "16px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          background: "#681813",
                          boxShadow:
                            "0px 1px 2px rgba(16, 24, 40, 0.05)",
                          overflow: "hidden",
                          borderRadius: "8px",
                          outline: "1px solid #681813",
                          outlineOffset: "-1px",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "8px",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: "11.67px",
                              height: "11.67px",
                              left: "4.17px",
                              top: "4.17px",
                              position: "absolute",
                              outline: "1.67px solid white",
                              outlineOffset: "-0.83px",
                              borderRadius: "50%",
                            }}
                          />
                        </div>

                        <div
                          style={{
                            color: "white",
                            fontSize: "14px",
                            fontFamily: "Inter",
                            fontWeight: 600,
                            lineHeight: "18px",
                            letterSpacing: "0.04px",
                            overflowWrap: "break-word",
                          }}
                        >
                          Tambah Data
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Header */}
              <div
                style={{
                  width: "1152px",
                  height: "48px",
                  padding: "12px",
                  background: "white",
                  overflow: "hidden",
                  borderBottom: "1px solid black",
                  justifyContent: "space-between",
                  alignItems: "center",
                  display: "inline-flex",
                }}
              >
                {["No", "User Name", "Department", "Position", "Type", ""].map(
                  (header, index) => (
                    <div
                      key={`${header}-${index}`}
                      style={{
                        width:
                          index === 0
                            ? "130px"
                            : index === 5
                            ? "100px"
                            : "150px",
                        height: "48px",
                        background: "white",
                        overflow: "hidden",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        display: "flex",
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
                        {header}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Table Rows */}
              {users.map((user, index) => (
                <div
                  key={user.no}
                  style={{
                    width: "1152px",
                    height: "48px",
                    padding: "12px",
                    background:
                      index % 2 === 1 ? "#F8F7F5" : "white",
                    overflow: "hidden",
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                >
                  {[
                    user.no,
                    user.name,
                    user.department,
                    user.position,
                    user.type,
                  ].map((value, valueIndex) => (
                    <div
                      key={valueIndex}
                      style={{
                        width:
                          valueIndex === 0
                            ? "130px"
                            : valueIndex === 1
                            ? "230px"
                            : "150px",
                        height: "48px",
                        background:
                          index % 2 === 1 ? "transparent" : "white",
                        overflow: "hidden",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          color:
                            valueIndex === 0 ? "#681813" : "#211F1D",
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

                  {/* Action Icon */}
                  <div
                    style={{
                      width: "100px",
                      height: "46px",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      paddingTop: "14px",
                      paddingBottom: "14px",
                      borderBottom: "1px solid #EAECF0",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "4px",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "2px",
                          height: "11.33px",
                          left: "9.33px",
                          top: "2px",
                          position: "absolute",
                          background: "#4D4D4D",
                        }}
                      />
                    </div>
                  </div>
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
                justifyContent: "space-between",
                alignItems: "center",
                display: "inline-flex",
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
                  justifyContent: "flex-start",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    position: "relative",
                    overflow: "hidden",
                    color: "#A5A3A3",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
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
                      overflowWrap: "break-word",
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
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
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
                      overflowWrap: "break-word",
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
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
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
                      overflowWrap: "break-word",
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
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
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
                      overflowWrap: "break-word",
                    }}
                  >
                    5
                  </div>
                </div>

                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    position: "relative",
                    overflow: "hidden",
                    color: "#19191A",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
            justifyContent: "space-between",
            alignItems: "center",
            display: "inline-flex",
          }}
        >
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
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
              justifyContent: "center",
              display: "flex",
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