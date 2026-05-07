import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Header from "./Header.jsx";
import Question from "./Question.jsx";
import Results from "./Results.jsx";
import UserForm from "./UserForm.jsx";
import { UserProvider } from "./UserContext.jsx";



function App(){

  const questions = [
    {
      question: "What's your favorite color?",
      options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
    },
    {
      question: "Choose a place:",
      options: ["Volcano 🌋", "Ocean 🌊", "Forest 🌳", "Sky ☁️"],
    },
    {
      question: "Choose an activity:",
      options: ["Dancing 🔥", "Swimming 🏊", "Gardening 🌱", "Flying 🪽"],
    },
  ];

  const keywords = {
    Fire: "fire",
    Water: "water",
    Earth: "earth",
    Air: "air",
  };

  const elements = {
    "Red 🔴": "Fire",
    "Blue 🔵": "Water",
    "Green 🟢": "Earth",
    "Yellow 🟡": "Air",

    "Volcano 🌋": "Fire",
    "Ocean 🌊": "Water",
    "Forest 🌳": "Earth",
    "Sky ☁️": "Air",

    "Dancing 🔥": "Fire",
    "Swimming 🏊": "Water",
    "Gardening 🌱": "Earth",
    "Flying 🪽": "Air",
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState("");
  const [artwork, setArtwork] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleAnswer(answer) {
    setAnswers(function (previousAnswers) {
      return [...previousAnswers, answer];
    });

    setCurrentQuestionIndex(function (previousIndex) {
      return previousIndex + 1;
    });
  }


  function determineElement(answers) {
    const counts = {};
    answers.forEach(function(answer) {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce(function(a, b) {
      return counts[a] > counts[b] ? a : b
    });
  };

async function fetchArtwork(keyword) {
  const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keyword}`;

  try {
    setError(null);
    setArtwork(null);
    setLoading(true);

    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      throw new Error("Failed to search artwork");
    }

    const searchData = await searchResponse.json();

    if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
      setArtwork(null);
      return;
    }

    const objectId = searchData.objectIDs[0];

    const objectResponse = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
    );

    if (!objectResponse.ok) {
      throw new Error("Failed to fetch artwork details");
    }

    const objectData = await objectResponse.json();
    const image = objectData.primaryImage || objectData.primaryImageSmall;

    if (!image) {
      setArtwork(null);
      return;
    }

    setArtwork({
      title: objectData.title,
      primaryImage: image,
      artistDisplayName: objectData.artistDisplayName || "Unknown artist",
      objectDate: objectData.objectDate || "Unknown date",
    });
  } catch (error) {
    setError("Error fetching data. Please try again later.");
  } finally {
    setLoading(false);
  }
}

  function resetQuiz() {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setElement("");
    setArtwork(null);
    setError(null);
    setLoading(false);
  }


  useEffect(
    function () {
      if (
        currentQuestionIndex === questions.length &&
        answers.length === questions.length
      ) {
        const selectedElement = determineElement(answers);
        setElement(selectedElement);
        fetchArtwork(keywords[selectedElement]);
      }
    },
    [currentQuestionIndex, answers]
  );

  return(
  <UserProvider>
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<UserForm onStart={resetQuiz} />} />
        <Route
          path="/quiz"
          element={
            currentQuestionIndex < questions.length ? (
              <Question question={questions[currentQuestionIndex].question} options={questions[currentQuestionIndex].options} onAnswer={handleAnswer} />
            ) : (
              <Results
                element={element}
                artwork={artwork}
                error={error}
                loading={loading}
                onRestart={resetQuiz}
              />
            )
          }
        />
      </Routes>
    </div>
  </UserProvider>
);
}

export default App