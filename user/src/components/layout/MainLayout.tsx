import { Outlet } from 'react-router-dom'
import { ChatWidget } from '@/components/chatbot/ChatWidget'
import { DemoControls } from '@/components/chatbot/DemoControls'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { siteConfig } from '@/config/site'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      {siteConfig.demoMode ? <DemoControls /> : null}
    </div>
  )
}
