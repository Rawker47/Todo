const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongooose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

// var items = ["Buy Food", "Cook Food", "Eat Food"];
// var workItems = [];
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", function (req, res) {
  //    var today=new Date();
  //    var currentDay=today.getDay();
  //    var day=" ";
  //    if(currentDay===0||currentDay===6){
  //     day="weekend";
  //     res.render("list",{kindOfDay:day});
  //    }
  //    else{
  //     day="weekday";
  //     res.render("list",{kindOfDay:day});
  //    }

  // switch (currentDay) {
  //     case 0:
  //         day="Sunday"
  //         break;
  //     case 1:
  //         day="Monday"
  //         break;
  //     case 2:
  //         day="Tuesday"
  //         break;
  //     case 3:
  //         day="wednesday"
  //         break;
  //     case 4:
  //         day="Thursday"
  //         break;
  //     case 5:
  //         day="Friday"
  //         break;
  //     case 6:
  //         day="Saturday"
  //         break;

  //     default:
  //         console.log("Error!");

  //         break;
  // }
  const itemsSchema = {
    name: String,
  };
  const Item = moongoose.model("Item", itemsSchema);

  var today = new Date();
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let day = today.toLocaleDateString("en-US", options);
  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
  console.log(req.body);
  let item = req.body.addList;

  if (req.body.list === "work") {
    console.log("work ko hai");
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    console.log("work ko haina hai");
    res.redirect("/");
  }
});
app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.listen(3000, function () {
  console.log("listening on port 3000");
});
