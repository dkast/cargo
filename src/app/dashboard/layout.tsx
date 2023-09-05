import Sidebar from "@/app/dashboard/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <main className="py-8 lg:pl-60">
        <div>{children}</div>
      </main>
    </div>
  )
}
