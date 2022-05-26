import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  //basically getPostbypage he cz ub pages k hisab se aengy post tw neche pagination ka logic he
  const {page}= req.query
  try {
    const LIMIT=8
    startIndex=(Number(page) - 1) * LIMIT  //getting the start index of ervery page
    const total= await postMessage.countDocuments({})
    const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex);

    // console.log(postMessages)

    res.status(200).json({data: posts, currentPage: Number(page), numberOfPage: Math.ceil(total / LIMIT)});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// req.query--- ssdd/abcbd?djd=1
// params---fsff/ddfd/:id etc


export const getPostsBySearch = async (req, res) => {
  const {searchQuery, tags}= req.query
  try {
    //using regExp makes easy to search in daatabase
    const title = new RegExp(searchQuery, 'i')
    const posts = await PostMessage.find( { $or : [ { title } , { tags: { $in: tags.split(',') } } ] } );

 res.json({data: posts})

  } catch (error) {
  res.status(404).json({message: error.message})
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No Post with That Id");

  const updatedPost= await PostMessage.findByIdAndUpdate(_id, {...post, _id}, { new: true });
  res.json(updatedPost);

};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Post with That Id");

  await PostMessage.findByIdAndRemove(id);
  res.json({message: 'post deleted successfully'});

};

export const likePost = async (req, res) => {
  const { id } = req.params;
  //agr kisi action s ephle req populate horhi ho jese middle ware me req.userid iska mtlb ap
  // agle action me uska access rkhty jiski wjh se yhn ye use ho pa rha
  if(!req.userId) return json({message: 'unAuthenticated'})

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Post with That Id");

  const post=await PostMessage.findById(id);

  const index= post.likes.findIndex((id)=> id === String(req.userId))

  if (index === -1){
    post.likes.push(req.userId);
    // like the post
  }else{
    post.likes = post.likes.filter((id)=> id !== String(req.userId))
    //dislike the post
  }
  const updatedPost= await PostMessage.findByIdAndUpdate(id,post, {new: true})
  res.json(updatedPost);

};
