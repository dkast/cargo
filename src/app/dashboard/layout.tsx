import Sidebar from "@/app/dashboard/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="flex min-h-screen flex-col py-8 lg:pl-60">{children}</div>
    </>
  )
}
