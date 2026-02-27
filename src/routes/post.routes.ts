import { Router } from 'express'
import { CommentPost, CreatePost, DeleteComment, DeleteCommentReply, DeletePost, GetAllComments, GetAllPosts, GetCommentReplies, GetPostById, LikeComment, LikeCommentReply, LikePost, Reply, Save, UpdateComment, UpdatePost } from '../controllers/post.controllers'
import { AuthCheck } from '../middlewares/auth.middleware';
import { uploadMedia } from '../middlewares/multer';
import { multerWrapper } from '../middlewares/multerWrapper';
import RateLimiter from '../utils/rateLimiter';

const postRoutes = Router()



postRoutes.post('/create', multerWrapper(uploadMedia.single("media"), "media"), AuthCheck, CreatePost);
postRoutes.get('/get/all', GetAllPosts);
postRoutes.get('/get', GetPostById);
postRoutes.put('/update', multerWrapper(uploadMedia.single("media"), "media"), AuthCheck, UpdatePost);
postRoutes.delete('/delete', AuthCheck, DeletePost);
postRoutes.get('/like', AuthCheck, LikePost);
postRoutes.get('/save', AuthCheck, Save)

// comment related paths
postRoutes.post('/comment/create', AuthCheck, RateLimiter(15), CommentPost);
postRoutes.get('/comment/get/all', AuthCheck, GetAllComments);
postRoutes.put('/comment/update', AuthCheck, UpdateComment);
postRoutes.delete('/comment/delete', AuthCheck, DeleteComment);
postRoutes.get('/comment/like', AuthCheck, LikeComment);


//comment reply releted paths
postRoutes.post('/comment/reply', AuthCheck, RateLimiter(15), Reply);
postRoutes.get('/comment/reply/all', GetCommentReplies);
postRoutes.delete('/comment/reply/delete', AuthCheck, DeleteCommentReply)
postRoutes.get('/comment/reply/like', AuthCheck , LikeCommentReply);
export default postRoutes;