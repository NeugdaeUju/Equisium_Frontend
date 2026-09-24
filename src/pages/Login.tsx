import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../services/authService.ts';
import { useAppDispatch } from '../store/hooks.ts';
import { loginSuccess } from '../store/authSlice.ts';
import '../assets/styles/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginRequest({ email, password });
      dispatch(loginSuccess({ token: data.token, userId: data.userId }));
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Équisium</h1>
        <p className="login-subtitle">Connexion à votre écurie</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <label className="login-label" htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;