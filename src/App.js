import './App.css';
import { useState } from "react";
import { buildTeams } from "./buildTeams"

const playersByTeam = buildTeams();
console.log(playersByTeam)
const teamAbbrevations = Object.keys(playersByTeam)

function getPlayersForTeam (team) {
  if (team == null) return [];
  return playersByTeam[team]
}

function App() {

  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);

  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);

  function onChangeTeam1Name (name) {
    setTeam1(name);
    setTeam1Players(getPlayersForTeam(name))
    setTeam2Players(getPlayersForTeam(team2))
  }

  function onChangeTeam2Name (name) {
    setTeam2(name);
    setTeam2Players(getPlayersForTeam(name))
    setTeam1Players(getPlayersForTeam(team1))
  }

  function movePlayer (fromTeam, toTeam, info) {
    if (fromTeam === team1 && toTeam === team2) {
      const newTeam1Players = team1Players.filter((team1Player) => team1Player.player !== info.player)
      const newTeam2Players = team2Players.concat(info);
      setTeam1Players(newTeam1Players);
      setTeam2Players(newTeam2Players);
    } else if (fromTeam === team2 && toTeam === team1) {
      const newTeam2Players = team2Players.filter((team2Player) => team2Player.player !== info.player)
      const newTeam1Players = team1Players.concat(info);
      setTeam2Players(newTeam2Players);
      setTeam1Players(newTeam1Players);
    } else {
      throw new Error(`Bad movePlayer – team1: ${team1}, team2: ${team2}, fromTeam: ${fromTeam}, toTeam: ${toTeam}`)
    }
  }

  return (
    <div className="App">
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <TeamPane name={team1} otherTeamName={team2} players={team1Players} onChangeTeam={onChangeTeam1Name} movePlayer={movePlayer} />
        </div>
        <div style={{ flex: 1 }}>
          <TeamPane name={team2} otherTeamName={team1} players={team2Players} onChangeTeam={onChangeTeam2Name} movePlayer={movePlayer} />
        </div>
      </div>
    </div>
  );
}

function TeamPane ({ name, onChangeTeam, players, otherTeamName, movePlayer }) {
  return (
    <div>
      <h3>Team: {name}</h3>
      <select onChange={(ev) => onChangeTeam(ev.target.value)}>
        <option>pick a team</option>
        {
          teamAbbrevations.map(function (abbr) {
            return <option value={abbr}>{abbr}</option>
          })
        }
      </select>

      <ol>
        {
          players.map(function (info) {
            return <PlayerListItem info={info} fromTeam={name} toTeam={otherTeamName} movePlayer={movePlayer} />
          })
        }
      </ol>
    </div>
  )
}

function PlayerListItem ({ info, fromTeam, toTeam, movePlayer }) {
  const backgroundColor = info.team === fromTeam ? "transparent" : "blue"
  return (
    <div
      style={{ textAlign: "left", marginBottom: "10px", cursor: "pointer", backgroundColor }}
      onClick={() => movePlayer(fromTeam, toTeam, info)}
    >
      {info.player} – ${formatSalary(info["2021-2022"])}
    </div>
  )
}

// $26,984,128 -> 26.9m
// $925,258 -> 925k
function formatSalary (salary) {
  if (salary.startsWith("$")) {
    salary = salary.slice(1);
  }
  salary = salary.replaceAll(",", "")
  const salaryNumber = Number(salary);
  if (salaryNumber > 1_000_000) {
    return (salaryNumber / 1_000_000).toFixed(2) + "m"
  }
  return (salaryNumber / 1000).toFixed(0) + "k"
}

export default App;
