const canvas=document.getElementById("network-canvas"),ctx=canvas.getContext("2d"),wrap=document.querySelector(".canvas-wrap"),dialog=document.getElementById("node-dialog"),hint=document.getElementById("start-hint");
const COLS=18,ROWS=11;
const nodes=[
{id:"yext",label:"YEXT · 24→",gx:3,gy:2,tag:"2024 — NOW · NEW YORK",title:"Technical Partner Manager",copy:"Yext. Product integrations and technical partnerships."},
{id:"zest",label:"ZEST · 21",gx:14,gy:2,tag:"2021 — 2022",title:"Business Development Intern",copy:"Zest. An early-stage startup and my first real look at building a company."},
{id:"crowded",label:"CROWDED · 22",gx:15,gy:7,tag:"2022 · TEL AVIV",title:"Product Management Intern",copy:"Crowded. Fintech product work, customer discovery, and plenty of QA."},
{id:"unc",label:"UNC · 23",gx:9,gy:8,tag:"GRADUATED DECEMBER 2023",title:"UNC Chapel Hill",copy:"B.S. in Business Administration with a minor in Data Science."},
{id:"amazon",label:"AMAZON · 23",gx:3,gy:8,tag:"2023 · SEATTLE",title:"Program Management Intern",copy:"Amazon. Data management, automation, and operations at scale."},
{id:"scaffold",label:"SCAFFOLDMAX · 26",gx:9,gy:4,tag:"2026 · SIDE PROJECT",title:"ScaffoldMaxNYC",copy:"A side project that escaped the notes app.",link:"/scaffold/"}
];
let width=0,height=0,dpr=1,cell=40,offsetX=0,offsetY=0,tick=0;
let snake=[],dir={x:1,y:0},visited=new Set();
function reset(){snake=[{x:6,y:5},{x:5,y:5},{x:4,y:5},{x:3,y:5}];dir={x:1,y:0};visited=new Set();document.getElementById("visited-count").textContent=0;hint.classList.remove("hidden");canvas.focus();draw()}
function resize(){const r=wrap.getBoundingClientRect();width=r.width;height=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);cell=Math.min(width/(COLS+1),height/(ROWS+1));offsetX=(width-cell*COLS)/2;offsetY=(height-cell*ROWS)/2;draw()}
new ResizeObserver(resize).observe(wrap);
function pt(gx,gy){return{x:offsetX+(gx+.5)*cell,y:offsetY+(gy+.5)*cell}}
function openNode(n){if(!n)return;visited.add(n.id);document.getElementById("visited-count").textContent=visited.size;document.getElementById("dialog-tag").textContent=n.tag;document.getElementById("dialog-title").textContent=n.title;document.getElementById("dialog-copy").textContent=n.copy;const link=document.getElementById("dialog-link");link.hidden=!n.link;if(n.link)link.href=n.link;if(!dialog.open)dialog.showModal()}
function move(next){dir=next;hint.classList.add("hidden");const head=snake[0],newHead={x:(head.x+dir.x+COLS)%COLS,y:(head.y+dir.y+ROWS)%ROWS};snake.unshift(newHead);snake.length=4+visited.size;const hit=nodes.find(n=>n.gx===newHead.x&&n.gy===newHead.y);if(hit&&!visited.has(hit.id))openNode(hit);draw()}
const directions={ArrowUp:{x:0,y:-1},w:{x:0,y:-1},W:{x:0,y:-1},ArrowDown:{x:0,y:1},s:{x:0,y:1},S:{x:0,y:1},ArrowLeft:{x:-1,y:0},a:{x:-1,y:0},A:{x:-1,y:0},ArrowRight:{x:1,y:0},d:{x:1,y:0},D:{x:1,y:0}};
addEventListener("keydown",e=>{if(!directions[e.key]||document.activeElement!==canvas)return;e.preventDefault();move(directions[e.key])});
canvas.addEventListener("click",e=>{canvas.focus();hint.classList.add("hidden");const r=canvas.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;let hit=null;nodes.forEach(n=>{const p=pt(n.gx,n.gy);if(Math.hypot(mx-p.x,my-p.y)<cell*.75)hit=n});if(hit){snake.unshift({x:hit.gx,y:hit.gy});snake.length=4+visited.size;openNode(hit);draw()}});
hint.addEventListener("click",()=>{canvas.focus();hint.classList.add("hidden")});
document.querySelectorAll("[data-direction]").forEach(b=>b.addEventListener("click",()=>{canvas.focus();move(directions["Arrow"+b.dataset.direction[0].toUpperCase()+b.dataset.direction.slice(1)])}));
document.getElementById("reset-game").onclick=reset;document.querySelector(".dialog-close").onclick=()=>{dialog.close();canvas.focus()};dialog.addEventListener("click",e=>{if(e.target===dialog){dialog.close();canvas.focus()}});
function grid(){ctx.fillStyle="#0d0e17";ctx.fillRect(0,0,width,height);ctx.strokeStyle="rgba(255,255,255,.065)";ctx.lineWidth=1;for(let x=0;x<=COLS;x++){const px=offsetX+x*cell;ctx.beginPath();ctx.moveTo(px,offsetY);ctx.lineTo(px,offsetY+ROWS*cell);ctx.stroke()}for(let y=0;y<=ROWS;y++){const py=offsetY+y*cell;ctx.beginPath();ctx.moveTo(offsetX,py);ctx.lineTo(offsetX+COLS*cell,py);ctx.stroke()}}
function drawNodes(){nodes.forEach(n=>{const p=pt(n.gx,n.gy),found=visited.has(n.id);ctx.beginPath();ctx.arc(p.x,p.y,cell*.22+Math.sin(tick+n.gx)*1.5,0,Math.PI*2);ctx.fillStyle=found?"#c8ff45":"#ff6b4a";ctx.fill();ctx.lineWidth=3;ctx.strokeStyle="#fff";ctx.stroke();ctx.fillStyle=found?"#c8ff45":"#fff";ctx.font=`500 ${Math.max(9,cell*.23)}px 'DM Mono'`;ctx.textAlign="center";ctx.fillText(n.label,p.x,p.y+cell*.58)})}
function drawSnake(){snake.slice().reverse().forEach((s,reverseIndex)=>{const original=snake.length-1-reverseIndex,p=pt(s.x,s.y),isHead=original===0,size=cell*(isHead?.34:.28);ctx.fillStyle=isHead?"#c8ff45":"#76d8ff";ctx.strokeStyle="#111118";ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(p.x-size,p.y-size,size*2,size*2,Math.max(5,size*.55));ctx.fill();ctx.stroke();if(isHead){const ex=dir.y?cell*.11:dir.x*cell*.13,ey=dir.x?cell*.11:dir.y*cell*.13;ctx.fillStyle="#111118";ctx.beginPath();ctx.arc(p.x+ex-dir.y*cell*.1,p.y+ey-dir.x*cell*.1,2.4,0,Math.PI*2);ctx.arc(p.x+ex+dir.y*cell*.1,p.y+ey+dir.x*cell*.1,2.4,0,Math.PI*2);ctx.fill()}})}
function draw(){grid();drawNodes();drawSnake()}
function animate(t){tick=t/500;draw();requestAnimationFrame(animate)}
reset();resize();requestAnimationFrame(animate);