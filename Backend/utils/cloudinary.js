import {v2 as cloudinary} from 'cloudinary'
import { config } from 'dotenv'

config()
cloudinary.config({
    cloud_name:process.env.cloudinaryName,
    api_key:process.env.cloudinaryApiKey,
    api_secret:process.env.cloudinaryApiSecret
})
export default cloudinary