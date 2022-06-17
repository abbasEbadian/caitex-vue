export const deposit = (data) => {
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
    const url = "http://localhost:8000/deposit/"

    return new Promise((resolve, reject) => {
        fetch(url,{method: "post", body: JSON.stringify(d), headers: {
            "Content-Type": "application/json"
        }})
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
        fetch("http://localhost:8000/pair_price/",{method: "post", body: JSON.stringify({pair}), headers: {
            "Content-Type": "application/json"
        }}).then(response => response.json())
        .then(response =>{
            return res(response)
        })
        .catch(e => {
            console.log(e)
            return rej("error")
        })
    })
}