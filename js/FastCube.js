//Objeto del lienzo
var canvas;
canvas = document.getElementById('zonaDeJuego');
//Contexto del canvas 
var  ctx;

//Tamaños de canvas
var canvasWidth;
var canvasHeihgt;
//Array con las posiciones del cursor
var cursor = new Image();                       

var yPosCursor;
var xPosCursor;

var cuadradosBuenos = [];
var cuadradosMalos = [];

var tamanoCuadrados = 24;

var puntuacion;

var velocidadMovimiento;

var colorMalos = "rgb(239,64,54)";
var colorBuenos = "#6bad1f";



function ObtenerContexto() {
    canvas = document.getElementById('zonaDeJuego');
     //Objeto del lienzo
    ctx = canvas.getContext("2d");     
    return ctx;
}

function NuevoJuego() {
    ObtenerContexto();
    MoverCursor();
    DibujarCursor();        

    setCanvasHeight(window.innerHeight - 70);
    setCanvasWidth(window.innerWidth - 30);
    CapturarClick();
    puntuacion = 0;
    velocidadMovimiento = 1;
    document.getElementById("navTitulo").innerHTML = "Pause";
    document.getElementById("navTitulo").className = "";
    document.getElementById("navTitulo").style.cssFloat = "right";
    document.getElementById("navVolverAtras").innerHTML = "< Back";
    document.getElementById("navPuntos").innerHTML = puntuacion;
    document.getElementById("navPuntos").style.cssFloat = "right";
    document.getElementById("navPuntos").className = "itemSelect";
    document.getElementById("ulMenu").style.display = "block";
    LimpiarCanvas();
    EscribirTexto("touch to begin", "bold 25px Arial", "black", "center", 10, 30);

    
    canvasWidth = canvas.width;
    canvasHeihgt = canvas.height;
    yPosCursor = getCanvasHeight() / 2;
    xPosCursor = getCanvasWidth() / 2;
    DibujarCuadrados(colorBuenos, true, 1);
    DibujarCuadrados(colorMalos, false, 3);
    
}

function DibujarCuadrados(color, sonBuenos, numero) {
    for(var i = 0 ; i <= numero; i++) {
        var xDelCuadrado = Math.random() * (canvasWidth - 50);
        var yDelCuadrado = Math.random() * (canvasHeihgt - 50);
        //alert(xDelCuadrado + " " + yDelCuadrado);
        ctx.fillStyle = color;
//        ctx.shadowColor = '#5cb429';
//        ctx.shadowBlur = 10;
//        ctx.shadowOffsetX = 0;
//        ctx.shadowOffsetY = 0;
        ctx.fillRect(xDelCuadrado, yDelCuadrado, tamanoCuadrados, tamanoCuadrados);
        if (sonBuenos) {
            cuadradosBuenos[i] = new Array(xDelCuadrado, yDelCuadrado, false, tamanoCuadrados, false);
        } else {
           cuadradosMalos[i] = new Array(xDelCuadrado, yDelCuadrado, false, tamanoCuadrados, false);
        }
    }
    
}

function DibujarCursor() {
    setCanvasHeight(20);
    setCanvasWidth(20);
    //Cursor triangulo
//    ctx.beginPath(); 
//    ctx.lineWidth = 1;
//    ctx.moveTo(25 , 0);
//    ctx.lineTo(0 , 25);
//    ctx.lineTo(50, 25);
//    ctx.fill();

    //Cursor cuadrado
    ctx.fillStyle = "#d9d246";
   ctx.fillRect(0, 0, 18, 18);
   
    
//    //Cursor circulo
//    ctx.fillStyle = "green";
//    ctx.beginPath();
//    ctx.arc(10, 10, 10, 0, Math.PI*2, true);
//    ctx.closePath();
//    ctx.fill();
    
    document.getElementById("imagenCursor").src = canvas.toDataURL("image/png");
    LimpiarCanvas();

   CargarCursor(200, 200);

}

