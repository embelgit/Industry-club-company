async function tokenReturn() {
    let yourConfig = {
      headers: {
        Authorization:
          sessionStorage.getItem("token") != null
            ? "Bearer " + sessionStorage.getItem("token")
            : "",
      },
    };
  
    return yourConfig;
  }
  
  export default tokenReturn;