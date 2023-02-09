var date = document.getElementById("date");
var currentDate = new Date();
date.textContent= currentDate;


var clickButton = document.getElementById("click-button");

clickButton.addEventListener("click", getInfo);

function getInfo(){
    
    var newName= document.getElementById("cityInput");
    var cityName= document.getElementById("cityName");
    cityName.innerHTML = newName.value ;


fetch('https://api.openweathermap.org/data/2.5/forecast?q='+newName.value+ '&appid=38cb11c67f69091dfd62cacf2bab3a5e')
.then(response => response.json())
.then(data =>{
    console.log(data);
    for (let i = 0; i < 5; i++) {
        document.getElementById("day" + (i+1) + "Min").innerHTML = "Min:" +Number(data.list[i].main.temp_min -288.53).toFixed(1)+" °";

    }
    for (let i = 0; i < 5; i++) {
        document.getElementById("day" + (i+1) + "Max").innerHTML = "Max:" +Number(data.list[i].main.temp_max -288.53).toFixed(1)+" °";
        
    }
    for (let i = 0; i < 5; i++) {
        document.getElementById("img" +(i+1)).src="http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon+".png";      
    }


})

.catch(err => alert("error"))
}


function defaultScreen(){
    document.getElementById("cityInput").defaultValue = "Denver";
    getInfo();
}


var d= new Date();
var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function checkDay(day){
    if(day +d.getDay() > 6){
        return day +d.getDay()-7;
    }
    else{
        return day +d.getDay();
    }
}

for (let i = 0; i < 5; i++) {
    
    document.getElementById("day" +(i+1)).innerHTML= weekday[checkDay(i)];
}