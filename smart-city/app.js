/* Dortmund Air Intelligence — live Open-Meteo CAMS modeled data.
   All chart values are obtained from the API; there are no fabricated data points. */
"use strict";
const LAT=51.5136,LON=7.4653,ZONE="Europe/Berlin";
const AIR="https://air-quality-api.open-meteo.com/v1/air-quality";
const WEATHER="https://api.open-meteo.com/v1/forecast";
const BACKUP="https://raw.githubusercontent.com/vikas56655/dortmund-smart-city-predictor/main/data/latest.json";
const C={pm2_5:"#59d6b5",pm10:"#72a9fa",nitrogen_dioxide:"#f7bd70",ozone:"#bf9cfe"};
const labels={pm2_5:"PM2.5",pm10:"PM10",nitrogen_dioxide:"NO₂",ozone:"O₃"};
const pollutants=Object.keys(C);let air=null,weather=null,plots={},map=null;
const $=id=>document.getElementById(id);
const n=v=>(v===null||v===undefined||v==="")?null:(Number.isFinite(Number(v))?Number(v):null);
const local=(iso,opts={})=>new Intl.DateTimeFormat("en-GB",{timeZone:ZONE,...opts}).format(new Date(iso.endsWith("Z")?iso:iso+"Z"));
const timeKey=iso=>iso.slice(0,16); // API timezone GMT returns UTC without Z
function currentCutoff(){return Date.now()}
function cssColors(){return {grid:"rgba(134,169,189,.12)",ticks:"#839aad"}}
function series(data,key){return data.hourly.time.map((t,i)=>({time:t+"Z",value:n(data.hourly[key]?.[i])})).filter(r=>r.value!==null)}
function clearChart(name){if(plots[name])plots[name].destroy()}
function makeChart(name,id,configuration){if(!window.Chart)throw Error("Chart.js failed to load");clearChart(name);plots[name]=new Chart($(id),configuration)}
function opts(type="line",more={}){const colors=cssColors();return {responsive:true,maintainAspectRatio:false,animation:{duration:450},plugins:{legend:{display:false},tooltip:{backgroundColor:"#092034",titleColor:"#e9faf7",bodyColor:"#b9d9e1"}},scales:type==="doughnut"?{}:{x:{ticks:{color:colors.ticks,maxTicksLimit:7,font:{size:10}},grid:{display:false},border:{display:false}},y:{beginAtZero:false,ticks:{color:colors.ticks,font:{size:10}},grid:{color:colors.grid},border:{display:false}}},...more}}
function filterPast(points){return points.filter(p=>Date.parse(p.time)<=currentCutoff())}
function filterFuture(points){return points.filter(p=>Date.parse(p.time)>currentCutoff())}
function nice(iso){return local(iso,{day:"2-digit",month:"short",hour:"2-digit"})}
function updateMetrics(){
 const keys=[["m-pm25","pm2_5"],["m-pm10","pm10"],["m-no2","nitrogen_dioxide"],["m-aqi","european_aqi"]];
 let current=air.current||{};
 keys.forEach(([id,key])=>{$(id).textContent=n(current[key])===null?"—":Number(current[key]).toFixed(key==="european_aqi"?0:1)});
 const a=n(current.european_aqi);$("aqi-caption").textContent=a===null?"Unavailable":a<=20?"Good":a<=40?"Fair":a<=60?"Moderate":a<=80?"Poor":a<=100?"Very poor":"Extremely poor";
 $("updated").textContent="SOURCE TIME: "+(current.time?nice(current.time+"Z")+" (Dortmund)":"Not provided");
}
function historyChart(){
 const key=$("pollutant").value;
 const points=filterPast(series(air,key)).slice(-168);
 makeChart("history","history-chart",{type:"line",data:{labels:points.map(x=>nice(x.time)),datasets:[{data:points.map(x=>x.value),borderColor:C[key],backgroundColor:C[key]+"23",fill:true,tension:.3,pointRadius:0,borderWidth:2}]},options:opts()});
}
function mixChart(){
 let current=air.current||{};
 let values=pollutants.map(k=>n(current[k])||0);
 makeChart("mix","mix-chart",{type:"doughnut",data:{labels:pollutants.map(k=>labels[k]),datasets:[{data:values,backgroundColor:pollutants.map(k=>C[k]),borderColor:"#111f30",borderWidth:3,hoverOffset:5}]},options:{...opts("doughnut"),cutout:"69%",plugins:{legend:{display:true,position:"bottom",labels:{color:"#acbdc9",usePointStyle:true,boxWidth:9,font:{size:10}}}}}});
}
function dailyChart(){
 const key=$("pollutant").value,points=filterPast(series(air,key)).slice(-168);
 let daily={};
 points.forEach(p=>{let d=local(p.time,{day:"2-digit",month:"short",year:"numeric"});(daily[d]??=[]).push(p.value)});
 const keys=Object.keys(daily),values=keys.map(k=>daily[k].reduce((a,b)=>a+b,0)/daily[k].length);
 makeChart("daily","daily-chart",{type:"bar",data:{labels:keys,datasets:[{data:values,backgroundColor:"#69a8f9",borderRadius:5,maxBarThickness:33}]},options:opts()});
}
function heatmapChart(){
 const points=filterPast(series(air,"pm2_5")).slice(-168);
 const days=[...new Set(points.map(p=>local(p.time,{day:"2-digit",month:"short",year:"numeric"})))].slice(-7);
 const dayHour={};for(const p of points){let d=local(p.time,{day:"2-digit",month:"short",year:"numeric"}),h=Number(local(p.time,{hour:"2-digit",hourCycle:"h23"}));(dayHour[d+"|"+h]??=[]).push(p.value)}
 const vals=Object.values(dayHour).flat(),min=Math.min(...vals),max=Math.max(...vals);
 let html='<div class="heat-grid"><span></span>';
 for(let h=0;h<24;h++)html+='<div class="heat-hour">'+(h%4===0?h.toString().padStart(2,"0"):"")+'</div>';
 for(let d of days){html+='<div class="heat-day">'+d.slice(0,6)+'</div>';for(let h=0;h<24;h++){let a=dayHour[d+"|"+h],v=a?.reduce((x,y)=>x+y,0)/a?.length;
 let f=Number.isFinite(v)?Math.max(0,Math.min(1,(v-min)/(max-min||1))):0;
 let color=Number.isFinite(v)?'hsl('+(205-51*f)+' '+(38+24*f)+'% '+(22+36*f)+'%)':'#1b3040';
 html+='<div class="heat-cell" style="background:'+color+'" title="'+d+' '+h+':00 — '+(Number.isFinite(v)?v.toFixed(1)+" µg/m³":"No data")+'"></div>'} }
 $("heatmap").innerHTML=html+'</div>';
}
function weatherChart(){
 if(!weather?.hourly){$("weather-chart").parentElement.innerHTML='<div class="loading">Weather API unavailable; other analyses remain available.</div>';return}
 const airPoints=filterPast(series(air,"pm2_5")).slice(-168);
 const w=new Map(weather.hourly.time.map((t,i)=>[t,n(weather.hourly.temperature_2m[i])]));
 const scatter=airPoints.map(p=>({x:w.get(timeKey(p.time)),y:p.value})).filter(p=>p.x!==null&&p.x!==undefined);
 makeChart("weather","weather-chart",{type:"scatter",data:{datasets:[{data:scatter,pointBackgroundColor:"#62d6c5a6",pointBorderColor:"#62d6c5",pointRadius:3,pointHoverRadius:5}]},options:opts("scatter",{scales:{x:{type:"linear",title:{display:true,text:"Temperature °C",color:"#829bab"},ticks:{color:"#829bab"},grid:{color:"rgba(134,169,189,.10)"}},y:{title:{display:true,text:"Modeled PM2.5 µg/m³",color:"#829bab"},ticks:{color:"#829bab"},grid:{color:"rgba(134,169,189,.10)"}}}})});
}
function forecastChart(){
 const key=$("pollutant").value;
 let p=series(air,key);
 const before=filterPast(p).slice(-24),after=filterFuture(p).slice(0,72);
 const joined=[...before,...after];
 const historical=new Set(before.map(x=>x.time));
 makeChart("forecast","forecast-chart",{type:"line",data:{labels:joined.map(x=>nice(x.time)),datasets:[{data:joined.map(x=>historical.has(x.time)?x.value:null),borderColor:C[key],borderWidth:2,pointRadius:0,tension:.25,spanGaps:false},{data:joined.map((x,i)=>i>=before.length-1?x.value:null),borderColor:"#c0a5fe",borderDash:[5,5],borderWidth:2,pointRadius:0,tension:.25}]},options:opts()});
}
function addMap(){
 if(!window.L){$("map").innerHTML='<p class="loading">Map tiles unavailable.</p>';return}
 if(map)return;map=L.map("map",{scrollWheelZoom:false}).setView([LAT,LON],11);
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
 L.circleMarker([LAT,LON],{radius:11,color:"#6ef2cf",weight:3,fillColor:"#2b8a87",fillOpacity:.7}).addTo(map).bindPopup("<b>Dortmund modeled-grid query</b><br>51.5136°N, 7.4653°E<br>Not a measured monitoring station.");
}
async function getJson(url){const res=await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(16000)});if(!res.ok)throw Error("HTTP "+res.status);const data=await res.json();if(data.error)throw Error(data.reason||"Provider error");return data}
async function load(){
 $("status").textContent="Requesting latest modeled CAMS air-quality data…";
 $("refresh").disabled=true;
 try{
 const airQuery=new URLSearchParams({latitude:LAT,longitude:LON,timezone:"GMT",current:"pm2_5,pm10,nitrogen_dioxide,ozone,european_aqi",hourly:"pm2_5,pm10,nitrogen_dioxide,ozone,european_aqi",past_days:7,forecast_days:3,domains:"cams_europe"});
 try{air=await getJson(AIR+"?"+airQuery)}catch(e){$("status").textContent="Live API unavailable; trying archived GitHub snapshot…";const snapshot=await getJson(BACKUP+"?v="+Date.now());air={hourly:snapshot.hourly,current:snapshot.current};$("status").textContent="Displaying last archived CAMS snapshot retrieved "+snapshot.retrieved_at+". Live API unavailable."}
 const weatherQuery=new URLSearchParams({latitude:LAT,longitude:LON,timezone:"GMT",hourly:"temperature_2m,relative_humidity_2m,wind_speed_10m",past_days:7,forecast_days:3});
 try{weather=await getJson(WEATHER+"?"+weatherQuery)}catch(e){weather=null}
 updateMetrics();historyChart();mixChart();heatmapChart();dailyChart();weatherChart();forecastChart();addMap();
 if(!$("status").textContent.startsWith("Displaying"))$("status").textContent="Data retrieved from Open-Meteo / Copernicus CAMS. Values are modeled and subject to provider update lag. Last refreshed: "+new Date().toLocaleString("en-GB",{timeZone:ZONE})+".";
 }catch(e){$("status").innerHTML='<span class="error">Data unavailable: '+String(e.message).replace(/[<>]/g,"")+'. Please retry later; no substitute or fabricated values are displayed.</span>';addMap()}
 finally{$("refresh").disabled=false}
}
$("refresh").addEventListener("click",load);
$("pollutant").addEventListener("change",()=>{if(air){historyChart();dailyChart();forecastChart()}});
load();
