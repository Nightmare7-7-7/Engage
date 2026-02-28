import { Router } from 'express'
import { CommentPost, CreatePost, DeleteComment, DeleteCommentReply, DeletePost, GetAllComments, GetAllPosts, GetCommentReplies, GetPostById, LikeComment, LikeCommentReply, LikePost, Reply, Save, UpdateComment, UpdatePost } from '../controllers/post.controllers'
import { AuthCheck } from '../middlewares/auth.middleware';
import { uploadMedia } from '../middlewares/multer';
import { multerWrapper } from '../middlewares/multerWrapper';
import RateLimiter from '../utils/rateLimiter';
import { VerifiedEmail } from '../middlewares/verifiedEmail';

const postRoutes = Router()



postRoutes.post('/create', multerWrapper(uploadMedia.single("media"), "media"), AuthCheck, VerifiedEmail, CreatePost);
postRoutes.get('/get/all', GetAllPosts);
postRoutes.get('/get', GetPostById);
postRoutes.put('/update', multerWrapper(uploadMedia.single("media"), "media"), AuthCheck, VerifiedEmail, UpdatePost);
postRoutes.delete('/delete', AuthCheck, VerifiedEmail, DeletePost);
postRoutes.get('/like', AuthCheck, VerifiedEmail, LikePost);
postRoutes.get('/save', AuthCheck, VerifiedEmail, Save)

// comment related paths
postRoutes.post('/comment/create', AuthCheck, VerifiedEmail, RateLimiter(15), CommentPost);
postRoutes.get('/comment/get/all', AuthCheck, GetAllComments);
postRoutes.put('/comment/update', AuthCheck, VerifiedEmail, UpdateComment);
postRoutes.delete('/comment/delete', AuthCheck, VerifiedEmail, DeleteComment);
postRoutes.get('/comment/like', AuthCheck, VerifiedEmail, LikeComment);


//comment reply releted paths
postRoutes.post('/comment/reply', AuthCheck, VerifiedEmail, RateLimiter(15), Reply);
postRoutes.get('/comment/reply/all', GetCommentReplies);
postRoutes.delete('/comment/reply/delete', VerifiedEmail, AuthCheck, DeleteCommentReply)
postRoutes.get('/comment/reply/like', AuthCheck, VerifiedEmail, LikeCommentReply);
export default postRoutes;