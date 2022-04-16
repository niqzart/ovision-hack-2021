import React from 'react';

import "./index.scss";

// import femaleLogo from "../../../assets/"

const GenderImage = ({gender}) => {
    let image_path;
    switch (gender) {
        case "male": {
            image_path = "../";
            break;
        }
        case "female" : {
            image_path = "path-2"
            break
        }
        default: {
            image_path = "undefined";
        }
    }
    image_path = "";

    return (
        // <img className="card__gender-image" src="../" />
        <span>{gender}</span>
    );
}

export default GenderImage;