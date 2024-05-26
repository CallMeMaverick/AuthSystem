# 🛂 AuthSystem

AuthSystem is an authentication system that allows users to sign up, sign in, and authenticate using both Google and GitHub OAuth providers. The system also supports local authentication with email and password.

## 💡 Features
- User sign-up and sign-in using email and password.
- Google OAuth authentication.
- GitHub OAuth authentication.
- Protected routes accessible only to authenticated users.
- User session management and logout functionality.

## ⚙️ Installation 
1. **Clone the repo**
```bash
git clone git@github.com:CallMeMaverick/AuthSystem.git
cd AuthSystem
```
2. **Install dependecies**
```bash
npm install
```
3. **Set up environment variables**:
Create a .env file in the project root with the following content:
```env
PORT=you_port
MONGO_URI=your_mongo_database_uri
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```
4. **Run the application**:
```bash
npm start
```
## 📄 License
This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details. 
