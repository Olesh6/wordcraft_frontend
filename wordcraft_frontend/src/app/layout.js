import './styles/global.css'
import Header from "./components/Header.jsx"
import Sidebar from "./components/Sidebar.jsx"
import Info from "./components/Info.jsx"

export const metadata = {
  title: "WordCraft",
  description: "Best site",
  icons: {
    icon: "/icon.png"
  }
}


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <Header />
        <div className="content-with-sidebar">
          <Sidebar />
          <main className='main-page'>{children}</main>
        </div>
        <Info />
      </body>
    </html>
  );
}