function CargarCursor() {        
    cursor.src = document.getElementById("imagenCursor").src;   
}

function CapturarClick() {
    canvas.addEventListener("click",   
 
    function(e){
        MoverCursor(e.clientX-canvas.offsetTop, e.clientY-canvas.offsetTop);
        
    });
}
var enMovimiento;
function MoverCursor(x, y) {       
    //El cursor al empezar el movimiento esta en un posicion determinada
    var xAlEmpezarMovimiento = xPosCursor;
    var yAlEmpezarMovimiento = yPosCursor;
    

    var xALaQueLlegar = x;
    var yALaQueLlegar = y;

    //Al ser movimiento, pasará entre varias cordenadas antes de llegar
    var xMientrasMovimiento = xAlEmpezarMovimiento;
    var yMientrasMovimiento = yAlEmpezarMovimiento;    
      
    

    var distanciaEntrePuntos = Math.sqrt((Math.pow((xALaQueLlegar - xAlEmpezarMovimiento), 2) + Math.pow((yALaQueLlegar - yAlEmpezarMovimiento), 2)));


   if(enMovimiento !== undefined) {        
        clearInterval(enMovimiento);
   }
    if(x !== undefined || y !== undefined) {
    enMovimiento =  setInterval(function() {
        
        
        var xVectorDirector = xALaQueLlegar - xAlEmpezarMovimiento;
        var yVectorDirector = yALaQueLlegar - yAlEmpezarMovimiento;

        var x = xMientrasMovimiento + (velocidadMovimiento / distanciaEntrePuntos) * xVectorDirector;
        var y = yMientrasMovimiento + (velocidadMovimiento / distanciaEntrePuntos) * yVectorDirector;
        
        xMientrasMovimiento = x;
        yMientrasMovimiento = y;

        
        //Cada vez que se ejecuta este intervalo se redibujan los cudrados 
        //y se mueve el cursor peeero si se han cambiado las coordenadas 
        //(nuevo punto) se crea una animacion para hacer mas amigable la 
        //aparicion de nuvos cuadrados
    
        
        ctx.fillStyle = "#d9d246";
        LimpiarCanvas();
        
        
             
        xPosCursor = x;
        yPosCursor = y;
        
        //ctx.drawImage(cursor, x, y);
        
        ctx.fillRect(x, y, 18, 18); 

        ComprobarChoqueCuadrados(true);
        ComprobarChoqueCuadrados(false);
        
        RedibujarCuadrados(true);
        RedibujarCuadrados(false);
        
        //Si se sale del marco de juego...
        if (xPosCursor >= getCanvasWidth() - 18 || yPosCursor >= getCanvasHeight() - 18 || yPosCursor <= 0 || xPosCursor <= 0) {
            FinJuego();
        }
        
        
         



    }
    
    
    , 1000/48);
    

    
   }
}

function ComprobarChoqueCuadrados(sonBuenos) {
    var ArrayAComprobar = (sonBuenos) ? cuadradosBuenos : cuadradosMalos;
   
    for (var i = 0; i < ArrayAComprobar.length; i++) {
        var xDelCuadrado = ArrayAComprobar[i][0];
        var yDelCuadrado = ArrayAComprobar[i][1];
        
        //Comprobamos que no haya entrado en las inmediaciones del cuadrado
        if( xPosCursor >= xDelCuadrado && xPosCursor <= xDelCuadrado + 22
            && 
            yPosCursor >= yDelCuadrado && yPosCursor <= yDelCuadrado + 22
            ||
            xPosCursor + 20 >= xDelCuadrado && xPosCursor <= xDelCuadrado + 22
            && 
            yPosCursor + 20 >= yDelCuadrado && yPosCursor <= yDelCuadrado + 22
        ) 
        {
            if(sonBuenos) {
   
                document.getElementById("navPuntos").innerHTML = puntuacion; 
                
               
                
                cuadradosBuenos[i][2] = true;
                

                
            } else {
                FinJuego();
            }
        }
    }
}

