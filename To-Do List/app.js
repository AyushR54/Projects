//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemSchema = new mongoose.Schema({
  name: String
})

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
  name: "Drink water"
});

const item2 = new Item({
  name: "Eat food"
});

const item3 = new Item({
  name: "Sleep"
});

var defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: itemSchema
})

const List = mongoose.model('List', listSchema);



app.get("/", function(req, res) {

  Item.find().then((items) => {

    if(items.length === 0) {
      Item.insertMany(defaultItems).then(() => {
        console.log("Successfully added all the items")
      });
      res.redirect('/');
    }
    else {
      res.render("list", {listTitle: "Today", newListItems: items});
    }
    
  }) 
  

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  })

  item.save();
  res.redirect('/'); 
});

app.post('/delete', (req, res) => {
  const checkedItemsId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemsId).then(() => {
    console.log("Item removed successfully!");
  })
  res.redirect('/');
});
 

// app.get('/:customListName', (req, res) => {
//   const customListName = req.params.customListName; 

//   List.find({name: customListName}).then(foundList => {
//     if(foundList === false) {
//       // Create a new list
//       const list = new List({
//         name: customListName,
//         items: defaultItems
//       });

//       list.save();
//       res.redirect("/" + customListName);
//     }
//     else {
//       // Show existing list
//       res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
//     }
//   });

  

// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
