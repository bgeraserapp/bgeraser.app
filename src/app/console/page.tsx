export const metadata = {
  title: 'Console Page',
  description: 'This is the console page for the application.',
};

export default function ConsolePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Console Page</h1>
      <p className="text-lg">This is the console page.</p>
    </div>
  );
}
