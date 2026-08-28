const startDate = new Date("2019-08-29T08:30:00-05:00");

window.addEventListener("load",()=>{
  setTimeout(()=>document.getElementById("loader").classList.add("hide"),900);
  updateCounter();
  setInterval(updateCounter,1000);
  makeRandomGallery();
});

function updateCounter(){
  const now=new Date();
  let years=now.getFullYear()-startDate.getFullYear();
  const ann=new Date(startDate); ann.setFullYear(startDate.getFullYear()+years);
  if(now<ann) years--;
  const anchor=new Date(startDate); anchor.setFullYear(startDate.getFullYear()+years);
  let d=now-anchor;
  const day=86400000,hour=3600000,min=60000;
  const days=Math.floor(d/day); d-=days*day;
  const hours=Math.floor(d/hour); d-=hours*hour;
  const minutes=Math.floor(d/min); d-=minutes*min;
  const seconds=Math.floor(d/1000);
  document.getElementById("years").textContent=years;
  document.getElementById("days").textContent=days;
  document.getElementById("hours").textContent=hours;
  document.getElementById("minutes").textContent=minutes;
  document.getElementById("seconds").textContent=seconds;
}

const photoNames=[
 "01.jpg","02.jpg","03.jpg","04.jpg","05.jpg","06.jpg","07.jpg","08.jpg",
 "09.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg","15.jpg","16.jpg",
 "17.jpg","18.jpg","19.jpg","20.jpg","21.jpg","22.jpg","23.jpg","24.jpg",
 "25.jpg","26.jpg","27.jpg","28.jpg","29.jpg","30.jpg"
];

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}

function makeRandomGallery(){
 const gallery=document.getElementById("random-gallery");
 gallery.innerHTML="";
 const usable=shuffle(photoNames).slice(0,14);
 usable.forEach((name,i)=>{
   const card=document.createElement("div");
   card.className="random-photo";
   const img=document.createElement("img");
   img.src="assets/fotos/"+name;
   img.alt="Un recuerdo de nosotros";
   img.onerror=()=>card.remove();
   card.appendChild(img);
   const x=10+Math.random()*78;
   const y=170+Math.random()*480;
   const rot=-9+Math.random()*18;
   card.style.left=x+"%";
   card.style.top=y+"px";
   card.style.transform=`rotate(${rot}deg)`;
   card.style.animationDelay=(-Math.random()*5)+"s";
   gallery.appendChild(card);
 });
}
document.getElementById("shuffle").addEventListener("click",makeRandomGallery);

const envelope=document.getElementById("envelope");
document.getElementById("openLetter").addEventListener("click",()=>{
 envelope.classList.toggle("open");
 document.getElementById("openLetter").textContent=envelope.classList.contains("open")?"cerrar mi carta":"abrir mi carta ♡";
});

document.getElementById("loveButton").addEventListener("click",()=>{
 for(let i=0;i<30;i++){
   const h=document.createElement("div");
   h.className="burst-heart";
   h.textContent=Math.random()>.2?"♡":"♥";
   h.style.left=(48+Math.random()*4)+"%";
   h.style.top=(72+Math.random()*8)+"%";
   h.style.setProperty("--x",(Math.random()*300-150)+"px");
   h.style.animationDuration=(2.5+Math.random()*2)+"s";
   document.body.appendChild(h);
   setTimeout(()=>h.remove(),5000);
 }
});

const observer=new IntersectionObserver(entries=>{
 entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add("seen");observer.unobserve(e.target)}
 })
},{threshold:.12});
document.querySelectorAll(".chapter,.little-item,.first-card,.songs a,.hard-section>div,.future>div").forEach(el=>{
 el.style.opacity="0";el.style.transform+=" translateY(25px)";el.style.transition="opacity .8s ease,transform .8s ease";
 observer.observe(el);
});
const style=document.createElement("style");
style.textContent=".seen{opacity:1!important;transform:none!important}";
document.head.appendChild(style);
