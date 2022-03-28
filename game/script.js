/*chave alphavantage
/*LZPK3ABRMMBD23DL*/

/*
2021-11-02:
1. open: "126.3000"
2. high: "127.1700"
3. low: "124.9100"
4. cosed: "126.1800"
5. volume: "4496393"
*/
function log(texto) {
    console.log(texto)
}


var cotacao = []
var date = []
var fechamento = []
var abertura = []
var maxima = []
var minima = []
var maximo = 0
var velocidade = 400;
var comprado = false
var vendido = false
var posicao = 0;
var lucroPrejuizo = 0
$("#veloc").val(velocidade)
fetchStock()
var carteira = 5000.00
$("#carteira").text(carteira)

//quando clica no teclado

document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {
        e.preventDefault();
        log("clicou no espaço")
    }
}

var pausado = false
document.addEventListener('keydown', e => {
    if (e.keyCode == 32) {
        e.preventDefault();
        if (pausado == false) {
            clearInterval(myTimer);
            pausado = true
        }else{
            myTimer = setInterval(loop, velocidade);
            pausado = false
        }   
    }
    if (e.keyCode == 39) {
        e.preventDefault();
        loop()
    }
    if (e.keyCode == 38) {
        e.preventDefault();
        log("comprou a " + fechamento[local])
        comprado = true;
        posicao = fechamento[local]
    }
    if (e.keyCode == 40) {
        e.preventDefault();
        vendido = true;
        posicao = fechamento[local]
    }
    if (e.keyCode == 96) {
        e.preventDefault();
        comprado = false;
        vendido = false;
        carteira += parseFloat(lucroPrejuizo)
        imprimeCarteira(carteira)
        $("#lp").text(0)
        posicao = 0
    }

});

$("#veloc").focusout(function () {
    log($(this).val())
    velocidade = $(this).val()
    clearInterval(myTimer);
    myTimer = setInterval(loop, velocidade);
});

function imprimeCarteira(valor){
    var novoFloat = parseFloat(valor).toFixed(2)
    $("#carteira").text(novoFloat)
}

function fetchStock() {
    const API_KEY = "LZPK3ABRMMBD23DL";
    let API_call = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=GOOG&outputsize=full&apikey=' + API_KEY;

    $.getJSON(API_call)
        .done(function (data) {
            cotacao = data["Time Series (Daily)"]
            matematica()
        })
}

function matematica() {


    for (let dia of Object.keys(cotacao)) {
        date.push(dia)
        var cosed = parseInt(cotacao[dia]["4. close"])
        fechamento.push(parseFloat(cotacao[dia]["4. close"]).toFixed(2))
        abertura.push(parseFloat(cotacao[dia]["1. open"]).toFixed(2))
        minima.push(parseFloat(cotacao[dia]["3. low"]).toFixed(2))
        maxima.push(parseFloat(cotacao[dia]["2. high"]).toFixed(2))
        if (cosed > maximo) {
            maximo = cosed
        }
    }

    local = date.length;
    desenhagraficototal()
    loop()
}

var canvas = document.getElementById('game');

var ctx = canvas.getContext('2d');

var local = date.length;
var myTimer = setInterval(loop, velocidade);
//ctx.clearRect(0, 0, 700, 700);


function desenhagraficototal() {
    if (canvas.getContext) {
        
        ctx.clearRect(0, 0, 1000, 600);
        for (let d = 0; d < date.length; d++) {
            var passoLinha = canvas.width / date.length
            var passoY = canvas.height / maximo
            var larguraCandle = (passoLinha / 2)
            var afastamentoTopo = 40
            var max = canvas.height - (passoY * maxima[d] - afastamentoTopo)
            var min = canvas.height - (passoY * minima[d] - afastamentoTopo)
            var aber = canvas.height - (passoY * abertura[d] - afastamentoTopo)
            var fech = canvas.height - (passoY * fechamento[d] - afastamentoTopo)
            var x = (date.length - d) * passoLinha

            //ctx.restore();
            ctx.fillStyle = "#a6a6a6";
            //desenha sombra
            ctx.fillRect(x, max, 1, (min - max));

            if (aber > fech) {
                ctx.fillStyle = "#62c3d9";
                ctx.fillRect(x - larguraCandle, aber, larguraCandle * 2, (fech - aber));
            } else {
                ctx.fillStyle = "#db3b3b";
                ctx.fillRect(x - larguraCandle, fech, larguraCandle * 2, (aber - fech));
            }
            ctx.stroke();
        }
    }
}

var quantidadedecandles = 60
function loop() {

    if(comprado == true){
        lucroPrejuizo = (fechamento[local] - posicao).toFixed(2)
        imprimeCarteira(carteira+parseFloat(lucroPrejuizo))
        $("#lp").text(lucroPrejuizo)
    }
    if(vendido == true){
        lucroPrejuizo = (posicao - fechamento[local]).toFixed(2)
        imprimeCarteira(carteira+parseFloat(lucroPrejuizo))
        $("#lp").text(lucroPrejuizo)
    }

    $("#max").text(maxima[local])
    $("#min").text(minima[local])
    $("#opem").text(abertura[local])
    $("#close").text(fechamento[local])


    if (canvas.getContext) {
        desenhagraficototal()


        var passoLinha = canvas.width / date.length
        var passoLinha2 = canvas.width / quantidadedecandles
        var passoY = canvas.height / maximo
        var larguraCandle = (passoLinha2 / 2)

        if (local > 0) {
            //ctx.clearRect(0, 0, 700, 700);



            var topo = 0
            var fundo = 7000
            for (let d = 0; d < quantidadedecandles; d++) {
                if (topo < maxima[local + d]) {
                    topo = maxima[local + d]
                }
                if (fundo > minima[local + d]) {
                    fundo = minima[local + d]
                }
            }
            var passoY2 = canvas.height / (topo - fundo)
            for (let d = 0; d < quantidadedecandles; d++) {

                var max = canvas.height - ((maxima[local + d] - fundo) * passoY2)

                var min = canvas.height - ((minima[local + d] - fundo) * passoY2)
                var aber = canvas.height - ((abertura[local + d] - fundo) * passoY2)
                var fech = canvas.height - ((fechamento[local + d] - fundo) * passoY2)
                var x = (canvas.width - d * passoLinha2) - passoLinha2
                ctx.fillStyle = "#a6a6a6";
                ctx.fillRect(x, max, 1, (min - max));
                if (aber > fech) {
                    ctx.fillStyle = "#62c3d9";
                    ctx.fillRect(x - larguraCandle, aber, larguraCandle * 2, (fech - aber));
                } else {
                    ctx.fillStyle = "#db3b3b";
                    ctx.fillRect(x - larguraCandle, fech, larguraCandle * 2, (aber - fech));
                }
            }


        }

    }
    local--
}
