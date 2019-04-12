const API_URL = "https://jsonplaceholder.typicode.com";

const headers = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json; charset=UTF-8"
};

export const signIn = async () =>
  // faz um post e retorna um id que vamos usar como token, para simular autenticação
  fetch(`${API_URL}/posts`, {
    headers: {
      ...headers
    },
    method: "post",
    body: JSON.stringify({
      title: "foo",
      body: "bar",
      userId: 1
    })
  });

export const getUsers = async () =>
  fetch(`${API_URL}/users`, {
    headers: {
      ...headers
    }
  });

export const getUser = async id =>
  fetch(`${API_URL}/users/${id}`, {
    headers: {
      ...headers
    }
  });

export const getUserPosts = async id =>
  fetch(`${API_URL}/posts?userId=${id}`, {
    headers: {
      ...headers
    }
  });
