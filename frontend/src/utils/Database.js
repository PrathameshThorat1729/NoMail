const base_uri = "http://localhost:8080"

export async function signupUser({ username, email, password, confirmPassword }, signal) {
  try {

    let res = await fetch(base_uri + "/user/signup", {
      signal,
      method: "POST",
      body: JSON.stringify({ username, email, password, confirmPassword }),
      headers: {
        "Content-Type": "application/json"
      }});
    let data = await res.json();

    return data;
  } catch (err) {
    return {
      status: false,
      message: "Internal Error Occured"
    }
  }
}

export async function loginUser({ email, password }, signal) {
  try {
    let res = await fetch(base_uri + "/user/login", {
      signal,
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    let data = await res.json();

    return data;
  } catch (err) {
    return {
      status: false,
      message: "Internal Error Occured"
    }
  }
}

export async function getEmails() {
  try {
    let res = await fetch(base_uri + "/token/getEmails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("loginToken")}`
      }
    });
    let data = await res.json();

    return data;
  } catch (err) {
    return {
      status: false,
      message: "Internal Error Occured"
    }
  }
}

export async function deleteEmail({email}) {
  try {
    let res = await fetch(base_uri + "/token/deleteEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("loginToken")}`
      },
      body: JSON.stringify({email})
    });
    let data = await res.json();

    return data;
  } catch (err) {
    return {
      status: false,
      message: "Internal Error Occured"
    }
  }
}

export async function createEmail({name, email, token}, signal) {
  try {
    let res = await fetch(base_uri + "/token/register", {
      signal,
      method: "POST",
      body: JSON.stringify({ name, email, token }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("loginToken")}`
      }
    });
    let data = await res.json();

    return data;
  } catch (err) {
    return {
      status: false,
      message: "Internal Error Occured"
    }
  }
}