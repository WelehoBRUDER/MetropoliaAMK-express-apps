// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?
import promisePool from "../../utils/database.js";

const listAllCats = async () => {
  const [rows] = await promisePool.query(
    "SELECT cat.*, user.name AS owner_name FROM wsk_cats cat JOIN wsk_users user ON cat.owner = user.user_id"
  );
  console.log("rows", rows);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT wsk_cats.*, wsk_users.name AS owner_name FROM wsk_cats JOIN wsk_users wsk_users ON wsk_cats.owner = wsk_users.user_id WHERE wsk_cats.cat_id = ? ",
    [id]
  );
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};
const findCatsByUserId = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT cat.*, user.name AS owner_name FROM wsk_cats JOIN wsk_users user ON cat.owner = user.user_id WHERE owner = ?",
    [id]
  );
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addCat = async (cat, thumb) => {
  const {cat_name, weight, owner, birthdate} = cat;
  const filename = thumb ? thumb.filename : null;
  console.log(filename);
  const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [cat_name, weight, owner, filename, birthdate];
  console.log("params", params, "sql", sql);
  const rows = await promisePool.execute(sql, params);
  console.log("rows", rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {cat_id: rows[0].insertId};
};

const modifyCat = async (cat, id, user) => {
  let sql;
  if (user.role === "admin") {
    sql = promisePool.format(`UPDATE wsk_cats SET ? WHERE cat_id = ?`, [
      cat,
      id,
    ]);
  } else {
    sql = promisePool.format(
      `UPDATE wsk_cats SET ? WHERE cat_id = ? AND owner = ?`,
      [cat, id, user.user_id]
    );
  }
  const rows = await promisePool.execute(sql);
  console.log("rows", rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {message: "success"};
};

const removeCat = async (id, user) => {
  let sql;
  if (user.role === "admin") {
    sql = promisePool.format(`DELETE FROM wsk_cats WHERE cat_id = ?`, [id]);
  } else {
    sql = promisePool.format(
      `DELETE FROM wsk_cats WHERE cat_id = ? AND owner = ?`,
      [id, user.user_id]
    );
  }
  const [rows] = await promisePool.execute(sql);
  console.log("rows", rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  return {message: "success"};
};

export {
  listAllCats,
  findCatById,
  findCatsByUserId,
  addCat,
  modifyCat,
  removeCat,
};
