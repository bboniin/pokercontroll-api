export async function getMethodsPay(valuePay, methodsC) {
    let methodsPay = []
    await methodsC.map(async (item) => {
        if (valuePay) {
            if (item.value >= valuePay) {
                methodsPay[0] = {
                    name: item["name"],
                    percentage: item["percentage"],
                    id: item["id"],
                    value: valuePay,
                }
                item.value -= valuePay
                valuePay = 0
            } else {
                methodsPay[methodsPay.length] = {
                    name: item["name"],
                    percentage: item["percentage"],
                    id: item["id"],
                    value: item["value"],
                }
                valuePay -= item.value
                item.value = 0
            }
        }
    })

    if (valuePay) {
        methodsPay[methodsPay.length] = {
            name: "Crédito",
            id: "Crédito",
            percentage: 0,
            value: valuePay,
        }
        return {methodsPay, payCredit: valuePay, methodsC}; 
    } else {
        return {methodsPay, payCredit: 0, methodsC}; 
    }

};