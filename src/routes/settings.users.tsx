import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { useState } from "react";
import { Trash2 } from "lucide-react";

type Role = "Admin" | "Manager" | "Viewer";
interface User { id: string; name: string; email: string; role: Role; }

const INITIAL: User[] = [
  { id: "1", name: "Aman Prajapati", email: "aman@prajapati.in", role: "Admin" },
  { id: "2", name: "Priya Rao", email: "priya@prajapati.in", role: "Manager" },
  { id: "3", name: "Karan Malhotra", email: "karan@prajapati.in", role: "Viewer" },
];

export const Route = createFileRoute("/settings/users")({
  component: UsersPage,
});

function UsersPage() {
  const [users, setUsers] = useState(INITIAL);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Viewer");

  const add = () => {
    if (!name || !email) return;
    setUsers([...users, { id: Date.now().toString(), name, email, role }]);
    setName(""); setEmail("");
  };

  return (
    <div>
      <PageHeader title="Manage Users and Roles" />
      <div className="flex gap-2 mb-6 flex-wrap">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border border-border rounded-md px-3 py-2 text-sm" />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-border rounded-md px-3 py-2 text-sm" />
        <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="border border-border rounded-md px-3 py-2 text-sm">
          <option>Admin</option><option>Manager</option><option>Viewer</option>
        </select>
        <Button onClick={add}>Add User</Button>
      </div>
      <DataTable
        rows={users}
        columns={[
          { key: "name", label: "Name", render: (r) => r.name },
          { key: "email", label: "Email", render: (r) => r.email },
          { key: "role", label: "Role", render: (r) => (
            <select
              value={r.role}
              onChange={(e) => setUsers(users.map((u) => u.id === r.id ? { ...u, role: e.target.value as Role } : u))}
              className="bg-transparent border-b border-border text-sm focus:outline-none"
            >
              <option>Admin</option><option>Manager</option><option>Viewer</option>
            </select>
          ) },
          { key: "action", label: "", align: "right", render: (r) => (
            <button onClick={() => setUsers(users.filter((u) => u.id !== r.id))} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded">
              <Trash2 className="h-4 w-4" />
            </button>
          ) },
        ]}
      />
    </div>
  );
}