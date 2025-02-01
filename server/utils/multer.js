import multer from "multer"



const multerUpload = multer({dest: 'uploads/'})

export default multerUpload