function RedibujarCuadrados(sonBuenos) {    
   
   var yDelCuadrado;
   var xDelCuadrado;
   var ArrayAComprobar = (sonBuenos) ? cuadradosBuenos : cuadradosMalos;
   var colorCuadrados = (ArrayAComprobar === cuadradosBuenos) ? colorBuenos : colorMalos;
   var tamanoDelCuadrado;
   
   
    for (var i = 0; i < ArrayAComprobar.length; i++) {
        xDelCuadrado = ArrayAComprobar[i][0];
        yDelCuadrado = ArrayAComprobar[i][1];
        
        if(ArrayAComprobar === cuadradosBuenos) {
            tamanoDelCuadrado = ArrayAComprobar[i][3];

            if (ArrayAComprobar[i][2]) {

                if(ArrayAComprobar[i][4]) {
                    if(tamanoDelCuadrado <= 0) {
                        ArrayAComprobar[i][0] = Math.random() * (canvasWidth - 50);
                        ArrayAComprobar[i][1] = Math.random() * (canvasHeihgt - 50);
                    }
                    tamanoDelCuadrado++;

                    if(tamanoDelCuadrado >= tamanoCuadrados) {
                        ArrayAComprobar[i][2] = false;
                        ArrayAComprobar[i][4] = false;
                        
                    }
                } else {
                    tamanoDelCuadrado--;
                    if(tamanoDelCuadrado <= 0) {
                        puntuacion++;
                        velocidadMovimiento += 0.05;
                        ArrayAComprobar[i][4] = true;
                    }
                }

                ctx.fillStyle = colorCuadrados;            
                ctx.fillRect(xDelCuadrado, yDelCuadrado, tamanoDelCuadrado, tamanoDelCuadrado); 

                ArrayAComprobar[i][3] = tamanoDelCuadrado;
            } else {

               ctx.fillStyle = colorCuadrados;
               ctx.fillRect(xDelCuadrado, yDelCuadrado, tamanoCuadrados, tamanoCuadrados); 

            }
        
        
        } else {
            ctx.fillStyle = colorCuadrados;
            ctx.fillRect(xDelCuadrado, yDelCuadrado, tamanoCuadrados, tamanoCuadrados);
        }
                       
    }
}

function AnimacionCuadrados(x, y, indiceArrayCuadrado) {
    var xDelCuadrado = cuadradosBuenos[indiceArrayCuadrado][0];
    var yDelCuadrado = cuadradosBuenos[indiceArrayCuadrado][1];
    
                         
    //Efecto de desaparicion
    var widthEnAnimacion = tamanoCuadrados;
    var heightEnAnimacion = tamanoCuadrados;
    var animacion = setInterval(function() {
        widthEnAnimacion--;
        heightEnAnimacion--; 
        ctx.fillStyle = colorBuenos;
        ctx.fillRect(xDelCuadrado, yDelCuadrado, widthEnAnimacion, heightEnAnimacion); 
        if(heightEnAnimacion <= 0 || widthEnAnimacion <= 0 ) {
            clearInterval(animacion);
        }
    }, 30);
                                                
}

function FinJuego() {
    var nuevoJuego = confirm("GAMEOVER \n Points: " + puntuacion + "\n New game?", "Selecciona");
   clearInterval(enMovimiento);
    if (nuevoJuego) {
        NuevoJuego();
    } else {
        AnimacionVolverAtras();
       
    }
}

function EscribirTexto(texto, fuente, color, alinear, yDondeColocar, xDondeColocar) {    
    ctx.font= fuente;
    ctx.fillStyle = color;
    ctx.fillText(texto, yDondeColocar, xDondeColocar);
    ctx.textAlign= alinear;
}

function SonarSonido() {
    var audio = document.getElementById('musica');
    audio.play();
    audio.src = 'sonidos/deFondo.mp3';
    audio.play();
}

function AcercaDe() {  
    LimpiarCanvas();
    EscribirTexto("by @gmarco_", "bold 25px Arial", "white", "center", canvasWidth/2,canvasHeihgt/2);
}

