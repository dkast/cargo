import Sidebar from "@/app/dashboard/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-60">{children}</div>
    </>
  )
}
