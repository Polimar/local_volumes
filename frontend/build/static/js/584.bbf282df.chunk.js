"use strict";(self.webpackChunkwaichat_frontend=self.webpackChunkwaichat_frontend||[]).push([[584],{584:(r,o,e)=>{e.r(o),e.d(o,{default:()=>g});var a=e(43),n=e(216),t=e(475),i=e(867),s=e(16),c=e(579);const d=i.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--background-color);
`,l=i.Ay.form`
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
`,p=i.Ay.div`
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
`,x=i.Ay.button`
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
`,u=i.Ay.div`
  color: var(--error-color);
  margin-bottom: 20px;
  text-align: center;
`,h=i.Ay.div`
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
`,m=i.Ay.div`
  font-size: 32px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 30px;
  text-align: center;
`,g=()=>{const[r,o]=(0,a.useState)({username:"",password:""}),[e,i]=(0,a.useState)(!1),{login:g,error:b}=(0,s.A)(),v=(0,n.Zp)(),w=r=>{const{name:e,value:a}=r.target;o((r=>({...r,[e]:a})))};return(0,c.jsxs)(d,{children:[(0,c.jsx)(m,{children:"WaiChat"}),(0,c.jsxs)(l,{onSubmit:async o=>{if(o.preventDefault(),r.username&&r.password){i(!0);try{await g(r),v("/")}catch(b){console.error("Errore durante il login:",b)}finally{i(!1)}}},children:[(0,c.jsx)("h2",{children:"Accedi"}),b&&(0,c.jsx)(u,{children:b}),(0,c.jsxs)(p,{children:[(0,c.jsx)("label",{htmlFor:"username",children:"Username o Email"}),(0,c.jsx)("input",{type:"text",id:"username",name:"username",value:r.username,onChange:w,required:!0})]}),(0,c.jsxs)(p,{children:[(0,c.jsx)("label",{htmlFor:"password",children:"Password"}),(0,c.jsx)("input",{type:"password",id:"password",name:"password",value:r.password,onChange:w,required:!0})]}),(0,c.jsx)(x,{type:"submit",disabled:e,children:e?"Accesso in corso...":"Accedi"}),(0,c.jsxs)(h,{children:["Non hai ancora un account? ",(0,c.jsx)(t.N_,{to:"/register",children:"Registrati"})]})]})]})}}}]);
//# sourceMappingURL=584.bbf282df.chunk.js.map