function LimpiarCanvas() {
   var ctx = document.getElementById("zonaDeJuego").getContext("2d");     

   ctx.clearRect(0,0, document.getElementById("zonaDeJuego").width, document.getElementById("zonaDeJuego").height); 
   ctx.restore();
}

function setCanvasWidth(tamano) {        
    canvas.width = tamano;
}

function setCanvasHeight(tamano) {
    canvas.height = tamano;
}

function getCanvasWidth() {
    return canvas.width;
}

function getCanvasHeight() {
    return canvas.height;
}

function AnimacionesInicio() {
    var canvas;
    canvas = document.getElementById('zonaDeJuego');
     //Objeto del lienzo
    ctx = canvas.getContext("2d");     
    
    ctx.font= "bold 25px MV Boli";
    ctx.fillStyle = "black";
    ctx.fillText("fast", 12, 55);
    ctx.textAlign= "left";
    
    ctx.beginPath(); 
    ctx.lineWidth = 10;
    ctx.moveTo(20 , 66);
    ctx.lineTo(20 , 132);
    ctx.lineTo(66 , 132);
    ctx.strokeStyle='black';
    ctx.moveTo(15 , 66);
    ctx.lineTo(66 , 66);
    ctx.stroke();
    
    ctx.beginPath(); 
    ctx.lineWidth = 10;
    ctx.moveTo(66 , 62);
    ctx.lineTo(66 , 132);
    ctx.lineTo(120, 132);
    ctx.lineTo(120, 62);
    ctx.strokeStyle='rgb(239,64,54)';
    ctx.stroke();
    
    ctx.beginPath(); 
    ctx.lineWidth = 10;
    ctx.moveTo(125, 66);
    ctx.lineTo(176 , 66);
    ctx.lineTo(176 , 132);
    ctx.lineTo(125 , 132);
    ctx.moveTo(176, 99);
    ctx.lineTo(150 , 99);    
    ctx.strokeStyle='#6bad1f';
    ctx.stroke();
    
    ctx.beginPath(); 
    ctx.lineWidth = 10;
    ctx.moveTo(176, 66);
    ctx.lineTo(226 , 66);
    ctx.moveTo(181, 66);
    ctx.lineTo(181 , 132);
    ctx.lineTo(226 , 132);
    ctx.moveTo(179, 99);
    ctx.lineTo(210 , 99);
    ctx.strokeStyle='#6bad1f';
    ctx.stroke();
}

