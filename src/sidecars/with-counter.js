import withEntity from "@fp/with-entity"
import counter from "../domains/counter"

export default withEntity("withCounter", {
  dependencies() {
    return {
      counter,
    }
  },

  init({ $$, Ok, self }, { counterId }) {
    $$.counter.init(counterId)
    $$.counter.subscribe(counterId, self())
    return Ok({ counterId })
  },

  handleTell: {
    [counter.count]({ Ok, setProps }, state, { count }) {
      setProps({ count })
      return Ok(state)
    },
  },

  terminate({ $$, self }, state, reason) {
    $$.counter.unsubscribe(state.counterId, self())
    return reason
  },
})
