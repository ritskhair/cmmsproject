import { useMemo, useState } from "react";

type UserRole = "Admin" | "Superadmin" | "SPV/Manager";

type User = {
  id: number;
  name: string;
  department: string;
  position: string;
  role: UserRole;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "John doe",
    department: "Warehouse",
    position: "Team Leader",
    role: "Admin",
  },
  {
    id: 2,
    name: "Supri",
    department: "EMTC",
    position: "Area Head",
    role: "Superadmin",
  },
  {
    id: 3,
    name: "Tarjo",
    department: "EMTC",
    position: "Team Leader",
    role: "Admin",
  },
  {
    id: 4,
    name: "Sukri",
    department: "Production",
    position: "Area Head",
    role: "SPV/Manager",
  },
  {
    id: 5,
    name: "Syemi",
    department: "Production",
    position: "Team Leader",
    role: "Admin",
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All roles");
  const [showFilter, setShowFilter] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const [newUser, setNewUser] = useState({
    name: "",
    department: "",
    position: "",
    role: "Admin" as UserRole,
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(searchText) ||
        user.department.toLowerCase().includes(searchText) ||
        user.position.toLowerCase().includes(searchText) ||
        user.role.toLowerCase().includes(searchText);

      const matchesRole =
        selectedRole === "All roles" || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, search, selectedRole]);

  const totalUsers = users.length;

  const totalSuperadmin = users.filter(
    (user) => user.role === "Superadmin"
  ).length;

  const totalManager = users.filter(
    (user) => user.role === "SPV/Manager"
  ).length;

  const totalAdmin = users.filter(
    (user) => user.role === "Admin"
  ).length;

  const handleAddUser = () => {
    if (
      !newUser.name.trim() ||
      !newUser.department.trim() ||
      !newUser.position.trim()
    ) {
      alert("Mohon lengkapi seluruh data user.");
      return;
    }

    const newUserData: User = {
      id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
      name: newUser.name,
      department: newUser.department,
      position: newUser.position,
      role: newUser.role,
    };

    setUsers((previousUsers) => [...previousUsers, newUserData]);

    setNewUser({
      name: "",
      department: "",
      position: "",
      role: "Admin",
    });

    setShowAddModal(false);
  };

  const handleDeleteUser = (id: number) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus user ini?"
    );

    if (!confirmed) return;

    setUsers((previousUsers) =>
      previousUsers.filter((user) => user.id !== id)
    );

    setActiveMenu(null);
  };

  return (
    <div className="user-management-page">
      {/* Header */}
      <section className="page-header">
        <div>
          <h1>User Management</h1>
        </div>

        <div className="page-header-actions">
          <button className="search-icon-button" type="button">
            ⌕
          </button>

          <div className="profile-circle">SA</div>
        </div>
      </section>

      <p className="page-description">
        Manage system users, roles and access permissions
      </p>

      {/* Summary Cards */}
      <section className="summary-grid">
        <div className="summary-card">
          <span>Total Users</span>
          <strong className="summary-maroon">{totalUsers}</strong>
        </div>

        <div className="summary-card">
          <span>Superadmin</span>
          <strong className="summary-green">{totalSuperadmin}</strong>
        </div>

        <div className="summary-card">
          <span>SPV/Manager</span>
          <strong className="summary-gold">{totalManager}</strong>
        </div>

        <div className="summary-card">
          <span>Admin</span>
          <strong className="summary-red">{totalAdmin}</strong>
        </div>
      </section>

      {/* Table Container */}
      <section className="user-table-card">
        <div className="table-toolbar">
          <div className="user-search-wrapper">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="toolbar-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowFilter((previous) => !previous)}
            >
              ☷ &nbsp; Tampilkan
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowFilter((previous) => !previous)}
            >
              ⚑ &nbsp; Role
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() => setShowAddModal(true)}
            >
              ＋ Tambah Data
            </button>
          </div>
        </div>

        {showFilter && (
          <div className="filter-panel">
            <label htmlFor="role-filter">Filter Role</label>

            <select
              id="role-filter"
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
            >
              <option value="All roles">All roles</option>
              <option value="Admin">Admin</option>
              <option value="Superadmin">Superadmin</option>
              <option value="SPV/Manager">SPV/Manager</option>
            </select>

            <button
              type="button"
              className="reset-filter-button"
              onClick={() => {
                setSearch("");
                setSelectedRole("All roles");
              }}
            >
              Reset
            </button>
          </div>
        )}

        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>No</th>
                <th>User Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.department}</td>
                    <td>{user.position}</td>
                    <td>{user.role}</td>
                    <td className="action-cell">
                      <button
                        type="button"
                        className="menu-button"
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === user.id ? null : user.id
                          )
                        }
                      >
                        ⋮
                      </button>

                      {activeMenu === user.id && (
                        <div className="row-action-menu">
                          <button
                            type="button"
                            onClick={() => {
                              alert(
                                `Fitur edit untuk user ${user.name} belum terhubung ke database.`
                              );
                              setActiveMenu(null);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="empty-table">
                    Data user tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            1 - {filteredUsers.length} dari {filteredUsers.length} data
          </span>

          <div className="pagination">
            <button type="button" disabled>
              ‹
            </button>

            <button type="button" className="active-page">
              1
            </button>

            <button type="button" disabled>
              2
            </button>

            <span>...</span>

            <button type="button" disabled>
              5
            </button>

            <button type="button" disabled>
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="user-modal">
            <div className="modal-header">
              <h2>Tambah Data User</h2>

              <button
                type="button"
                className="modal-close-button"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-form">
              <label htmlFor="user-name">User Name</label>
              <input
                id="user-name"
                type="text"
                value={newUser.name}
                onChange={(event) =>
                  setNewUser({
                    ...newUser,
                    name: event.target.value,
                  })
                }
                placeholder="Masukkan nama user"
              />

              <label htmlFor="user-department">Department</label>
              <input
                id="user-department"
                type="text"
                value={newUser.department}
                onChange={(event) =>
                  setNewUser({
                    ...newUser,
                    department: event.target.value,
                  })
                }
                placeholder="Masukkan department"
              />

              <label htmlFor="user-position">Position</label>
              <input
                id="user-position"
                type="text"
                value={newUser.position}
                onChange={(event) =>
                  setNewUser({
                    ...newUser,
                    position: event.target.value,
                  })
                }
                placeholder="Masukkan posisi"
              />

              <label htmlFor="user-role">Type</label>
              <select
                id="user-role"
                value={newUser.role}
                onChange={(event) =>
                  setNewUser({
                    ...newUser,
                    role: event.target.value as UserRole,
                  })
                }
              >
                <option value="Admin">Admin</option>
                <option value="Superadmin">Superadmin</option>
                <option value="SPV/Manager">SPV/Manager</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowAddModal(false)}
              >
                Batal
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleAddUser}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}