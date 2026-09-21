import { Sidebar } from "@/components/wiki/sidebar";
import { MobileHeader } from "@/components/wiki/mobile-header";
import { AnnotationProvider } from "@/components/wiki/text-annotator";

export default function WikiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnnotationProvider>
      <div className="flex min-h-screen">
        <aside className="hidden lg:block w-64 shrink-0 border-r bg-muted/30 p-4">
          <div className="sticky top-0 max-h-screen overflow-y-auto">
            <Sidebar />
          </div>
        </aside>
        <div className="flex flex-1 flex-col">
          <MobileHeader />
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </AnnotationProvider>
  );
}
