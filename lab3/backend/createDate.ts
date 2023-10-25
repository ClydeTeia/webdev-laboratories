export function createDate() {
  const currentDate = new Date();

  const formattedTimestamp = currentDate
    .toISOString()
    .replace("T", " ")
    .split(".")[0];

  return formattedTimestamp;
}
