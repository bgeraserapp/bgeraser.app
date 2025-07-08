export const metadata = {
  title: "Docs Page",
  description: "This is the documentation page for the application.",
};

export default function ConsolePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Docs Page</h1>
      <p className="text-lg">This is the console page.</p>
    </div>
  );
}
