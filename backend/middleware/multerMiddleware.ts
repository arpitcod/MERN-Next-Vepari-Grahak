import { Request, request } from "express";
import multer from "multer";
import path from "path"


const storage = multer.diskStorage({
    destination(req, file, callback) {
            callback(null,"uploads/");
    },
    filename(req, file, callback) {
        const ext = path.extname(file.originalname);
        const name = file.fieldname + "-"+ Date.now() + ext;
        callback(null,name)
        console.log(name);
        
    },
})

// only filter image 
const fileFilter = (rq:Request,file:Express.Multer.File,callBack:any) =>{
    if (file.mimetype.startsWith("image/")) {
        callBack(null,true)
    }else{
        callBack(new Error("only images are allowed"),false)
    }
}


export const upload = multer({storage,fileFilter})