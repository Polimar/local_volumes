"use strict";(self.webpackChunkwaichat_frontend=self.webpackChunkwaichat_frontend||[]).push([[372],{372:(r,e,o)=>{o.r(e),o.d(e,{default:()=>g});var a=o(43),n=o(216),i=o(475),s=o(867),t=o(16),l=o(579);const d=s.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--background-color);
`,c=s.Ay.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: var(--chat-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--shadow-color);

  h2 {
    margin-bottom: 24px;
    text-align: center;
    color: var(--primary-color);
  }
`,m=s.Ay.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.2s;

    &:focus {
      border-color: var(--primary-color);
    }
  }
`,p=s.Ay.button`
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;

  &:hover {
    background-color: var(--accent-color);
  }

  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
  }
`,u=s.Ay.div`
  color: var(--error-color);
  margin-bottom: 20px;
  text-align: center;
`,x=s.Ay.div`
  margin-top: 20px;
  text-align: center;
  font-size: 15px;

  a {
    color: var(--primary-color);
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`,h=s.Ay.div`
  font-size: 32px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 30px;
  text-align: center;
`,g=()=>{const[r,e]=(0,a.useState)({username:"",email:"",password:"",confirmPassword:"",fullName:""}),[o,s]=(0,a.useState)(!1),[g,f]=(0,a.useState)(""),{register:b}=(0,t.A)(),w=(0,n.Zp)(),v=r=>{const{name:o,value:a}=r.target;e((r=>({...r,[o]:a})))};return(0,l.jsxs)(d,{children:[(0,l.jsx)(h,{children:"WaiChat"}),(0,l.jsxs)(c,{onSubmit:async e=>{if(e.preventDefault(),r.password===r.confirmPassword)if(r.password.length<6)f("La password deve contenere almeno 6 caratteri");else{s(!0),f("");try{const e={username:r.username,email:r.email,password:r.password,fullName:r.fullName};await b(e),w("/")}catch(g){var o,a;f((null===(o=g.response)||void 0===o||null===(a=o.data)||void 0===a?void 0:a.message)||"Errore durante la registrazione")}finally{s(!1)}}else f("Le password non corrispondono")},children:[(0,l.jsx)("h2",{children:"Registrati"}),g&&(0,l.jsx)(u,{children:g}),(0,l.jsxs)(m,{children:[(0,l.jsx)("label",{htmlFor:"username",children:"Username"}),(0,l.jsx)("input",{type:"text",id:"username",name:"username",value:r.username,onChange:v,required:!0})]}),(0,l.jsxs)(m,{children:[(0,l.jsx)("label",{htmlFor:"email",children:"Email"}),(0,l.jsx)("input",{type:"email",id:"email",name:"email",value:r.email,onChange:v,required:!0})]}),(0,l.jsxs)(m,{children:[(0,l.jsx)("label",{htmlFor:"fullName",children:"Nome Completo"}),(0,l.jsx)("input",{type:"text",id:"fullName",name:"fullName",value:r.fullName,onChange:v})]}),(0,l.jsxs)(m,{children:[(0,l.jsx)("label",{htmlFor:"password",children:"Password"}),(0,l.jsx)("input",{type:"password",id:"password",name:"password",value:r.password,onChange:v,required:!0})]}),(0,l.jsxs)(m,{children:[(0,l.jsx)("label",{htmlFor:"confirmPassword",children:"Conferma Password"}),(0,l.jsx)("input",{type:"password",id:"confirmPassword",name:"confirmPassword",value:r.confirmPassword,onChange:v,required:!0})]}),(0,l.jsx)(p,{type:"submit",disabled:o,children:o?"Registrazione in corso...":"Registrati"}),(0,l.jsxs)(x,{children:["Hai gi\xe0 un account? ",(0,l.jsx)(i.N_,{to:"/login",children:"Accedi"})]})]})]})}}}]);
//# sourceMappingURL=372.c395c106.chunk.js.map