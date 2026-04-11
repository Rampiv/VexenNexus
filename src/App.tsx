import { Route, Routes } from "react-router"
import "./App.scss"
import React from "react"
import { Footer, Header } from "./components"
import {
  Feedback,
  Egg,
  Greeting,
  Privacy,
  Resonator,
  Mechanic,
  Admin,
} from "./pages"

const HeaderMemo = React.memo(Header)
const FooterMemo = React.memo(Footer)
const GreetingMemo = React.memo(Greeting)
const ResonatorMemo = React.memo(Resonator)
const PrivacyMemo = React.memo(Privacy)
const FeedbackMemo = React.memo(Feedback)
const EggMemo = React.memo(Egg)
const MechanicMemo = React.memo(Mechanic)

export default function App() {
  return (
    <div className="App">
      <HeaderMemo />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<GreetingMemo />} />
            <Route path="/resonator/:id" element={<ResonatorMemo />} />
            <Route path="/mechanics/:id" element={<MechanicMemo />} />
            <Route path="/privacy" element={<PrivacyMemo />} />
            <Route path="/feedback" element={<FeedbackMemo />} />
            <Route path="/egg" element={<EggMemo />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </main>
      <FooterMemo />
    </div>
  )
}
