(()=>{
'use strict';
const form=document.getElementById('form'),ticket=document.getElementById('ingresso'),email=document.getElementById('email'),out=document.getElementById('response'),btn=document.getElementById('submit');
const api=(window.SIMPOSIO_API_BASE||'').trim().replace(/\/+$/,'');
function el(tag,txt,cls){const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n;}
function show(kind,title,text){out.hidden=false;out.className='response '+kind;out.replaceChildren(el('div',title,'status'),el('p',text));out.scrollIntoView({behavior:'smooth',block:'nearest'});}
form.addEventListener('submit',async e=>{
 e.preventDefault();const numero=ticket.value.trim().toUpperCase(),mail=email.value.trim();
 if(!/^[A-Z0-9-]{5,40}$/.test(numero)){show('warning','Confira o ingresso','Informe o número completo do ingresso Sympla, incluindo letras e hífens.');return;}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)||mail.length>254){show('warning','Confira o e-mail','Use o mesmo e-mail informado na inscrição.');return;}
 if(!api){show('warning','Consulta indisponível','A conexão com o serviço de consulta ainda não está configurada.');return;}
 btn.disabled=true;btn.textContent='Consultando...';
 try{
  const res=await fetch(api+'/v1/participacao',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({numero_ingresso:numero,email:mail}),cache:'no-store'});
  const data=await res.json();
  if(res.ok&&data.presenca_confirmada===true){show('success','✓ Participação confirmada','Há registro de check-in para este ingresso no II Simpósio da Educação Profissional e Técnica, em 08 de dezembro de 2026. Essa consulta confirma o registro de presença, não a integridade do PDF do certificado.');}
  else if(res.status===404){show('error','Registro não confirmado','Não foi possível confirmar a participação com esses dados. Confira o ingresso e o e-mail ou procure a Comissão Organizadora.');}
  else if(res.status===429){show('warning','Limite de consultas','Tente novamente mais tarde.');}
  else{show('warning','Consulta indisponível','Não foi possível consultar os registros agora. Tente novamente mais tarde.');}
 }catch{show('warning','Falha de conexão','Não foi possível comunicar com o serviço. Tente novamente mais tarde.');}
 finally{btn.disabled=false;btn.textContent='Consultar participação';}
});
})();
