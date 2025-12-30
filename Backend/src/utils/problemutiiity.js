const axios=require('axios');
const getLanguageById=(lang)=>{
    const language={
        "cpp":54,
        
        "java":62,
        "javascript":63
    }
    return language[lang.toLowerCase()];
}
const submitBatch=async(submissions)=>{
    const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': '5e5be17ec4msh4c3e6a38b9be5a3p19bf45jsnc5a3d71f36f9',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();
}

const waiting=async(timer)=>{
    setTimeout(()=>{
        return 1;
    },timer);
}
// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
//we get the tokens like that in previous code

const submittoken=async(resultToken)=>{
    const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'true',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '5e5be17ec4msh4c3e6a38b9be5a3p19bf45jsnc5a3d71f36f9',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}



while(true){
    const result=await fetchData();
    const IsResultObtained=result.submissions.every((r)=>r.status_id>2);
    if(IsResultObtained){
        return result.submissions;
    }
    await waiting(1000);

}

}
module.exports={getLanguageById,submitBatch,submittoken};

