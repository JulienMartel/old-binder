import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../adapters/openai";

const mixBasePrompt = (title: string) => `
Who is the author to the book "${title}". Print only the authors name and nothing else. Make sure it is not a complete sentence.

Author:

`; // last line break is important

type Data = {
  author?: string;
};

const authorAction = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { title } = req.body;

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: mixBasePrompt(title),
    temperature: 0.7,
    max_tokens: 100,
  });

  const [output] = baseCompletion.data.choices;

  const author = output.text?.trim();

  res.status(200).json({ author });
};

export default authorAction;
