

// A .variaveis
const p = document.querySelector('#passa');
let toggie = true;
 
function trocafrase(){
    p.textContent = 'Obrigado por passares';

}
function repoefrase(){
    p.textContent = '1.Passa por aqui';
}

p.onmouseover = trocafrase;
p.addEventListener('mouseout', repoefrase);{

}
