const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

const itemsSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "Welcome !",
});

const item2 = new Item({
  name: "Press + button to add new item ",
});
const item3 = new Item({
  name: "<-- Hit this to Delete an item",
});
const defaultItems = [item1, item2, item3];
const listSchema = {
  name: String,
  items: [itemsSchema],
};
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then((docs) => {
            console.log("Documents inserted successfully:", docs);
          })
          .catch((error) => {
            console.error(error);
          });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    })

    .catch((err) => {
      console.error(err);
    });
});
app.listen(3000, function () {
  console.log("listening on port 3000");
});

app.post("/", function (req, res) {
  console.log(req.body);
  const itemName = req.body.addList;
  const listName = req.body.list;
  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })

      .then((foundList) => {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId)
      .then(() => {
        console.log("Successfull");
        res.redirect("/");
      })
      .catch((err) => {
        console.log("Error" + err);
      });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    )
      .then((foundList) => {
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.log("Error " + err);
      });
  }
});

app.get("/:anything", function (req, res) {
  const Naya = _.capitalize(req.params.anything);
  List.findOne({ name: Naya })
    .then((foundList) => {
      if (!foundList) {
        const list = new List({
          name: Naya,
          items: defaultItems,
        });
        list.save();
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    })
    .catch((err) => {
      console.log("error");
    });
});