function AnimacionBotones(atras, botonPulsado) {
    //Movemos los botones
    var btnNuevoJuego = document.getElementById("btnNuevoJuego").style;
    var btnLeaderboars = document.getElementById("btnLeaderboars").style;
    var btnAcerca = document.getElementById("btnAcerca").style;
    
    if(!atras) {           
        var margenBtnNuevoJuego = 0;
        var margenBtnLeaderBoards = 0;
        var margenBtnAcerca = 0;

        var animacionBtnNuevoJuego = setInterval(function() {
            margenBtnNuevoJuego+= 20;
            btnNuevoJuego.marginLeft = margenBtnNuevoJuego + "px";

            if(margenBtnNuevoJuego > window.innerWidth) {    
                margenBtnLeaderBoards += 20;
                btnLeaderboars.marginLeft = margenBtnLeaderBoards + "px";
            }

            if(margenBtnLeaderBoards > window.innerWidth) {
                margenBtnAcerca += 20;
                btnAcerca.marginLeft = margenBtnAcerca + "px";
            }

            if (margenBtnNuevoJuego >= window.innerWidth && margenBtnLeaderBoards >= window.innerWidth && margenBtnAcerca >= window.innerWidth) {
                document.getElementById("menuSelector").style.display = "none";
                clearInterval(animacionBtnNuevoJuego);
                
                
                
                if(botonPulsado === "fastcube") {
                    AnimacionAdaptarCanvas(false);
                } else if(botonPulsado === "tienda") {
                    DesvanecerContenido(true);
                }
                
                
                
                
            }
        }, 1000/60);
    } else {
        var margenBtnNuevoJuego = window.innerWidth - 100;
        var margenBtnLeaderBoards = window.innerWidth - 100;
        var margenBtnAcerca = window.innerWidth + 100;
        document.getElementById("menuSelector").style.display = "block";
 
        var animacionBtnNuevoJuego = setInterval(function() {
            
            if(margenBtnNuevoJuego <= 10) {
                margenBtnNuevoJuego = 10;
            } else {
                margenBtnNuevoJuego -= 20;
            }
            
            btnNuevoJuego.marginLeft = margenBtnNuevoJuego + "px";

            if(margenBtnNuevoJuego <= 10) {   
                
                if(margenBtnLeaderBoards <= 10) {
                    margenBtnLeaderBoards = 10;
                } else {
                    margenBtnLeaderBoards -= 20;
                }
                

                btnLeaderboars.marginLeft = margenBtnLeaderBoards + "px";
                
            }

            if(margenBtnLeaderBoards <= 10) {
                
                
                margenBtnAcerca -= 20;
                btnAcerca.marginLeft = margenBtnAcerca + "px";
            } 
                
            

            if (margenBtnNuevoJuego <= 10 && margenBtnLeaderBoards <= 10 && margenBtnAcerca <= 10) {
 
                
                btnNuevoJuego.marginLeft = 10+"px";
                btnLeaderboars.marginLeft = 10 + "px";
                btnAcerca.marginLeft =10 + "px";
                clearInterval(animacionBtnNuevoJuego);
                
            }
        }, 1000/60);
    }
}
function AnimacionPrepararNuevoJuego() {
    AnimacionBotones(false, "fastcube");
}
function AnimacionAdaptarCanvas(atras) {
    if(!atras) {
        var canvas = document.getElementById("zonaDeJuego");
        var canvasWidth = canvas.width;
        var canvasHeight= canvas.height;
	canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.marginLeft = "10px";
        canvas.style.top = "67px";
	LimpiarCanvas();
		
        var animacionCanvas = setInterval(function() {                        
            canvas.style.width = canvasWidth + "px";
            canvas.style.height = canvasHeight + "px";
            if(canvasWidth >= window.innerWidth - 30) {
                canvasWidth = window.innerWidth - 30;
               
                canvasHeight += 10;
                
                if(canvasHeight >= window.innerHeight - 80) {                
                    canvasHeight = window.innerHeight - 80;
                    
                }
                
                if(canvasHeight >= window.innerHeight - 80 && canvasWidth >= window.innerWidth - 30) {					
                    canvas.width = window.innerWidth - 30;
                    canvas.heihgt = window.innerHeight - 70;
                    NuevoJuego();                  
                    clearInterval(animacionCanvas);
				}
            } else {
                
              canvasWidth += 10;  
              
            }


        }, 1000/60);
    } else {
        var canvas = document.getElementById("zonaDeJuego");
        var canvasWidth = canvas.width;
        var canvasHeight= canvas.height;
		LimpiarCanvas();
        canvas.style.marginLeft = "auto";
        canvas.style.marginRight = "auto";
        canvas.style.top = "15%";


        var animacionCanvas = setInterval(function() {                        
            canvas.style.width = canvasWidth + "px";
            canvas.style.height = canvasHeight + "px";
            if(canvasWidth <= 245) {
                canvasWidth = 245;
                
                
            } else {
              canvasWidth -= 10;  
            }
            
            if(canvasHeight <= 190) {                
                canvasHeight = 190;

            } else {
               canvasHeight -= 10; 
            }
            
            if(canvasHeight <= 200 && canvasWidth <= 245) {
                canvas.width = 245;
                canvas.height = 190;
                LimpiarCanvas();
                AnimacionesInicio();
                AnimacionBotones(true);
                
                clearInterval(animacionCanvas);
            }
        }, 1000/60);
    }
    
}

