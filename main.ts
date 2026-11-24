const fs=require("fs"),P=require("path");
const ID=process.env.MAKEFUN_INPUT_DIR||"/input",OD=process.env.MAKEFUN_OUTPUT_DIR||"/output";
const F=[(a,b)=>a+b|0,(a,b)=>a-b|0,Math.imul,(a,b)=>(a/b)|0,(a,b)=>(a%b)|0,(a,b)=>((a>>>0)/(b>>>0))|0,(a,b)=>((a>>>0)%(b>>>0))|0,a=>-a|0,(a,b)=>a&b,(a,b)=>a|b,(a,b)=>a^b,a=>~a,(a,b)=>a<<(b&31),(a,b)=>a>>(b&31),(a,b)=>(a>>>(b&31))|0,0,(a,b)=>a==b?1:0,(a,b)=>a<b?1:0,(a,b)=>(a>>>0)<(b>>>0)?1:0];
function run(g,b){
 let pc=0,s=[],c=[],m=new Int32Array(256),o=[],n=0,q=0;
 const im=k=>{let v=0;for(let i=0;i<k;i++)v|=g[pc+1+i]<<8*i;return v};
 while(1){
  if(n>=1e6)return[10,o];
  if(pc<0||pc>=g.length)return[9,o];
  let op=g[pc],L=0,u=0,w=0;
  if(op<8){
   if(op==1){L=1;w=1}else if(op==2){L=4;w=1}else if(op==3)u=1;
   else if(op==4){u=1;w=2}else if(op==5){u=2;w=2}else if(op==6){u=2;w=3}else if(op==7){u=3;w=3}
  }else if(op>=16&&op<35){
   if(!F[op-16])return[5,o];
   u=op==23||op==27?1:2;w=1;
  }else if(op>=48&&op<53){
   if(op<52)L=2;if(op==49||op==50)u=1;
  }else if(op==64){u=1;w=1}else if(op==65)u=2;
  else if(op>=80&&op<84){if(op==82)w=1;else u=1}
  else return[5,o];
  if(pc+1+L>g.length)return[9,o];
  if(s.length<u)return[2,o];
  if(s.length-u+w>256)return[3,o];
  n++;
  let x=pc+1+L;
  if(op<8){
   if(op==0)return[0,o];
   if(op==1){let v=g[pc+1];s.push(v>127?v-256:v)}
   else if(op==2)s.push(im(4)|0);
   else if(op==3)s.pop();
   else if(op==4)s.push(s[s.length-1]);
   else if(op==5){let t=s[s.length-1];s[s.length-1]=s[s.length-2];s[s.length-2]=t}
   else if(op==6)s.push(s[s.length-2]);
   else if(op==7){let t=s[s.length-3];s[s.length-3]=s[s.length-2];s[s.length-2]=s[s.length-1];s[s.length-1]=t}
  }else if(op<35){
   if(u==2){let y=s.pop(),v=s.pop();if(op>=19&&op<=22&&y==0)return[4,o];s.push(F[op-16](v,y))}
   else s.push(F[op-16](s.pop()));
  }else if(op<53){
   let v=im(2),j=v>32767?v-65536:v;
   if(op==48)x=pc+3+j;
   else if(op==49){if(!s.pop())x=pc+3+j}
   else if(op==50){if(s.pop())x=pc+3+j}
   else if(op==51){if(c.length>=64)return[7,o];c.push(pc+3);x=v}
   else{if(!c.length)return[8,o];x=c.pop()}
  }else if(op==64){
   let a=s[s.length-1];if(a<0||a>255)return[6,o];s[s.length-1]=m[a];
  }else if(op==65){
   let a=s[s.length-1];if(a<0||a>255)return[6,o];m[a]=s[s.length-2];s.pop();s.pop();
  }else if(op==80){
   let t=String(s.pop());
   if(o.length+t.length>65536)return[11,o];
   for(let i=0;i<t.length;i++)o.push(t.charCodeAt(i));
  }else if(op==81){
   if(o.length>=65536)return[11,o];o.push(s.pop()&255);
  }else if(op==82)s.push(q<b.length?b[q++]:-1);
  else return[s.pop()&255,o];
  pc=x;
 }
}
for(let id of fs.readdirSync(ID).sort()){
 let d=P.join(ID,id),g=fs.readFileSync(P.join(d,"program.bin")),b=fs.readFileSync(P.join(d,"input.bin")),r=run(g,b),od=P.join(OD,id);
 fs.mkdirSync(od,{recursive:true});
 fs.writeFileSync(P.join(od,"stdout.bin"),Buffer.from(r[1]));
 fs.writeFileSync(P.join(od,"exit.txt"),r[0]+"\n");
}
