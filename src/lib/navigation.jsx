"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Link({ to, href, onClick, ...props }) {
  const target = href ?? to;

  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented || !target?.startsWith("/#")) return;

    const id = target.slice(2);
    if (window.location.pathname === "/") {
      event.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", target);
    }
  }

  return <NextLink href={target} onClick={handleClick} {...props} />;
}

export function useLocation() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    function syncHash() {
      setHash(window.location.hash);
    }

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  return { pathname, hash };
}

export function useNavigate() {
  const router = useRouter();
  return (target) => router.push(target);
}
