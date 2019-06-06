import { html } from "@fp/html"
import renderer from "react-test-renderer"
import counter from "../domains/counter"
import Counter, { Render } from "./counter"

const sleep = ms => new Promise(resolve => setTimeout(() => resolve(ms), ms))

test("Render", () => {
  const inc = jest.fn()
  const dec = jest.fn()

  const c1 = renderer.create(html`
    <${Counter} />
  `)
  expect(c1.toJSON()).toMatchSnapshot("c1 - no counterId - loading")

  const c2 = renderer.create(html`
    <${Counter} counterId="baz" />
  `)
  expect(c2.toJSON()).toMatchSnapshot("c2 - no count - loading")

  const c3 = renderer.create(html`
    <${Counter} counterId="baz" count=${9} inc=${inc} dec=${dec} />
  `)
  expect(c3.toJSON()).toMatchSnapshot("c3 - renders counter")
})

test("Counter", async () => {
  const ID = "baz"

  counter.init(ID, {
    debug: false,
    inject: {
      $$: {
        getCount: jest.fn(() => Promise.resolve(32)),
        saveCount: jest.fn(v => v),
      },
    },
  })

  let c1 = renderer.create(
    html`
      <${Counter} counterId=${ID} />
    `
  )

  expect(c1.toJSON()).toMatchSnapshot("c1 loading")
  await sleep(50)
  expect(c1.toJSON()).toMatchSnapshot("c1 after subscribe")

  counter.inc(ID)
  await sleep(50)
  expect(c1.toJSON()).toMatchSnapshot("c1 after inc")
})
