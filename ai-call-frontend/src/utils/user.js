import { v4 as uuidv4 } from "uuid";

export function getUserId() {
  let userId = localStorage.getItem("userId");

  if (!userId) {
    userId = uuidv4();
    localStorage.setItem("userId", userId);
    console.log("New userId generated:", userId);
  }

  return userId;
}
