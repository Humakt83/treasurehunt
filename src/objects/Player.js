const homes = ['🏠', '🏭', '⛪️', '🏦', '🏬', '🕌', '⛩', '🏰'];
const playerEmojis = ['🤓', '😎', '🧐', '🥳', '🤪', '😬', '😍', '😄'];
const playerColors = ['blue', 'red', 'yellow', 'white', 'black', 'tan', 'cyan', 'lightgray'];

export const createPlayer = (name, index) => {
  const player = {
    name,
    emoji: playerEmojis[index],
    color: playerColors[index],
    money: 500,
    treasure: false,
    winner: false,
  };
  player.home = {owner: player, color: player.color, permanent: true, emoji: homes[index]}
  return player;
}