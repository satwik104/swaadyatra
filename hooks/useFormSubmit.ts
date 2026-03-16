"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

interface Options<T> {
  url: string;
  onSuccess?: () => void;
  buildBody: (data: T) => BodyInit;
  headers?: Record<string, string>;
}

export function useFormSubmit<T>({ url, onSuccess, buildBody, headers }: Options<T>) {
  const [status, setStatus] = useState<Status>("idle");
  const [apiMessage, setApiMessage] = useState("");

  async function submit(data: T) {
    setStatus("loading");
    setApiMessage("");
    try {
      const res = await fetch(url, { method: "POST", headers, body: buildBody(data) });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus("success");
        setApiMessage(json.message ?? "");
        onSuccess?.();
      } else {
        setStatus("error");
        setApiMessage(json.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setApiMessage("Something went wrong. Please try again.");
    }
  }

  const reset = () => { setStatus("idle"); setApiMessage(""); };

  return { status, apiMessage, submit, reset };
}
