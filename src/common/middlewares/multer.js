import multer from "multer";
import fs from "fs"

export let extensions = {
    image: ['image/jpeg', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/avi', 'video/mkv', 'video/mov', 'video/wmv'],
    audio: ['audio/mp3', 'audio/wav', 'audio/aac', 'audio/flac', 'audio/ogg'],
    document: ['application/pdf']
}
export const multer_local = ({ customPath, allowedExtensions } = { customPath: 'genaral' }) => {
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `./uploads/${customPath}`
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }
            cb(null, path)
        },
        filename: function (req, file, cb) {
            let prefix = Date.now() + '-' + file.originalname
            cb(null, prefix)
        }
    })
    let fileFilter = function (req, file, cb) {
        if (!allowedExtensions.includes(file.mimetype)) {
            cb(new Error('Invalid file type'), false);
        }
        cb(null, true)
    }
    return multer({ storage, fileFilter })
}