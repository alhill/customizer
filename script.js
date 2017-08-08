//TO DO LIST
/*
    - Ponerlo todo bonito y ordenado, je
    - Arreglar cambio de color del elemento no fijado cuando se cambia a otro elemento
    - Habilitar rotación de elementos
    - Habilitar cambio de tipografía sin tener que reescribir el elemento
    - Habilitar edición del texto de un elemento
    - En ocasiones la lista de elementos hace cosas extrañas, revisar
    - Arreglar la lista de imagenes para que no haga falta recortar la etiqueta <svg>
*/

function cambioParam(){
    document.documentElement.style.setProperty(`--${this.name}`, this.value + this.dataset.sufijo);
}

function procesarSvg( file ){
    var parser = new DOMParser();
    var serializer = new XMLSerializer();
    xml_from_file = parser.parseFromString( file, "text/xml" );
    
    try{
        var svgnode = xml_from_file.getElementsByTagName("svg")[0].children;
    
        var svgarray = Array.from(svgnode);

        var retorno = svgarray.reduce((salida, elem) => {
            return String( salida + serializer.serializeToString(elem) );
        }, "");

        return retorno;
    }
    catch(err){
        alert("This file doesn't seem a valid SVG file");
        $(".cont_svg.active").remove();
    }
}

var currentMatrix = [0,0,0,0,0,0];

function matrix_scale(evt){
        if(isMouseDown){
        console.log(evt.path[0].value);
        var matrix = $(".cont_svg.active").css("transform");
        currentMatrix= matrix.match(/[0-9., -]+/)[0].split(", ");
        var scale = evt.path[0].value;
        currentMatrix[0] = scale;
        currentMatrix[3] = scale;
        newMatrix = "matrix(" + currentMatrix[0] + ", "+ currentMatrix[1] + ", "
    + currentMatrix[2] + ", " + currentMatrix[3] + ", " + currentMatrix[4] + ", " + currentMatrix[5] + ")";
        $(".cont_svg.active").css("transform", newMatrix);
        console.log(newMatrix);
    }
}

function updateItemSelector(){
    var listaelementos = document.getElementsByClassName("cont_svg");
    $(".element_selector").html("<option>-</option>")
    for (i = 0; i < listaelementos.length; i++){
        var formattedselect = (listaelementos[i].id).replace(/[^0-9]/g,'');
        var filename = listaelementos[i].getAttribute("data-file");
        if (filename === null){ filename = "empty" }
        $(".element_selector").append("<option value=" + listaelementos[i].id + ">" + formattedselect + " ("+ filename +")</option>");
    }
}

function changeColor(evt){
    var activeelement = $(".cont_svg.active").css("fill", evt.path[0].value);
}

var isMouseDown = false;
document.onmousedown = function() { isMouseDown = true  };
document.onmouseup   = function() { isMouseDown = false };

var selectedElement = 0;
var currentX = 0;
var currentY = 0;

function moveElement(evt){
    if(isMouseDown){
        var matrix = $(".cont_svg.active").css("transform");
        currentMatrix= matrix.match(/[0-9., -]+/)[0].split(", ");
        dx = evt.clientX - $("#Layer_1").position().left + ($(".cont_svg").width() / 2);
        dy = evt.clientY - $("#Layer_1").position().top + ($(".cont_svg").height() / 2);
        currentMatrix[4] = dx / 0.5 ;
        currentMatrix[5] = dy / 0.5 ;
        
        newMatrix = "matrix(" + currentMatrix[0] + ", "+ currentMatrix[1] + ", "
+ currentMatrix[2] + ", " + currentMatrix[3] + ", " + currentMatrix[4] + ", " + currentMatrix[5] + ")";
        $(".cont_svg.active").css("transform", newMatrix);
        
        /*console.log( $(".cont_svg").css("transform") );*/
    }
}

document.addEventListener("DOMContentLoaded", function(event){
    var grupico = document.querySelectorAll("input");
    grupico.forEach(elem => elem.addEventListener("change", cambioParam));
    grupico.forEach(elem => elem.addEventListener("mousemove", cambioParam));  
});


