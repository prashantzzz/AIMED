import { client } from "@gradio/client";

const response_0 = await fetch("https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png");
const exampleImage = await response_0.blob();
						
const app = await client("vikhyatk/moondream2");
const result = await app.predict("/answer_question", [
				exampleImage, 	// blob in 'Upload an Image' Image component		
				"Hello!!", // string  in 'Input' Textbox component
	]);

console.log(result.data);
