export const getJobs = (params) => {  
  return fetch("https://wiljob.herokuapp.com/allJobs", {
    method: "get",  
  })
};