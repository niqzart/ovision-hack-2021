import React from 'react';


// import femaleLogo from "../../../assets/"

const GenderImage = ({gender, className}) => {
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
        <span className={className}>{gender}</span>
    );
}

export default GenderImage;