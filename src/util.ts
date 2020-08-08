import fetch = require("node-fetch");

type quote = {
  text:string;
  author:string;
}

export async function getQuote(): Promise<quote> {
  const response = await fetch("https://type.fit/api/quotes")
  const jsonObj: quote[] = await response.json()
  const idx =  Math.floor((Math.random() * jsonObj.length) + 1);
  return jsonObj[idx];
}