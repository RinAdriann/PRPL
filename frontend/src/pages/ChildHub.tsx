import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/state/AuthContext";

const ChildHub: React.FC = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const data = await api.educatorChildren();
        setChildren(data);
      } catch (e: any) {
        setErr(e.message);
      }
    }
    load();
  }, [user]);

  if (!user) return <div>Please login.</div>;
  return (
    <div>
      <h2>Child Hub</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <ul>{children.map((c) => <li key={c.id}>{c.name || c.id}</li>)}</ul>
    </div>
  );
};

export default ChildHub;
