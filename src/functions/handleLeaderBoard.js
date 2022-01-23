import { leaderBoard } from "../ui/uiElements";

export function handleLeaderBoard(i, data) {
  if (data) {
    let template = `<span class="leaderBoardRank">${i}</span><span class="leaderBoardUserName">${data.userName}</span><span class="leaderBoardSpeed">${data.speed}</span>`;
    let listItem = document.createElement("li");
    listItem.innerHTML = template;
    listItem.classList.add("leaderBoardListItem");
    leaderBoard.appendChild(listItem);
  }
}

export function clearLeaderBoard() {
  while (leaderBoard.firstChild) {
    leaderBoard.firstChild.remove();
  }
}

export function prepareLeaderboard() {
  let leaderBoardHeader = document.createElement("li");
  leaderBoardHeader.classList.add("leaderBoardHeader");
  leaderBoardHeader.innerText = "leaderboard";
  let leaderBoardHeader2 = document.createElement("li");
  leaderBoardHeader2.classList.add("leaderBoardInfo");
  leaderBoardHeader2.innerHTML =
    '<span class="leaderBoardRank">Rank</span><span class="leaderBoardUserName">Username</span><span class="leaderBoardSpeed">Top Speed</span>';
  leaderBoard.appendChild(leaderBoardHeader);
  leaderBoard.appendChild(leaderBoardHeader2);
}
