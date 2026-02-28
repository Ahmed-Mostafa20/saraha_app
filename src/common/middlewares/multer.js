import multer from "multer";
import fs from "fs"


export const multer_local = ({ customPath } = { customPath: 'genaral' }) => {
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
    return multer({ storage })
}