import { Header } from "@/src/components/header";
import { Sidebar } from "@/src/components/sidebar";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex flex-col h-full bg-gray-100">
      <Header user={"teste"} />
      <main className="lg:pl-40">
        <Sidebar />
        {children}
      </main>
    </section>
  );
}
