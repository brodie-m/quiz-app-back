const initialState = {
    questions: []
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case 'LOAD_QUESTIONS':
        return { ...state, ...payload }

    default:
        return state
    }
}
