import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { NextRequest } from "next/server";
import { createClient } from '@/utils/supabase/server'; // Import your existing Supabase server client

export async function POST(request: NextRequest) {
    try {
        // Get the current user from the Supabase session
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('Error fetching user:', authError);
            return new Response('Unauthorized', { status: 401 });
        }

        const userId = user.id; // Get the current user's ID

        // Get the image file from the request body
        const formData = await request.formData();
        const file: any = formData.get('image');

        // Check if a file is uploaded
        if (!file) {
            console.log('no file!');
            return new Response('No file uploaded', { status: 400 });
        }

        // Convert the file to a buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Create the Google AI file manager and generative AI instance
        const fileManager = new GoogleAIFileManager(process.env.API_KEY as string);
        const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
        console.log("smt!");

        // Upload the file to Google Cloud Storage and get the URI
        const fileUri = await fileManager.uploadFile(fileBuffer, {
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

        //@ts-ignore
        const res: any = result?.response?.candidates[0]?.content?.parts[0]?.text;
        if (res) {
            console.log(res);
            const startIdx = res.indexOf('{');
            const endIdx = res.lastIndexOf('}');
            const trimmedString = res.slice(startIdx, endIdx + 1);

            // Upload the image to Supabase bucket named 'photos'
            const fileName = Date.now().toString(); // Use a unique filename
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('photos')
                .upload(fileName, fileBuffer, {
                    contentType: file.type,
                });

            if (uploadError) {
                console.error('Error uploading to Supabase:', uploadError);
                return new Response('Error uploading to Supabase', { status: 500 });
            }

            console.log('File uploaded to Supabase:', uploadData);

            // Get the public URL of the uploaded file
            const { data: urlData } = supabase
                .storage
                .from('photos')
                .getPublicUrl(fileName);

            const imageUrl = urlData.publicUrl;
            console.log('imageUrl:', imageUrl);
            console.log('userId:', userId);

            // Insert a new row into the `pokemons` table
            const { data: insertData, error: insertError } = await supabase
                .from('pokemons')
                .insert([
                    {
                        user_id: userId,
                        url: fileName, // Store the filename (or full URL if needed)
                        body: trimmedString,
                    },
                ]);

            if (insertError) {
                console.error('Error inserting into Supabase:', insertError);
                return new Response('Error inserting into Supabase', { status: 500 });
            }

            console.log('Row inserted into Supabase:', insertData);

            // Combine the Gemini response with the image URL
            const combinedResponse = {
                ...JSON.parse(trimmedString),
                url: imageUrl, // Add the image URL to the response
            };

            return new Response(JSON.stringify(combinedResponse), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response("Some error occurred", { status: 400 });

    } catch (error: any) {
        console.log(error);
        return new Response(error.message, { status: 500 });
    }
}