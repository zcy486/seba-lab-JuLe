const APIService = {

    register: async (data: string) => {
        return fetch('http://localhost:5000/register/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .catch(error => console.log(error))
    },

    login: async (data: string) => {
        return fetch('http://localhost:5000/login/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .catch(error => console.log(error))
    }

}

export default APIService