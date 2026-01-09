
        let counter = 0;
        function count(){
            counter++;
            alert(counter);
            document.querySelector('h1').innerHTML = counter;
        }
      
        document.querySelector('form').onsubmit = () => {
        value;
        document.querySelector('#frase').textContent = `Olá,${nome}!`;
        return false;
    };

    const hello = document.querySelector("#hello")
    document.querySelector('#red').onclick = function(){
        hello.style.color = "red";
    }
   document.querySelector('#green').onclick = function(){
        hello.style.color = "green";
    }
    document.querySelector('#blue').onclick = function(){
        hello.style.color = "blue";
    }

    document.querySelectorAll('button').forEach(function(button) {
        button.onclick = function (){
            hello.style.color = button.dataset.color;
        }
    })

    function count() {
        span.innerHTML = --counter;
    }
    if(counter == 0){
        clearInterval(invervalId);
        span.innerHTML ="terminou"
    }
         

document.addEventListener("DOMContentLoaded", () => {
  const listaProdutos = document.getElementById("lista-produtos");

  fetch("https://deisishop.pythonanywhere.com/products")
    .then(res => res.json())
    .then(data => {
      console.log("API devolveu:", data);

      listaProdutos.innerHTML = "";

      data.forEach(produto => {
        const div = document.createElement("div");
        div.innerHTML = `
          <h3>${produto.title}</h3>
          <p>${produto.description}</p>
          <p>€ ${produto.price}</p>
         <img src="https://deisishop.pythonanywhere.com${produto.image}" width="150">

          <hr>
        `;
        listaProdutos.appendChild(div);
      });
    })
    .catch(err => {
      console.error("ERRO:", err);
      listaProdutos.innerHTML = "Erro ao carregar produtos";
    });
});


