import React from 'react';

import Age from "../../atoms/Age";
import EmotionStatus from "../../atoms/EmotionStatus";
import GenderImage from "../../atoms/GenderImage";
import ProfileImage from "../../atoms/ProfileImage";
import BodypartList from "../../molecules/BodypartList";

import "./index.scss";


const Card = ({profileImage, gender, emotion, age, bodyparts}) => {
    return (
        <div className="card">
            <Age age={age} />
            <EmotionStatus emotion={emotion} />
            <GenderImage gender={gender} />
            <ProfileImage profileImage={profileImage} />
            <BodypartList bodyparts={bodyparts} />
        </div>
    );
}

export default Card;
