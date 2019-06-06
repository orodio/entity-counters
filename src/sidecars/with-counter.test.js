import withCounter from "./with-counter"
import counter from "../domains/counter"
import { Entity } from "@fp/entity"
import { html } from "@fp/html"
import renderer from "react-test-renderer"

const sleep = ms => new Promise(resolve => setTimeout(() => resolve(ms), ms))

const Render = ({ counterId, count }) =>
  count == null
    ? html`
        <div>Loading...</div>
      `
    : html`
        <div>${counterId}: ${count}</div>
      `

test("withCounter", async () => {
  const ID = "foo"
  counter.init(ID, {
    debug: false,
    inject: {
      $$: {
        getCount: jest.fn(() => Promise.resolve(10)),
        saveCount: jest.fn(v => v),
      },
    },
  })

  const Counter = withCounter(Render)

  let c1 = renderer.create(
    html`
      <${Counter} counterId=${ID} />
    `
  )

  expect(c1.toJSON()).toMatchSnapshot("c1 loading")
  await sleep(50)
  expect(c1.toJSON()).toMatchSnapshot("c1 after subscribe")

  counter.inc(ID, 5)
  await sleep(50)
  expect(c1.toJSON()).toMatchSnapshot("c1 after inc")

  const c2 = renderer.create(
    html`
      <${Counter} counterId=${ID} />
    `
  )
  await sleep(50)
  expect(c2.toJSON()).toMatchSnapshot("c2 after subscribe")

  counter.dec(ID)
  await sleep(50)
  expect(c1.toJSON()).toMatchSnapshot("*c1* and c2 after dec")
  expect(c2.toJSON()).toMatchSnapshot("c1 and *c2* after dec")

  const t1 = await counter.dump(ID)
  expect(t1.subs.size).toBe(2)

  c1.unmount()
  c2.unmount()
  await sleep(50)
  const t2 = await counter.dump(ID)
  expect(t2.subs.size).toBe(0)
})
