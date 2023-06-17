import axios from "axios";
import { useEffect, useState } from "react";
import { book_search, parseResult } from "../page/Search";

export function useAIRecommendation(booksList,shouldRefresh){
    
    const [result,setResult] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    async function getRecommendation(){
        setLoading(true);
        const prompt = `
        Recommend me 5 books based on the book I've read!
        I've read: 
        ${booksList || "I haven't read any book so recommend me some of the best selling"}.
        Write a javascript array inside it is an object with the book name as 'title'  and its ISBN number as 'ISBN', and don't say anything before it.
        `;
        const req = await axios.post('https://api.openai.com/v1/completions',
            {
                "model":"text-davinci-003",
                "prompt":prompt,
                "temperature":1,
                "max_tokens":300
            }, {
            headers:{
                "Content-type": 'application/json',
                "Authorization": `Bearer ${import.meta.env.VITE_OPENAI}`
            }
        })

        console.log(req.data,req.data.choices[0].text);
        let ai = [];
        try{
            //  ai = JSON.parse(req.data.choices[0].text);
            ai = eval("(" + req.data.choices[0].text + ")");
        }catch(err){
            console.log('Error Catched:',err);
            setLoading(false);
            setError('There were some problems while trying to generate recommendations please try refreshing the pages!');
            return;
        }
        console.log(ai);
        // return;
        // if(!ai || !ai.recommendation ||ai.recommendation.length === 0 ) {
        //     setLoading(false);
        //     setError('There were some problems while trying to generate recommendations please try refreshing the pages!');
        //     return;
        // }
        let allRecc = [];
        for(let i = 0; i < ai.length; i++){
            const title = ai[i].title;
            const apires = await book_search(title || 'a');
            allRecc.push(parseResult(apires)[0] || []);
        }
        setResult(allRecc);
        setLoading(false);
        localStorage.setItem('recc_refreshed',true);
        localStorage.setItem('recommendation',JSON.stringify({recommendation:allRecc}));
    }
    
    useEffect(()=>{
        if(!shouldRefresh){
            console.log('Generating Recommendations');
            getRecommendation();
        }else{
            console.log('Recommendation already refreshed');
            const res = JSON.parse(localStorage.getItem('recommendation'));
            setResult(res.recommendation || []);
       }
    },[])

    return {recommendation:result,loading,error};
}