$(function(){
    
    $("#botonsito").click(function(){
       alert( $("#stock_selector").val() );
    });

    $("#areadetrabajo").load("singlet.svg");
    
    $("#stock_selector").click(function(){
        switch( $("#stock_selector").val() ) {
        case "bolt":
            $(".cont_svg.active").load("flash.svg");
            $(".cont_svg.active").attr("data-file", "Lightning Bolt")
            updateItemSelector();
            break;
        case "star":
            $(".cont_svg.active").load("star.svg");
            $(".cont_svg.active").attr("data-file", "Star")
            updateItemSelector();
            break;        
        case "fist":
            $(".cont_svg.active").load("power.svg");
            $(".cont_svg.active").attr("data-file", "Fist")
            updateItemSelector();
            break;        
        case "penis":
            $(".cont_svg.active").load("penis.svg");
            $(".cont_svg.active").attr("data-file", "Penis")
            updateItemSelector();
            break;
        default:
            /* nothing */
            $(".cont_svg.active").html("");
            break;
        }
    });
    
    $("#nigga").click(function(){
       $("#Layer_1").toggleClass("nigga");
    });
    
    $("#exportsvg").click(function(){
        
        $(".magiczone2").html( $("#Layer_1").parent().html() );
        $(".magiczone2 .cls-1").css("fill", $("#areadetrabajo .cls-1").css("fill") );
        $(".magiczone2 .cls-2").css("fill", $("#areadetrabajo .cls-2").css("fill") );
        $(".magiczone2 .cls-3").css("fill", $("#areadetrabajo .cls-3").css("fill") );
        $(".magiczone2 .cont_svg.active").css("fill", $("#areadetrabajo .cont_svg.active").css("fill") );
        $(".magiczone2 .cont_svg.active").css("transform", $("#areadetrabajo .cont_svg.active").css("transform") );
        $(".magiczone2 .cont_svg.active").css("transform", $("#areadetrabajo .cont_svg.active").css("transform") );
        
        var svg = $(".magiczone2").html();
        var fileName = "custom_singlet.svg";
        var url = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
        var link = document.createElement("a");
        link.download = fileName;
        link.href = url;
        link.click();
    });
    
    var custom_svg = "";
    document.getElementById('custom_svg').addEventListener("change", function(e){
        var reader = new FileReader();
        reader.readAsText($("#custom_svg")[0].files[0]); 
        reader.onload = function(e){
            custom_svg = reader.result;
            $(".cont_svg.active").html("");
            var svg_procesado = procesarSvg( custom_svg );
            $(".cont_svg.active").html(svg_procesado);
            var ruta = $("#custom_svg")[0].value;

            console.log(ruta.length);
            console.log(ruta.lastIndexOf("\\"));
            $(".cont_svg.active").attr("data-file", ruta.substring( ruta.lastIndexOf("\\")+1 , ruta.length ));
            updateItemSelector();
        }
    });
    
    var elem_number = 0;
    $("#add_new").click(function(){
        elem_number++;
        $(".cont_svg.active").css("fill", $("#areadetrabajo .cont_svg.active").css("fill") );
        $(".cont_svg.active").css("transform", $("#areadetrabajo .cont_svg.active").css("transform") );
        $(".cont_svg.active").css("transform", $("#areadetrabajo .cont_svg.active").css("transform") );
        $(".cont_svg.active").toggleClass("active");
        $("#Layer_1").append("<g class='cont_svg active' id='element_" + elem_number + "' onmousedown='clickElement()' onmousemove='moveElement()'></g>");
        var areadetrabajointer = $("#areadetrabajo").html();
        $("#areadetrabajo").html("");
        $("#areadetrabajo").html( areadetrabajointer );
        updateItemSelector();
    });
    
    $("#delete_elem").click(function(){
        if(confirm("Do you want to remove " + $(".cont_svg.active").attr("id") + " (" + $(".cont_svg.active").attr("data-file") + ") ?" )){
            $(".cont_svg.active").remove();
        }
        updateItemSelector();
    });
    
    $(".element_selector").change(function(){
        $(".cont_svg.active").toggleClass("active");
        document.getElementById( this.value ).classList.add("active");
        updateItemSelector();
    });
    $(".element_selector").click(function(){
        updateItemSelector();
    });
    
    $("#text_send").click(function(){
        elem_number++;
        $(".cont_svg.active").css("fill", $("#areadetrabajo .cont_svg.active").css("fill") );
        $(".cont_svg.active").css("transform", $("#areadetrabajo .cont_svg.active").css("transform") );
        $(".cont_svg.active").css("transform", $("#areadetrabajo .cont_svg.active").css("transform") );
        $(".cont_svg.active").toggleClass("active"); 
        
        var text_content = document.getElementById("text_content").value;
        var text_font = document.getElementById("text_font").value;
        
        $("#Layer_1").append(`<text class="cont_svg active" id='element_${elem_number}' data-file="Text" onmousedown='clickElement()' onmousemove='moveElement()' style='font-family: ${text_font}; font-size: 120;'>${text_content}</text>`);
        var areadetrabajointer = $("#areadetrabajo").html();
        $("#areadetrabajo").html("");
        $("#areadetrabajo").html( areadetrabajointer );
        updateItemSelector();
    });
    
    $("#exportpng").click(function(){
        
        $(".magiczone2").html( $("#Layer_1").parent().html() );
        $(".magiczone2 .cls-1").css("fill", $("#areadetrabajo .cls-1").css("fill") );
        $(".magiczone2 .cls-2").css("fill", $("#areadetrabajo .cls-2").css("fill") );
        $(".magiczone2 .cls-3").css("fill", $("#areadetrabajo .cls-3").css("fill") );
        $(".magiczone2 .cont_svg.active").css("fill", $("#areadetrabajo .cont_svg.active").css("fill") );
        $(".magiczone2 .cont_svg.active").css("transform", $("#areadetrabajo .cont_svg.active").css("transform") );
        $(".magiczone2 .cont_svg.active").css("transform", $("#areadetrabajo .cont_svg.active").css("transform") );
        
        var svg = $(".magiczone2").html(); 
        canvg('magiczone1', svg );
        var image = document.getElementById("magiczone1").toDataURL("image/png");
        image = image.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
        var res = encodeURIComponent(svg);
        var link = document.createElement("a");
        link.download = "custom_singlet.png";
        link.href = image;
        link.click();
    });
});

