/**
 * Split Text into span
 * @param {HTMLElement} element 
 */
export const splitText = (element) => {
    console.log(element)
    Array.prototype.forEach.call(element, function(el, i) {
        let elText = el.innerText;
        el.setAttribute('data-word', elText);

        const  chars = elText.split('');

        let res = chars.map((el, i) => {
            return `<span style="--i:${i}">${el}</span>`;
        }).join('');
    
        el.innerHTML = res;

    })
}