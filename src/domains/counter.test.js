import counter from "./counter"
import { Entity } from "@fp/entity"

const sleep = ms => new Promise(resolve => setTimeout(() => resolve(ms), ms))

test("counter - inc and dec", async () => {
  const ID = "asdf"

  const getCount = jest.fn(() => Promise.resolve(5))
  const saveCount = jest.fn(v => v)
  const broadcastCount = jest.fn()

  const c1 = counter.init(ID, {
    debug: false,
    inject: {
      $$: { getCount, saveCount },
      broadcast: {
        count: broadcastCount,
      },
    },
  })

  const c2 = counter.init(ID, {
    debug: false,
    inject: {
      $$: { getCount, saveCount },
      broadcast: {
        count: broadcastCount,
      },
    },
  })

  expect(c1).toBe(c2)

  const t1 = await counter.dump(ID)
  expect(t1.id).toBe(ID)
  expect(t1.count).toBe(5)

  counter.inc(ID)
  counter.inc(ID, 5)
  const t2 = await counter.dump(ID)
  expect(t2.count).toBe(11)

  counter.dec(ID)
  counter.dec(ID, 5)
  const t3 = await counter.dump(ID)
  expect(t3.count).toBe(5)

  counter.subscribe(ID, "foo")
  counter.subscribe(ID, "bar")
  counter.subscribe(ID, "bar")
  const t4 = await counter.dump(ID)
  expect(t4.count).toBe(5)
  expect(t4.subs.size).toBe(2)
  expect(t4.subs.has("foo")).toBe(true)
  expect(t4.subs.has("bar")).toBe(true)
  expect(t4.subs.has("baz")).toBe(false)

  counter.unsubscribe(ID, "foo")
  counter.unsubscribe(ID, "bar")
  counter.unsubscribe(ID, "bar")
  counter.subscribe(ID, "baz")
  const t5 = await counter.dump(ID)
  expect(t5.subs.size).toBe(1)
  expect(t5.subs.has("foo")).toBe(false)
  expect(t5.subs.has("bar")).toBe(false)
  expect(t5.subs.has("baz")).toBe(true)

  counter.stop(ID)
  await sleep(50)
})

test("counter - sub and unsub", async () => {
  const ID = "rawr"

  const getCount = jest.fn(() => Promise.resolve(5))
  const saveCount = jest.fn(v => v)

  counter.init(ID, {
    debug: false,
    inject: {
      $$: { getCount, saveCount },
    },
  })

  const handleCount = jest.fn(({ Ok }) => Ok())
  const sub = Entity("sub", {
    init({ Ok }) {
      return Ok()
    },
    handleTell: {
      [counter.count]: handleCount,
    },
  })

  const s1 = sub.init()

  counter.subscribe(ID, s1)
  await counter.dump(ID)
  await sub.dump(s1)
  expect(handleCount).toHaveBeenCalledTimes(1)
  expect(handleCount.mock.calls[0][2].count).toBe(5)

  counter.inc(ID)
  await counter.dump(ID)
  await sub.dump(s1)
  expect(handleCount).toHaveBeenCalledTimes(2)
  expect(handleCount.mock.calls[1][2].count).toBe(6)

  counter.dec(ID, 5)
  await counter.dump(ID)
  await sub.dump(s1)
  expect(handleCount).toHaveBeenCalledTimes(3)
  expect(handleCount.mock.calls[2][2].count).toBe(1)
})
