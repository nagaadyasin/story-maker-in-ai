export function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <span className="text-4xl">🚧</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground">
        This module is currently under development.
      </p>
    </div>
  );
}
