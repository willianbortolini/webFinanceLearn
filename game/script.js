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
var velocidade = 100;
var comprado = false
var vendido = false
var posicao = 0;
var lucroPrejuizo = 0
var lote = 0
var mao = 10
$("#veloc").val(velocidade)
fetchStock()
var carteira = 5000.00
$("#carteira").text(carteira)
var graficoHeigth = 600
var graficoWidth = 800
    //quando clica no teclado

document.body.onkeyup = function(e) {
    if (e.keyCode == 32) {
        e.preventDefault();
        log("clicou no espaço")
    }
}

function aleatorio(fech, tamanhoTotal) {
    return fech + (tamanhoTotal / 20) - Math.random() * (tamanhoTotal / 10);
}

var pausado = false
document.addEventListener('keydown', e => {
    if (e.keyCode == 32) {
        e.preventDefault();
        if (pausado == false) {
            clearInterval(myTimer);
            pausado = true
        } else {
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
        compra(mao)
    }
    if (e.keyCode == 40) {
        e.preventDefault();
        vende(mao)
    }
    if (e.keyCode == 96) {
        e.preventDefault();
        zeraOperacao()
    }

    if (e.keyCode == 37) {
        e.preventDefault();
        local = (parseFloat(local) + 0.02).toFixed(2)
        loop()
    }

})

function compra(quant) {
    if (lote == 0) {
        comprado = true;
        posicao = fechamento[local]
        lote += quant
    } else if (vendido && (lote - quant) == 0) {
        zeraOperacao()
    } else if (vendido && (lote - quant) < 0) {
        zeraOperacao()
        console.log("virou a mao")
        vende(quant - lote)
    } else if (comprado) {
        posicao = (lote * posicao + quant * fechamento[local]) / (lote + quant)
        lote += quant
    } else if (vendido) {
        posicao = (lote * posicao - quant * fechamento[local]) / (lote - quant)
        lote -= quant
    }
    $("#quantidade").text(lote)
}

function vende(quant) {
    if (lote == 0) {
        vendido = true;
        posicao = fechamento[local]
        lote += quant
    } else if (comprado && (lote - quant) == 0) {
        zeraOperacao()
    } else if (comprado && (lote - quant) < 0) {
        zeraOperacao()
        console.log("virou a mao")
        vende(quant - lote)
    } else if (comprado) {
        posicao = (lote * posicao - quant * fechamento[local]) / (lote - quant)
        lote -= quant
    } else if (vendido) {
        posicao = (lote * posicao + quant * fechamento[local]) / (lote + quant)
        lote += quant
    }
    $("#quantidade").text(lote)
}

function zeraOperacao() {
    comprado = false;
    vendido = false;
    lote = 0
    carteira += parseFloat(lucroPrejuizo)
    imprimeCarteira(carteira)
    $("#lp").text(0)
    posicao = 0
    $("#quantidade").text(lote)
}

$("#veloc").focusout(function() {
    log($(this).val())
    velocidade = $(this).val()
    clearInterval(myTimer);
    myTimer = setInterval(loop, velocidade);
});

function imprimeCarteira(valor) {
    var novoFloat = parseFloat(valor).toFixed(2)
    $("#carteira").text(novoFloat)
}

function fetchStock() {
    const API_KEY = "LZPK3ABRMMBD23DL";
    let API_call = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=GOOG&outputsize=full&apikey=' + API_KEY;

    $.getJSON(API_call)
        .done(function(data) {
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
    /*if (canvas.getContext) {
        ctx.clearRect(0, 0, 1000, 600);
        for (let d = 0; d < date.length; d++) {
            var passoLinha = graficoWidth / date.length
            var passoY = graficoHeigth / maximo
            var larguraCandle = (passoLinha / 2)
            var afastamentoTopo = 40
            var max = graficoHeigth - (passoY * maxima[d] - afastamentoTopo)
            var min = graficoHeigth - (passoY * minima[d] - afastamentoTopo)
            var aber = graficoHeigth - (passoY * abertura[d] - afastamentoTopo)
            var fech = graficoHeigth - (passoY * fechamento[d] - afastamentoTopo)
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

    }*/
}

var quantidadedecandles = 60
var valorAtual = 0

function loop() {
    ctx.clearRect(0, 0, 1000, 600);
    if (comprado == true) {
        lucroPrejuizo = (fechamento[local] - posicao).toFixed(2) * lote
        imprimeCarteira(carteira + parseFloat(lucroPrejuizo))
        $("#lp").text(lucroPrejuizo)
    }
    if (vendido == true) {
        lucroPrejuizo = (posicao - fechamento[local]).toFixed(2) * lote
        imprimeCarteira(carteira + parseFloat(lucroPrejuizo))
        $("#lp").text(lucroPrejuizo)
    }




    if (canvas.getContext) {
        desenhagraficototal()

        //console.log((local - parseInt(local)))
        var localParsial = Math.round((local - parseInt(local)) * 100)

        var localInteiro = parseInt(local)

        $("#max").text(maxima[localInteiro])
        $("#min").text(minima[localInteiro])
        $("#opem").text(abertura[localInteiro])
        $("#close").text(fechamento[localInteiro])

        var passoLinha = graficoWidth / date.length
        var passoLinha2 = graficoWidth / quantidadedecandles
        var passoY = graficoHeigth / maximo
        var larguraCandle = (passoLinha2 / 2)
        ctx.font = "18px Arial";
        if (localInteiro > 0) {
            var topo = 0
            var fundo = 7000
            var localPosicao = 0
            for (let d = 0; d < quantidadedecandles; d++) {
                if (topo < maxima[localInteiro + d]) {
                    topo = maxima[localInteiro + d]
                }
                if (fundo > minima[localInteiro + d]) {
                    fundo = minima[localInteiro + d]
                }
            }
            var passoY2 = graficoHeigth / (topo - fundo)
            localPosicao = graficoHeigth - ((posicao - fundo) * passoY2)
            for (let d = 0; d < quantidadedecandles; d++) {
                var max = graficoHeigth - ((maxima[localInteiro + d] - fundo) * passoY2)
                var min = graficoHeigth - ((minima[localInteiro + d] - fundo) * passoY2)
                var aber = graficoHeigth - ((abertura[localInteiro + d] - fundo) * passoY2)
                var fech = graficoHeigth - ((fechamento[localInteiro + d] - fundo) * passoY2)
                    //animação de movimento
                var drawMin = min
                var drawMax = max
                if (d == 0) {
                    if ((aber - fech) > 0) { //subindo
                        var sombraSuperior = max - fech
                        var corpo = fech - aber
                        var sombraInferior = aber - min
                        var tamanhoTotal = max - min
                        var porcentoSombraSuperior = parseInt(sombraSuperior / tamanhoTotal * 100)
                        var porcentoCortpo = parseInt(corpo / tamanhoTotal * 100)
                        var porcentoSombraInferior = parseInt(sombraInferior / tamanhoTotal * 100)
                            //vai até sombra superior e volta
                            //console.log(porcentoSombraSuperior + "-" + porcentoCortpo + "-" + porcentoSombraInferior)
                        var metadePorcento = parseInt(porcentoSombraSuperior / 2)
                        var metadePorCentoInferior = parseInt(porcentoSombraInferior / 2)
                        if (metadePorCentoInferior > 100 - localParsial) {
                            //sobe a sombra
                            var acrecimoPasso = sombraInferior / metadePorCentoInferior * (100 - localParsial)
                            fech = aber - acrecimoPasso
                            fech = aleatorio(fech, tamanhoTotal)
                            drawMax = fech
                            drawMin = aber
                        } else if (porcentoSombraInferior > 100 - localParsial) {
                            //desce a sombra
                            var acrecimoPasso = sombraInferior / metadePorCentoInferior * (100 - localParsial - metadePorCentoInferior)
                            fech = min + acrecimoPasso
                            fech = aleatorio(fech, tamanhoTotal)
                            drawMax = fech
                        } else if (metadePorcento < localParsial) {
                            var acrecimoPasso = (corpo + sombraSuperior) / (porcentoCortpo + metadePorcento) * (100 - localParsial - porcentoSombraInferior)
                            fech = aber + acrecimoPasso
                            fech = aleatorio(fech, tamanhoTotal)
                            drawMax = fech
                        } else if ((100 - metadePorcento) > localParsial) {
                            var acrecimoPasso = (sombraSuperior) / (metadePorcento) * (metadePorcento - localParsial)
                            fech = max - acrecimoPasso
                            fech = aleatorio(fech, tamanhoTotal)
                        }
                    } else { //caindo
                        var sombraSuperior = max - aber
                        var corpo = aber - fech
                        var sombraInferior = fech - min
                        var tamanhoTotal = max - min
                        var porcentoSombraSuperior = parseInt(sombraSuperior / tamanhoTotal * 100)
                        var porcentoCortpo = parseInt(corpo / tamanhoTotal * 100)
                        var porcentoSombraInferior = parseInt(sombraInferior / tamanhoTotal * 100)
                            //vai até sombra superior e volta
                        var metadePorcento = parseInt(porcentoSombraSuperior / 2)
                        var metadePorCentoInferior = parseInt(porcentoSombraInferior / 2)
                        if (metadePorcento > 100 - localParsial) {
                            //sobe a sombra
                            var acrecimoPasso = sombraSuperior / metadePorcento * (100 - localParsial)
                            fech = aber + acrecimoPasso
                            fech = aleatorio(fech, tamanhoTotal)
                            drawMax = fech
                            drawMin = aber
                        } else if (porcentoSombraSuperior > 100 - localParsial) {
                            //desce a sombra
                            var acrecimoPasso = sombraSuperior / metadePorcento * (100 - localParsial - metadePorcento)
                            fech = max - acrecimoPasso
                            fech = aleatorio(fech, tamanhoTotal)
                            drawMin = aber
                        } else if (100 - metadePorCentoInferior > localParsial && localParsial > metadePorCentoInferior) {
                            var acrecimoPasso = (corpo + sombraInferior) / (porcentoCortpo + metadePorCentoInferior) * (100 - localParsial - porcentoSombraSuperior)
                            fech = aber - acrecimoPasso
                            fech = aleatorio(fech, tamanhoTotal)
                            drawMin = fech
                        } else if ((100 - metadePorCentoInferior) > localParsial) {
                            var acrecimoPasso = (sombraInferior) / (metadePorCentoInferior) * (metadePorCentoInferior - localParsial)
                            fech = min + acrecimoPasso
                            fech = aleatorio(fech, tamanhoTotal)
                        }
                    }
                }

                var x = (graficoWidth - d * passoLinha2) - passoLinha2
                ctx.fillStyle = "#a6a6a6";
                ctx.fillRect(x, drawMax, 1, (drawMin - drawMax));
                if (aber > fech) {
                    ctx.fillStyle = "#62c3d9";
                    ctx.fillRect(x - larguraCandle, aber, larguraCandle * 2, (fech - aber));
                } else {
                    ctx.fillStyle = "#db3b3b";
                    ctx.fillRect(x - larguraCandle, fech, larguraCandle * 2, (aber - fech));
                }
                if (d == 0) {
                    //ctx.fillRect(0, fech, graficoWidth, 2);

                    valorAtual = ((parseFloat(graficoHeigth) - parseFloat(fech)) / parseFloat(passoY2)) + parseFloat(fundo)
                    ctx.fillText((valorAtual).toFixed(2), graficoWidth, fech + 10);
                }
            }
            if (posicao > 0 && localPosicao < graficoHeigth) {
                ctx.fillRect(0, localPosicao, graficoWidth, 2);
                ctx.fillText(posicao, graficoWidth, localPosicao + 10);
            }
            if (posicao > 0 && localPosicao > graficoHeigth) {
                ctx.fillRect(0, graficoHeigth - 4, graficoWidth, 2);
                ctx.fillText(posicao, graficoWidth, graficoHeigth - 10);
            }
            if (posicao > 0 && localPosicao < 0) {
                ctx.fillRect(0, 4, graficoWidth, 2);
                ctx.fillText(posicao, graficoWidth, 20);
            }
        }

    }
    local = parseFloat(local - 0.01).toFixed(2)

}