"use strict";
(() => {
const K={reports:"sda.denuncias",agents:"sda.agentes",session:"sda.sessaoAdmin",adminProfile:"sda.perfilAdmin"};
const ADMIN_USERS={
  admin:{pass:"delegacia123",nome:"Administrador Geral",perfil:"Administrador Geral"},
  analista:{pass:"analista123",nome:"Agente Analista",perfil:"Agente Analista"},
  consulta:{pass:"consulta123",nome:"Usuário de Consulta",perfil:"Consulta"}
};
const STATUS=["Recebida","Em análise","Em investigação","Concluída","Arquivada"];
const URG=["Baixa","Média","Alta"];
const CATS={
  "Furto ou roubo":["Residência","Veículo","Estabelecimento comercial","Via pública","Outros"],
  "Tráfico de drogas":["Ponto de venda","Movimentação suspeita","Outros"],
  "Violência doméstica":["Física","Psicológica","Ameaça","Outros"],
  "Perturbação do sossego":["Som excessivo","Aglomeração","Outros"],
  "Vandalismo":["Patrimônio público","Patrimônio privado","Outros"],
  "Corrupção":["Suborno","Desvio de conduta","Outros"],
  "Outra ocorrência":["Não listada acima"]
};
const $=id=>document.getElementById(id);
const read=k=>{try{const x=JSON.parse(localStorage.getItem(k)||"[]");return Array.isArray(x)?x:[]}catch{return[]}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const iso=()=>new Date().toISOString();
const day=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const fmt=v=>{if(!v)return"Não informado";const d=new Date(String(v).length===10?v+"T12:00:00":v);return isNaN(d)?"Data indisponível":d.toLocaleDateString("pt-BR")};
const fmtTime=v=>{const d=new Date(v);return isNaN(d)?"":d.toLocaleString("pt-BR")};
const msg=(id,text,type="")=>{const e=$(id);if(e){e.textContent=text;e.className="notice "+type;e.hidden=!text}};
const badge=(v,type)=>{const s=document.createElement("span");s.className=`badge ${type==="status"?"status":"urg"}-${v}`;s.textContent=v;return s};
const profile=()=>sessionStorage.getItem(K.adminProfile)||"";
const currentUser=()=>Object.values(ADMIN_USERS).find(u=>u.perfil===profile())||null;
const permissions={
  "Administrador Geral":{update:true,archive:true,agents:true,export:true},
  "Agente Analista":{update:true,archive:false,agents:false,export:true},
  "Consulta":{update:false,archive:false,agents:false,export:false}
};
function can(action){return !!permissions[profile()]?.[action]}
function rand(max){const a=new Uint32Array(1),lim=Math.floor(4294967296/max)*max;do{crypto.getRandomValues(a)}while(a[0]>=lim);return a[0]%max}
function creds(ex){
  let p,pre="SD-"+day().replaceAll("-","")+"-";
  do{p=pre+String(rand(1e6)).padStart(6,"0")}while(ex.some(x=>x.protocolo===p));
  const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return{protocolo:p,codigoAcesso:Array.from({length:8},()=>a[rand(a.length)]).join("")}
}
function detail(r){
  const d=document.createElement("dl");d.className="detail";
  const f=[
    ["Protocolo",r.protocolo],["Status",r.status,"status"],["Categoria",r.categoria],
    ["Subcategoria",r.subcategoria],["Urgência",r.urgencia,"urg"],["Data da ocorrência",fmt(r.dataOcorrencia)],
    ["Local do fato",r.local,null,true],["Descrição",r.descricao,null,true],
    ["Registrada em",fmtTime(r.criadoEm)],["Última atualização",fmtTime(r.atualizadoEm)]
  ];
  f.forEach(([l,v,t,w])=>{const x=document.createElement("div");if(w)x.className="wide";const dt=document.createElement("dt"),dd=document.createElement("dd");dt.textContent=l;if(t)dd.append(badge(v,t));else dd.textContent=v||"Não informado";x.append(dt,dd);d.append(x)});
  return d
}
function protect(){
  if(!sessionStorage.getItem(K.session)){location.replace("admin.html");return false}
  return true
}
function header(){
  const p=document.body.dataset.page;
  document.querySelectorAll(".nav a").forEach(a=>{if(a.getAttribute("href")===p+".html")a.setAttribute("aria-current","page")});
  if($("admin-identidade")){
    const u=currentUser();
    $("admin-identidade").textContent=u?`${u.nome} • ${u.perfil}`:"";
  }
  $("btn-sair")?.addEventListener("click",e=>{e.preventDefault();sessionStorage.removeItem(K.session);sessionStorage.removeItem(K.adminProfile);location.replace("admin.html")});
}
function register(){
  const f=$("form-registro");if(!f)return;
  const c=$("categoria"),s=$("subcategoria");
  Object.keys(CATS).forEach(x=>c.add(new Option(x,x)));
  c.onchange=()=>{s.replaceChildren(new Option("Selecione",""));(CATS[c.value]||[]).forEach(x=>s.add(new Option(x,x)));s.disabled=!c.value};
  $("data-ocorrencia").max=day();
  f.onsubmit=e=>{
    e.preventDefault();
    const u=f.querySelector("[name=urgencia]:checked"),l=$("local").value.trim(),d=$("descricao").value.trim(),dt=$("data-ocorrencia").value;
    if(!c.value||!s.value||!u||l.length<5||d.length<20||!dt||dt>day())return msg("form-mensagem","Preencha todos os campos corretamente.","error");
    const rs=read(K.reports),cr=creds(rs),t=iso();
    const r={...cr,categoria:c.value,subcategoria:s.value,dataOcorrencia:dt,urgencia:u.value,local:l,descricao:d,status:"Recebida",criadoEm:t,atualizadoEm:t,historico:[{status:"Recebida",data:t,obs:"Denúncia registrada via Web.",ator:"Sistema"}]};
    rs.push(r);
    if(!save(K.reports,rs))return msg("form-mensagem","Erro ao salvar a denúncia.","error");
    $("protocolo-gerado").textContent=r.protocolo;$("codigo-gerado").textContent=r.codigoAcesso;f.closest(".layout").hidden=true;$("confirmacao").hidden=false
  };
  $("btn-nova")?.addEventListener("click",()=>location.reload())
}
function consult(){
  const f=$("form-consulta");if(!f)return;
  f.onsubmit=e=>{
    e.preventDefault();
    const p=$("protocolo").value.trim().toUpperCase(),c=$("codigo-acesso").value.trim().toUpperCase();
    const r=read(K.reports).find(x=>x.protocolo===p&&x.codigoAcesso===c),out=$("resultado");
    out.hidden=true;out.replaceChildren();
    if(!r)return msg("consulta-mensagem","Denúncia não encontrada. Confira protocolo e código de acesso.","error");
    msg("consulta-mensagem","");
    const h=document.createElement("h2");h.textContent="Acompanhamento da denúncia";out.append(h,detail(r));
    const ul=document.createElement("ul");ul.className="timeline";
    [...(r.historico||[])].reverse().forEach(x=>{const li=document.createElement("li");li.append(badge(x.status,"status"));const sm=document.createElement("small");sm.textContent=`${fmtTime(x.data)} • ${x.ator||"Sistema"}`;const p=document.createElement("p");p.textContent=x.obs||"";li.append(sm,p);ul.append(li)});
    out.append(ul);out.hidden=false
  }
}
function login(){
  const f=$("form-login");if(!f)return;
  if(sessionStorage.getItem(K.session))location.replace("dashboard.html");
  f.onsubmit=e=>{
    e.preventDefault();
    const u=$("login-usuario").value.trim().toLowerCase(),p=$("login-senha").value,found=ADMIN_USERS[u];
    if(found&&found.pass===p){
      sessionStorage.setItem(K.session,"autenticado");
      sessionStorage.setItem(K.adminProfile,found.perfil);
      location.replace("dashboard.html")
    }else msg("login-mensagem","Credenciais incorretas.","error")
  }
}
function dashboard(){
  if(!$("tabela"))return;
  if(!protect())return;
  const q=$("busca"),st=$("fstatus"),ug=$("furg"),ca=$("fcat"),tb=$("tabela"),u=currentUser();
  STATUS.forEach(x=>st.add(new Option(x,x)));URG.forEach(x=>ug.add(new Option(x,x)));Object.keys(CATS).forEach(x=>ca.add(new Option(x,x)));
  if($("perfil-atual"))$("perfil-atual").textContent=u?u.perfil:"";
  const stats=()=>{
    const r=read(K.reports);
    $("total").textContent=r.length;
    $("recebidas").textContent=r.filter(x=>x.status==="Recebida").length;
    $("investigacao").textContent=r.filter(x=>x.status==="Em investigação").length;
    $("concluidas").textContent=r.filter(x=>x.status==="Concluída").length;
    $("arquivadas").textContent=r.filter(x=>x.status==="Arquivada").length;
    const cats={};r.forEach(x=>cats[x.categoria]=(cats[x.categoria]||0)+1);
    if($("categoria-resumo"))$("categoria-resumo").innerHTML=Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([n,v])=>`<div class="mini-row"><span>${n}</span><strong>${v}</strong></div>`).join("")||'<div class="empty">Nenhum registro.</div>'
  };
  const render=()=>{
    const term=q.value.trim().toLowerCase();
    const rs=read(K.reports).filter(r=>(!term||[r.protocolo,r.categoria,r.local,r.descricao].join(" ").toLowerCase().includes(term))&&(!st.value||r.status===st.value)&&(!ug.value||r.urgencia===ug.value)&&(!ca.value||r.categoria===ca.value)).sort((a,b)=>new Date(b.atualizadoEm)-new Date(a.atualizadoEm));
    tb.replaceChildren();
    if(!rs.length){tb.innerHTML='<tr><td colspan="7" class="empty">Nenhuma denúncia encontrada.</td></tr>'}
    rs.forEach(r=>{
      const tr=document.createElement("tr");
      [r.protocolo,fmtTime(r.criadoEm),r.categoria,r.local,badge(r.urgencia,"urg"),badge(r.status,"status")].forEach(v=>{const td=document.createElement("td");v instanceof Node?td.append(v):td.textContent=v;tr.append(td)});
      const td=document.createElement("td"),wrap=document.createElement("div");wrap.className="rowactions";
      const view=document.createElement("button");view.className="btn secondary";view.textContent="Detalhes";view.onclick=()=>openView(r);
      wrap.append(view);
      if(can("update")){
        const b=document.createElement("button");b.className="btn primary";b.textContent="Atualizar";b.onclick=()=>edit(r.protocolo);wrap.append(b)
      }
      if(can("archive") && r.status!=="Arquivada"){
        const x=document.createElement("button");x.className="btn danger";x.textContent="Arquivar";x.onclick=()=>archive(r.protocolo);wrap.append(x)
      }
      td.append(wrap);tr.append(td);tb.append(tr)
    });
    stats()
  };
  function openView(r){
    $("view-content").replaceChildren(detail(r));
    $("modal-view").hidden=false
  }
  function edit(p){
    const r=read(K.reports).find(x=>x.protocolo===p);if(!r)return;
    $("edit-protocolo").textContent=p;$("edit-status").replaceChildren(...STATUS.map(x=>new Option(x,x)));$("edit-status").value=r.status;$("edit-obs").value="";
    $("modal").hidden=false;
    $("form-edicao").onsubmit=e=>{
      e.preventDefault();
      const rs=read(K.reports),i=rs.findIndex(x=>x.protocolo===p),t=iso(),s=$("edit-status").value,o=$("edit-obs").value.trim()||"Status atualizado pela administração.";
      rs[i].status=s;rs[i].atualizadoEm=t;rs[i].historico=rs[i].historico||[];rs[i].historico.push({status:s,data:t,obs:o,ator:u?.perfil||"Administração"});
      save(K.reports,rs);$("modal").hidden=true;render();msg("dashboard-msg","Denúncia atualizada e registrada no histórico.","ok")
    }
  }
  function archive(p){
    if(!can("archive"))return;
    const rs=read(K.reports),i=rs.findIndex(x=>x.protocolo===p);if(i<0)return;
    if(!confirm("Arquivar esta denúncia? Ela continuará disponível para consulta administrativa."))return;
    const t=iso();rs[i].status="Arquivada";rs[i].atualizadoEm=t;rs[i].historico=rs[i].historico||[];rs[i].historico.push({status:"Arquivada",data:t,obs:"Denúncia arquivada pela administração.",ator:u?.perfil||"Administrador"});
    save(K.reports,rs);render();msg("dashboard-msg","Denúncia arquivada com sucesso.","ok")
  }
  [q,st,ug,ca].forEach(x=>x.addEventListener("input",render));
  $("limpar").onclick=()=>{q.value=st.value=ug.value=ca.value="";render()};
  if(can("export"))$("exportar").onclick=()=>{const blob=new Blob([JSON.stringify(read(K.reports),null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="denuncias-"+day()+".json";a.click();URL.revokeObjectURL(url)};
  else $("exportar")?.remove();
  $("fechar").onclick=()=>{$("modal").hidden=true};$("fechar-view").onclick=()=>{$("modal-view").hidden=true};
  render()
}
function agents(){
  const f=$("form-agente"),tb=$("agentes");if(!f||!tb)return;
  if(!protect())return;
  if(!can("agents")){f.closest(".card")?.classList.add("hidden");return}
  const render=()=>{const a=read(K.agents);tb.replaceChildren();if(!a.length){tb.innerHTML='<tr><td colspan="4" class="empty">Nenhum agente cadastrado.</td></tr>';return}a.forEach((x,i)=>{const tr=document.createElement("tr");[x.nome,x.matricula,x.permissao].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.append(td)});const td=document.createElement("td"),b=document.createElement("button");b.className="btn danger";b.textContent="Excluir";b.onclick=()=>{if(confirm("Excluir agente do cadastro?")){const a=read(K.agents);a.splice(i,1);save(K.agents,a);render()}};td.append(b);tr.append(td)})};
  f.onsubmit=e=>{e.preventDefault();const n=$("agente-nome").value.trim(),m=$("agente-matricula").value.trim(),p=$("agente-permissao").value;if(n.length<3||m.length<2)return msg("agente-msg","Informe nome e matrícula.","error");const a=read(K.agents);if(a.some(x=>x.matricula.toLowerCase()===m.toLowerCase()))return msg("agente-msg","Matrícula já cadastrada.","error");a.push({nome:n,matricula:m,permissao:p,criadoEm:iso()});save(K.agents,a);f.reset();msg("agente-msg","Agente cadastrado.","ok");render()};
  render()
}
document.addEventListener("DOMContentLoaded",()=>{header();register();consult();login();dashboard();agents()});
})();
