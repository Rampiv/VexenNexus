import { Route, Routes } from "react-router"
import "./App.scss"
import React from "react"
import { Footer, Header } from "./components"
import { Banners, Main, Privacy, Resonator, Resonators } from "./pages"

const HeaderMemo = React.memo(Header)
const FooterMemo = React.memo(Footer)
const MainMemo = React.memo(Main)
const ResonatorsMemo = React.memo(Resonators)
const BannersMemo = React.memo(Banners)
const ResonatorMemo = React.memo(Resonator)
const PrivacyMemo = React.memo(Privacy)

export default function App() {
  return (
    <div className="App">
      <HeaderMemo />
      <Routes>
        <Route path="/" element={<MainMemo />} />
        <Route path="/resonators" element={<ResonatorsMemo />} />
        <Route path="/resonator/:id" element={<ResonatorMemo />} />
        <Route path="/banners" element={<BannersMemo />} />
        <Route path="/privacy" element={<PrivacyMemo />} />
      </Routes>
      <FooterMemo />
    </div>
  )
}
