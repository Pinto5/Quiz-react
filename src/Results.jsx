// This component will display the quiz results 
// alongside the image obtained from the API

import React, { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Results({ element, artwork, error, loading, onRestart }) {
  // reference the context for the "name".
  const { name } = useContext(UserContext);

    if (!element) {
        return <p>Calculating your result...</p>;
    }

  return (
    <div>
        <p>
            <strong>{name}</strong>, your element is: {element}
        </p>

        {error && <p>{error}</p>}

        {loading && <p>Loading artwork...</p>}

        {!loading && !error && artwork ? (
            <div className="artwork">
            <h2>{artwork.title}</h2>
            <img src={artwork.primaryImage} alt={artwork.title} />
            <p>{artwork.artistDisplayName}</p>
            <p>{artwork.objectDate}</p>
            </div>
        ) : (
            !loading && !error && <p>No artwork found.</p>
        )}

        <button className="restart-quiz" onClick={onRestart}>Take quiz again</button>
    </div>
  );
}