function AnimacionVolverAtras() {
    
    LimpiarCanvas();
    clearInterval(enMovimiento);
    DesvanecerCanvas(true);
    DesvanecerContenido(false);
    document.getElementById("zonaDeJuego").style.display = "block";
    document.getElementById("menu").style.backgroundColor = "rgb(239,64,54)";
    document.getElementById("navTitulo").innerHTML = "Welcome to FastCube";
    document.getElementById("navTitulo").style.cssFloat = "left";
    document.getElementById("navPuntos").style.cssFloat = "left";
    document.getElementById("navPuntos").className = "";
    document.getElementById("navVolverAtras").innerHTML = "";
    document.getElementById("navPuntos").innerHTML = "";
    document.getElementById("navTitulo").className = "itemSelect";
    document.getElementById("ulMenu").style.display = "inline-block";
    AnimacionAdaptarCanvas(true);
 
}
function DesvanecerContenido(aparecer) {
    if(!aparecer) {
  
        document.getElementById("contenido").style.display = "none"; 
              
    } else {
        var opacidadCanvas = 0;
        document.getElementById("contenido").style.display = "block";
        var animacionDesvanecerCanvas = setInterval(function() {
            opacidadCanvas += 0.05;

            document.getElementById("contenido").style.opacity = opacidadCanvas;

            if (opacidadCanvas >= 1) {
                 
                clearInterval(animacionDesvanecerCanvas);
                
            }
        }, 1000/60);
    }
}
function DesvanecerCanvas(aparecer) {
    if(!aparecer) {
        var opacidadCanvas = 1;
        var animacionDesvanecerCanvas = setInterval(function() {
            opacidadCanvas -= 0.03;

            document.getElementById("zonaDeJuego").style.opacity = opacidadCanvas;

            if (opacidadCanvas <= 0) {
                document.getElementById("zonaDeJuego").style.display = "none"; 
                clearInterval(animacionDesvanecerCanvas);
            }
        }, 1000/60);
    } else {
        var opacidadCanvas = 0;
        var animacionDesvanecerCanvas = setInterval(function() {
            opacidadCanvas += 0.03;

            document.getElementById("zonaDeJuego").style.opacity = opacidadCanvas;

            if (opacidadCanvas >= 1) {
                document.getElementById("zonaDeJuego").style.display = "block"; 
                clearInterval(animacionDesvanecerCanvas);
            }
        }, 1000/60);
    }    
}

function CargarTiendaYEstadisticas() {
    DesvanecerCanvas(false);
    AnimacionBotones(false, "tienda");
    
    document.getElementById("navTitulo").innerHTML = "Store";
    document.getElementById("navTitulo").className = "";
    document.getElementById("navTitulo").style.cssFloat = "right";
    document.getElementById("navVolverAtras").innerHTML = "< Back";
    document.getElementById("navPuntos").innerHTML = "Leaderboards";
    document.getElementById("navPuntos").style.cssFloat = "right";
    document.getElementById("navTitulo").className = "itemSelect";
    document.getElementById("ulMenu").style.display = "block";
    document.getElementById("menu").style.backgroundColor = "#6bad1f";
    
     Tienda(false);
     
    document.getElementById("navTitulo").addEventListener("click", function() {
       Tienda(true); 
       document.getElementById("navTitulo").className = "itemSelect";
       document.getElementById("navPuntos").className = "";
    });
    document.getElementById("navPuntos").addEventListener("click", function() {
        Leaderboars()(); 
        document.getElementById("navTitulo").className = "";
        document.getElementById("navPuntos").className = "itemSelect";
    });
    
    
}

function Tienda(dentroDeEvento) {
    if (dentroDeEvento) {
    DesvanecerContenido(true);
    }
    document.getElementById("contenido").innerHTML = '<h1>Store</h1><p>soon...</p>';

}

function Leaderboars() {
    DesvanecerContenido(true);
    document.getElementById("contenido").innerHTML = '<h1>Leaderboars</h1><p><input type="text" style="width:100%;" value="search a friend"></p><hr><p>soon..</p>';
}

