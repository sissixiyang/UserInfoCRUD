const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// check database connection
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.fotzn.mongodb.net/project3?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let app = express();
const PORT = 5009;
const Soldier = require("./soldier.js");
const recordsPerPage = 6;

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api", bodyParser.json());

app.post("/saveImages/:filename", (req, res) => {
  const filename = req.params.filename;
  console.log(filename);
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + "/images");
    },
    filename: function (req, file, cb) {
      cb(null, filename);
    },
  });
  let upload = multer({ storage: storage }).single("file");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

// without query
app.get("/api/soldiers/:pageNum/:sortBy/:direction/:mode", (req, res) => {
  const pageNum = Number(req.params.pageNum);
  const sortBy = req.params.sortBy;
  const direction = Number(req.params.direction);
  const mode = req.params.mode;
  const info = {
    soldiers: [],
    recordsPerPage,
    pageNum: pageNum,
  };
  let limit = mode === "0" ? recordsPerPage : recordsPerPage * (pageNum + 1);
  let offset = mode === "0" ? pageNum * recordsPerPage : 0;
  const options = {
    page: pageNum + 1,
    limit: limit,
    offset: offset,
  };
  if (sortBy !== "noSort") {
    options.sort = { [sortBy]: direction };
  }
  Soldier.paginate({}, options)
    .then((data) => {
      info.soldiers = data.docs;
      res.status(200).json(info);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
// with query
app.get(
  "/api/soldiers/:query/:pageNum/:sortBy/:direction/:mode",
  (req, res) => {
    const pageNum = Number(req.params.pageNum);
    const sortBy = req.params.sortBy;
    const direction = Number(req.params.direction);
    const mode = req.params.mode;
    const regex = new RegExp(req.params.query, "i");
    const info = {
      soldiers: [],
      recordsPerPage,
      pageNum: Number(req.params.pageNum),
    };
    //   whether show all user or not by setting limit and offset
    let limit = mode === "0" ? recordsPerPage : recordsPerPage * (pageNum + 1);
    let offset = mode === "0" ? pageNum * recordsPerPage : 0;
    const query = {
      $or: [
        { name: regex },
        { sex: regex },
        { rank: regex },
        { startDate: regex },
        { phone: regex },
        { email: regex },
        { superior: regex },
      ],
    };
    const options = {
      page: pageNum + 1,
      limit: limit,
      offset: offset,
    };
    if (sortBy !== "noSort") {
      options.sort = { [sortBy]: direction };
    }
    Soldier.paginate(query, options)
      .then((data) => {
        info.soldiers = data.docs;
        res.status(200).json(info);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
);
// get superior info
app.get("/api/soldiers/:superiorId", (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.superiorId);
  Soldier.findById(id)
    .then((superior) => {
      res.status(200).json(superior);
    })
    .catch((err) => res.status(500).json(err));
});

app.get(
  "/api/subordinates/:superiorId/:pageNum/:sortBy/:direction/:mode",
  (req, res) => {
    let id = mongoose.Types.ObjectId(req.params.superiorId);
    const pageNum = Number(req.params.pageNum);
    const sortBy = req.params.sortBy;
    const direction = Number(req.params.direction);
    const mode = req.params.mode;
    const info = {
      subordinates: [],
      recordsPerPage,
      pageNum: Number(req.params.pageNum),
    };

    let limit = mode === "0" ? recordsPerPage : recordsPerPage * (pageNum + 1);
    let offset = mode === "0" ? pageNum * recordsPerPage : 0;
    const options = {
      page: pageNum + 1,
      limit: limit,
      offset: offset,
    };
    const query = {
      superiorId: id,
    };
    if (sortBy !== "noSort") {
      options.sort = { [sortBy]: direction };
    }
    Soldier.paginate(query, options)
      .then((data) => {
        info.subordinates = data.docs;
        res.status(200).json(info);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
);

app.get(
  "/api/subordinates/:superiorId/:query/:pageNum/:sortBy/:direction/:mode",
  (req, res) => {
    let id = mongoose.Types.ObjectId(req.params.superiorId);
    const pageNum = Number(req.params.pageNum);
    const sortBy = req.params.sortBy;
    const direction = Number(req.params.direction);
    const mode = req.params.mode;
    const regex = new RegExp(req.params.query, "i");

    const info = {
      subordinates: [],
      recordsPerPage,
      pageNum: Number(req.params.pageNum),
    };
    let limit = mode === "0" ? recordsPerPage : recordsPerPage * (pageNum + 1);
    let offset = mode === "0" ? pageNum * recordsPerPage : 0;
    const query = {
      superiorId: id,
      $or: [
        { name: regex },
        { sex: regex },
        { rank: regex },
        { startDate: regex },
        { phone: regex },
        { email: regex },
        { superior: regex },
      ],
    };
    const options = {
      page: pageNum + 1,
      limit: limit,
      offset: offset,
    };
    if (sortBy !== "noSort") {
      options.sort = { [sortBy]: direction };
    }
    Soldier.paginate(query, options)
      .then((data) => {
        info.subordinates = data.docs;
        res.status(200).json(info);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
);

/* get superior list in edit page to avoid circle relationship
    filter current soldiers' descendents out ---> get available superior list
 */
app.get("/api/superiorList/:id", (req, res) => {
  let list = [];
  let descendants = [];
  let id = mongoose.Types.ObjectId(req.params.id);
  Soldier.find()
    .then((soldiers) => {
      list = soldiers.filter((soldier) => !soldier._id.equals(id));
      Soldier.aggregate([
        { $match: { _id: id } },
        {
          $graphLookup: {
            from: "soldiers",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "superiorId",
            as: "descendants",
          },
        },
      ]).then((result) => {
        console.log("-----------------");
        console.log(JSON.stringify(result));
        descendants = result[0].descendants;
        descendants.forEach((descendant) => {
          list = list.filter((soldier) => !soldier._id.equals(descendant._id));
        });
        res.status(200).json(list);
      });
    })
    .catch((err) => res.status(500).json(err));
});

// get superior list on create page
app.get("/api/allSoldiers", (req, res) => {
  Soldier.find()
    .then((soldiers) => {
      res.status(200).json(soldiers);
    })
    .catch((err) => res.status(500).json(err));
});

// get all soldier
app.get("/api/allPages", (req, res) => {
  const info = { subordinates: [], recordsPerPage, pageNum: 0 };
  Soldier.find()
    .then((soldiers) => {
      info.soldiers = soldiers;
      info.pageNum = Math.floor((soldiers.length - 1) / 6);
      res.status(200).json(info);
    })
    .catch((err) => res.status(500).send(err));
});

app.post("/api/soldiers/insert/", (req, res) => {
  let {
    name,
    rank,
    sex,
    startDate,
    phone,
    email,
    superior,
    superiorId,
    imageUrl,
  } = req.body;
  let soldier = new Soldier();
  soldier.name = name;
  soldier.rank = rank;
  soldier.sex = sex;
  soldier.startDate = startDate;
  soldier.phone = phone;
  soldier.email = email;
  soldier.imageUrl = imageUrl;
  if (!imageUrl) {
    soldier.imageUrl = "assets/default.png";
  } else {
    soldier.imageUrl = imageUrl;
  }
  if (superior) soldier.superior = superior;
  if (superiorId) {
    soldier.superiorId = mongoose.Types.ObjectId(superiorId);
    Soldier.updateOne({ _id: superiorId }, { $inc: { ds: 1 } })
      .then((obj) => {
        console.log(`Superior's info updated: ${JSON.stringify(obj)}`);
      })
      .catch((err) => res.status(500).send(err));
  }
  soldier
    .save()
    .then((obj) => {
      console.log(`${obj.toString()}`);
      res.status(200).send(obj);
    })
    .catch((err) => res.status(500).json(err));
});

app.put("/api/soldiers/update/:id", (req, res) => {
  let {
    name,
    rank,
    sex,
    startDate,
    phone,
    email,
    superior,
    superiorId,
    imageUrl,
  } = req.body;
  let id = mongoose.Types.ObjectId(req.params.id);
  Soldier.findById(id)
    .then((soldier) => {
      if (soldier.name !== name) {
        Soldier.updateMany({ superiorId: id }, { $set: { superior: name } })
          .then((obj) => {
            console.log(`Record updated: ${obj.toString()}`);
          })
          .catch((err) => res.status(500).json(err));
      }
      soldier.name = name;
      soldier.rank = rank;
      soldier.sex = sex;
      soldier.startDate = startDate;
      soldier.phone = phone;
      soldier.email = email;
      if (soldier.superiorId && soldier.superiorId !== superiorId) {
        Soldier.updateOne({ _id: soldier.superiorId }, { $inc: { ds: -1 } })
          .then((obj) => {
            console.log(`Record updated: ${obj.toString()}`);
          })
          .catch((err) => res.status(500).json(err));
      }
      if (
        (superiorId && !soldier.superiorId) ||
        soldier.superiorId !== superiorId
      ) {
        soldier.superiorId = mongoose.Types.ObjectId(superiorId);
        Soldier.updateOne({ _id: superiorId }, { $inc: { ds: 1 } })
          .then((obj) => {
            console.log("Update successfully!");
          })
          .catch((err) => res.status(500).json(err));
      }

      if (!superior) {
        Soldier.updateOne(
          { id: id },
          { $unset: { superior: "", superiorId: "" } }
        );
      }

      soldier.superior = superior;

      if (imageUrl) soldier.imageUrl = imageUrl;
      soldier
        .save()
        .then((obj) => {
          res.status(200).json(obj);
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
});

app.delete("/api/soldiers/delete/:id", (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.id);
  Soldier.findById(id).then((soldier) => {
    if (soldier.superiorId) {
      Soldier.updateMany(
        { superiorId: id },
        { $set: { superior: soldier.superior, superiorId: soldier.superiorId } }
      )
        .then((obj) => {
          console.log(`New info!!!!: ${obj.toString()}`);
        })
        .then(() => {
          console.log(soldier.ds);
          Soldier.updateOne(
            { _id: soldier.superiorId },
            { $inc: { ds: soldier.ds - 1 } }
          ).then(() => {
            Soldier.deleteOne({ _id: id }).then(() => {
              res.status(200).send("Delete Successfully");
            });
          });
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    } else {
      Soldier.deleteOne({ _id: id })
        .then(() => {
          res.status(200).send("Delete Successfully");
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    }
  });
});

app.listen(PORT);
