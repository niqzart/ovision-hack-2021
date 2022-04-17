class Card {
    landmarks;
    genderConfidence;
    faceRegionColor;
    jawLine;
    constructor(id, age, emotion, gender){
        this.id = id;
        this.age = age;
        this.emotion = emotion;
        this.gender = gender;
    }
}

function dtoToCardList(dto) {
    if (dto != null) {
        const result = [];
        for (let i = 0; i < dto.length; ++i) {
            const card = new Card(i, dto["age"], "null", dto["gender"]);
            card.landmarks = dto["landmarks"];
            card.genderConfidence = dto["genderConfidence"];
            card.faceRegionColor = dto["faceRegionColor"];
            card.jawLine = dto["jawLine"];
            result.push(card);
        }
        return result;
    } else {
        return [];
    }
}


export default Card;
export {dtoToCardList};
