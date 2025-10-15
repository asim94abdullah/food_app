


/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.

  dispatch({type: Actions.GetBalance})
*/
function* Saga() {
    
}

export const Actions = {
    GetBalance: "Get_Balance"
}

export default Saga;