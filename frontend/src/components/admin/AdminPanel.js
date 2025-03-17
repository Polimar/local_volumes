import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../services/api";
import { toast } from "react-toastify";

// Styled components
const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: var(--sidebar-bg);
  padding: 1rem 0;
  overflow-y: auto;
`;

const SidebarItem = styled.div`
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--hover-color);
  }
  
  &.active {
    background-color: var(--active-color);
    font-weight: bold;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  th {
    background-color: var(--table-header-bg);
    font-weight: bold;
  }
  
  tr:hover {
    background-color: var(--hover-color);
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  margin-right: 0.5rem;
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
  
  &.secondary {
    background-color: var(--secondary-color);
    color: white;
    
    &:hover {
      background-color: var(--secondary-dark);
    }
  }
  
  &.danger {
    background-color: var(--danger-color);
    color: white;
    
    &:hover {
      background-color: var(--danger-dark);
    }
  }
`;

const Form = styled.form`
  max-width: 600px;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-color);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-color);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-color);
  min-height: 150px;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--background-color);
  padding: 2rem;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
`;

// Componente principale
const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("users");
  const [users, setUsers] = useState([]);
  const [models, setModels] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const [sslCertificate, setSslCertificate] = useState({ cert: "", key: "" });
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Carica i dati iniziali
  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      switch (activeSection) {
        case "users":
          const userResponse = await api.get("/admin/users");
          setUsers(userResponse.data);
          break;
        case "models":
          const modelsResponse = await api.get("/admin/ollama/models");
          setModels(modelsResponse.data);
          break;
        case "prompts":
          const promptsResponse = await api.get("/admin/ollama/prompts");
          setPrompts(promptsResponse.data);
          break;
        case "groups":
          const groupsResponse = await api.get("/admin/groups");
          setGroups(groupsResponse.data);
          break;
        case "ssl":
          const sslResponse = await api.get("/admin/ssl");
          setSslCertificate(sslResponse.data);
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error(`Errore nel caricamento dei dati: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // GESTIONE UTENTI
  const handleOpenUserModal = (type, user = null) => {
    setFormData(user || { username: "", email: "", password: "", fullName: "", role: "user" });
    setModal({ isOpen: true, type, data: user });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (modal.type === "addUser") {
        await api.post("/admin/users", formData);
        toast.success("Utente creato con successo");
      } else if (modal.type === "editUser") {
        await api.put(`/admin/users/${modal.data.id}`, formData);
        toast.success("Utente aggiornato con successo");
      } else if (modal.type === "changePassword") {
        await api.put(`/admin/users/${modal.data.id}/password`, { password: formData.newPassword });
        toast.success("Password aggiornata con successo");
      }
      
      setModal({ isOpen: false, type: null, data: null });
      fetchData();
    } catch (error) {
      toast.error(`Errore: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Sei sicuro di voler eliminare questo utente?")) {
      setIsLoading(true);
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success("Utente eliminato con successo");
        fetchData();
      } catch (error) {
        toast.error(`Errore: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // GESTIONE MODELLI OLLAMA
  const handleOpenModelModal = (type, model = null) => {
    setFormData(model || { name: "", url: "" });
    setModal({ isOpen: true, type, data: model });
  };

  const handleModelSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (modal.type === "addModel") {
        await api.post("/admin/ollama/models", formData);
        toast.success("Modello aggiunto con successo");
      } else if (modal.type === "editModel") {
        await api.put(`/admin/ollama/models/${modal.data.id}`, formData);
        toast.success("Modello aggiornato con successo");
      }
      
      setModal({ isOpen: false, type: null, data: null });
      fetchData();
    } catch (error) {
      toast.error(`Errore: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModel = async (modelId) => {
    if (window.confirm("Sei sicuro di voler eliminare questo modello?")) {
      setIsLoading(true);
      try {
        await api.delete(`/admin/ollama/models/${modelId}`);
        toast.success("Modello eliminato con successo");
        fetchData();
      } catch (error) {
        toast.error(`Errore: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // GESTIONE PROMPT OLLAMA
  const handleOpenPromptModal = (type, prompt = null) => {
    setFormData(prompt || { name: "", content: "", modelId: models.length > 0 ? models[0].id : "" });
    setModal({ isOpen: true, type, data: prompt });
  };

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (modal.type === "addPrompt") {
        await api.post("/admin/ollama/prompts", formData);
        toast.success("Prompt aggiunto con successo");
      } else if (modal.type === "editPrompt") {
        await api.put(`/admin/ollama/prompts/${modal.data.id}`, formData);
        toast.success("Prompt aggiornato con successo");
      }
      
      setModal({ isOpen: false, type: null, data: null });
      fetchData();
    } catch (error) {
      toast.error(`Errore: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePrompt = async (promptId) => {
    if (window.confirm("Sei sicuro di voler eliminare questo prompt?")) {
      setIsLoading(true);
      try {
        await api.delete(`/admin/ollama/prompts/${promptId}`);
        toast.success("Prompt eliminato con successo");
        fetchData();
      } catch (error) {
        toast.error(`Errore: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // GESTIONE CHAT DI GRUPPO
  const handleOpenGroupModal = (type, group = null) => {
    setFormData(group || { name: "", userIds: [] });
    setModal({ isOpen: true, type, data: group });
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (modal.type === "addGroup") {
        await api.post("/admin/groups", formData);
        toast.success("Gruppo creato con successo");
      } else if (modal.type === "editGroup") {
        await api.put(`/admin/groups/${modal.data.id}`, formData);
        toast.success("Gruppo aggiornato con successo");
      }
      
      setModal({ isOpen: false, type: null, data: null });
      fetchData();
    } catch (error) {
      toast.error(`Errore: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("Sei sicuro di voler eliminare questo gruppo?")) {
      setIsLoading(true);
      try {
        await api.delete(`/admin/groups/${groupId}`);
        toast.success("Gruppo eliminato con successo");
        fetchData();
      } catch (error) {
        toast.error(`Errore: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // GESTIONE SSL
  const handleSslSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.post("/admin/ssl", sslCertificate);
      toast.success("Certificato SSL aggiornato con successo");
    } catch (error) {
      toast.error(`Errore: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSslChange = (e) => {
    const { name, value } = e.target;
    setSslCertificate({ ...sslCertificate, [name]: value });
  };

  const handleMultiSelect = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setFormData({ ...formData, userIds: values });
  };

  const renderUserManagement = () => (
    <>
      <Title>Gestione Utenti</Title>
      <Button 
        className="primary" 
        onClick={() => handleOpenUserModal("addUser")}
      >
        Aggiungi Utente
      </Button>
      
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Nome Completo</th>
            <th>Ruolo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.fullName}</td>
              <td>{user.role}</td>
              <td>
                <Button 
                  className="secondary" 
                  onClick={() => handleOpenUserModal("editUser", user)}
                >
                  Modifica
                </Button>
                <Button 
                  className="secondary" 
                  onClick={() => handleOpenUserModal("changePassword", user)}
                >
                  Cambia Password
                </Button>
                <Button 
                  className="danger" 
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderModelManagement = () => (
    <>
      <Title>Gestione Modelli Ollama</Title>
      <Button 
        className="primary" 
        onClick={() => handleOpenModelModal("addModel")}
      >
        Aggiungi Modello
      </Button>
      
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>URL</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {models.map(model => (
            <tr key={model.id}>
              <td>{model.id}</td>
              <td>{model.name}</td>
              <td>{model.url}</td>
              <td>
                <Button 
                  className="secondary" 
                  onClick={() => handleOpenModelModal("editModel", model)}
                >
                  Modifica
                </Button>
                <Button 
                  className="danger" 
                  onClick={() => handleDeleteModel(model.id)}
                >
                  Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderPromptManagement = () => (
    <>
      <Title>Gestione Prompt Ollama</Title>
      <Button 
        className="primary" 
        onClick={() => handleOpenPromptModal("addPrompt")}
      >
        Aggiungi Prompt
      </Button>
      
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Modello</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map(prompt => (
            <tr key={prompt.id}>
              <td>{prompt.id}</td>
              <td>{prompt.name}</td>
              <td>{models.find(m => m.id === prompt.modelId)?.name || "N/A"}</td>
              <td>
                <Button 
                  className="secondary" 
                  onClick={() => handleOpenPromptModal("editPrompt", prompt)}
                >
                  Modifica
                </Button>
                <Button 
                  className="danger" 
                  onClick={() => handleDeletePrompt(prompt.id)}
                >
                  Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderGroupManagement = () => (
    <>
      <Title>Gestione Chat di Gruppo</Title>
      <Button 
        className="primary" 
        onClick={() => handleOpenGroupModal("addGroup")}
      >
        Crea Gruppo
      </Button>
      
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Partecipanti</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(group => (
            <tr key={group.id}>
              <td>{group.id}</td>
              <td>{group.name}</td>
              <td>{group.users?.length || 0} utenti</td>
              <td>
                <Button 
                  className="secondary" 
                  onClick={() => handleOpenGroupModal("editGroup", group)}
                >
                  Modifica
                </Button>
                <Button 
                  className="danger" 
                  onClick={() => handleDeleteGroup(group.id)}
                >
                  Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderSslManagement = () => (
    <>
      <Title>Gestione Certificato SSL</Title>
      <Form onSubmit={handleSslSubmit}>
        <FormGroup>
          <Label htmlFor="cert">Certificato (PEM)</Label>
          <Textarea
            id="cert"
            name="cert"
            value={sslCertificate.cert}
            onChange={handleSslChange}
            placeholder="-----BEGIN CERTIFICATE-----"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="key">Chiave Privata (PEM)</Label>
          <Textarea
            id="key"
            name="key"
            value={sslCertificate.key}
            onChange={handleSslChange}
            placeholder="-----BEGIN PRIVATE KEY-----"
            required
          />
        </FormGroup>
        
        <Button className="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Aggiornamento..." : "Aggiorna Certificato"}
        </Button>
      </Form>
    </>
  );

  const renderUserForm = () => (
    <Form onSubmit={handleUserSubmit}>
      <FormGroup>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          value={formData.username || ""}
          onChange={handleInputChange}
          required
          disabled={modal.type === "changePassword"}
        />
      </FormGroup>
      
      {modal.type !== "changePassword" && (
        <>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="role">Ruolo</Label>
            <Select
              id="role"
              name="role"
              value={formData.role || "user"}
              onChange={handleInputChange}
              required
            >
              <option value="user">Utente</option>
              <option value="admin">Amministratore</option>
            </Select>
          </FormGroup>
        </>
      )}
      
      {modal.type === "changePassword" ? (
        <FormGroup>
          <Label htmlFor="newPassword">Nuova Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword || ""}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
      ) : (
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password || ""}
            onChange={handleInputChange}
            required={modal.type === "addUser"}
            placeholder={modal.type === "editUser" ? "Lascia vuoto per non modificare" : ""}
          />
        </FormGroup>
      )}
      
      <Button className="primary" type="submit" disabled={isLoading}>
        {isLoading ? "Salvataggio..." : "Salva"}
      </Button>
    </Form>
  );

  const renderModelForm = () => (
    <Form onSubmit={handleModelSubmit}>
      <FormGroup>
        <Label htmlFor="name">Nome Modello</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          name="url"
          value={formData.url || ""}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      
      <Button className="primary" type="submit" disabled={isLoading}>
        {isLoading ? "Salvataggio..." : "Salva"}
      </Button>
    </Form>
  );

  const renderPromptForm = () => (
    <Form onSubmit={handlePromptSubmit}>
      <FormGroup>
        <Label htmlFor="name">Nome Prompt</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="modelId">Modello</Label>
        <Select
          id="modelId"
          name="modelId"
          value={formData.modelId || ""}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleziona un modello</option>
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </Select>
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="content">Contenuto del Prompt</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content || ""}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      
      <Button className="primary" type="submit" disabled={isLoading}>
        {isLoading ? "Salvataggio..." : "Salva"}
      </Button>
    </Form>
  );

  const renderGroupForm = () => (
    <Form onSubmit={handleGroupSubmit}>
      <FormGroup>
        <Label htmlFor="name">Nome Gruppo</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="userIds">Partecipanti</Label>
        <Select
          id="userIds"
          name="userIds"
          multiple
          value={formData.userIds || []}
          onChange={handleMultiSelect}
          required
          style={{ height: "200px" }}
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.fullName || user.email})
            </option>
          ))}
        </Select>
      </FormGroup>
      
      <Button className="primary" type="submit" disabled={isLoading}>
        {isLoading ? "Salvataggio..." : "Salva"}
      </Button>
    </Form>
  );

  const renderModalContent = () => {
    const titles = {
      addUser: "Aggiungi Nuovo Utente",
      editUser: "Modifica Utente",
      changePassword: "Cambia Password",
      addModel: "Aggiungi Nuovo Modello",
      editModel: "Modifica Modello",
      addPrompt: "Aggiungi Nuovo Prompt",
      editPrompt: "Modifica Prompt",
      addGroup: "Crea Nuovo Gruppo",
      editGroup: "Modifica Gruppo"
    };
    
    return (
      <ModalContent>
        <ModalHeader>
          <h3>{titles[modal.type]}</h3>
          <CloseButton onClick={() => setModal({ isOpen: false, type: null, data: null })}>×</CloseButton>
        </ModalHeader>
        
        {modal.type?.includes("User") && renderUserForm()}
        {modal.type?.includes("Model") && renderModelForm()}
        {modal.type?.includes("Prompt") && renderPromptForm()}
        {modal.type?.includes("Group") && renderGroupForm()}
      </ModalContent>
    );
  };

  return (
    <AdminContainer>
      <Header>
        <h1>Pannello di Amministrazione</h1>
      </Header>
      
      <MainContent>
        <Sidebar>
          <SidebarItem 
            className={activeSection === "users" ? "active" : ""}
            onClick={() => setActiveSection("users")}
          >
            Gestione Utenti
          </SidebarItem>
          <SidebarItem 
            className={activeSection === "models" ? "active" : ""}
            onClick={() => setActiveSection("models")}
          >
            Modelli Ollama
          </SidebarItem>
          <SidebarItem 
            className={activeSection === "prompts" ? "active" : ""}
            onClick={() => setActiveSection("prompts")}
          >
            Prompt Ollama
          </SidebarItem>
          <SidebarItem 
            className={activeSection === "groups" ? "active" : ""}
            onClick={() => setActiveSection("groups")}
          >
            Chat di Gruppo
          </SidebarItem>
          <SidebarItem 
            className={activeSection === "ssl" ? "active" : ""}
            onClick={() => setActiveSection("ssl")}
          >
            Certificato SSL
          </SidebarItem>
        </Sidebar>
        
        <ContentArea>
          {activeSection === "users" && renderUserManagement()}
          {activeSection === "models" && renderModelManagement()}
          {activeSection === "prompts" && renderPromptManagement()}
          {activeSection === "groups" && renderGroupManagement()}
          {activeSection === "ssl" && renderSslManagement()}
        </ContentArea>
      </MainContent>
      
      {modal.isOpen && (
        <Modal>
          {renderModalContent()}
        </Modal>
      )}
    </AdminContainer>
  );
};

export default AdminPanel;
