const Server = require('./server');
const Tasker = require('../shared-util/tasker');

const tick_rate = process.env.SERVER_TICK_RATE || 20000;
const ver = process.env.SERVER_VERSION;

console.log("################################");
console.log("      Start SHOODOO Poller      ");
console.log("      Ver: " + ver + "          ");
console.log("################################");

// Create server.
const ServerInstance = new Server();

// Create tasker.
const TaskerInstance = new Tasker();

// Assign server loop.
ServerInstance.assignTasker(TaskerInstance);

TaskerInstance.target(ServerInstance.tick, ServerInstance).run(tick_rate); //default - 20000
