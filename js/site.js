(function () {
'use strict';
const menu = [
{id:'roll-caramel-apple',name:'Caramel Apple loaded cinnamon roll',cents:700},
{id:'roll-biscoff',name:'Biscoff loaded cinnamon roll',cents:700},
{id:'treat-biscoff',name:'Biscoff Kitty Krispies Treat',cents:500},
{id:'treat-oreo',name:'Oreo Kitty Krispies Treat',cents:500}
];
const key='mgk_static_cart_v2';
let cart={};
try { const stored=JSON.parse(localStorage.getItem(key)||'{}'); if(stored && typeof stored==='object') menu.forEach(item=>{ const q=stored[item.id]; if(Number.isInteger(q)&&q>0&&q<=99) cart[item.id]=q; }); } catch(e) {}
const money=cents=>'$'+(cents/100).toFixed(2);
function totals(){const subtotal=menu.reduce((sum,item)=>sum+item.cents*(cart[item.id]||0),0);const tax=Math.round(subtotal*825/10000);return {subtotal,tax,total:subtotal+tax};}
function persist(){try{localStorage.setItem(key,JSON.stringify(cart));}catch(e){}render();}
function summary(){const t=totals();const name=document.getElementById('order-name')?.value.trim()||'';const pickup=document.getElementById('order-pickup')?.value.trim()||'';const payment=document.getElementById('payment-method')?.value||'';return ["Milo's Ghost Kitchen order request",'Name: '+name,'Pickup requested: '+pickup,...menu.filter(i=>cart[i.id]).map(i=>cart[i.id]+' x '+i.name+' — '+money(i.cents*cart[i.id])),'Subtotal: '+money(t.subtotal),'Texas sales tax (8.25%): '+money(t.tax),'Final total: '+money(t.total),'Payment preference: '+payment,'Please confirm availability and pickup details.'].join('\n');}
function render(){const box=document.getElementById('cart-items-container');if(!box)return;box.replaceChildren();menu.forEach(item=>{const qty=cart[item.id]||0;if(!qty)return;const row=document.createElement('div');row.className='cart-row';const text=document.createElement('span');text.textContent=qty+' x '+item.name+' — '+money(qty*item.cents);row.append(text);for(const [label,delta] of [['−',-1],['+',1]]){const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-label',(delta<0?'Remove one ':'Add one ')+item.name);b.disabled=delta>0&&qty>=99;b.onclick=()=>{const n=(cart[item.id]||0)+delta;if(n>0)cart[item.id]=Math.min(n,99);else delete cart[item.id];persist();};row.append(b);}box.append(row);});const t=totals();if(!t.subtotal)box.textContent='Your cart is empty. Choose treats above.';for(const [id,value] of [['calc-subtotal',t.subtotal],['calc-tax',t.tax],['calc-total',t.total]]){const el=document.getElementById(id);if(el)el.textContent=money(value);}const submit=document.getElementById('submit-order-btn');if(submit)submit.disabled=!t.subtotal;const out=document.getElementById('order-summary');if(out)out.textContent=t.subtotal?summary():'';}
document.addEventListener('click',e=>{const b=e.target.closest('.add-to-cart-btn');if(!b)return;const item=menu.find(i=>i.id===b.dataset.id);if(!item)return;cart[item.id]=Math.min((cart[item.id]||0)+1,99);persist();const notice=document.getElementById('cart-notice');if(notice)notice.textContent=item.name+' added. Quantity: '+cart[item.id]+'.';});
const form=document.getElementById('order-form');if(form){form.addEventListener('input',render);form.addEventListener('change',render);form.addEventListener('submit',e=>{e.preventDefault();if(!totals().subtotal||!form.reportValidity())return;const body=summary();const out=document.getElementById('order-summary');if(out)out.textContent=body;window.location.href='sms:+13468968007?body='+encodeURIComponent(body);});}
render();
})();
