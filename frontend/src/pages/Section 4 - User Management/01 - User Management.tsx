import { useEffect, useMemo, useState } from "react";

import { apiRequest } from "../../utils/api";

type Role = "teknisi" | "team_leader" | "manager" | "general_manager" | "super_admin";
type Account = {
  id: string;
  username: string;
  department: string | null;
  position: string | null;
  role: Role;
  created_at: string;
};

type AccountForm = {
  username: string;
  password: string;
  department: string;
  position: string;
  role: Role;
};

const roles: Role[] = ["teknisi", "team_leader", "manager", "general_manager", "super_admin"];
const roleLabels: Record<Role, string> = {
  teknisi: "Teknisi",
  team_leader: "Team Leader",
  manager: "Manager",
  general_manager: "General Manager",
  super_admin: "Super Admin",
};
const emptyForm: AccountForm = { username: "", password: "", department: "", position: "", role: "teknisi" };

export default function UserManagement() {
  const [users, setUsers] = useState<Account[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [form, setForm] = useState<AccountForm>(emptyForm);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setUsers(await apiRequest<Account[]>("/accounts"));
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "User gagal dimuat.");
    }
  }

  useEffect(() => { void loadUsers(); }, []);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const searchText = `${user.username} ${user.department || ""} ${user.position || ""} ${roleLabels[user.role]}`.toLowerCase();
    return searchText.includes(search.toLowerCase()) && (!selectedRole || user.role === selectedRole);
  }), [users, search, selectedRole]);

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setModal("add");
    setError("");
  }

  function openEdit(user: Account) {
    setForm({ username: user.username, password: "", department: user.department || "", position: user.position || "", role: user.role });
    setEditingId(user.id);
    setModal("edit");
    setActiveMenu(null);
    setError("");
  }

  async function saveUser() {
    if (!form.username.trim() || (modal === "add" && !form.password.trim())) {
      setError("Username dan password wajib diisi untuk user baru.");
      return;
    }
    try {
      if (modal === "add") {
        await apiRequest<Account>("/accounts", { method: "POST", body: JSON.stringify(form) });
      } else if (editingId) {
        const payload = { ...form, ...(form.password ? {} : { password: undefined }) };
        await apiRequest<Account>(`/accounts/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      }
      setModal(null);
      await loadUsers();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "User gagal disimpan.");
    }
  }

  async function deleteUser(user: Account) {
    if (!window.confirm(`Hapus user ${user.username}?`)) return;
    try {
      await apiRequest<void>(`/accounts/${user.id}`, { method: "DELETE" });
      await loadUsers();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "User gagal dihapus.");
    }
    setActiveMenu(null);
  }

  const updateField = (field: keyof AccountForm, value: string) => setForm((previous) => ({ ...previous, [field]: value }));
  const superAdmins = users.filter((user) => user.role === "super_admin").length;
  const managers = users.filter((user) => user.role === "manager" || user.role === "general_manager").length;
  const technicians = users.filter((user) => user.role === "teknisi" || user.role === "team_leader").length;

  return (
    <div className="user-management-page">
      <section className="page-header"><div><h1>User Management</h1></div><div className="page-header-actions"><button className="search-icon-button" type="button">⌕</button><div className="profile-circle">SA</div></div></section>
      <p className="page-description">Manage system users, roles and access permissions</p>
      <section className="summary-grid"><div className="summary-card"><span>Total Users</span><strong className="summary-maroon">{users.length}</strong></div><div className="summary-card"><span>Super Admin</span><strong className="summary-green">{superAdmins}</strong></div><div className="summary-card"><span>Manager</span><strong className="summary-gold">{managers}</strong></div><div className="summary-card"><span>Teknisi / Team Leader</span><strong className="summary-red">{technicians}</strong></div></section>
      {error && <p className="login-error">{error}</p>}
      <section className="user-table-card"><div className="table-toolbar"><div className="user-search-wrapper"><span>⌕</span><input placeholder="Search" value={search} onChange={(event) => setSearch(event.target.value)} /></div><div className="toolbar-actions"><button type="button" className="secondary-button" onClick={() => setShowFilter((value) => !value)}>☷ &nbsp; Tampilkan</button><button type="button" className="primary-button" onClick={openAdd}>＋ Tambah Data</button></div></div>
        {showFilter && <div className="filter-panel"><label htmlFor="role-filter">Filter Role</label><select id="role-filter" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}><option value="">All roles</option>{roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}</select><button type="button" className="reset-filter-button" onClick={() => { setSearch(""); setSelectedRole(""); }}>Reset</button></div>}
        <div className="table-wrapper"><table className="user-table"><thead><tr><th>No</th><th>Username</th><th>Department</th><th>Position</th><th>Type</th><th></th></tr></thead><tbody>{filteredUsers.length ? filteredUsers.map((user, index) => <tr key={user.id}><td>{index + 1}</td><td>{user.username}</td><td>{user.department || "-"}</td><td>{user.position || "-"}</td><td>{roleLabels[user.role]}</td><td className="action-cell"><button type="button" className="menu-button" onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}>⋮</button>{activeMenu === user.id && <div className="row-action-menu"><button type="button" onClick={() => openEdit(user)}>Edit</button><button type="button" onClick={() => void deleteUser(user)}>Hapus</button></div>}</td></tr>) : <tr><td colSpan={6} className="empty-table">Data user tidak ditemukan.</td></tr>}</tbody></table></div><div className="table-footer"><span>{filteredUsers.length} data</span></div></section>
      {modal && <div className="modal-overlay"><div className="user-modal"><div className="modal-header"><h2>{modal === "add" ? "Tambah Data User" : "Edit Data User"}</h2><button type="button" className="modal-close-button" onClick={() => setModal(null)}>×</button></div><div className="modal-form"><label htmlFor="user-name">Username</label><input id="user-name" value={form.username} onChange={(event) => updateField("username", event.target.value)} placeholder="Masukkan username" /><label htmlFor="user-password">Password {modal === "edit" && "(kosongkan jika tidak diubah)"}</label><input id="user-password" type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} placeholder="Masukkan password" /><label htmlFor="user-department">Department</label><input id="user-department" value={form.department} onChange={(event) => updateField("department", event.target.value)} placeholder="Masukkan department" /><label htmlFor="user-position">Position</label><input id="user-position" value={form.position} onChange={(event) => updateField("position", event.target.value)} placeholder="Masukkan posisi" /><label htmlFor="user-role">Type</label><select id="user-role" value={form.role} onChange={(event) => updateField("role", event.target.value)}>{roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}</select></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>Batal</button><button type="button" className="primary-button" onClick={() => void saveUser()}>Simpan</button></div></div></div>}
    </div>
  );
}
