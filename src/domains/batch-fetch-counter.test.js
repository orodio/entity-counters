import { getCount, batchFetchCounter } from "./batch-fetch-counter"

const sleep = ms => new Promise(resolve => setTimeout(() => resolve(ms), ms))

test("batchFetchCounter", async () => {
  const BATCH = 5
  const RESULT = 34
  const sync = jest.fn((ids = []) => ids.reduce((acc, id) => ({ ...acc, [id]: RESULT }), {}))

  batchFetchCounter.init(null, {
    debug: false,
    inject: { $$: { sync }, __: { batchSize: BATCH } },
  })

  const ids = "abcdefghijklmnopqrstuvwxyz".split("")
  const results = await Promise.all(ids.map(getCount))
  expect(results).toEqual(ids.map((_, i) => RESULT))
  expect(sync).toHaveBeenCalledTimes(Math.ceil(ids.length / BATCH))
})
