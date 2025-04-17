import { Request, Response } from "express";
import faqModel from "../model/faqModel";

interface UserType extends Request{
    user? :string
}

export const faqController = async (rq:UserType,rs:Response) =>{
    try {
        const {faq} = rq.body;
        const userId = rq.user;
        // console.log(userId);
        
        if (faq.length < 10) {
            rs.status(400).json({
                success:false,
                message:"minimun 10 charachter valid"
            })
            return
        }

        const userFaq = await new faqModel(
            {
                faq,
                user:userId
            }
        ).save()
        rs.status(201).json({
            success:true,
            message:"faq sent successfully",
            userFaq
        })
    } catch (error) {
        console.log(error);
        
    }
}


export const getAllFaqs = async (rq:Request,rs:Response) =>{
    try {
        const userFaqs = await faqModel.find({}).populate("user")
        if (!userFaqs) {
            rs.status(404).json({
                success:false,
                message:"faqs not found",

            })
            return
        }
            
         rs.status(200).json({
            totalFaqs:userFaqs.length,
            success:true,
            mesasge:"faqs fetched",
            userFaqs
        })

    } catch (error) {
        console.log(error);
        
    }
}