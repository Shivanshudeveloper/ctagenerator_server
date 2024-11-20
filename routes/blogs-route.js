const express = require('express');
const router = express.Router();

require('dotenv').config();

const blogsController = require('../controllers/blogs');


router.post('/submitnewblog', blogsController.submitBlog);
router.get('/getallpublishedblogs', blogsController.getAllBlogs);
router.get('/getblog/:blogPublicId', blogsController.getParticularBlog);
router.put('/updateblog/:blogPublicId', blogsController.updateBlog);


module.exports = router;
