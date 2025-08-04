import { Request, request } from "express";
import multer from "multer";
import path from "path"
import fs from "fs"

// const storage = multer.diskStorage({
//     destination(req, file, callback) {
        
//             callback(null,"uploads/");
//     },
//     filename(req, file, callback) {
//         const ext = path.extname(file.originalname);
//         const name = file.fieldname + "-"+ Date.now() + ext;
//         callback(null,name)
//         console.log(name);
        
//     },
// })
const storage = multer.diskStorage({
    destination(req, file, callback) {
        let folder = "uploads/";
 if (file.fieldname === "banner" || file.fieldname === "profile") {
      folder += "vepari";
    } else if (file.fieldname === "mainImage" || file.fieldname === "images") {
      folder += "products";
    }

     // Ensure folder exists
    fs.mkdirSync(folder, { recursive: true });
        callback(null,folder);
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