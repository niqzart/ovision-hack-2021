import React from "react";

import Age from "../../atoms/Age";
import EmotionStatus from "../../atoms/EmotionStatus";
import GenderImage from "../../atoms/GenderImage";
import ProfileImage from "../../atoms/ProfileImage";

import "./index.scss";
import BodypartList from "../../molecules/BodypartList";


const Card = ({ profileImage, gender, emotion, age, className }) => {
    return (
        <div className={className}>
            <Age className="card__age" age={age} />
            <EmotionStatus className="card__emotion" emotion={emotion} />
            <GenderImage className="card__gender-image" gender={gender} />
            <ProfileImage className="card__profile-image" profileImage={profileImage} />
            <BodypartList className={"card__bodypart-list"} />
        </div>
    );
}

export default Card;
