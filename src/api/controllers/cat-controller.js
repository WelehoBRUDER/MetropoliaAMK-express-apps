import {
  addCat,
  findCatById,
  findCatsByUserId,
  listAllCats,
  modifyCat,
  removeCat,
} from "../models/cat-model.js";

const getCat = async (req, res) => {
  try {
    res.json(await listAllCats());
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getCatById = async (req, res) => {
  try {
    const cat = await findCatById(req.params.id);
    if (cat) {
      res.json(cat);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const getCatsByUserId = async (req, res) => {
  try {
    const cats = await findCatsByUserId(req.params.id);
    if (cats) {
      res.json(cats);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const postCat = async (req, res) => {
  try {
    const result = await addCat(req.body, req.file);
    if (result.cat_id) {
      res.status(201);
      res.json({message: "New cat added.", result});
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const putCat = async (req, res) => {
  const user = res.locals.user.user_id;
  try {
    if (user !== parseInt(req.params.id)) {
      res.sendStatus(403);
      return;
    }
    const result = await modifyCat(req.body, req.params.id);
    if (!result) {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const deleteCat = async (req, res) => {
  const user = res.locals.user.user_id;
  try {
    if (user !== parseInt(req.params.id)) {
      res.sendStatus(403);
      return;
    }
    const result = await removeCat(req.params.id);
    if (!result) {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export {getCat, getCatById, getCatsByUserId, postCat, putCat, deleteCat};
