

const numIn=document.querySelector('.weightInputNumber');
const rangeIn=document.querySelector('.weightInputRange');
const actualPrice=document.querySelector('.actualPrice');

numIn.addEventListener('input',(e)=>{
    e.preventDefault();
    rangeIn.value=numIn.value;
})
rangeIn.addEventListener('input',(e)=>{
    e.preventDefault();
    numIn.value=rangeIn.value;
})
