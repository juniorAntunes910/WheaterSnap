const climaForm = document.getElementById("clima-form");
const input = document.getElementById("input-form");
const nomeCidade = document.getElementById("nome-cidade");
const diaCidade = document.getElementById("dia-cidade");
const temperaturaCidade = document.getElementById("temperatura-cidade");
const climaCidade = document.getElementById("clima-cidade");
const ventoCidade = document.getElementById("vento-cidade");
const humidadeCidade = document.getElementById("humidade-cidade");
const fraseCidade = document.getElementById("frase-cidade");
const diaProximo = document.getElementById("proximo-dia-cidade");
const temProximo = document.getElementById("proximo-temperatura-cidade");
const titulo = document.getElementById("titulo");
const main = document.getElementById("main");
const doisDiasCidade = document.getElementById("dois-dias-cidade");
const tresDiasCidade = document.getElementById("tres-dias-cidade");
const doisTemp = document.getElementById("dois-temp-cidade");
const tresTemp = document.getElementById("tres-temp-cidade");
const simboloPrincipal = document.getElementById("simbolo-principal");
const segundoSimbolo = document.getElementById("segundo-simbolo");
const terceiroSimbolo = document.getElementById("terceiro-simbolo");
const quartoSimbolo = document.getElementById("quarto-simbolo")

const API_KEY = "95703de0a6fd405ba0a154228263004";

function calcularIcone(code, isDay) {
    if (code === 1000) return isDay ? "wi-day-sunny" : "wi-night-clear";
    if (code <= 1009) return isDay ? "wi-day-cloudy" : "wi-night-alt-cloudy";
    if (code <= 1063 || code >= 1180) return isDay ? "wi-day-rain" : "wi-night-rain";
    return "wi-cloudy";
}

climaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cidade = input.value;

    if (!cidade) return alert("Digite o nome correto da cidade!");
    nomeCidade.textContent = "Carregando...";

    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cidade}&days=4&aqi=no&alerts=no&lang=pt`
        );
        const data = await response.json();

        if (data.error) {
            nomeCidade.textContent = "Cidade não encontrada.";
            return;
        }

        // Troca de fundo (Modo dia/noite)
        const isDay = data.current.is_day;
        if (isDay === 1) {
            titulo.textContent = "WeatherSnap☀️";
            main.style.background = "linear-gradient(to bottom right, #8EBCF7, #70A8F4)";
        } else {
            titulo.textContent = "WeatherSnap🌑";
            main.style.background = "linear-gradient(to bottom right, #1e293b, #0f172a)";
        }

        nomeCidade.textContent = `${data.location.name}, ${data.location.region}`;
        diaCidade.textContent = data.location.localtime;
        temperaturaCidade.textContent = Math.round(data.current.temp_c) + "°C";
        climaCidade.textContent = data.current.condition.text;
        ventoCidade.textContent = data.current.wind_kph + " km/h";
        humidadeCidade.textContent = data.current.humidity + "%";

        simboloPrincipal.className = `wi ${calcularIcone(data.current.condition.code, isDay)}`;


        const tempAtual = data.current.temp_c;
        if (tempAtual <= 16) {
            fraseCidade.textContent = "Está frio, leve um casaco!";
        } else if (tempAtual <= 25) {
            fraseCidade.textContent = "O clima está agradável para uma caminhada";
        } else {
            fraseCidade.textContent = "Está calor, se hidrate!";
        }

        if (data.forecast && data.forecast.forecastday) {
            const dias = data.forecast.forecastday;

            // Amanhã
            diaProximo.textContent = "Amanhã";
            temProximo.textContent = Math.round(dias[1].day.avgtemp_c) + "°C"; 
            segundoSimbolo.className = `wi ${calcularIcone(data.forecast.forecastday[1].day.condition.code, true)}`

            // Dia 2
            doisDiasCidade.textContent = dias[2].date.split('-').reverse().slice(0,2).join('/'); // Fiz isso para deixar a data com uma formatação mais bonita
            terceiroSimbolo.className = `wi ${calcularIcone(data.forecast.forecastday[2].day.condition.code, true)}`
            doisTemp.textContent = Math.round(dias[2].day.avgtemp_c) + "°C";

            // Dia 3
            tresDiasCidade.textContent = dias[3].date.split('-').reverse().slice(0,2).join('/');// Fiz isso para deixar a data com uma formatação mais bonita
            quartoSimbolo.className = `wi ${calcularIcone(data.forecast.forecastday[3].day.condition.code, true)}`
            tresTemp.textContent = Math.round(dias[3].day.avgtemp_c) + "°C";
        }

        input.value = "";
    } catch (error) {
        console.log("Error: ", error);
        nomeCidade.textContent = "Erro ao conectar com o serviço.";
    }
});