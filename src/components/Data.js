import React, { useEffect, useState } from 'react';
import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent',
  headers: {
    // 'X-RapidAPI-Key': 'hehe',
    // 'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
  }
};

export default function Data() {
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.request(options);
        console.log(response.data);
        setMatchData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {matchData ? <MatchDetails match={matchData} /> : <p>Loading...</p>}
    </div>
  );
}

function MatchDetails({ match }) {
  const team1 = match.typeMatches[0].seriesMatches[0].seriesAdWrapper.matches[0].matchInfo.team1.teamName;
  const team2 = match.typeMatches[0].seriesMatches[0].seriesAdWrapper.matches[0].matchInfo.team2.teamName;
  const score1 = match.typeMatches[0].seriesMatches[0].seriesAdWrapper.matches[0].matchScore.team1Score.inngs1.runs;
  const score2 = match.typeMatches[0].seriesMatches[0].seriesAdWrapper.matches[0].matchScore.team2Score.inngs1.runs;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '10px',
        height: '30vh',
        padding: '20px',
        border: '2px solid black'
      }}
    >
      <h2>Match Details</h2>
      <p>Teams: {team1} vs {team2}</p>
      <p>{team1} scored : {score1} in innings 1 </p>
      <p>{team2} scored : {score2} in innings 2</p>
    </div>
  );
}

