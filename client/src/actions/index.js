const loadQuestions = (questionsData) => ({
    type: 'LOAD_QUESTIONS',
    payload: questionsData
});

export const getQuestions = () => {
    return async (dispatch) => {
      try {
        const results = await fetchQuestions();
        await dispatch(loadQuestions(results));
      } catch (err) {
        console.warn(err.message);
      }
    };
  };

const fetchQuestions = async () => {
    try {
        const resp = await fetch(`https://opentdb.com/api.php?amount=10&category=24&difficulty=medium&type=multiple`)
        const data = await resp.json();
        return data.results
    } catch (err) {
        throw new Error(err.message)
    }
}

