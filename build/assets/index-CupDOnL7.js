(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();document.documentElement.setAttribute("color-mode","light");function p(){const e=n=>{if(n.currentTarget.classList.contains("hideL")){document.documentElement.setAttribute("color-mode","light");return}document.documentElement.setAttribute("color-mode","dark")};document.querySelectorAll(".change-btn").forEach(n=>{n.addEventListener("click",e)})}p();const u=document.getElementById("search-txt"),m=document.getElementById("search-txt-header"),E=document.getElementById("search-btn"),w=document.getElementById("search-btn-header");u.addEventListener("keyup",function(e){if(e.key==="Enter"){const t=u.value;showingViewResults(t)}console.log(e.key)});m.addEventListener("keyup",function(e){if(e.key==="Enter"){const t=m.value;showingViewResults(t)}});E.addEventListener("click",function(){showingViewResults(u.value)});w.addEventListener("click",function(){showingViewResults(m.value)});async function x(){try{return await(await fetch("/api/giphy?endpoint=trending/searches")).json()}catch(e){console.error("Error fetching text GIFs:",e)}}async function I(){let e=await x(),t=document.getElementById("random-trend");t.innerHTML="";for(let s=0;s<5;s++)t.innerHTML+='<div class="trend-text-searched noSpace">'+e.data[s]+",</div>";document.querySelectorAll(".trend-text-searched").forEach(s=>s.addEventListener("click",o=>{let i=o.currentTarget.textContent.substring(0,o.currentTarget.textContent.length-1);showingViewResults(i)}))}I();function L(){let e=window.matchMedia("(min-width: 800px)"),t=window.scrollY;e.matches&&t!==0?(document.getElementById("hideSearch").style.display="block",document.querySelector(".header").style.boxShadow="1px 1px 4px 0 rgba(0, 0, 0, .1)"):(document.getElementById("hideSearch").style.display="none",document.querySelector(".header").style.boxShadow="none"),t!==0?document.querySelector(".header").style.boxShadow="1px 1px 4px 0 rgba(0, 0, 0, .1)":document.querySelector(".header").style.boxShadow="none"}window.addEventListener("scroll",L);const b=document.getElementById("button-prev"),B=document.getElementById("button-next"),a=document.getElementById("track"),$=document.getElementById("slick-list");document.querySelectorAll(".slick");async function k(){try{const t=await(await fetch("/api/giphy?endpoint=gifs/trending&limit=12&rating=g")).json();S(t),P(t)}catch(e){console.error("Error fetching trending GIFs:",e)}}k();b.onclick=()=>h(1);B.onclick=()=>h(2);function h(e){let t=document.getElementById("slick-list");const n=a.offsetWidth,s=$.offsetWidth;if(a.style.left==""?leftPosition=a.style.left=0:leftPosition=parseFloat(a.style.left.slice(0,-2)*-1),leftPosition<n-s&&e==2){a.style.left=`${-1*(leftPosition+275)}px`,t.scroll(a.style.left,0);return}else leftPosition>0&&e==1&&(a.style.left=`${-1*(leftPosition-275)}px`,t.scroll(a.style.left,0))}const T=document.getElementById("track");function S(e){let t="";e.data.forEach(n=>{const s=n.images.fixed_width.url;t+=`<div class="slick" id="${n.id}">
                            <img src="${s}" alt="${n.title}">
                            <div class="card">
                            <div class="group-icons">
                                <div id="${n.id}-add" class="icons icon-heart"></div>
                                <div id="${n.id}-download" class="icons icon-download"></div>
                                <div id="${n.id}-max" class="icons icon-max"></div>
                            </div>
                            <div class="text-card">
                                <div class="text-card-user">${n.username!==""?n.username:"User"}</div>
                                <h3 class="text-card-title">${n.title}</h3>
                            </div>
                            </div>
                        </div>`}),T.innerHTML=t}function f(e,t){let n=localStorage.getItem(e);n=n?JSON.parse(n):[],n.push(t),localStorage.setItem(e,JSON.stringify(n))}function M(e){document.getElementById(`${e.id}-add`).classList.contains("icon-heart--active")==!1?(document.getElementById(`${e.id}-add`).classList.add("icon-heart--active"),f("Favourites",e)):(document.getElementById(`${e.id}-add`).classList.remove("icon-heart--active"),y(e))}async function q(e){let t=document.createElement("a"),s=await(await fetch(`${e.images.downsized.url}`)).blob();t.download=`${e.title}`,t.href=window.URL.createObjectURL(s),t.dataset.downloadurl=["application/octet-stream",t.download,t.href].join(":"),t.click()}function y(e){let t=JSON.parse(localStorage.getItem("Favourites"));t.forEach((n,s)=>n.id===e.id?t.splice(s,1):null),localStorage.setItem("Favourites",JSON.stringify(t))}function A(e){const t=o=>{o.currentTarget.id==`${e.id}-add`&&M(e),o.currentTarget.id==`${e.id}-download`&&q(e),o.currentTarget.id==`${e.id}-max`&&g(e.id)};document.querySelectorAll(".icons").forEach(o=>{o.addEventListener("click",t)}),document.getElementById(e.id).addEventListener("click",function(){F()&&g(e.id)})}function F(){return navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/BlackBerry/i)}function P(e){e.data.map(function(t){return A(t)}).join("")}async function g(e){try{const n=await(await fetch(`/api/giphy?endpoint=gifs/${e}`)).json();if(n.data){const s=document.getElementById("modal");let o="";const i=n.data.images.fixed_width.url;o+=`<div class="cross" onclick="closeModal()">X</div>
            <div class="container">
                <div class="max-image-text">
                    <div class="image-max">
                        <img src="${i}" alt="${n.data.title}">
                    </div>
                    <div class="icon-text">
                        <div class="max-text">
                            <div class="text-card-user">${n.data.username!==""?n.data.username:"User"}</div>
                            <h3 class="text-card-title">${n.data.title}</h3>
                        </div>
                        <div class="iconos">
                            <div id="${n.data.id}-add-max-gif" class="icons icon-heart"></div>
                            <div id="${n.data.id}-download-max-gif" class="icons icon-download"></div>
                        </div>
                    </div>
                </div>
            </div>`,s.innerHTML=o,s.style.display="block";const c=document.getElementById(`${n.data.id}-add-max-gif`),v=document.getElementById(`${n.data.id}-download-max-gif`);c.addEventListener("click",()=>R(n.data)),v.addEventListener("click",()=>H(n.data))}}catch(t){console.error("Error fetching GIF by ID:",t)}}function R(e){let t=document.getElementById(`${e.id}-add-max-gif`);t.classList.contains("icon-heart--active")==!1?(t.classList.add("icon-heart--active"),f("Favourites",e)):(t.classList.remove("icon-heart--active"),y(e))}async function H(e){let t=document.createElement("a"),s=await(await fetch(`${e.images.downsized.url}`)).blob();t.download=`${e.title}`,t.href=window.URL.createObjectURL(s),t.dataset.downloadurl=["application/octet-stream",t.download,t.href].join(":"),t.click()}function O(){document.querySelectorAll(".modal").forEach(t=>{t.style.display="none"})}document.addEventListener("click",e=>{document.querySelectorAll(".modal").forEach(n=>{e.target===n&&O()})});const r=document.querySelector(".search-txt"),d=document.getElementById("suggestions");function G(){r.addEventListener("keyup",async e=>{let t=await N(r.value);document.getElementById("search-btn").style.display="none",document.getElementById("clean-btn").style.display="block",r.value==""&&(document.getElementById("search-btn").style.display="block",document.getElementById("clean-btn").style.display="none"),d.style.borderTop="1px solid rgba(156, 175, 195 ,.5)";const n=`
        <ul class="suggestions">
            ${t.map(o=>`
                <li class="option-list"><i class="fa fa-search"></i>${o.name}</li>
            `).join("")}
        </ul>
        `;t.length!==0?d.innerHTML=n:(d.innerHTML="",d.style.borderTop="none"),document.querySelectorAll(".option-list").forEach(o=>o.addEventListener("click",C))})}G();document.getElementById("clean-btn").addEventListener("click",function(){document.getElementById("search-txt").value="",document.getElementById("search-btn").style.display="block",document.getElementById("clean-btn").style.display="none"});async function N(e){try{const n=await(await fetch(`/api/giphy?endpoint=search/tags&q=${e}`)).json();n.data&&showSuggestions(n.data)}catch(t){console.error("Error fetching suggestions:",t)}}const C=e=>{let t=e.currentTarget.textContent,n=document.getElementById("search-txt");n.value=e.currentTarget.textContent;let s=document.getElementById("suggestions");s.innerHTML="",U(t)};let l=12;async function V(e){l=l+12,document.getElementById("gifs-container"),searchGifsFn(e,l)}async function U(e){let t=await getGifWithInput(e),n=document.getElementById("trend-text");document.getElementById("search-resultados");const s=`
      <h1 class="main-title">${e}</h1>
      <div id="gifs-container" class="gifs-container gifs-container-search-results">           
      </div><br>
      <div id="more-results" class="button-suggestion">
          Ver más
      </div> 
  `,o=`
      <div class="center-no-result">
      <h1 class="main-title">${e}</h1>
      </div><br>
      <div class="error-results">
          <img src="./img/icon-busqueda-sin-resultado.svg" alt="Busqueda-sin-resultados"><br><br>
          <p>Intenta con otra búsqueda.</p><br>
      </div>
  `;t.data.length!==0?(n.innerHTML=s,searchGifsFn(e,0),document.getElementById("more-results").addEventListener("click",function(){V(e)})):n.innerHTML=o}document.getElementById("modal");
//# sourceMappingURL=index-CupDOnL7.js.map
