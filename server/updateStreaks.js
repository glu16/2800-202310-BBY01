const { User } = require("./models/users.js");

async function updateStreaks() {
  try {
    const users = await User.find();
    for (const user of users) {
      if (user.doneToday) {
        user.daysDone++;
      } else {
        user.currentStreak = 0;
        user.daysMissed++;
      }
      await user.save();
      console.log(`${user.username} streak updated.`);
    }
    console.log("All streaks updated successfully.");
  } catch (err) {
    console.error("Failed to update streaks: ", err);
  }

  try {
    await User.updateMany({}, { doneToday: false });
    console.log("All doneToday reset to false successfully.");
  } catch (error) {
    console.log("Failed to reset doneToday: " + error);
  }
}

module.exports = updateStreaks;
