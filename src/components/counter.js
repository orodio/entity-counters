import { html } from "@fp/html"
import { silence } from "@fp/silence"
import withCounter from "../sidecars/with-counter"
import counter from "../domains/counter"

export const Render = ({ counterId, count, inc = counter.inc, dec = counter.dec }) =>
  counterId == null
    ? html`
        <div>Loading...<//>
      `
    : html`
        <div>
          <div>
            <strong>${counterId}: <//>
            <span>${count}<//>
          <//>
          <div>
            <button onClick=${silence(_ => dec(counterId))}>dec<//>
            <button onClick=${silence(_ => inc(counterId))}>inc<//>
          <//>
        <//>
      `

export default withCounter(Render)
