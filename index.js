import express from "express";
import bodyParser from "body-parser";
import { v4 as uuid4 } from "uuid";

const app=express();
const port=3000;
let postList=[];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app. get("/",(req,res)=>{
    postList=[];
    res.render("index.ejs",{posts: postList});
});
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});
app.post("/submit",(req,res)=>{
    console.log(req.body);
    const newPost={
        id: uuid4(),
        firstName: req.body["fName"],
        lastName: req.body["lName"],
        userName: req.body["username"],
        msg: req.body["message"],
        timestamp: new Date().toLocaleString()
    };
    postList.unshift(newPost);
    res.render("index.ejs", {posts: postList});
    console.log(postList);
});

app.post("/delete",(req,res)=>{
    const postId=req.body.id;
    postList=postList.filter(post=>postId!==post.id);
    res.render("index.ejs", {posts: postList});
});

app.get("/edit",(req,res)=>{
    const postId=req.query.id;
    const postToEdit=postList.find(post=> postId===post.id);
    res.render("partials/post-edit.ejs",{post:postToEdit});
});

app.post("/update",(req,res)=>{
    const postId=req.body.id;
    const updatedPost={
        id: postId,
        firstName: req.body["fName"],
        lastName: req.body["lName"],
        userName: req.body["username"],
        msg: req.body["message"],
        timestamp: postList.find(post => postId === post.id).timestamp
    };
    postList = postList.map(post => post.id === postId ? updatedPost : post);
    res.render("index.ejs", {posts: postList});
});