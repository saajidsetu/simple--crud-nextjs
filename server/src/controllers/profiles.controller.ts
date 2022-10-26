import { Request, Response } from "express";
import logger from "../config/logger";
import { iApiUser } from "../interfaces/auth.interface";
import Profile from "../models/Profile.model";
import { formatError } from "../utils/error.util";
import fs from "fs/promises";
import path from "path";
import { promisify } from "util";
import { uploadFileToCDN } from "../utils/upload.util";

const NAMESPACE = "Profile Controller";
const ALLOWED_IMAGE_EXTENSIONS = /png|jpg|jpeg|webp/;
const ALLOWED_FILE_EXTENSIONS = /pdf|doc|docx/;

// Create Profile
export const createProfile = async (req: Request, res: Response) => {
    try {
        const {
            club_name,
            nccp_number,
            club_number,
            about_us,
			offered_programms,
            contact_name,
            address,
            tel,
            cell,
            email,
            website,
            job_title,
            incorporation_number,
            facebook,
            twitter,
            instagram,
            youtube,
            linkedin,
            canskateexcellence,
			excellencedetails,
            coaches,
            owners,
        } = req.body;
        const user: iApiUser = req.body.api_user;

        const newProfile = new Profile({
            club_name,
            nccp_number,
            club_number,
            about_us,
			offered_programms,
            contact_name,
            address,
            tel,
            cell,
            email,
            website,
            job_title,
            incorporation_number,
            facebook,
            twitter,
            instagram,
            youtube,
            linkedin,
            canskateexcellence,
			excellencedetails,
            coaches,
            owners,
        });

        newProfile.user = user._id;

        if (req.files) {
            const profile_image: any = req.files.profile_image;
            const club_logo: any = req.files.club_logo;
            const documents: any = req.files.documents;

            const profileExtName = profile_image.name.split(".")[
                profile_image.name.split(".").length - 1
            ];
            const logoExtName = club_logo.name.split(".")[
                club_logo.name.split(".").length - 1
            ];
            const docExtName = documents.name.split(".")[
                documents.name.split(".").length - 1
            ];

            if (!ALLOWED_IMAGE_EXTENSIONS.test(profileExtName)) {
                return res
                    .status(400)
                    .json(
                        formatError(
                            "Only Image files are acceptable for profile image"
                        )
                    );
            }

            if (!ALLOWED_IMAGE_EXTENSIONS.test(logoExtName)) {
                return res
                    .status(400)
                    .json(
                        formatError(
                            "Only Image files are acceptable for club logo"
                        )
                    );
            }

            if (!ALLOWED_FILE_EXTENSIONS.test(docExtName)) {
                return res
                    .status(400)
                    .json(
                        formatError(
                            "Only pdf, doc and docx files are acceptable for documents"
                        )
                    );
            }

            const server = process.env.SERVER_ADDRESS;
            const unique_number = Date.now().toString().slice(7, -1);

            const user: iApiUser = req.body.api_user;
            await fs.mkdir(path.resolve("server", "uploads", user._id), {
                recursive: true,
            });

            const profileURL = `${path.resolve(
                "server",
                "uploads",
                user._id
            )}/${unique_number}-${profile_image.name}`;
            const logoURL = `${path.resolve(
                "server",
                "uploads",
                user._id
            )}/${unique_number}-${club_logo.name}`;
            const docURL = `${path.resolve(
                "server",
                "uploads",
                user._id
            )}/${unique_number}-${documents.name}`;

            await promisify(profile_image.mv)(profileURL);
            await promisify(club_logo.mv)(logoURL);
            await promisify(documents.mv)(docURL);

            const profileImageUrl = `${server}/uploads/${user._id}/${unique_number}-${profile_image.name}`;
            const logoImageUrl = `${server}/uploads/${user._id}/${unique_number}-${club_logo.name}`;
            const documentsUrl = `${server}/uploads/${user._id}/${unique_number}-${documents.name}`;

            newProfile.profile_image = profileImageUrl;
            newProfile.club_logo = logoImageUrl;
            newProfile.documents = [documentsUrl];
        }

        await newProfile.save();

        res.json({ success: true });
    } catch (err: any) {
        logger.error(NAMESPACE, "Create profile error", err);
        res.status(500).json(formatError("Server error"));
    }
};

