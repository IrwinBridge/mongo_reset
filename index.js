const util = require("util");
const exec = util.promisify(require("child_process").exec);
const sleep = require('util').promisify(setTimeout)

const execute = async (command) => {
  const { stdout, stderr } = await exec(command);
  if (stderr) {
    console.error(stderr);
    return;
  }
  console.log(stdout);
};

const mongo_resetup = async () => {
  // 1. Delete old DB
  await execute(
    "sudo systemctl stop mongodb && sudo rm -rf /var/lib/mongodb && sudo mkdir /var/lib/mongodb"
  );
  console.log("1. Deleting old DB is done");

  // 2. Chown new db directory
  await execute("sudo chown -R mongodb:mongodb /var/lib/mongodb");
  console.log("2. Re-chowning is done");

  // 3. Restart mongodb service
  await execute("sudo systemctl restart mongodb");
  console.log("3. mongodb service successfully restarted");

  // 4. Change content of the mongodb.conf to comment all security checks
  await execute(
    "sudo bash -c 'cat /home/oleg/job/helpers/mongo-reset/1.mongodb.conf > /etc/mongodb.conf'"
  );
  console.log("4. mongodb.conf successfully updated");

  // 5. Restart mongodb service
  await execute("sudo systemctl restart mongodb");
  console.log("5. mongodb service successfully restarted");

  // 6. Create mongodb root user
  await sleep(5000);
  await execute("sh /home/oleg/job/helpers/mongo-reset/mongo.script.1.sh");
  console.log("6. mongodb root user has been created");

  // Restore mongo from production
  await execute("mongorestore --gzip --archive=${GZ_BACKUP_FILE}");
  console.log("restored from production");
  await sleep(5000);

  // 7. Change content of the mongodb.conf to uncomment security checks
  await execute(
    "sudo bash -c 'cat /home/oleg/job/helpers/mongo-reset/2.mongodb.conf > /etc/mongodb.conf'"
  );
  console.log("7. mongodb.conf successfully updated");

  // 8. Restart mongodb service
  await execute("sudo systemctl restart mongodb");
  console.log("8. mongodb service successfully restarted");

  // 9. Create lms and lms_audit db users
  await sleep(5000);
  await execute("sh /home/oleg/job/helpers/mongo-reset/mongo.script.2.sh");
  console.log("9. mongodb lms and lms_audit napi users have been added");

  // 10. Change content of the mongodb.conf to uncomment ssl
  await execute(
    "sudo bash -c 'cat /home/oleg/job/helpers/mongo-reset/3.mongodb.conf > /etc/mongodb.conf'"
  );
  console.log("10. mongodb.conf successfully updated");

  // 11. Restart mongodb service
  await execute("sudo systemctl restart mongodb");
  console.log("11. mongodb service successfully restarted");

  // 12. Initiate replica set
  await sleep(5000);
  await execute("sh /home/oleg/job/helpers/mongo-reset/mongo.script.3.sh");
  console.log("12. Replica set initiated");

  console.log("MONGODB WAS SUCCESSFULLY RE-SETUP!");
};

mongo_resetup();
