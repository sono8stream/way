const auth = (state = {noData: true}, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return {ownKey: action.ownKey}
    default:
      return state
  }
}

export default auth
