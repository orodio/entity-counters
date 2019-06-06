import { html } from "@fp/html"
import ReactDOM from "react-dom"
import App from "./components/app"

ReactDOM.render(
  html`
    <${App} />
  `,
  document.getElementById("ROOT")
)
