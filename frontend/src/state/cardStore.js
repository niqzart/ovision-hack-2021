import {createEvent, createStore} from "effector";

const createCard = createEvent();
const removeCard = createEvent();
const clearAllCards = createEvent();
const loadCards = createEvent();

const $cardStore = createStore([])
    // add new card
    .on(createCard, (state, card) => {return [...state, card]})
    // load cards
    .on(loadCards, (state, cards) => { return cards; })
    // clear cards
    .on(clearAllCards, (state, cards) => {return []; })


export {clearAllCards, loadCards, createCard};
export {$cardStore};

