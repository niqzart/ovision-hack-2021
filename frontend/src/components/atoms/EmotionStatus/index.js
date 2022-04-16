import React from 'react';

import "./index.scss";


const EmotionStatus = ({emotion}) => {
    return (
        <span className="card__emotion">{emotion}</span>
    );
}

export default EmotionStatus;