import { Entity } from "@fp/entity"

const batchFetchFromApi = (ids = []) =>
  Promise.resolve(ids.reduce((acc, id) => ({ ...acc, [id]: ~~(Math.random() * 10) }), {}))

// Super naive batch fetcher, this is a good place for improvements
export const batchFetchCounter = Entity("batchFetchCounter", {
  withName: (_, label) => label,

  dependencies() {
    return {
      sync: batchFetchFromApi,
    }
  },

  config: {
    batchSize: 3,
    maxTimeInMs: 100,
  },

  init({ Ok }) {
    return Ok({})
  },

  handleAsk: {
    get({ Ok, Continue, reply }, state, id) {
      state[id] = reply
      return Ok(state, Continue("process"))
    },
  },

  handleContinue: {
    process({ __, Ok, Timeout, Continue }, state) {
      return Object.keys(state).length >= __.batchSize
        ? Ok(state, Continue("fetch"))
        : Ok(state, Timeout(__.maxTimeInMs))
    },

    async fetch({ $$, Ok }, state) {
      const have = await $$.sync(Object.keys(state))
      for (let id of Object.keys(have)) {
        state[id](have[id])
        delete state[id]
      }
      return Ok(state)
    },
  },

  handleTimeout({ Ok, Continue }, state) {
    return Ok(state, Continue("fetch"))
  },
})

export const getCount = id => {
  batchFetchCounter.init()
  return batchFetchCounter.ask(null, "get", id)
}
