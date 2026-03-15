import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({ title, actions, children }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-60">
        <Navbar title={title} actions={actions} />
        <main className="flex-1 p-6 animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  )
}