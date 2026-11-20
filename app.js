(()=>{
"use strict";
const form=document.getElementById('form'), input=document.getElementById('codigo'), out=document.getElementById('response'), btn=document.getElementById('submit');
const api=(window.SIMPOSIO_API_BASE||'').trim().replace(/\/+$/,'');
function el(tag,txt,cls){let n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n;}
function show(kind,title,text,details){out.hidden=false;out.className='response '+kind;out.replaceChildren(el('div',title,'status'),el('p',text));if(details){let dl=el('dl',undefined,'details');for(let [k,v] of details){let d=el('div');d.append(el('dt',k),el('dd',String(v)));dl.append(d)}out.append(dl)}out.scrollIntoView({behavior:'smooth',block:'nearest'});}
const p=new URLSearchParams(location.search);const initial=p.get('codigo');if(initial)input.value=initial;
form.addEventListener('submit',async e=>{
e.preventDefault();const codigo=input.value.trim().toUpperCase();if(!/^[A-Z0-9-]{12,80}$/.test(codigo)){show('warning','Verifique o código','Informe o código completo do certificado, sem espaços.');return;}
if(!api){show('warning','Sistema ainda não ativado','A página foi preparada, mas a consulta oficial ainda precisa ser conectada ao banco de certificados da organização. Nenhum certificado pode ser autenticado neste momento.');return;}
btn.disabled=true;btn.textContent='Consultando...';
try{const response=await fetch(`${api}/v1/certificados/${encodeURIComponent(codigo)}`,{headers:{accept:'application/json'},cache:'no-store'});
 const data=await response.json();
 if(response.ok&&data.valido===true){show('success','✓ Certificado válido','O código corresponde a um certificado registrado e ativo no cadastro oficial.',[['Participante',data.participante],['Evento',data.evento],['Data',data.data],['Carga horária',data.horas],['Categoria',data.categoria],['Código',codigo]])}
 else if(response.status===404){show('error','Certificado não localizado','Não foi encontrado um certificado ativo para este código. Confira os caracteres ou contate a comissão organizadora.')}
 else if(response.status===429){show('warning','Muitas consultas','Aguarde um pouco antes de fazer outra tentativa.')}else{show('warning','Consulta indisponível','Não foi possível validar este documento agora. Tente novamente mais tarde.')}}
catch{show('warning','Sem conexão com o verificador','Não foi possível consultar o serviço de autenticação. Verifique a conexão e tente novamente.')}finally{btn.disabled=false;btn.innerHTML='Verificar certificado <span aria-hidden="true">→</span>';}
});
if(initial)form.requestSubmit();
})();
