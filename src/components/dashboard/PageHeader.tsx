export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}