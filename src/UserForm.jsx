// This component will have a search input that holds the 
// name of the person taking the quiz for personalization

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function UserForm({ onStart }) {
  const [inputName, setInputName] = useState("");
  const { setName } = useContext(UserContext);
  const navigate = useNavigate();

    function handleSubmit(e) {
    e.preventDefault();

    onStart();
    setName(inputName);
    navigate("/quiz");
    }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Insert your name:</label>

        <input
          id="name"
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}