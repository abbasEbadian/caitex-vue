const HEADERS = {
    "Content-Type": "application/json"
}
// const base_url = "http://localhost:8000/api/v1/"
const base_url = "https://caitex.net/api/v1/"
const get_url = (endpoint) =>{
    return new URL(endpoint, base_url).href
}
export const deposit = (data) => {
    const token = localStorage.getItem('token')
    const headers = {...HEADERS, Authorization: "Token " + token} 
    const d= {
        type: data.currency,
        amount: data.amount,
        test: data.test
        // "name": "Caitex",
        // "secret_key": "93670b9ac912296e1a74caa33a417050",
        // "password": "8A73CE1FE3F948F7D8944951D30E5AFA",
        // "amount": 1.23412341,
        // "order_id": "-1005",
        // "currency": "USD",
        // "description": "Payment for t-shirt ALFAcoins size XXL",
        // "options": {
        //   "notificationURL": "https://www.alfacoinshop.com/notification.php",
        //   "redirectURL": "http://localhost:3000",
        //   "payerName": "Caitex user",
        //   "payerEmail": "no_reply@alfacoins.com"
        // }
    }


    return new Promise((resolve, reject) => {
        fetch(get_url("deposit/"), {method: "post", body: JSON.stringify(d), headers})
        .then(response => response.json())
        .then(response =>{
            return resolve(response)
        })
        .catch(e => {
            console.log(e)
            return reject("error")
        })
    })
}
export const withdraw = (data) => {
    
    const token = localStorage.getItem('token')
    const headers = {...HEADERS, Authorization: "Token " + token} 
    const d= {
        type: data.currency,
        amount: data.amount,
        test: data.test,
        address: data.address
        // "name": "Caitex",
        // "secret_key": "93670b9ac912296e1a74caa33a417050",
        // "password": "8A73CE1FE3F948F7D8944951D30E5AFA",
        // "amount": 1.23412341,
        // "order_id": "-1005",
        // "currency": "USD",
        // "description": "Payment for t-shirt ALFAcoins size XXL",
        // "options": {
        //   "notificationURL": "https://www.alfacoinshop.com/notification.php",
        //   "redirectURL": "http://localhost:3000",
        //   "payerName": "Caitex user",
        //   "payerEmail": "no_reply@alfacoins.com"
        // }
    }



    return new Promise((resolve, reject) => {
        fetch(get_url("withdraw/"), {method: "post", body: JSON.stringify(d), headers: headers})
        .then(response => response.json())
        .then(response =>{
            return resolve(response)
        })
        .catch(e => {
            console.log(e)
            return reject("error")
        })
    })
}

export const get_pair_price = (pair) =>{
    
    return new Promise((res, rej)=>{
        fetch(get_url("pair_price/"),{method: "post", body: JSON.stringify({pair}), headers: HEADERS})
        .then(response => response.json())
        .then(response =>{
            return res(response)
        })
        .catch(e => {
            console.log(e)
            return rej("error")
        })
    })
}
export const profile = () =>{
    
    const token = localStorage.getItem('token')
    const headers = { Authorization: "Token  " + token} 
    return new Promise((res, rej)=>{
        fetch(get_url("profile/"),{method: "get", headers})
        .then(response => response.json())
        .then(response =>{
            return res(response)
        })
        .catch(e => {
            console.log(e)
            return rej("error")
        })
    })
}
export const assets = () =>{
     
    return new Promise((res, rej)=>{
        fetch(get_url("currencies/"),{method: "get"})
        .then(response => response.json())
        .then(response =>{
            return res(response)
        })
        .catch(e => {
            console.log(e)
            return rej("error")
        })
    })
}