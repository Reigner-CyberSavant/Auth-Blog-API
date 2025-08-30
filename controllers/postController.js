const post = require("../models/post.model");


//CONTROLLER TO GET ALL POSTS
exports.getPosts = async (req, res) => {
    //request page number
   const {page} = req.query;
   //create a constant to return number of requested post(s) per request to the user
   const postPerPage = 10;
    try {
        let pageNum = 0;
        if (page <= 1) {
            pageNum = 0;
        }else {
            pageNum = page - 1;
        }

        //import posts from DB using the postmodel/schemas
        const result = await post.find()
        .sort({createdAt: -1})
        .skip(pageNum * postPerPage)
        .limits(postPerPage)
        .populate({
                path: "userId",
                select: "email"
            });
        res.status(200).json({success: true, message: "Posts Acquired Successfully", data: result});

    } catch (err) {
        next(err);
    }
}




//C0NTROLLER TO GET A SINGLE POST BY ID
exports.getSinglePost = async (req, res) => {
    //request id parameter
   const {_id} = req.query;
    try{
        const existingPost = await post.findOne({_id})
        .populate({
                path: "userId",
                select: "email"
            });
            if(!existingPost){
            return res.status(404).json({ success: false, message: 'Post not Found'})
        }
        res.status(200).json({success: true, message: " Single Post Acquired ", data: result});
    } catch (err) {
        next(err);
    }
}



//CONTROLLER TO CREATE POST(S)
exports.createPost = async (req, res) => {
    //request post title, description and user's Id
    const { title, description } = req.body;
    const { userId } = req.user;

    try {
        //User must provide title, description and UserId hence the  createPostSchema.validate ensures this.
        const  { error, value } = createPostSchema.validate({
            title,
            description,
            userId
        });
        if (error) {
      return res.status(401).json({ error: error.details[0].message });
    }
        //Create Post
        const result = await post.create({
            title, description, userId
        });
       res.status(201).json({success: true, message: "Post Created Successfully", data: result}); 
    } catch (err) {
        next(err);
    }
}


//CONTROLLER TO UPDATE POSTS
exports.createPost = async (req, res) => {
    //request post title, description and user's Id
    const { _id } = req.query;
    const { title, description } = req.body;
    const { userId } = req.user;

    try {
        //User must provide title, description and UserId hence the  createPostSchema.validate ensures this.
        const  { error, value } = createPostSchema.validate({
            title,
            description,
            userId
        });
        if (error) {
      return res.status(401).json({ error: error.details[0].message });
    }
        //Find thw Post for update by Id
        const existingPost = await post.findOne({_id})
        if(!existingPost){
            return res.status(404).json({ success: false, message: 'Post not Found'})
        }
        if(existingPost.userId.toString() !== userId){
            return res.status(403).json({ success: false, message: 'Unauthorized'})
        }

        existingPost.title = title;
        existingPost.description - description;

        const result = await existingPost.save()
        res.status(200).json({success: true, message: "Post Updated Successfully", data: result}); 
    } catch (err) {
         next(err);
    }
}



//CONTROLLER TO DELETE POSTS
exports.createPost = async (req, res) => {
    //request post id and user's Id
    const { _id } = req.query;
    const { userId } = req.user;

    try {

        //Find thw Post to be deleted by Id
        const existingPost = await post.findOne({_id})
        if(!existingPost){
            return res.status(404).json({ success: false, message: 'Post already Unavailable'})
        }
        if(existingPost.userId.toString() !== userId){
            return res.status(403).json({ success: false, message: 'Unauthorized'})
        }

        //Delete Post
        await post.deleteOne({_id});
        res.status(200).json({success: true, message: "Post Deleted Successfully"}); 
    } catch (err) {
        next(err);
    }
}