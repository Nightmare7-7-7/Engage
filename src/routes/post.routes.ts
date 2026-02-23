import { Router } from 'express'
import { CreatePost } from '../controllers/post.controllers'
import { AuthCheck } from '../middlewares/auth.middleware';
import { uploadMedia } from '../middlewares/multer';
import { multerWrapper } from '../middlewares/multerWrapper';

const postRoutes = Router()



postRoutes.post('/create', multerWrapper(uploadMedia.single("media"), "media"), AuthCheck, CreatePost);

export default postRoutes;