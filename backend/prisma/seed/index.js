function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log("\nejecutando seeds");

try {
  await import("./roles.js");
  console.log("\nEsperando 5 segundos antes de programas...");
  await delay(5000);

  await import("./programas.js");
  console.log("\nEsperando 5 segundos antes de usuarios...");
  await delay(5000);

  await import("./users.js");

} catch (err) {
  console.error("error ejecutando seeds ;( ", err);
}
