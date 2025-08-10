import { ReactNode, useEffect, useState } from "react";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    const email = localStorage.getItem("authEmail");
    if (!email) {
      window.location.href = "/login";
    } else {
      setOk(true);
    }
  }, []);
  if (!ok) return null;
  return <>{children}</>;
}
