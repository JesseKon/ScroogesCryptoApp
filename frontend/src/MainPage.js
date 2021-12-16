import React, { useEffect, useState } from "react"

export const MainPage = () => {
  const [serverStatus, setServerStatus] = useState("Waiting server status...");

  // Check server status
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/ping");

      if (response.ok) {
        setServerStatus("Server status: all good!");
      }
      else {
        setServerStatus("Server status: something is wrong");
      }
    }

    fetchData();
  }, [])


  const Submit = async (e) => {
    e.preventDefault();

  }


  return (
    <div>
      <p>{serverStatus}</p>

      <form onSubmit={Submit}>
        <input type="submit"></input>
      </form>

    </div>
  );
}