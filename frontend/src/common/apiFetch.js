const apiFetch=async (url,metadata)=>{
const response=await fetch(url,metadata);
return response
}
export default apiFetch