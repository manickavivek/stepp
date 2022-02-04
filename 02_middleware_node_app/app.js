var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var app = express();
var mongodbUrl = "mongodb://localhost:27017/";

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json());

app.post('/product', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;        
        var dbo = db.db("stepp_db");
        let searchProObj = {
            "model": req["body"]["model"],
            "size": req["body"]["size"],
            "color": req["body"]["color"],
            "type": req["body"]["type"]
        };
        let addProObj = {
            "model": req["body"]["model"],
            "size": req["body"]["size"],
            "color": req["body"]["color"],
            "type": req["body"]["type"],
            "count": req["body"]["count"]
        };

        dbo.collection("products").find(searchProObj).toArray(function(err, result) {
            if (err) throw err;
            if(result.length == 0) {
                dbo.collection("products").insertOne(addProObj,
                function(err, result) {
                    if (err) throw err;
                    if(result["acknowledged"] == true) {
                        res.json({"response": "Product Added!!"});
                    }
                    db.close();
                });
            } else {
                res.json({"response": "Product Already Exist!!"});
                db.close();
            }
        });
    });
});

app.get('/product', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stepp_db");
        dbo.collection("products").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.json({"response": result});
            db.close();
        });
    });
});

app.get('/getSizes', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stepp_db");
        dbo.collection("raw_data").distinct("size", function(err, result) {
            if (err) throw err;
            res.json({"response": result});
            db.close();
        });
    });
});

app.get('/getColors', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stepp_db");
        dbo.collection("raw_data").distinct("color", function(err, result) {
            if (err) throw err;
            res.json({"response": result});
            db.close();
        });
    });
});

app.post('/transactions', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;
        let transactionsObj = {};
        transactionsObj["date"] = new Date(req["body"]["date"]);
        transactionsObj["transaction_type"] = req["body"]["transaction_type"];
        transactionsObj["bill_no"] = req["body"]["bill_no"];
        transactionsObj["description"] = req["body"]["description"];
        transactionsObj["income"] = req["body"]["income"];
        transactionsObj["expense"] = req["body"]["expense"];
        if((req["body"]).hasOwnProperty("customer_name")) {
            transactionsObj["customer_name"] = req["body"]["customer_name"];
        }
        if((req["body"]).hasOwnProperty("customer_phone")) {
            transactionsObj["customer_phone"] = req["body"]["customer_phone"];
        }
        if((req["body"]).hasOwnProperty("customer_address")) {
            transactionsObj["customer_address"] = req["body"]["customer_address"];
        }
        if((req["body"]).hasOwnProperty("more_details")) {
            transactionsObj["more_details"] = req["body"]["more_details"];
        }
        var dbo = db.db("stepp_db");
        dbo.collection("transactions").insertOne(transactionsObj, function(err, result) {
            if (err) throw err;
            if(result["acknowledged"] == true) {
                res.json({"response": "transactions collection updated successfully!!"});
            }
            db.close();
        });
    });
});

app.post('/productCountUpdate', function (req, res) {
    let totalDataArr = req["body"]["updatedData"];
    updatedData();

    function updatedData() {
        let queryObj = {};
        queryObj["model"] = totalDataArr[0]["model"];
        queryObj["size"] = totalDataArr[0]["size"];
        queryObj["color"] = totalDataArr[0]["color"];
        queryObj["type"] = totalDataArr[0]["type"];
        let incValue = parseInt(totalDataArr[0]["count"]);
        let incValueObj = { $inc: { "count" : incValue } };
        MongoClient.connect(mongodbUrl, function(err, db) {
            if (err) throw err;
            var dbo = db.db("stepp_db");
            dbo.collection("products").findOneAndUpdate(queryObj, incValueObj, function(err, result) {
                if (err) throw err;
                if(result["ok"] == 1) {
                    totalDataArr.shift();
                }
                db.close();
                if(totalDataArr.length == 0) {
                    res.json({"response": "products collection's counts updated successfully!!"});
                } else {
                    updatedData();
                }
            });
        });
    }
});

app.post('/getTransactions', function (req, res) {
    let from = new Date(req["body"]["from"]);
    let to = new Date(req["body"]["to"]);
    let queryObj = { date: { $gte: from, $lte: to } };
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stepp_db");
        dbo.collection("transactions").find(queryObj).toArray(function(err, result) {
            if (err) throw err;
            res.json({"response": result});
            db.close();
        });
    });
});

app.post('/getTransaction', function (req, res) {
    let id = req["body"]["id"];
    let queryObj = { "_id": new ObjectId(id)};
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stepp_db");
        dbo.collection("transactions").find(queryObj).toArray(function(err, result) {
            if (err) throw err;
            res.json({"response": result});
            db.close();
        });
    });
});

app.post('/updatePurchaseRate', function (req, res) {
    let id = req["body"]["id"];
    let moreDetails = req["body"]["more_details"];
    let queryObj = { "_id": new ObjectId(id)};
    let newVal = { $set: { more_details: moreDetails } };
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stepp_db");
        dbo.collection("transactions").updateOne(queryObj, newVal, function(err, result) {
            if (err) throw err;
            res.json({"response": "1 document updated"});
            db.close();
        });
    });
});

app.get('/getCustomerDatabase', function (req, res) {
    MongoClient.connect(mongodbUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stepp_db");
        dbo.collection("transactions").find({ transaction_type : "Stock Sale" }).toArray(function(err, result) {
            if (err) throw err;
            res.json({"response": result});
            db.close();
        });
    });
});

// app.post('/stockin', function (req, res) {
//     MongoClient.connect(mongodbUrl, function(err, db) {
//         if (err) throw err;        
//         var dbo = db.db("stepp_db");
//         dbo.collection("stock_in").insertMany(req["body"], function(err, result) {
//             if (err) throw err;
//             if(result["acknowledged"] == true) {
//                 res.json({"response": "Stock_in collection updated successfully!!"});
//             }
//             db.close();
//         });
//     });
// });

// app.post('/stocksale', function (req, res) {
//     MongoClient.connect(mongodbUrl, function(err, db) {
//         if (err) throw err;        
//         var dbo = db.db("stepp_db");
//         dbo.collection("stock_sale").insertMany(req["body"], function(err, result) {
//             if (err) throw err;
//             if(result["acknowledged"] == true) {
//                 res.json({"response": "Stock_sale collection updated successfully!!"});
//             }
//             db.close();
//         });
//     });
// });

// app.post('/getStockinBill', function (req, res) {
//     let queryObj = {};
//     queryObj["bill_no"] = req["body"]["bill_no"];
//     queryObj["date"] = req["body"]["date"];
//     MongoClient.connect(mongodbUrl, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("stepp_db");
//         dbo.collection("stock_in").find(queryObj).toArray(function(err, result) {
//             if (err) throw err;
//             res.json({"response": result});
//             db.close();
//         });
//     });
// });

app.listen(3000, function () {
  console.log('Stepp app listening on port 3000!');
});