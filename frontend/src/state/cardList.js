import {createEvent, createStore} from "effector";

const createCard = createEvent();
const removeCard = createEvent();
const clearAllCards = createEvent();
const loadCards = createEvent();

const $cardStore = createStore([])
// load cards
    .on(loadCards, (state, cards) => { return cards; })
// clear cards
    .on(clearAllCards, (state, cards) => {return []; })


export {clearAllCards, loadCards};
export {$cardStore};

