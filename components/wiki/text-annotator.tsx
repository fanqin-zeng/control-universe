"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface Annotation {
  id: string;
  text: string;
  priority: "low" | "medium" | "high";
  author: string;
  authorRole: "author" | "reader";
  status: "pending" | "approved" | "rejected";
  visible: boolean;
}

interface AnnotationContextValue {
  annotations: Annotation[];
  addAnnotation: (a: Omit<Annotation, "id" | "status">) => void;
  toggleVisibility: (id: string) => void;
  removeAnnotation: (id: string, author: string) => void;
  showAll: boolean;
  setShowAll: (show: boolean) => void;
}

const AnnotationContext = createContext<AnnotationContextValue | null>(null);

const STORAGE_KEY = "control-universe-annotations";

export function AnnotationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setAnnotations(JSON.parse(saved));
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
    } catch {
      // ignore storage errors
    }
  }, [annotations]);

  const addAnnotation = (a: Omit<Annotation, "id" | "status">) => {
    const next: Annotation = {
      ...a,
      id: crypto.randomUUID(),
      status: "pending",
    };
    setAnnotations((prev) => [...prev, next]);
  };

  const toggleVisibility = (id: string) => {
    setAnnotations((prev) =>
      prev.map((x) => (x.id === id ? { ...x, visible: !x.visible } : x))
    );
  };

  const removeAnnotation = (id: string, author: string) => {
    setAnnotations((prev) =>
      prev.filter((x) => !(x.id === id && x.author === author))
    );
  };

  return (
    <AnnotationContext.Provider
      value={{
        annotations,
        addAnnotation,
        toggleVisibility,
        removeAnnotation,
        showAll,
        setShowAll,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
}

export const useAnnotations = () => {
  const ctx = useContext(AnnotationContext);
  if (!ctx)
    throw new Error("useAnnotations must be used inside AnnotationProvider");
  return ctx;
};
