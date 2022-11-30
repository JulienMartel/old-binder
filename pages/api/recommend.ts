import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../adapters/openai";

const mixBasePrompt = (bookList: string[]) => `
Give me a list of 3 good book recommendations that you think I would enjoy, based on the following data lists.

Favorite genres are:
Non-fiction

My favorite books are:
${bookList.map((book) => `${book}`).join("\n")}

Make sure the list is not numbered, and should have no prefixes. The format of the list should look like:
{Book title} by {Author name}

Recommendations:

`; // last line break is important

type Data = {
  recommendations?: string[];
};

const generateAction = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { favoriteBooks } = req.body;

  console.log(mixBasePrompt(favoriteBooks));

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: mixBasePrompt(favoriteBooks),
    temperature: 0.8,
    max_tokens: 300,
  });

  const [output] = baseCompletion.data.choices;

  const recommendations = output.text?.split("\n").filter((line) => line);

  res.status(200).json({ recommendations });
};

export default generateAction;