function CargarAjustesYAcerca() {
    DesvanecerCanvas(false);
    AnimacionBotones(false, "tienda");
    
    document.getElementById("navTitulo").innerHTML = "Settings";
    document.getElementById("navTitulo").className = "";
    document.getElementById("navTitulo").style.cssFloat = "right";
    document.getElementById("navVolverAtras").innerHTML = "< Back";
    document.getElementById("navPuntos").innerHTML = "About";
    document.getElementById("navPuntos").style.cssFloat = "right";
    document.getElementById("navTitulo").className = "itemSelect";
    document.getElementById("ulMenu").style.display = "block";
    document.getElementById("menu").style.backgroundColor = "#d9d246";
    
     Ajustes(false);
     
    document.getElementById("navTitulo").addEventListener("click", function() {
       Ajustes(true); 
       document.getElementById("navTitulo").className = "itemSelect";
       document.getElementById("navPuntos").className = "";
    });
    document.getElementById("navPuntos").addEventListener("click", function() {
        Acerca();
        document.getElementById("navTitulo").className = "";
        document.getElementById("navPuntos").className = "itemSelect";
    });
}

function Ajustes(dentroDeEvento) {
    if (dentroDeEvento) {
        DesvanecerContenido(true);
    }
    document.getElementById("contenido").innerHTML = '<h1>Settings</h1><p>soon..</p>John Edward Brownlee was Premier of Alberta, Canada, from 1925 to 1934 as leader of the United Farmers of Alberta (UFA) caucus. After winning the 1926 election, his successes included obtaining control oJohn Edward Brownlee was Premier of Alberta, Canada, from 1925 to 1934 as leader of the United Farmers of Alberta (UFA) caucus. After winning the 1926 election, his successes included obtaining control oJohn Edward Brownlee was Premier of Alberta, Canada, from 1925 to 1934 as leader of the United Farmers of Alberta (UFA) caucus. After winning the 1926 election, his successes included obtaining control oJohn Edward Brownlee was Premier of Alberta, Canada, from 1925 to 1934 as leader of the United Farmers of Alberta (UFA) caucus. After winning the 1926 election, his successes included obtaining control oJohn Edward Brownlee was Premier of Alberta, Canada, from 1925 to 1934 as leader of the United Farmers of Alberta (UFA) caucus. After winning the 1926 election, his successes included obtaining control oJohn Edward Brownlee was Premier of Alberta, Canada, from 1925 to 1934 as leader of the United Farmers of Alberta (UFA) caucus. After winning the 1926 election, his successes included obtaining control oJohn Edward Brownlee was Premier of Alberta, Canada, from 1925 to 1934 as leader of the United Farmers of Alberta (UFA) caucus. After winning the 1926 election, his successes included obtaining control oJohn Edward Brownlee was Premier of Alberta, Canada, from 1925 to 1934 as leader of the United Farmers of Alberta (UFA) caucus. After winning the 1926 election, his successes included obtaining control oJohn Edward Brownlee was Premier of Alberta, Canada, from 1925 to 1934 as leader of the United Farmers of Alberta (UFA) caucus. After winning the 1926 election, his successes included obtaining control oJohn Edward Brownlee was Premier of Alberta, Canada, from 1925 to 1934 as leader of the United Farmers of Alberta (UFA) caucus. After winning the 1926 election, his successes included obtaining control oJohn Edward Brownlee was Premier of Alberta, Canada, from 1925 to 1934 as leader of the United Farmers of Alberta (UFA) caucus. After winning the 1926 election, his successes included obtaining control oJohn Edward Brownlee was Premier of Alberta, Canada, from 1925 to 1934 as leader of the United Farmers of Alberta (UFA) caucus. After winning the 1926 election, his successes included obtaining control o';
}
function Acerca() {
    DesvanecerContenido(true);
    document.getElementById("contenido").innerHTML = '<h1>About</h1><p>by @gmarco_</p>';
}
