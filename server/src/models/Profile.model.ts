import { Document, model, Schema } from "mongoose";
import { CAN_SKATE_EXCELLENCE } from "../types/index";

interface iCoach {
    name: string;
    email: string;
    certificates: string[];
}

interface iOwner {
    name: string;
    email: string;
    title: string;
}

interface ProfileDocument extends Document {
    user: Schema.Types.ObjectId | string;
    profile_image?: string;
    club_name: string;
    club_logo?: string;
    nccp_number: string;
    club_number: string;
    about_us: string;
	offered_programms: string[];
    contact_name: string;
    address: string;
    tel: string;
    cell?: string;
    email: string;
    website?: string;
    job_title?: string;
    incorporation_number: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    canskateexcellence: CAN_SKATE_EXCELLENCE;
	excellencedetails: string;
    coaches: iCoach[];
    owners: iOwner[];
    documents: string[];
}

const ProfileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        profile_image: {
            type: String,
            default: "",
        },
        club_name: {
            type: String,
            default: "",
        },
        club_logo: {
            type: String,
            default: "",
        },
        nccp_number: {
            type: String,
            default: "",
        },
        club_number: {
            type: String,
            default: "",
        },
        about_us: {
            type: String,
            default: "",
        },
        offered_programms: {
            type: [String],
            default: [],
            required: false,
        },
        contact_name: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            default: "",
        },
        tel: {
            type: String,
            default: "",
        },
        cell: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        },
        job_title: {
            type: String,
            default: "",
        },
        incorporation_number: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        youtube: {
            type: String,
            default: "",
        },
        linkedin: {
            type: String,
            default: "",
        },
        canskateexcellence: {
            type: String,
            default: "",
        },
		excellencedetails: {
            type: String,
            default: "",
        },
        coaches: {
            type: [
                {
                    name: { type: String, default: "" },
                    email: { type: String, default: "" },
                    certificates: { type: Array, default: [] },
                    job_title: { type: String, default: "" },
                },
            ],
            default: [],
        },
        owners: {
            type: [
                {
                    name: { type: String, default: "" },
                    email: { type: String, default: "" },
                    title: { type: String, default: "" },
                },
            ],
            default: [],
        },
        documents: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

const Profile = model<ProfileDocument>("profiles", ProfileSchema);

export default Profile;
