export function login(params) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ data: params }), 500)
  );
}

export const registerUser = (params) => {
  console.log(params, '+++++++')
  return fetch("https://wiljob.herokuapp.com/users", {
    method: "post",
    body: JSON.stringify(params),
  })
};


