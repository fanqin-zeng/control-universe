/** Next Link handles basePath itself; this helper is for plain HTML assets/MDX links. */
export function withBasePath(value: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return base && value.startsWith("/") && !value.startsWith("//") && value !== base && !value.startsWith(base + "/")
    ? base + value : value;
}

/** usePathname may carry a trailing slash in the exported site. */
export function lessonPath(value: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const path = base && (value === base || value.startsWith(base + "/")) ? value.slice(base.length) : value;
  return path.replace(/\/+$/, "") || "/";
}
