# ⚡ Guia Rápido - Windows

## 🎯 Problema Atual

Você precisa instalar Maven e configurar o ambiente antes de executar o projeto.

---

## ✅ Solução Rápida (5 minutos)

### Opção 1: Instalar via Chocolatey (Recomendado)

**Passo 1:** Abra PowerShell como **Administrador** e instale o Chocolatey:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

**Passo 2:** Instale Java e Maven:

```powershell
choco install openjdk17 maven nodejs-lts -y
```

**Passo 3:** Feche e reabra o PowerShell (como usuário normal) e teste:

```powershell
java -version
mvn -version
node -v
```

**Passo 4:** Execute o projeto:

```powershell
cd C:\Users\ander\Documents\bip-teste-integrado

# Dar permissão aos scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Executar backend (em um terminal)
.\run-backend.ps1

# Executar frontend (em outro terminal)
.\run-frontend.ps1
```

---

### Opção 2: Download Manual

#### 1. Java 17
- Baixe: https://adoptium.net/temurin/releases/?version=17
- Instale o arquivo `.msi`
- Reinicie o terminal

#### 2. Maven
- Baixe: https://maven.apache.org/download.cgi (Binary zip archive)
- Extraia para `C:\Program Files\Apache\maven`
- Adicione ao PATH:
  1. Pressione `Win + X` → Sistema
  2. Configurações avançadas do sistema
  3. Variáveis de ambiente
  4. Em "Variáveis do sistema", edite `Path`
  5. Adicione: `C:\Program Files\Apache\maven\bin`
- Reinicie o terminal

#### 3. Node.js
- Baixe: https://nodejs.org/ (versão LTS)
- Instale o arquivo `.msi`
- Reinicie o terminal

#### 4. Verificar instalações

```powershell
java -version    # Deve mostrar: openjdk version "17.x.x"
mvn -version     # Deve mostrar: Apache Maven 3.x.x
node -v          # Deve mostrar: v18.x.x ou v20.x.x
npm -v           # Deve mostrar: 9.x.x ou 10.x.x
```

---

## 🚀 Executar o Projeto

### Backend

```powershell
cd C:\Users\ander\Documents\bip-teste-integrado\backend-module

# Compilar
mvn clean package -DskipTests

# Executar
mvn spring-boot:run
```

**Acesse:** http://localhost:8080/swagger-ui.html

### Frontend (em outro terminal)

```powershell
cd C:\Users\ander\Documents\bip-teste-integrado\frontend

# Instalar dependências
npm install

# Executar
npm start
```

**Acesse:** http://localhost:4200

---

## 🧪 Executar Testes

```powershell
# Backend
cd backend-module
mvn test

# Frontend
cd frontend
npm test
```

---

## ❓ Perguntas Frequentes

**P: O erro "mvn não é reconhecido" continua aparecendo**
R: Feche TODOS os terminais e abra um novo. As variáveis de ambiente só são carregadas ao abrir um novo terminal.

**P: Posso usar Docker ao invés de instalar tudo?**
R: Sim! Crie um `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    image: maven:3.8-openjdk-17
    working_dir: /app
    volumes:
      - ./backend-module:/app
    ports:
      - "8080:8080"
    command: mvn spring-boot:run

  frontend:
    image: node:18
    working_dir: /app
    volumes:
      - ./frontend:/app
    ports:
      - "4200:4200"
    command: sh -c "npm install && npm start"
```

Execute: `docker-compose up`

**P: A porta 8080 está ocupada**
R: Encontre e mate o processo:

```powershell
netstat -ano | findstr :8080
taskkill /PID <número> /F
```

---

## 📞 Precisa de Ajuda?

Consulte o arquivo `SETUP.md` para instruções mais detalhadas.
