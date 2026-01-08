# 🚀 COMECE AQUI - Solução Simples

## ⚡ Instalação Rápida (Escolha UMA opção)

### Opção 1: Instalação Automática (Recomendado) ✅

Abra PowerShell **como Administrador** nesta pasta e execute:

```powershell
.\install-tools-manual.ps1
```

Este script irá:
- ✅ Baixar e instalar Java 17
- ✅ Baixar e instalar Maven
- ✅ Baixar e instalar Node.js
- ✅ Configurar PATH automaticamente

**Depois:** Feche e reabra o PowerShell, execute:
```powershell
.\run-backend.ps1
```

---

### Opção 2: Corrigir Chocolatey (Se você tem Chocolatey instalado) 🔧

```powershell
# 1. Adicionar Chocolatey ao PATH
$env:Path = "C:\ProgramData\chocolatey\bin;$env:Path"

# 2. Verificar
choco --version

# 3. Instalar ferramentas
choco install openjdk17 maven nodejs-lts -y

# 4. Fechar e reabrir PowerShell, depois:
.\run-backend.ps1
```

---

### Opção 3: Download Manual (Mais trabalhoso) 📥

#### 1. Java 17
👉 https://aka.ms/download-jdk/microsoft-jdk-17.0.12-windows-x64.msi
- Baixe e instale
- Aceite os padrões

#### 2. Maven
👉 https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip
- Baixe e extraia para `C:\Program Files\Apache\maven`
- Adicione ao PATH: `C:\Program Files\Apache\maven\bin`
  1. Win + X → Sistema
  2. Configurações avançadas
  3. Variáveis de ambiente
  4. Editar "Path" do Sistema
  5. Novo → Colar o caminho acima

#### 3. Node.js
👉 https://nodejs.org/dist/v20.18.1/node-v20.18.1-x64.msi
- Baixe e instale
- Aceite os padrões

#### 4. Reiniciar PowerShell e verificar:
```powershell
java -version
mvn -version
node -v
```

---

## 🎯 Próximo Passo

Depois de instalar as ferramentas:

```powershell
# 1. Permitir scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 2. Executar backend (em um terminal)
.\run-backend.ps1

# 3. Executar frontend (em OUTRO terminal)
.\run-frontend.ps1
```

### URLs Importantes:
- 🌐 **Frontend:** http://localhost:4200
- 🔌 **Backend API:** http://localhost:8080
- 📚 **Swagger:** http://localhost:8080/swagger-ui.html

---

## ❓ Problemas?

### "O termo 'mvn' não é reconhecido"
➡️ Feche TODOS os terminais PowerShell e abra um novo. As variáveis de ambiente só são carregadas em novos terminais.

### "Script não pode ser carregado"
➡️ Execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### "Porta 8080 já em uso"
➡️ Execute:
```powershell
netstat -ano | findstr :8080
taskkill /PID <número> /F
```

### Chocolatey não funciona
➡️ Use a **Opção 1** (instalação automática) que não depende do Chocolatey

---

## 📋 Ordem Correta de Execução

1. ✅ Instalar ferramentas (Java, Maven, Node.js)
2. ✅ Fechar e reabrir PowerShell
3. ✅ Verificar instalações (`java -version`, `mvn -version`, `node -v`)
4. ✅ Executar `.\run-backend.ps1`
5. ✅ Executar `.\run-frontend.ps1` (em outro terminal)
6. ✅ Acessar http://localhost:4200

---

## 🆘 Ainda com problemas?

Consulte os arquivos:
- `QUICKSTART.md` - Guia rápido
- `SETUP.md` - Instruções detalhadas
- `README.md` - Documentação completa do projeto
