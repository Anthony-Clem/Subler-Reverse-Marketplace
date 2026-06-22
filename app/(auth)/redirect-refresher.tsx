"use client";

import { useEffect } from "react";

export default function RedirectRefresher() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("new_login") === "true") {
      const url = new URL(window.location.href);
      url.searchParams.delete("new_login");
      // Hard refresh to the clean URL, releasing Lax cookie isolation
      window.location.replace(url.pathname + url.search);
    }
  }, []);

  return null;
}
