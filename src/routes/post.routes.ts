import { Router } from 'express'
import { CreatePost, DeletePost, GetAllPosts, GetPostById, LikePost, UpdatePost } from '../controllers/post.controllers'
import { AuthCheck } from '../middlewares/auth.middleware';
import { uploadMedia } from '../middlewares/multer';
import { multerWrapper } from '../middlewares/multerWrapper';

const postRoutes = Router()



postRoutes.post('/create', multerWrapper(uploadMedia.single("media"), "media"), AuthCheck, CreatePost);
postRoutes.get('/get/all', GetAllPosts);
postRoutes.get('/get', GetPostById);
postRoutes.put('/update', multerWrapper(uploadMedia.single("media"), "media"), AuthCheck, UpdatePost);
postRoutes.delete('/delete', AuthCheck, DeletePost);
postRoutes.get('/like', AuthCheck,LikePost);

export default postRoutes;