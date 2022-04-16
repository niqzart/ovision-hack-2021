import React from 'react';


const EmotionStatus = ({emotion, className}) => {
    return (
        <span className={className}>{emotion}</span>
    );
}

export default EmotionStatus;