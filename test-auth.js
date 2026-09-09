const bcrypt = require('bcryptjs');

async function checkPass(hash, typed) {
  const isValid = await bcrypt.compare(typed, hash);
  console.log("Is Valid?", isValid);
}
// The hash from the DB
checkPass('$2b$10$.nLTmX0ki6fYq68FUgNbaO8mgEp/FIt0TuXUDzuHB/wPlRFZbWkfK', 'password');
