import allPlayersSalaries from "./data/salary.json";

export function buildTeams () {
  const salaryByTeam = {};

  for (const entry of allPlayersSalaries) {
    const team = entry.team;
    if (team.length < 3) continue;

    if (salaryByTeam[team] == null) {
      salaryByTeam[team] = [];
    }
    salaryByTeam[team].push(entry)
  }

  return salaryByTeam;
}

