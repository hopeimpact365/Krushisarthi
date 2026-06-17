"use client";

import { useEffect } from "react";
import disableDevtool from "disable-devtool";

export function SecurityProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Allow inspection during local development
      return;
    }

    try {
      disableDevtool({
        url: "about:blank",
        disableMenu: true,
        disableSelect: false,
        disableCopy: false,
        clearLog: true,
      });
    } catch (err) {
      console.error("SecurityProvider error:", err);
    }
  }, []);

  return null;
}
