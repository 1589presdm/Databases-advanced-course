import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "your_DB";

let db;
let logonUsers = new Map();

async function connect() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

export async function getAllData() {
  const db = await connect();
  return db.collection("data").find().toArray();
}

export async function getDataById(id) {
  const db = await connect();
  return db.collection("data").findOne({ _id: new ObjectId(id) });
}

export async function addData(data) {
  const db = await connect();
  return db.collection("data").insertOne(data);
}

export async function insert_multiple_rows(rows) {
  const db = await connect();
  return db.collection("data").insertMany(rows);
}

export async function getAllUsers() {
  const db = await connect();
  return db.collection("users").find().toArray();
}

export async function findOneUser(username) {
  const db = await connect();
  return db
    .collection("users")
    .find({ username })
    .project({ username: 1, password: 1, _id: 0 })
    .toArray()
    .then((results) => results[0]);
}

export async function getUsersRecords() {
  const db = await connect();
  return db
    .collection("users")
    .aggregate([
      {
        $lookup: {
          from: "data",
          localField: "username",
          foreignField: "userid",
          as: "records",
        },
      },
      {
        $project: {
          username: 1,
          count: { $size: "$records" },
        },
      },
    ])
    .toArray();
}

// export async function addManyData(count) {
//   const db = await connect();
//   const firstnames = [
//     "Keijo",
//     "Tuomas",
//     "Teemu",
//     "Jyrki",
//     "Ilkka",
//     "Juuso",
//     "Lauri",
//     "Risto",
//     "Timo",
//     "Mika",
//   ];
//   const surnames = [
//     "Liukkonen",
//     "Turunen",
//     "Kärnä",
//     "Halonen",
//     "Järvinen",
//     "Karhunen",
//     "Neuvonen",
//     "Koskinen",
//     "Sotikov",
//   ];
//   const users = await db.collection("users").find().toArray();

//   const rows = [];

//   for (let i = 0; i < count; i++) {
//     const fname = firstnames[Math.floor(Math.random() * firstnames.length)];
//     const sname = surnames[Math.floor(Math.random() * surnames.length)];
//     const user = users[Math.floor(Math.random() * users.length)];

//     rows.push({
//       Firstname: fname,
//       Surname: sname,
//       userid: user.username,
//     });
//   }

//   return db.collection("data").insertMany(rows);
// }

export { logonUsers };