export const updateProfile = async (req: Request, res: Response) => {
	// console.log(req.body);
	
    const {
        profileId,
        club_name,
        nccp_number,
        club_number,
        about_us,
		offered_programms,
        contact_name,
        address,
        tel,
        cell,
        email,
        website,
        job_title,
        incorporation_number,
        facebook,
        twitter,
        instagram,
        youtube,
        linkedin,
        canskateexcellence,
		excellencedetails,
        coaches,
        owners,
    } = req.body;
    const user: iApiUser = req.body.api_user;

    try {
        const profileFound = await Profile.findById(profileId);

        if (!profileFound) {
            return res.status(404).json(formatError("Profile not found"));
        }

        const to_update: any = {
            club_name,
            nccp_number,
            club_number,
            about_us,
			offered_programms: JSON.parse(offered_programms),
            contact_name,
            address,
            tel,
            cell,
            email,
            website,
            job_title,
            incorporation_number,
            facebook,
            twitter,
            instagram,
            youtube,
            linkedin,
            canskateexcellence,
			excellencedetails,
            coaches: JSON.parse(coaches),
            owners: JSON.parse(owners),
        };

        if (req.files) {

            const server = process.env.SERVER_ADDRESS;
            const unique_number = Date.now().toString().slice(7, -1);

            const user: iApiUser = req.body.api_user;

			if (req.files.profile_image) {
				const profile_image: any = req.files.profile_image;
				const profileExtName = profile_image.name.split(".")[
					profile_image.name.split(".").length - 1
				];
				if (!ALLOWED_IMAGE_EXTENSIONS.test(profileExtName)) {
					return res
						.status(400)
						.json(
							formatError(
								"Only Image files are acceptable for profile image"
							)
						);
				}
				const profileImageUrl = await uploadFileToCDN(profile_image, profile_image.name);
				to_update.profile_image = profileImageUrl;
				
			}

			if (req.files.club_logo) {
				const club_logo: any = req.files.club_logo;
				const logoExtName = club_logo.name.split(".")[
					club_logo.name.split(".").length - 1
				];
				if (!ALLOWED_IMAGE_EXTENSIONS.test(logoExtName)) {
					return res
						.status(400)
						.json(
							formatError(
								"Only Image files are acceptable for club logo"
							)
						);
				}
				
				const logoImageUrl = await uploadFileToCDN(club_logo, club_logo.name);

				to_update.club_logo = logoImageUrl;
			}

			if (req.files.documents) {
				const documents: any = req.files.documents;
				const documentUrls: string[] = []
				documents.forEach( async (doc: any) => {
					const logoImageUrl = await uploadFileToCDN(doc, doc.name);
					documentUrls.push(logoImageUrl)
				})

				to_update.documents = documentUrls;
			}

        }

        await Profile.findByIdAndUpdate(profileId, to_update);

        res.status(200).json({ msg: "Updated profile" });
    } catch (err: any) {
        logger.error(NAMESPACE, "Error updating profile", err);
        return res.status(500).json(formatError("Server error"));
    }
};

export const getProfileList = async (req: Request, res: Response) => {
    try {
        const profiles = await Profile.find();
        res.json(profiles);
    } catch (err) {
        logger.error(NAMESPACE, "Error getting profiles");
        return res.status(500).json(formatError("Server error"));
    }
};

export const getSingleProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const profileFound = await Profile.findById(id);

        if (!profileFound) {
            return res.status(404).json(formatError("No profile found"));
        }

        res.json(profileFound);
    } catch (err: any) {
        logger.error(NAMESPACE, "View single profile error", err);
        res.status(500).json(formatError("Server error"));
    }
};

export const deleteProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const profileFound = await Profile.findById(id);

        if (!profileFound) {
            return res.status(404).json(formatError("Profile not found"));
        }

        const deleted = await Profile.findByIdAndDelete(id);

        res.json({ msg: "Deleted profile" });
    } catch (err: any) {
        logger.error(NAMESPACE, "Error deleting profile");
        return res.status(500).json(formatError("Server error"));
    }
};

export const getProfileByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const profileFound = await Profile.findOne({ user: userId });
        if (!profileFound) {
            return res.status(404).json(formatError("Profile not found"));
        }
        res.json(profileFound);
    } catch (err: any) {
        logger.error(NAMESPACE, "Error Fetching profile by user", err);
        return res.status(500).json(formatError("Server error"));
    }
};
