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
            const card = new Card(i, dto[i]["age"], "null", dto[i]["gender"]);
            card.landmarks = dto[i]["landmarks"];
            card.genderConfidence = dto[i]["genderConfidence"];
            card.faceRegionColor = dto[i]["faceRegionColor"];
            card.jawLine = dto[i]["jawLine"];
            result.push(card);
        }
        return result;
    } else {
        return [];
    }
}


export default Card;
export {dtoToCardList};
