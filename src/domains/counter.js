import { Entity } from "@fp/entity"
import { pick } from "@fp/pick"
import { getCount } from "./batch-fetch-counter"

const saveCountToApi = ({ id, count }) => Promise.resolve({ id, count })

export default Entity("counter", {
  withName: (id, label) => `${label}|${id}`,

  dependencies() {
    return {
      getCount,
      saveCount: saveCountToApi,
    }
  },

  broadcast: {
    count: state => pick(state, ["id", "count"]),
  },

  async init({ $$, Ok }, id) {
    const subs = new Set()
    const count = await $$.getCount(id)
    return Ok({ id, subs, count })
  },

  handleTell: {
    subscribe({ Ok, broadcast }, state, sub) {
      state.subs.add(sub)
      broadcast.count([sub], state)
      return Ok(state)
    },
    unsubscribe({ Ok }, state, sub) {
      state.subs.delete(sub)
      return Ok(state)
    },
    inc({ Ok, Continue, broadcast }, state, delta = 1) {
      state.count = state.count + delta
      broadcast.count(state.subs, state)
      return Ok(state, Continue("persist"))
    },
    dec({ Ok, Continue, broadcast }, state, delta = 1) {
      state.count = state.count - delta
      broadcast.count(state.subs, state)
      return Ok(state, Continue("persist"))
    },
  },

  handleContinue: {
    persist({ $$, Ok }, state) {
      $$.saveCount(pick(state, ["id", "count"]))
      return Ok(state)
    },
  },

  terminate(_ctx, _state, reason) {
    return reason
  },
})
