import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from 'fs';
import path from 'path';
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Get the image file from the request body
        const formData = await request.formData();
        const file:any = formData.get('image');

        // Check if a file is uploaded
        if (!file) {
            console.log('no file!');
            return new Response('No file uploaded', { status: 400 });
        }

        // Create a temporary file path
        console.log('file', file);
        const tempFilePath = path.join('/tmp', file.name);
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Save the file to a temporary location
        fs.writeFileSync(tempFilePath, fileBuffer);

        // Create the Google AI file manager and generative AI instance
        const fileManager = new GoogleAIFileManager(process.env.API_KEY as string);
        const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
        console.log("smt!");
        // Upload the file to Google Cloud Storage and get the URI
        const fileUri = await fileManager.uploadFile(tempFilePath, {
            mimeType: file.type,
            displayName: file.name,
        });

        // Use the Gemini AI model to generate a description
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent([
            'Need recognize Pokémon  on image. I want see JSOM FORMAT like that. Should be only object!!! : {isPokemon :true/false,' +
            'description:provide arguments why it not pokemon if pokemon not exist if pokemon exist description of pokemon,' +
            'name:give me name of pikachu if detected,' +
            'code:code of pokemon like #0001, weakness:list of weakness,type:type of pokemon',
            'properties:{height:height of pokemon,category:category of pokemon,weight:weight of pokemon,' +
            'abilities:abilities of pokemon display it in string like ability1/ability2/ability/3,Gender:gender of pokemon,}}',
            {
                fileData: {
                    fileUri: fileUri.file.uri,
                    mimeType: fileUri.file.mimeType,
                },
            },
        ]);

        // Clean up the temporary file after upload (optional)
        fs.unlinkSync(tempFilePath);
        console.log(result)
        // Return the result
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.log(error);
        return new Response(error.message, { status: 500 });
    }
}
