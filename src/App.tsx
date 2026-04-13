import { Route, Routes } from "react-router"
import "./App.scss"
import React from "react"
import { Footer, Header } from "./components"
import {
  Feedback,
  Greeting,
  Privacy,
  ResonatorPage,
  Mechanic,
  Admin,
  EchoSets,
  Weapons,
} from "./pages"

const HeaderMemo = React.memo(Header)
const FooterMemo = React.memo(Footer)
const GreetingMemo = React.memo(Greeting)
const ResonatorMemo = React.memo(ResonatorPage)
const PrivacyMemo = React.memo(Privacy)
const FeedbackMemo = React.memo(Feedback)
const MechanicMemo = React.memo(Mechanic)
const EchoSetsMemo = React.memo(EchoSets)
const WeaponsMemo = React.memo(Weapons)

export default function App() {
  return (
    <div className="App">
      <HeaderMemo />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<GreetingMemo />} />
            <Route path="/resonator/:engName" element={<ResonatorMemo />} />
            <Route path="/mechanics/:engName?" element={<MechanicMemo />} />
            <Route path="/privacy" element={<PrivacyMemo />} />
            <Route path="/feedback" element={<FeedbackMemo />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/echoSets/:engName?" element={<EchoSetsMemo />} />
            <Route path="/weapons/:engName?" element={<WeaponsMemo />} />
          </Routes>
        </div>
      </main>
      <FooterMemo />
    </div>
  )
}
