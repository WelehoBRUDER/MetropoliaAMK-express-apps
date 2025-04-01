import {addCat, findCatById, listAllCats} from "../models/cat-model.js";

const getCat = async (req, res) => {
  try {
    res.json(await listAllCats());
  } catch {}
};

const getCatById = async (req, res) => {
  try {
    const cat = await findCatById(req.params.id);
    if (cat) {
      res.json(cat);
    } else {
      res.sendStatus(404);
    }
  } catch {}
};

const postCat = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try {
    const result = await addCat(req.body, req.file);
    if (result.cat_id) {
      res.status(201);
      res.json({message: "New cat added.", result});
    } else {
      res.sendStatus(400);
    }
  } catch {}
};

const putCat = async (req, res) => {
  try {
    const result = await modifyCat(req.body, req.params.id);
    if (!result) {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(200);
  } catch {}
};

const deleteCat = async (req, res) => {
  try {
    const result = await removeCat(req.params.id);
    if (!result) {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(200);
  } catch {}
};

export {getCat, getCatById, postCat, putCat, deleteCat};
