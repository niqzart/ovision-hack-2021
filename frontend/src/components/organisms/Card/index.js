import React from 'react';

import Age from "../../atoms/Age";
import EmotionStatus from "../../atoms/EmotionStatus";
import GenderImage from "../../atoms/GenderImage";
import ProfileImage from "../../atoms/ProfileImage";
import BodypartList from "../../molecules/BodypartList";


const Card = ({profileImage, gender, emotion, age, bodyparts}) => {
    return (
        <div className="card">
            <Age age={age} />
            <EmotionStatus emotion={} />
            <GenderImage gender={} />
            <ProfileImage profileImage={} />
            <BodypartList bodyparts={bodyparts} />
        </div>
    );
}

export default Card;
