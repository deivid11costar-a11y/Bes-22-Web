import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

// Endereço do servidor backend
const API_URL = 'http://localhost:3001/api';

const Login = () => {

  // ─────────────────────────────────────────────
  // ESTADOS — Guardam os dados digitados pelo
  // usuário e controlam o comportamento da tela
  // ─────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Armazena as mensagens de erro de cada campo
  const [errors, setErrors] = useState({ email: '', password: '', server: '' });

  const [loading, setLoading] = useState(false);           // Controla o botão "Entrando..."
  const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar senha
  const [rememberEmail, setRememberEmail] = useState(false); // Lembrar e-mail

  const navigate = useNavigate(); // Usado para redirecionar entre páginas

  // ─────────────────────────────────────────────
  // LEMBRAR E-MAIL
  // Ao abrir a página, verifica se existe um
  // e-mail salvo no navegador e preenche o campo
  // ─────────────────────────────────────────────
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  // ─────────────────────────────────────────────
  // LIMPA O ERRO do campo assim que o usuário
  // começa a digitar novamente nele
  // ─────────────────────────────────────────────
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
  };

  // ─────────────────────────────────────────────
  // VALIDAÇÃO DOS CAMPOS
  // Verifica cada campo antes de enviar ao servidor
  // Retorna true se tudo estiver correto
  // ─────────────────────────────────────────────
  const validateFields = () => {
    const newErrors = { email: '', password: '', server: '' };
    let valid = true;

    // Verifica se o e-mail foi preenchido e tem formato válido
    if (!email) {
      newErrors.email = 'O e-mail é obrigatório.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Insira um e-mail válido.';
      valid = false;
    }

    // Verifica se a senha foi preenchida e tem mínimo de 6 caracteres
    if (!password) {
      newErrors.password = 'A senha é obrigatória.';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ─────────────────────────────────────────────
  // ENVIO DO FORMULÁRIO
  // Só envia ao servidor se passar na validação
  // Em caso de sucesso, redireciona para o Dashboard
  // ─────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setErrors({ email: '', password: '', server: '' });

    if (!validateFields()) return; // Para aqui se houver erros

    // Salva ou remove o e-mail do navegador conforme o checkbox
    if (rememberEmail) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    setLoading(true);
    try {
      // Envia e-mail e senha para a rota POST /api/login no backend
      const response = await axios.post(`${API_URL}/login`, { email, password });

      // Salva o token e os dados do usuário no navegador
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/dashboard'); // Redireciona para o Dashboard
    } catch (err) {
      // Exibe o erro retornado pelo servidor ou mensagem genérica
      if (err.response?.data?.error) {
        setErrors(prev => ({ ...prev, server: err.response.data.error }));
      } else {
        setErrors(prev => ({ ...prev, server: 'Erro de conexão com o servidor. Tente novamente.' }));
      }
    } finally {
      setLoading(false); // Reativa o botão independentemente do resultado
    }
  };

  // ─────────────────────────────────────────────
  // ESTILO DA BORDA — Fica vermelha se houver
  // erro no campo, normal se estiver correto
  // ─────────────────────────────────────────────
  const inputBorder = (field) => ({
    border: `1px solid ${errors[field] ? '#f87171' : 'rgba(255,255,255,0.12)'}`,
  });

  // ─────────────────────────────────────────────
  // RENDERIZAÇÃO DA TELA
  // Aqui é montado todo o visual do formulário
  // ─────────────────────────────────────────────
  return (
    <>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        fontFamily: "'Segoe UI', sans-serif",
        padding: '1rem',
      }}>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}>

          {/* ── CABEÇALHO: ícone, título e subtítulo ── */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              borderRadius: '50%',
              width: 60, height: 60,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 20px rgba(108,99,255,0.4)',
            }}>
              <LogIn size={28} color="#fff" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem', letterSpacing: '-0.5px' }}>
              Task Manager
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', margin: 0 }}>
              Acesse sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} noValidate>

            {/* ── CAMPO E-MAIL: valida formato do e-mail ── */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block', fontSize: '0.8rem', fontWeight: 600,
                color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem',
                letterSpacing: '0.5px', textTransform: 'uppercase',
              }}>E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)',
                }} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.25rem',
                    background: 'rgba(255,255,255,0.07)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border 0.2s',
                    ...inputBorder('email'),
                  }}
                />
              </div>
              {errors.email && (
                <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.3rem 0 0 0.25rem' }}>
                  ⚠️ {errors.email}
                </p>
              )}
            </div>

            {/* ── CAMPO SENHA: com botão mostrar/ocultar ── */}
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{
                display: 'block', fontSize: '0.8rem', fontWeight: 600,
                color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem',
                letterSpacing: '0.5px', textTransform: 'uppercase',
              }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)',
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 2.25rem',
                    background: 'rgba(255,255,255,0.07)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border 0.2s',
                    ...inputBorder('password'),
                  }}
                />
                {/* Botão olhinho para mostrar ou ocultar a senha */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', color: 'rgba(255,255,255,0.3)',
                    padding: 0, display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.3rem 0 0 0.25rem' }}>
                  ⚠️ {errors.password}
                </p>
              )}
            </div>

            {/* ── ERRO DO SERVIDOR: exibido quando o backend rejeita o login ── */}
            {errors.server && (
              <div style={{
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.3)',
                borderRadius: '0.5rem',
                padding: '0.6rem 0.75rem',
                color: '#f87171',
                fontSize: '0.82rem',
                marginBottom: '0.75rem',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                ⚠️ {errors.server}
              </div>
            )}

            {/* ── LINK ESQUECI MINHA SENHA ── */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.75rem',
              marginBottom: '1.25rem',
            }}>
              <a href="#" style={{
                fontSize: '0.8rem',
                color: 'rgba(167,139,250,0.8)',
                textDecoration: 'none',
                fontWeight: 500,
              }}>Esqueci minha senha</a>
            </div>

            {/* ── BOTÃO PRINCIPAL: desabilitado enquanto está carregando ── */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: loading ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg, #6c63ff, #a78bfa)',
                border: 'none',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(108,99,255,0.35)',
                transition: 'opacity 0.2s',
                letterSpacing: '0.3px',
              }}
            >
              <LogIn size={18} />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            {/* ── LINK PARA CADASTRO: redireciona quem não tem conta ── */}
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', margin: '1rem 0 0 0' }}>
              Não tem conta?{' '}
              <span
                onClick={() => navigate('/cadastro')}
                style={{ color: 'rgba(167,139,250,0.8)', cursor: 'pointer', fontWeight: 500 }}
              >
                Criar conta
              </span>
            </p>

          </form>
        </div>
      </div>
    </>
  );
};

export default Login;