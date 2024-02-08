const express = require("express");
const fs = require("fs");
const path = require("path");

const { checkBody, checkParams } = require("./validation/validator");
const { idScheme, userScheme } = require("./validation/scheme");

const app = express();
let uniqueId = 5;
const pathName = path.join(__dirname, "./users.json");
const users = [];

app.use(express.json());

/**
 * получение всех статей (массив users)
 */
app.get("/users", (req, res) => {
  res.send(fs.readFileSync(pathName));
});

/**
 * выдача определённой статьи по (ID)
 */

// fs.readFileSync(pathName))

app.get("/users/:id", checkParams(idScheme), (req, res) => {
  const users = JSON.parse(fs.readFileSync(pathName));
  const user = users.find((user) => user.id === Number(req.params.id));

  if (user) {
    res.send({ user });
  } else {
    res.status(404);
    res.send({ user: null });
  }
});

/**
 *  создание статьи и доабвление в массив (массив users)
 */
//
app.post("/users", checkBody(userScheme), (req, res) => {
  uniqueId += 1;
  const users = JSON.parse(fs.readFileSync(pathName));

  users.push({
    id: uniqueId,
    ...req.body,
  });

  fs.writeFileSync(pathName, JSON.stringify(users, null, 2));
  res.send({
    id: uniqueId,
  });
});

/**
 *  изменить статью по (ID)
 */
// checkParams(idScheme),checkBody(userScheme),
app.put("/users/:id", (req, res) => {
  const result = userScheme.validate(req.body);
  if (result.error) {
    return res.status(404).send({ error: result.error.details });
  }

  const users = JSON.parse(fs.readFileSync(pathName));
  const user = users.find((user) => user.id === Number(req.params.id));
  console.log(user);
  if (user) {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.age = req.body.age;
    user.city = req.body.city;
    fs.writeFileSync(pathName, JSON.stringify(users, null, 2));
    res.send({ user });
  } else {
    res.status(404);
    res.send({ user: null });
  }
});

/**
 * удалить статью по (ID)
 */
app.delete("/users/:id", checkParams(idScheme), (req, res) => {
  const users = JSON.parse(fs.readFileSync(pathName));
  const user = users.find((user) => user.id === Number(req.params.id));
  if (user) {
    const userIndex = users.indexOf(user);
    users.splice(userIndex, 1);
    fs.writeFileSync(pathName, JSON.stringify(users, null, 2));
    res.send(user);
  } else {
    res.status(404);
    res.send({ user: null });
  }
});

/**
 * обработка не существующих роутов
 */
app.use((req, res) => {
  res.status(404).send({
    message: "URL not found!",
  });
});

app.listen(3000);
