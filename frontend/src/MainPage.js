import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

export const MainPage = () => {
  const [serverStatus, setServerStatus] = useState("Waiting server status...");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [output, setOutput] = useState();

  // Check server status
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/api/ping");

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

    const request = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate,
      })
    };

    const response = await fetch("http://localhost:8000/api/getData", request);
    const data = await response.json();
    setOutput(data);
  }


  return (
    <div>
      <p>{serverStatus}</p>

      <form onSubmit={Submit}>
        <p>Start date: </p>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />

        <p>End date: </p>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />

        <input type="submit"></input>
      </form>

    <p>{JSON.stringify(output)}</p>

    </div>
  );
}