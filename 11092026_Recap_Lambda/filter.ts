const myarray = [1,7,4,2,8,3,13,11]

// isEven = (x:number) => x%2 === 0
const evenNumbers = myarray.filter(x => x%2 === 0)
const dividableByThree = myarray.filter(x => x%3 === 0)
const primeNumbers = myarray.filter(x => {
    if(x <= 1) return false
    else {
        for(let i = 2; i <= x/2; i++){
            if(x%i===0) return false
        }
        return true
    }
})
console.log(`Even Numbers in Array: ${evenNumbers}`)
console.log(`Array: ${dividableByThree} is dividable by 3`)
console.log(`Prime Numbers in Array: ${primeNumbers}`)