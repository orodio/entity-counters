import { html } from "@fp/html"
import Counter from "./counter"

export default () => html`
  <div>
    <${Counter} counterId="foo" />
    <${Counter} counterId="bar" />
    <${Counter} counterId="baz" />
    <hr />
    <${Counter} counterId="foo" />
    <${Counter} counterId="bar" />
    <${Counter} counterId="baz" />
    <hr />
    <${Counter} counterId="a" />
    <${Counter} counterId="b" />
    <${Counter} counterId="c" />
    <${Counter} counterId="d" />
    <${Counter} counterId="e" />
    <${Counter} counterId="f" />
    <${Counter} counterId="g" />
  <//>
`
