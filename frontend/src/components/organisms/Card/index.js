import React from 'react';

import Age from "../../atoms/Age";
import EmotionStatus from "../../atoms/EmotionStatus";
import GenderImage from "../../atoms/GenderImage";
import ProfileImage from "../../atoms/ProfileImage";

import "./index.scss";
import BodypartList from "../../molecules/BodypartList";


const Card = ({profileImage, gender, emotion, age}) => {
    return (
        <div className="card">
            <Age age={age} />
            <EmotionStatus emotion={emotion} />
            <GenderImage gender={gender} />
            <ProfileImage profileImage={profileImage} />
            <BodypartList />
        </div>
    );
}

export default Card;
