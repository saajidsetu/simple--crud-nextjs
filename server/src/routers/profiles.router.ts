import { Router } from 'express';
import {
    getProfileList,
	createProfile,
    getSingleProfile,
    updateProfile,
	deleteProfile,
	getProfileByUser,
} from '../controllers/profiles.controller';
import { verifyToken } from '../middlewares/access-control.middleware';
import validateRequest from '../middlewares/error.validation';
// import { createProfileSchema, updateProfileSchema } from '../validators/profile.validator'
const router = Router();

router.patch('/', validateRequest, verifyToken, updateProfile);
router.post('/', validateRequest, verifyToken, createProfile);
router.get('/', getProfileList);
router.get('/by-user/:userId', verifyToken, getProfileByUser)
router.get('/:id', getSingleProfile);
router.delete('/:id', verifyToken, deleteProfile);

export default router;
