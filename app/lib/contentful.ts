import { createClient } from "contentful";
export function getContentfulClient(){
 const space=process.env.CONTENTFUL_SPACE_ID,accessToken=process.env.CONTENTFUL_ACCESS_TOKEN;
 return space&&accessToken?createClient({space,accessToken,timeout:10000}):null;
}
